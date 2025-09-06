Perfect — your schema is already set up for a first-class, multi-page, widget-based portfolio builder. Here’s a concrete, copy-pasteable plan to make the **Jenny Wilson** template fully customizable for each authenticated user using **Supabase** (Auth + Postgres + Storage), while fitting exactly into your tables:

---

# 0) Mental model → how your UI maps to DB

* **portfolios** = a user’s site (slug, visibility, theme).
* **pages** = one portfolio can have many pages (e.g., “home”, “work”).
* **page\_layouts.layout (jsonb)** = where widgets live (left/right columns + order).
* **widget\_types** = the library of block types (profile, education, projects, gallery…).
* **widget\_instances** = a placed block on a page with its **props** (the editable data).
* **page\_versions** = immutable snapshots (draft/published) for versioning / rollback.
* **themes** = design tokens (your 7-color gradients, typography etc.).
* **media\_assets** = uploaded images/videos, linked to widget instances.

Your **Home** screen lists `portfolios` for the logged-in user; clicking a card opens the **editor** for `pages + widget_instances + page_layouts`, editing **props** and **layout**, and publishing writes a **page\_versions** snapshot.

---

# 1) Themes: encode your 7-color translucent palette

Seed a reusable theme that stores the gradients in `themes.tokens`. You’ll read `tokens.gradients` and an optional `tokens.default_card_gradient_index` to render `selectedColor` in your `UnifiedPortfolioCard`.

