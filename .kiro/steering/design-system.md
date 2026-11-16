# Halloween Design System

## Color Palette

```ts
// tailwind.config.ts theme.extend.colors
halloween: {
  dark:       '#0D0D1A',   // Page background – near-black purple
  darker:     '#070710',   // Sidebar, panel backgrounds
  purple:     '#4A1B6D',   // Primary purple
  'purple-light': '#7B2FBE', // Hover, active states
  violet:     '#2D1B69',   // Card backgrounds
  orange:     '#FF6B00',   // Primary accent – pumpkin orange
  'orange-light': '#FF8C38', // Hover states
  amber:      '#FFA500',   // Coins, XP highlights
  green:      '#00FF88',   // Success, streak active
  red:        '#FF2D2D',   // Danger, streak broken
  ghost:      '#E8E8F0',   // Ghost white – primary text
  'ghost-muted': '#9090A8', // Secondary text
  glow:       '#FF6B0066', // Orange glow (semi-transparent)
}
```

## Typography

- Font families: `'Cinzel'` (headings, Halloween feel), `'Inter'` (body, readable).
- Load from Google Fonts in `index.html`.
- Heading scale: `text-4xl font-cinzel` for page titles, `text-2xl` for section headers.
- Body text: `text-sm` or `text-base font-inter text-halloween-ghost`.

## Spacing & Layout

- Max content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Card padding: `p-6` standard, `p-4` compact.
- Section gap: `gap-6` for grids, `space-y-4` for stacks.
- Border radius: `rounded-xl` cards, `rounded-full` avatars/badges, `rounded-lg` buttons.

## Component Patterns

### Cards
```
bg-halloween-violet border border-halloween-purple/30 rounded-xl
shadow-[0_0_20px_rgba(74,27,109,0.3)]
```

### Primary Button
```
bg-halloween-orange hover:bg-halloween-orange-light
text-white font-semibold rounded-lg px-6 py-2.5
transition-all duration-200 shadow-[0_0_15px_rgba(255,107,0,0.4)]
hover:shadow-[0_0_25px_rgba(255,107,0,0.6)]
```

### Ghost Button
```
border border-halloween-orange/50 text-halloween-orange
hover:bg-halloween-orange/10 rounded-lg px-6 py-2.5
transition-all duration-200
```

### XP Bar
```
bg-halloween-darker rounded-full overflow-hidden
  inner: bg-gradient-to-r from-halloween-purple to-halloween-orange
  glow:  shadow-[0_0_10px_rgba(255,107,0,0.5)]
```

### Badge / Achievement
```
rounded-full p-2 bg-halloween-purple/20 border border-halloween-purple/40
locked: grayscale opacity-40
unlocked: shadow-[0_0_12px_rgba(255,107,0,0.5)]
```

## Animations (Tailwind keyframes)

```ts
keyframes: {
  float: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%':      { transform: 'translateY(-8px)' },
  },
  flicker: {
    '0%, 100%': { opacity: '1' },
    '50%':      { opacity: '0.6' },
  },
  'pulse-glow': {
    '0%, 100%': { boxShadow: '0 0 10px rgba(255,107,0,0.3)' },
    '50%':      { boxShadow: '0 0 25px rgba(255,107,0,0.8)' },
  },
  'bat-fly': {
    '0%':   { transform: 'translateX(-100px) translateY(0px)' },
    '50%':  { transform: 'translateX(50vw) translateY(-30px)' },
    '100%': { transform: 'translateX(110vw) translateY(10px)' },
  },
  'ghost-rise': {
    '0%':   { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0px)',  opacity: '1' },
  },
}
```

## Island Building Sprites

Buildings are SVG components or PNG sprites at `public/assets/buildings/`.

| Building | Unlock Condition | Cost |
|---|---|---|
| Haunted Cottage | Default (free) | – |
| Pumpkin Farm | Level 2 | 50 coins |
| Graveyard | Level 3 | 100 coins |
| Witch's Tower | Level 5 | 200 coins |
| Haunted Castle | Level 8 | 500 coins |
| Dark Cathedral | Level 12 | 1000 coins |
| Ghost Harbor | Level 10 | 750 coins |
| Bone Bridge | Level 4 | 150 coins |
| Cursed Forest | Level 6 | 300 coins |

Island is rendered on a fixed-size `<div>` with absolute-positioned building components. No canvas, no WebGL.

## Icons

Use Lucide React for utility icons. Halloween-specific icons (pumpkin, skull, ghost, bat) are inline SVG components in `src/components/halloween/icons/`.

## Particles

Use a lightweight CSS-only particle system (no heavy libraries). Floating particles: small circles with `animate-float` and randomized `animation-delay`. Max 20 particles per page.

## Responsive Breakpoints

- Mobile: `< 768px` – stack layout, hidden sidebar, hamburger menu.
- Tablet: `768px – 1024px` – collapsible sidebar.
- Desktop: `> 1024px` – full layout with persistent sidebar.
