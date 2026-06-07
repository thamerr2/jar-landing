# Jar Brand Refresh — Landing Page & Identity Alignment

**Date:** 2026-06-07  
**Scope:** Landing page, AntiGravityCanvas, MockDashboard  
**Trigger:** New logo `Jar_logo 2.svg` introduces a warm cream/bronze/navy palette that replaces the previous cold dark + teal identity.

---

## Problem

The current landing page uses:
- Cold dark background `#0a0f1e`
- Teal accent `#0D9488` — absent from the new logo
- Gold `#c9a84c` — warmer in the new logo at `#BC7D37`
- `Landmark` icon as placeholder logo

The new `Jar_logo 2.svg` establishes a distinct warm identity that the UI must reflect.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `BG_DARK` | `#2A2F40` | Hero, Navbar, Modal backgrounds |
| `BG_CREAM` | `#FEF7DC` | Features, Contact, Footer sections |
| `BRONZE` | `#BC7D37` | Primary accent, buttons, borders |
| `BRONZE2` | `#D4A055` | Button gradients, highlights |
| `SAND` | `#EED6AC` | Soft borders, card backgrounds |
| `TEXT_LIGHT` | `#F8FAFC` | Text on dark backgrounds |
| `TEXT_DARK` | `#2A2F40` | Text on cream backgrounds |
| `MUTED_DARK` | `#B8A99A` | Secondary text on dark |
| `MUTED_LIGHT` | `#7A6A52` | Secondary text on cream |

**Removed:** `#0D9488` teal — not present in new brand identity.  
**Removed:** `#0a0f1e` cold navy — replaced by warmer `#2A2F40`.

---

## Page Layout

```
┌─────────────────────────────┐
│  Navbar (BG_DARK, blur)     │  Jar SVG logo, bronze CTAs
├─────────────────────────────┤
│  Hero (BG_DARK #2A2F40)     │  Bronze/sand particles, MockDashboard
├─────────────────────────────┤
│  Gradient transition        │  #2A2F40 → #FEF7DC over ~120px
├─────────────────────────────┤
│  Features (BG_CREAM)        │  Dark navy text, bronze card borders
├─────────────────────────────┤
│  Contact (BG_CREAM)         │  Dark fields, bronze send button
├─────────────────────────────┤
│  Footer (BG_CREAM)          │  Jar SVG logo, dark muted text
└─────────────────────────────┘
```

---

## Files Changed

### `src/pages/Landing.tsx`
- Update color constants: remove `BG=#0a0f1e`, `TEAL=#0D9488`; add `BG_DARK`, `BG_CREAM`, `BRONZE`, `BRONZE2`, `SAND`, `TEXT_DARK`, `MUTED_LIGHT`
- Navbar: replace `Landmark` icon with `<img src="/jar-logo.svg" />` at `h-8`
- Hero section: background `BG_DARK`, text colors updated
- Features section: `background: BG_CREAM`, text/card colors updated
- Contact section: `background: BG_CREAM`, input/button colors updated
- Footer: `background: BG_CREAM`, replace `Landmark` with `<img src="/jar-logo.svg" />`, text `TEXT_DARK`
- Add gradient bridge `<div>` between Hero and Features with CSS `background: linear-gradient(BG_DARK, BG_CREAM)`
- All button gradients: `linear-gradient(135deg, BRONZE, BRONZE2)` — remove teal

### `src/components/AntiGravityCanvas.tsx`
- Background: `#2A2F40` (warm navy, replaces cold `#0a0f1e`)
- Particle color palette: `["#BC7D37","#EED6AC","#D4A055","#F0EAD8","#8B6A3A","#C4A882","#FEF7DC"]`
- Speed fix: `vy: -(0.4 + Math.random() * 0.8)` (was `0.05–0.25`, now `0.4–1.2`)
- Radial gradient vignette: update stop colors to `rgba(42,47,64,...)` 

### `src/components/MockDashboard.tsx`
- `GOLD` → `#BC7D37`, `GOLD2` → `#D4A055`
- Remove `TEAL = "#0D9488"` → replace with `BRONZE2 = "#D4A055"`
- Card background: `rgba(42,47,64,0.9)` (warm navy)
- Border colors: `rgba(188,125,55,...)` (bronze-based)
- AI badge: `rgba(188,125,55,0.15)` border/background with `BRONZE2` text

### `public/jar-logo.svg`
- Copy `Jar_logo 2.svg` → `public/jar-logo.svg` (clean filename, accessible as static asset)

---

## Animation Fix Detail

**Before:**
```ts
vy: -(0.05 + Math.random() * 0.2)   // max 0.25 px/frame — very slow
```

**After:**
```ts
vy: -(0.4 + Math.random() * 0.8)    // 0.4–1.2 px/frame — natural feel
```

Also increase horizontal drift amplitude slightly for more organic movement:
```ts
driftAmp: 0.4 + Math.random() * 0.8  // was 0.2–0.7
```

---

## Out of Scope

- Other portals (HOA, Resident, Owner, Provider) — not touched
- Backend or API changes
- i18n strings — no new keys needed