\`\`\`sql
-- themes seed (one per workspace or global demo)
insert into public.themes (id, user_id, name, tokens)
values (
  gen_random_uuid(),            -- or a fixed UUID if you want a “global” theme
  null,                         -- null = global (read policy will allow public read)
  'Translucent 7',
  jsonb_build_object(
    'gradients', jsonb_build_array(
      'from-rose-400/40 to-rose-600/60',
      'from-blue-400/40 to-blue-600/60',
      'from-purple-400/40 to-purple-600/60',
      'from-green-400/40 to-green-600/60',
      'from-orange-400/40 to-orange-600/60',
      'from-teal-400/40 to-teal-600/60',
      'from-neutral-400/40 to-neutral-600/60'
    ),
    'default_card_gradient_index', 0
  )
) on conflict do nothing;
\`\`\`

> In UI: `selectedColor = theme.tokens->>'default_card_gradient_index'` (fallback 0).
> If you want per-portfolio override, add `portfolios.ui_tokens jsonb` with `{ "cardGradientIndex": n }`.

---

# 2) Widget library (types) + template blocks

Register widgets your editor can place, and store their **prop schema** (informational) so the editor can validate UI.

\`\`\`sql
insert into public.widget_types (id, key, name, schema_json, render_hint, created_at)
values
  (gen_random_uuid(), 'profile', 'Profile', '{
     "type":"object",
     "properties":{
       "avatarUrl":{"type":"string"},
       "name":{"type":"string"},
       "title":{"type":"string"},
       "subtitle":{"type":"string"},
       "social":{"type":"array","items":{"type":"string"}}
     }
   }', '{"bg":"theme","density":"spacious"}', now()),
  (gen_random_uuid(), 'education', 'Education', '{"type":"object","properties":{"items":{"type":"array"}}}', '{}', now()),
  (gen_random_uuid(), 'work-experience', 'Work Experience', '{"type":"object","properties":{"items":{"type":"array"}}}', '{}', now()),
  (gen_random_uuid(), 'projects', 'Projects', '{"type":"object","properties":{"groups":{"type":"array"}}}', '{}', now()),
  (gen_random_uuid(), 'services', 'Services', '{"type":"object","properties":{"text":{"type":"string"}}}', '{}', now()),
  (gen_random_uuid(), 'description', 'Description', '{"type":"object","properties":{"title":{"type":"string"},"body":{"type":"string"}}}', '{}', now()),
  (gen_random_uuid(), 'gallery', 'Gallery', '{"type":"object","properties":{"groups":{"type":"array"}}}', '{}', now())
on conflict do nothing;
\`\`\`

---

# 3) First-run seeding for a user (clone Jenny template)

When a user signs in the first time, create a portfolio, its page, layout, and widget instances using your Jenny defaults.

\`\`\`sql
-- 3.1 create portfolio (assign the translucent theme)
insert into public.portfolios (id, user_id, name, slug, theme_id, is_public, is_demo)
values (
  gen_random_uuid(),
  auth.uid(),
  'Jenny Wilson',
  'jenny-wilson',           -- ensure UNIQUE per user; or append a suffix
  (select id from public.themes where name = 'Translucent 7' limit 1),
  false,
  false
)
returning id into portfolio_id;

-- 3.2 create a home page
insert into public.pages (id, portfolio_id, title, is_demo)
values (gen_random_uuid(), portfolio_id, 'home', false)
returning id into page_id;

-- 3.3 create widget instances with props
-- (look up widget_type_id by key)
with wt as (
  select
    (select id from widget_types where key='profile') as profile,
    (select id from widget_types where key='education') as education,
    (select id from widget_types where key='projects') as projects,
    (select id from widget_types where key='services') as services,
    (select id from widget_types where key='description') as description
)
insert into public.widget_instances (id, page_id, widget_type_id, props, enabled)
values
  (gen_random_uuid(), page_id, (select profile from wt), '{
    "avatarUrl": "/professional-woman-headshot.png",
    "name": "jenny wilson",
    "title": "is a digital product designer",
    "subtitle": "currently designing at acme.",
    "social": ["linkedin","dribbble","behance","twitter","unsplash","instagram"]
  }', true),
  (gen_random_uuid(), page_id, (select education from wt), '{"items":[
    {"degree":"MS Computer Science","school":"Stanford University","meta":"2020 • GPA: 3.8"},
    {"degree":"BS Software Engineering","school":"UC Berkeley","meta":"2018 • GPA: 3.7"},
    {"degree":"AWS Solutions Architect","school":"Coursera","meta":"2021 • Certified"}
  ]}', true),
  (gen_random_uuid(), page_id, (select description from wt), '{"title":"About Me","body":"I''m a passionate digital designer with over 5 years..."}', true),
  (gen_random_uuid(), page_id, (select projects from wt), '{"groups":[
     {"name":"Web Development","stack":["React","Node.js","AWS"],"status":"In Progress","progress":85},
     {"name":"AI/ML","stack":["Python","React","TensorFlow"],"status":"In Progress","progress":60},
     {"name":"Mobile","stack":["React Native","TypeScript","Firebase"],"status":"Completed","progress":100},
     {"name":"DevOps","stack":["AWS","Terraform","Kubernetes"],"status":"Completed","progress":100}
  ]}', true),
  (gen_random_uuid(), page_id, (select services from wt), '{"text":"I specialize in creating unique visual identities..."}', true)
returning id into widget_ids;

-- 3.4 layout: which widgets appear left/right and in what order
insert into public.page_layouts (page_id, layout)
values (
  page_id,
  jsonb_build_object(
    'columns', jsonb_build_object(
      'left',  jsonb_build_array( (select id from widget_instances where page_id=page_id order by created_at asc limit 1),
                                  (select id from widget_instances where page_id=page_id and widget_type_id=(select id from widget_types where key='education') limit 1) ),
      'right', jsonb_build_array( (select id from widget_instances where page_id=page_id and widget_type_id=(select id from widget_types where key='description') limit 1),
                                  (select id from widget_instances where page_id=page_id and widget_type_id=(select id from widget_types where key='projects') limit 1),
                                  (select id from widget_instances where page_id=page_id and widget_type_id=(select id from widget_types where key='services') limit 1) )
    )
  )
);
\`\`\`

> That gives you the **identical layout** you already use in the Jenny component.

---

# 4) RLS policies (minimal & safe)

Enable RLS on all user data tables and use **owner** semantics. Example policies (adjust schema/table names if needed):

\`\`\`sql
-- portfolios
alter table public.portfolios enable row level security;

create policy "owner can read own portfolios"
on public.portfolios for select
using (user_id = auth.uid() or is_public = true);

create policy "owner can write own portfolios"
on public.portfolios for insert with check (user_id = auth.uid());
create policy "owner can update own portfolios"
on public.portfolios for update using (user_id = auth.uid());

-- pages (owned via portfolio)
alter table public.pages enable row level security;

create policy "read pages of own or public portfolios"
on public.pages for select
using (
  exists (
    select 1 from public.portfolios p
    where p.id = pages.portfolio_id and (p.user_id = auth.uid() or p.is_public = true)
  )
);

create policy "write pages of own portfolios"
on public.pages for all
using (
  exists (select 1 from public.portfolios p where p.id = pages.portfolio_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.portfolios p where p.id = pages.portfolio_id and p.user_id = auth.uid())
);

-- widget_instances (owned via page->portfolio)
alter table public.widget_instances enable row level security;

create policy "read widgets of own/public portfolios"
on public.widget_instances for select
using (
  exists (
    select 1 from public.pages pg
    join public.portfolios p on p.id = pg.portfolio_id
    where pg.id = widget_instances.page_id and (p.user_id = auth.uid() or p.is_public = true)
  )
);

create policy "write widgets of own portfolios"
on public.widget_instances for all
using (
  exists (
    select 1 from public.pages pg
    join public.portfolios p on p.id = pg.portfolio_id
    where pg.id = widget_instances.page_id and p.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.pages pg
    join public.portfolios p on p.id = pg.portfolio_id
    where pg.id = widget_instances.page_id and p.user_id = auth.uid()
  )
);

-- page_layouts (same ownership)
alter table public.page_layouts enable row level security;
create policy "read/write layout of own portfolios"
on public.page_layouts for all
using (
  exists (
    select 1 from public.pages pg
    join public.portfolios p on p.id = pg.portfolio_id
    where pg.id = page_layouts.page_id and p.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.pages pg
    join public.portfolios p on p.id = pg.portfolio_id
    where pg.id = page_layouts.page_id and p.user_id = auth.uid()
  )
);

-- themes (global + per-user)
alter table public.themes enable row level security;
create policy "read public or own themes"
on public.themes for select
using (user_id is null or user_id = auth.uid());
create policy "write own themes"
on public.themes for all
using (user_id = auth.uid()) with check (user_id = auth.uid());

-- media_assets (by owner or via widget ownership)
alter table public.media_assets enable row level security;
create policy "read/write own media"
on public.media_assets for all
using (user_id = auth.uid()) with check (user_id = auth.uid());
\`\`\`

> For **Storage** (bucket `media`), add Storage policies mirroring `media_assets.user_id = auth.uid()` and prefix per-user, e.g. `media/{user_id}/*`.

---

# 5) Editor operations (exact queries your UI needs)

### Fetch portfolios for Home

\`\`\`ts
// server or client (supabase-js with RLS)
const { data: portfolios } = await supabase
  .from('portfolios')
  .select(`
    id, name, slug, is_public,
    theme:themes ( tokens )
  `);

// map to your UnifiedPortfolio
const cards = portfolios.map(p => ({
  id: p.id,
  name: p.name,
  title: "Portfolio",
  email: `${p.slug}@example.com`,
  location: "Location",
  handle: `@${p.slug}`,
  initials: p.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
  selectedColor: p.theme?.tokens?.default_card_gradient_index ?? 0
}));
\`\`\`

### Load a page for editing

\`\`\`ts
const { data: page } = await supabase
  .from('pages')
  .select(`
    id, title,
    layout:page_layouts ( layout ),
    widgets:widget_instances ( id, widget_type_id, props, enabled,
      type:widget_types ( key, name )
    )
  `)
  .eq('portfolio_id', portfolioId)
  .eq('title', 'home')
  .single();
\`\`\`

### Update widget props (inline edits)

\`\`\`ts
await supabase.from('widget_instances')
  .update({ props })
  .eq('id', widgetId);
\`\`\`

### Reorder/move widgets (update `page_layouts.layout`)

\`\`\`ts
await supabase.from('page_layouts')
  .update({ layout }) // e.g. { columns: { left: [ids], right: [ids] } }
  .eq('page_id', pageId);
\`\`\`

### Change theme color index for card

* Option A: update `themes.tokens.default_card_gradient_index` (affects all pages in that portfolio/theme).
* Option B: store an override in `portfolios.ui_tokens`.

Option A example:

\`\`\`ts
const tokens = { ...theme.tokens, default_card_gradient_index: idx };
await supabase.from('themes').update({ tokens }).eq('id', themeId);
\`\`\`

### Publish (write a snapshot into `page_versions`)

\`\`\`ts
const { data: page } = await supabase
  .from('pages')
  .select(`
    id, title,
    layout:page_layouts ( layout ),
    widgets:widget_instances ( id, widget_type_id, props, enabled )
  `)
  .eq('id', pageId).single();

await supabase.from('page_versions').insert({
  page_id: page.id,
  status: 'published',
  snapshot: page,        // full JSON snapshot
  created_by: userId,
  published_at: new Date().toISOString()
});
\`\`\`

> Keep “draft” versions too: insert with `status: 'draft'` whenever auto-save runs.

---

# 6) Media uploads (gallery widget)

1. **Client** gets a signed URL (or just upload with RLS if public bucket is scoped).
2. Upload to Storage → create a `media_assets` row with `user_id`, `page_id`, `widget_instance_id`, `kind`, `path`, `metadata`.

\`\`\`ts
// upload to storage
const filePath = `${user.id}/${crypto.randomUUID()}-${file.name}`;
const { data, error } = await supabase.storage.from('media').upload(filePath, file);

// record in DB
await supabase.from('media_assets').insert({
  user_id: user.id,
  page_id,
  widget_instance_id: widgetId,
  kind: 'image',
  path: data.path,
  metadata: { width, height, mime: file.type }
});
\`\`\`

Your gallery widget then pushes the new `publicUrl` into its `props.groups[n].images[]` and PATCHes the widget props.

---

# 7) Activity log (optional but recommended)

Any client/server write can insert an `activity_log` row:

\`\`\`ts
await supabase.from('activity_log').insert({
  user_id: user.id,
  entity_type: 'widget_instance',
  entity_id: widgetId,
  action: 'update',
  diff: { op: 'replace', path: '/props/title', value: 'New Title' }
});
\`\`\`

This enables audit trails and basic undo.

---

# 8) Caching & performance

* Add **indexes**:

  * `pages.portfolio_id`
  * `page_layouts.page_id`
  * `widget_instances.page_id`, `widget_instances.widget_type_id`
  * `media_assets.user_id`, `media_assets.widget_instance_id`
* Cache **published** `page_versions` at the edge (Vercel middleware, or Supabase CDN).

---

# 9) Wiring your existing React

* Keep your **Home** UI exactly as is.
* On load, fetch `portfolios` joined to `themes` and map → `UnifiedPortfolio`.
* On edit, use your **existing editor components**; just replace local state saves with:

  * `update widget props` → `widget_instances.update`
  * `reorder/move` → `page_layouts.update`
  * `theme picker` → update `themes.tokens.default_card_gradient_index`
  * `publish` → insert `page_versions` snapshot

No UI changes required.

---

# 10) Quick server helper (Next.js App Router)

\`\`\`ts
// lib/supabaseServer.ts
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export const supabaseServer = () => createServerComponentClient({ cookies })
\`\`\`

Then server components can do the “first-run” seed and pass `initialPortfolios` down. Client components use `createBrowserClient` and rely on RLS.

---

## That’s the whole loop

* Auth user signs in → seed Jenny → edit widgets → reorder → upload media → publish snapshot → view public page (from latest `page_versions.published`).
* The **7-color translucent theme** powers card and widget gradients via `themes.tokens`.

If you want, I can generate:

* A single SQL migration file that creates the policies + seed data,
* Minimal TypeScript SDK helpers (`getPortfolios`, `getPageForEdit`, `saveWidgetProps`, `publishPage`),
* A tiny `useAutosave` hook (debounced PATCH) you can drop into each widget editor.
