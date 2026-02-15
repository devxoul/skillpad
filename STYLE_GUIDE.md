# SkillPad Style Guide

A comprehensive design system inspired by Arc browser's UI patterns, optimized for native desktop feel using Tauri + React + Tailwind CSS.

---

## Design Philosophy

**Core Principles:**
- **Subtlety over contrast** — Use low-opacity colors instead of solid fills
- **Reveal on interaction** — Hide secondary actions until hover
- **Glassmorphism** — Translucent backgrounds with blur effects
- **Native feel** — Apple-like transitions and system fonts
- **Density** — Compact but readable, optimized for desktop

---

## Color System

### Background Opacity Pattern

Instead of semantic color tokens, use opacity-based colors for universal light/dark mode support:

```css
/* Backgrounds */
bg-white/[0.03]     /* Sidebar background (dark) */
bg-black/[0.03]     /* Sidebar background (light) */
bg-white/[0.06]     /* Hover state */
bg-white/[0.08]     /* Active/selected state, input background */
bg-white/[0.10]     /* Strong hover */
bg-white/[0.12]     /* Active with emphasis */
bg-white/[0.15]     /* Dragging state */

/* Text */
text-foreground           /* Primary text */
text-foreground/70        /* Secondary text */
text-foreground/50        /* Tertiary text */
text-foreground/40        /* Muted text, descriptions */
text-foreground/30        /* Placeholder, icons */
text-foreground/20        /* Disabled, empty states */

/* Borders */
border-white/[0.06]       /* Subtle separator */
border-white/[0.08]       /* Standard border */
border-white/[0.10]       /* Emphasized border */
border-white/[0.15]       /* Focus ring */
```

### Status Colors

```css
/* Success */
bg-emerald-500/10         /* Background */
text-emerald-500          /* Text/icon */

/* Warning */
bg-amber-500/10           /* Background */
text-amber-500            /* Text/icon */

/* Error */
bg-red-500/10             /* Background */
text-red-400              /* Text/icon (slightly lighter for readability) */
```

---

## Typography

### Font Stack

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Size Scale

| Use Case | Size | Class |
|----------|------|-------|
| Page title | 15px | `text-[15px] font-semibold` |
| Item name | 13px | `text-[13px] font-medium` |
| Body text | 13px | `text-[13px]` |
| Description | 12px | `text-[12px]` |
| Caption/badge | 11px | `text-[11px]` |
| Micro text | 10px | `text-[10px]` |

### Font Weights

```css
font-medium     /* 500 - Item names, interactive elements */
font-semibold   /* 600 - Page titles, active nav items */
font-bold       /* 700 - Rarely used, only for strong emphasis */
```

---

## Spacing

### Base Unit: 4px

Use Tailwind's spacing scale consistently:

| Token | Value | Common Use |
|-------|-------|------------|
| `0.5` | 2px | Icon gaps |
| `1` | 4px | Tight padding |
| `1.5` | 6px | Badge padding |
| `2` | 8px | Standard gap |
| `2.5` | 10px | Item padding |
| `3` | 12px | Card padding |
| `4` | 16px | Section gaps |
| `5` | 20px | Page padding |

### Component Spacing

```css
/* Nav items */
px-2.5 py-1.5 mx-2          /* Inset from edges, compact height */

/* List items */
px-3 py-2.5                  /* Standard list item */

/* Cards */
px-3 py-2.5                  /* Compact card */
p-4                          /* Standard card */

/* Page sections */
px-5 py-4                    /* Header padding */
px-4 py-3                    /* Search area */
px-2 py-2                    /* List container */
```

---

## Borders & Separators

### Border Radius

```css
rounded-md      /* 6px - Buttons, inputs, small elements */
rounded-lg      /* 8px - Cards, list items, containers */
rounded-xl      /* 12px - Dialogs, large containers */
rounded-full    /* Badges, pills */
```

### Separators

```css
/* Horizontal divider */
<div className="mx-3 my-2 h-px bg-foreground/[0.06]" />

/* Section border */
border-b border-white/[0.06]
```

---

## Shadows

### Elevation System

```css
/* Level 1 - Subtle lift (active items) */
shadow-[0_1px_3px_rgba(0,0,0,0.08)]

/* Level 2 - Dropdowns, popovers */
shadow-[0_4px_12px_rgba(0,0,0,0.12)]

/* Level 3 - Dialogs, modals */
shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)]

/* Dragging state */
shadow-[0_4px_12px_rgba(0,0,0,0.15)]
```

---

## Transitions

### Standard Easing

```css
/* Apple-like smooth easing */
ease-[cubic-bezier(0.4,0,0.2,1)]

/* Duration */
duration-150    /* Standard interactions */
duration-200    /* Larger animations */
```

### Common Patterns

```css
/* Hover transitions */
transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]

/* Color only */
transition-colors duration-150

/* Opacity reveal */
transition-opacity duration-150
```

---

## Glassmorphism

### Sidebar / Panels

```css
bg-black/[0.03] backdrop-blur-2xl backdrop-saturate-[1.8] dark:bg-white/[0.03]
border-r border-white/[0.08]
```

### Dialogs / Modals

```css
bg-background/95 backdrop-blur-xl
border border-foreground/10
shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)]
```

### Backdrop Overlay

```css
bg-black/30 backdrop-blur-sm dark:bg-black/50
```

---

## Icons

