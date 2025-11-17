# Unified Design System

## Overview

This design system creates an **Apple-inspired Event Timeline with Linear-style dark cards** for the community page.

### Design Stack
- Dark-neutrals system
- Timeline rail
- Soft cards  
- Minimal typography
- Semantic icons
- Subtle depth

---

## Core Principles

### 1. **Consistent Card Grammar**
All cards (Events, Meetings, Announcements, Networks) now follow the same structure:
- Same border radius (`1.25rem`)
- Same padding (`1.5rem`)
- Same background color (`oklch(0.22 0 0)`)
- Same subtle border (`oklch(0.25 0 0)`)
- Same shadow system

### 2. **Unified Typography Scale**
We use a consistent type hierarchy:
- **Display**: 48px / Bold / -2% tracking (Hero sections)
- **H1**: 32px / Semibold / -1% tracking (Page titles)
- **H2**: 24px / Semibold / -1% tracking (Section titles)
- **H3**: 20px / Semibold (Card titles)
- **Body**: 15px / Regular / 160% line-height
- **Caption**: 12px / Regular (Metadata)

### 3. **Timeline Rail Aesthetic**
- Vertical accent rail on left of important cards
- 2px width for subtle presence
- Color-coded by content type
- Soft glow effect on hover/active states

### 4. **Icon Treatment**
All icons follow the same rules:
- Size: 16px (sm), 20px (md), 24px (lg)
- Stroke width: Consistent across all components
- Color: Always from the foreground scale
- Spacing: 8px gap from adjacent text

### 5. **Color Palette**
Minimal, professional palette:
- **Backgrounds**: 3 shades of dark neutral
- **Foregrounds**: 3 shades of white (100%, 70%, 50%)
- **Accents**: Only 4 colors (Blue, Purple, Green, Amber)
- Used sparingly for semantic meaning

---

## Component Tokens

### Cards
\`\`\`typescript
background: 'oklch(0.22 0 0)'
border: '1px solid oklch(0.25 0 0)'
borderRadius: '1.25rem'
padding: '1.5rem'
shadow: '0 2px 8px rgb(0 0 0 / 0.4)'
\`\`\`

### Buttons
\`\`\`typescript
borderRadius: '0.75rem'
padding: {
  sm: '0.5rem 1rem',
  md: '0.75rem 1.5rem',
  lg: '1rem 2rem'
}
\`\`\`

### Timeline Rail
\`\`\`typescript
width: '2px'
color: 'oklch(0.3 0 0)'
activeDotSize: '8px'
activeDotGlow: '0 0 12px [accentColor]'
\`\`\`

---

## Usage Guide

### Maintaining Consistency Across Sections

#### Events Section
- Use `<UnifiedEventCard>` for all event displays
- Apply timeline rail with type-specific colors
- Keep metadata icons consistent (Calendar, Clock, MapPin, Users)

#### Meetings Section  
- Use `<UnifiedMeetingCard>` for all meeting displays
- Maintain compact layout (same as events but denser)
- Use same icon set and spacing

#### Announcements Section
- Use `<UnifiedAnnouncementCard>` for all announcements
- Important flag = purple/pink gradient rail
- Expandable content follows same padding rules

#### Networks Section
- Use timeline card base with member avatars
- Keep same border radius and shadows
- Pills for roles follow unified pill token

---

## DO's and DON'Ts

### DO:
✅ Use the design system tokens for all measurements  
✅ Keep cards visually synchronized (radius, padding, shadows)  
✅ Use timeline rails for visual hierarchy  
✅ Apply subtle hover states (scale: 1.01)  
✅ Use semantic colors sparingly

### DON'T:
❌ Mix different card styles in same view  
❌ Use more than 4 accent colors  
❌ Create arbitrary spacing values  
❌ Mix border radius values  
❌ Use gradients on backgrounds (except timeline rails)  

---

## File Structure

\`\`\`
lib/
  design-system.ts        # Core tokens and utilities

components/
  ui/
    timeline-card.tsx     # Base card component
  cards/
    unified-event-card.tsx
    unified-meeting-card.tsx  
    unified-announcement-card.tsx
\`\`\`

---

## Migration Checklist

When updating a section to use the unified system:

1. [ ] Import design system tokens
2. [ ] Replace hardcoded values with tokens
3. [ ] Use `<TimelineCard>` as base
4. [ ] Apply consistent typography scale
5. [ ] Use semantic icon sizing
6. [ ] Add timeline rail if needed
7. [ ] Test hover states
8. [ ] Verify spacing matches other sections

---

This system ensures every section of the community page feels like part of a cohesive, professional product.
