/**
 * UNIFIED DESIGN SYSTEM
 * Apple-inspired Event Timeline with Linear-style dark cards
 * 
 * Design Stack:
 * - Dark-neutrals system
 * - Timeline rail
 * - Soft cards
 * - Minimal typography
 * - Semantic icons
 * - Subtle depth
 */

// ============================================
// COLOR SYSTEM
// ============================================

export const colors = {
  // Base backgrounds
  background: {
    primary: 'oklch(0.18 0 0)',      // Main background
    secondary: 'oklch(0.145 0 0)',    // Slightly lighter
    tertiary: 'oklch(0.22 0 0)',      // Card background
  },
  
  // Foreground colors
  foreground: {
    primary: 'oklch(1 0 0)',          // Pure white
    secondary: 'oklch(0.7 0 0)',      // Muted white
    tertiary: 'oklch(0.5 0 0)',       // Dimmed white
  },
  
  // Accent colors (use sparingly)
  accent: {
    blue: '#4169E1',
    purple: '#7B68EE',
    green: '#10B981',
    amber: '#F59E0B',
  },
  
  // Borders
  border: {
    subtle: 'oklch(0.25 0 0)',
    default: 'oklch(0.3 0 0)',
    strong: 'oklch(0.4 0 0)',
  }
} as const

// ============================================
// SPACING SYSTEM
// ============================================

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const

// ============================================
// BORDER RADIUS SYSTEM
// ============================================

export const radius = {
  sm: '0.5rem',    // 8px  - small elements
  md: '0.75rem',   // 12px - buttons, tags
  lg: '1rem',      // 16px - cards
  xl: '1.25rem',   // 20px - larger cards
  '2xl': '1.5rem', // 24px - hero cards
  full: '9999px',  // Fully rounded
} as const

// ============================================
// TYPOGRAPHY SYSTEM
// ============================================

export const typography = {
  // Display (Hero text)
  display: {
    size: '3rem',      // 48px
    weight: '700',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  
  // Headings
  h1: {
    size: '2rem',      // 32px
    weight: '600',
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
  },
  h2: {
    size: '1.5rem',    // 24px
    weight: '600',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
  },
  h3: {
    size: '1.25rem',   // 20px
    weight: '600',
    lineHeight: '1.4',
  },
  h4: {
    size: '1.125rem',  // 18px
    weight: '600',
    lineHeight: '1.4',
  },
  
  // Body text
  body: {
    size: '0.9375rem', // 15px
    weight: '400',
    lineHeight: '1.6',
  },
  bodySmall: {
    size: '0.875rem',  // 14px
    weight: '400',
    lineHeight: '1.5',
  },
  
  // Labels
  label: {
    size: '0.8125rem', // 13px
    weight: '500',
    lineHeight: '1.4',
    letterSpacing: '0.01em',
  },
  
  // Caption
  caption: {
    size: '0.75rem',   // 12px
    weight: '400',
    lineHeight: '1.4',
  },
} as const

// ============================================
// SHADOW SYSTEM (Neumorphic depth)
// ============================================

export const shadows = {
  // Subtle inner depth
  inner: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.5)',
  
  // Card depths
  card: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 2px 8px 0 rgb(0 0 0 / 0.4), 0 1px 3px 0 rgb(0 0 0 / 0.3)',
    lg: '0 4px 16px 0 rgb(0 0 0 / 0.5), 0 2px 6px 0 rgb(0 0 0 / 0.4)',
  },
  
  // Glows (for accents)
  glow: {
    blue: '0 0 20px rgb(65 105 225 / 0.3)',
    purple: '0 0 20px rgb(123 104 238 / 0.3)',
    green: '0 0 20px rgb(16 185 129 / 0.3)',
  }
} as const

// ============================================
// ANIMATION SYSTEM
// ============================================

export const animations = {
  // Easing curves
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    snappy: 'cubic-bezier(0.4, 0, 0, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Durations
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  
  // Common transitions
  transition: {
    default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  }
} as const

// ============================================
// COMPONENT TOKENS
// ============================================

export const components = {
  // Timeline rail
  timeline: {
    railWidth: '2px',
    railColor: colors.border.default,
    dotSize: '8px',
    dotColor: colors.accent.blue,
  },
  
  // Cards
  card: {
    background: colors.background.tertiary,
    border: colors.border.subtle,
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadow: shadows.card.md,
  },
  
  // Buttons
  button: {
    borderRadius: radius.md,
    padding: {
      sm: `${spacing.xs} ${spacing.md}`,
      md: `${spacing.sm} ${spacing.lg}`,
      lg: `${spacing.md} ${spacing.xl}`,
    },
  },
  
  // Tags/Pills
  pill: {
    borderRadius: radius.full,
    padding: `${spacing.xs} ${spacing.md}`,
    fontSize: typography.caption.size,
  },
  
  // Icons
  icon: {
    size: {
      sm: '16px',
      md: '20px',
      lg: '24px',
    },
  }
} as const

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function getEventTypeColor(type: string): string {
  const typeMap: Record<string, string> = {
    workshop: colors.accent.blue,
    networking: colors.accent.green,
    masterclass: colors.accent.purple,
    social: colors.accent.amber,
  }
  
  return typeMap[type.toLowerCase()] || colors.accent.blue
}