### Library: Phosphor Icons

```tsx
import { IconName } from '@phosphor-icons/react'
```

### Sizes

| Context | Size | Example |
|---------|------|---------|
| Inline with text | 12-14px | `<Icon size={12} />` |
| List item | 16px | `<Icon size={16} />` |
| Nav item | 18px | `<Icon size={18} />` |
| Empty state | 24-32px | `<Icon size={32} />` |

### Weights

```tsx
weight="duotone"    /* Default for decorative icons */
weight="bold"       /* Action buttons, interactive */
weight="fill"       /* Status indicators */
```

### Common Icons

| Use | Icon |
|-----|------|
| Gallery | `Books` |
| Global | `Globe` |
| Folder/Project | `FolderOpen` |
| Add | `Plus` |
| Remove/Close | `X` |
| Delete | `Trash` |
| Search | `MagnifyingGlass` |
| Refresh | `ArrowClockwise` |
| Loading | `SpinnerGap` (with `animate-spin`) |
| GitHub | `GithubLogo` |
| Drag handle | `DotsSixVertical` |
| Link | `LinkSimple` |
| Computer | `Monitor` |
| Warning | `Warning` |

---

## Component Patterns

### Nav Item

```tsx
<Link
  className={clsx(
    'flex items-center gap-2.5 rounded-md mx-2 px-2.5 py-1.5 text-[13px]',
    'transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
    isActive
      ? 'bg-white/[0.12] text-foreground font-medium shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
      : 'text-foreground/70 hover:bg-white/[0.06] hover:text-foreground',
  )}
>
  <Icon size={18} weight="duotone" className="text-foreground/60" />
  <span>Label</span>
</Link>
```

### List Item (with hover actions)

```tsx
<div className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/[0.06]">
  <div className="min-w-0 flex-1">
    <span className="text-[13px] font-medium text-foreground">Name</span>
    <p className="text-[12px] text-foreground/40">Description</p>
  </div>
  <button className="shrink-0 rounded-md p-1.5 text-foreground/30 opacity-0 transition-all duration-150 hover:bg-white/[0.1] hover:text-foreground/70 group-hover:opacity-100">
    <Plus size={16} weight="bold" />
  </button>
</div>
```

### Section Header

```tsx
<header className="shrink-0 border-b border-white/[0.06] px-5 py-4">
  <h1 className="text-[15px] font-semibold text-foreground">Title</h1>
  <p className="mt-0.5 text-[12px] text-foreground/40">Description</p>
</header>
```

### Section Label

```tsx
<span className="text-[11px] font-medium uppercase tracking-wide text-foreground/40">
  Section
</span>
```

### Search Input

```tsx
<div className="relative">
  <MagnifyingGlass
    size={14}
    weight="bold"
    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
  />
  <input
    className="w-full rounded-lg bg-white/[0.06] py-2 pl-8 pr-8 text-[13px] text-foreground placeholder:text-foreground/30 transition-all duration-150 hover:bg-white/[0.08] focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-white/[0.15]"
    placeholder="Search..."
  />
</div>
```

### Icon Button

```tsx
<button
  className="rounded-md p-1.5 text-foreground/40 transition-colors hover:bg-white/[0.06] hover:text-foreground/70"
  aria-label="Action"
>
  <Icon size={16} weight="bold" />
</button>
```

### Badge

```tsx
/* Neutral */
<span className="rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-foreground/50">
  Label
</span>

/* Success */
<span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">
  <LinkSimple size={10} weight="bold" />
  Linked
</span>

/* Warning */
<span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
  Not linked
</span>
```

### Empty State

```tsx
<div className="flex h-full items-center justify-center">
  <div className="text-center">
    <Package size={32} weight="duotone" className="mx-auto text-foreground/20" />
    <p className="mt-2 text-[13px] text-foreground/40">No items found</p>
  </div>
</div>
```

### Loading State

```tsx
<div className="flex items-center justify-center py-16">
  <SpinnerGap size={24} className="animate-spin text-foreground/30" />
</div>
```

---

## Do's and Don'ts

### Do ✓

- Use opacity-based colors (`white/[0.06]`) for universal theme support
- Hide secondary actions until hover
- Use `text-[13px]` as default body text
- Apply `transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]`
- Use Phosphor icons with `weight="duotone"` or `weight="bold"`
- Keep borders subtle (`white/[0.06]` to `white/[0.10]`)

### Don't ✗

- Use solid background colors for interactive elements
- Show all actions at once (reveal on hover instead)
- Use heavy shadows or thick borders
- Use bright focus rings with offsets
- Mix icon libraries
- Use arbitrary spacing values

---

## File Structure

```
src/
├── components/       # Feature components
│   ├── sidebar.tsx
│   ├── skill-card.tsx
│   └── search-input.tsx
├── ui/               # Base UI primitives
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── views/            # Page-level components
│   ├── skill-gallery-view.tsx
│   └── installed-skills-view.tsx
└── index.css         # Theme variables
```

---

## Quick Reference

```css
/* Hover background */      bg-white/[0.06]
/* Active background */     bg-white/[0.12]
/* Primary text */          text-foreground
/* Secondary text */        text-foreground/40
/* Border */                border-white/[0.06]
/* Transition */            transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
/* Border radius */         rounded-lg
/* Body text */             text-[13px]
/* Icon size */             16px (weight="bold")
```
