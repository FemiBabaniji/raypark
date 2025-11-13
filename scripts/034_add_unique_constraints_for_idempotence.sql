-- Add unique constraints to support idempotent operations
-- These ensure one-to-one relationships that our app logic expects

-- One "main" page per portfolio
CREATE UNIQUE INDEX IF NOT EXISTS pages_portfolio_key_unique
  ON public.pages (portfolio_id, key);

-- One widget instance per (page, type)
CREATE UNIQUE INDEX IF NOT EXISTS widget_instances_page_type_unique
  ON public.widget_instances (page_id, widget_type_id);

-- One layout per page
CREATE UNIQUE INDEX IF NOT EXISTS page_layouts_page_id_unique
  ON public.page_layouts (page_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Unique constraints added for idempotent operations';
END
$$;
