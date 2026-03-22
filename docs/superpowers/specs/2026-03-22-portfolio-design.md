# Portfolio Website Design Spec
**Date:** 2026-03-22
**Project:** Justin Keevers — Personal Portfolio
**Status:** Approved

---

## Overview

A personal portfolio website styled as an 80s arcade cabinet. Every page is a different screen inside the same machine. The site serves as a passive personal brand presence — not a job application, but a memorable destination that communicates "this person grows teams and ships products." The tone is warm and human; the arcade cabinet is the costume, not the personality.

---

## Target Audience

- Engineering hiring managers and recruiters
- Senior software engineer hiring teams
- Peers, collaborators, and people who've been referred to the site

Primary goal: passive personal brand. The site should be compelling when stumbled upon, not optimised for conversion funnels.

---

## Site Structure

```
/ (Home)
  Attract mode: cabinet powers on, marquee scrolls, high scores tick up,
  PRESS START blinks. Any keypress or click transitions to the main menu.
  The main menu is rendered on the home route (/) as a second state —
  not a separate page. The home route manages two Vue states:
  "attract" and "menu". No navigation occurs; the screen content swaps
  in place within the cabinet chrome.

  Main menu options (rendered inside the cabinet screen):
    [1] ABOUT ME      → /about
    [2] MY WORK       → /work
    [3] HOW I LEAD    → /leadership
    [4] WRITING       → /writing
    [5] CONTACT       → /contact

/about          → "PLAYER PROFILE"
                  Who Justin is, his story, what he cares about.
                  Layout: short intro paragraph, a "stats" block
                  (years experience, teams led, roles held), and a
                  values/beliefs section. All slots accept placeholder
                  text at launch.

/work           → "GAME HISTORY"
                  Companies and roles, presented as a timeline of
                  "missions completed." Layout: a vertical list of
                  entries, each with: company name, role title, date
                  range, and a short impact summary (1–3 lines).
                  All fields accept placeholder content at launch.
                  No case studies or deep-dive content in v1.

/leadership     → "HOW I PLAY"
                  Approach to leading teams, values, working style.
                  Layout: a set of named "moves" or principles, each
                  with a short description. Accepts placeholder at launch.

/writing        → "LEVEL SELECT"
                  Blog index. Posts listed as numbered stages with XP
                  values. Locked/upcoming stages shown greyed out.

/writing/[slug] → Individual blog post screen.
                  Readable prose inside the arcade cabinet chrome.

/contact        → "INSERT COIN"
                  Simple, warm. Links to LinkedIn, email, GitHub.
```

The arcade cabinet chrome (marquee, bezel, scanlines, control panel) is present on every page. Navigating between pages feels like switching screens inside the same machine.

---

## Visual Design System

### Colour Palette — Midnight Neon

| Role | Value | Usage |
|---|---|---|
| Background | `#0f0f1f` | Page background |
| Cabinet body | `#1a1a40` | Chrome, bezel |
| Border | `#2a2a5a` | Structural lines |
| Cyan | `#2fffff` | Primary accent, active states |
| Violet | `#7b2fff` | Secondary accent, menu keys |
| Hot pink | `#ff2faa` | Tertiary accent, glow highlights |
| Electric blue | `#2f6fff` | Supporting accent |
| Gold | `#ffd700` | XP values, high scores |
| White | `#e8e8ff` | Body text |
| Dim | `#3a3a6a` | Inactive/disabled states |

### Typography

**Press Start 2P** (Google Fonts, self-hosted at build time via `@fontsource/press-start-2p`) used everywhere — headings, body copy, UI chrome, navigation. Self-hosting avoids Google Fonts network requests and GDPR concerns. Body text at 8–9px with 2× line-height for readability at small sizes.

### CRT Effects

- **Scanlines**: `repeating-linear-gradient` overlay, 2px on / 2px off, 15–20% opacity
- **Neon text glow**: `text-shadow` with 2–3 layers (tight, mid, wide) in the element's accent colour
- **Vignette**: Radial gradient overlay, darkens screen corners
- **Screen border glow**: `box-shadow` on the screen element, colour matches current page accent
- **`prefers-reduced-motion`**: Disables all animations and transitions for users who need it

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Astro | Static generation, built-in content collections for blog, zero JS by default |
| Interactivity | Vue 3 | First-class Astro support, handles menu state, keyboard nav, attract mode |
| Page transitions | Astro View Transitions API | Native browser API, integrates cleanly with Astro routing, no extra router needed |
| Styling | Hand-written CSS | No framework — 90% of styles are custom (glow, scanlines, animations) |
| Fonts | `@fontsource/press-start-2p` | Self-hosted, no external network request, GDPR-safe |
| Content | Astro content collections | Blog posts as Markdown with typed frontmatter |
| Deployment | Vercel | Free tier, Astro adapter available, fast global CDN |

No CSS framework (Tailwind etc.) — the visual language is too custom for utility classes to add value.

No Vue Router — Astro handles all routing. Vue is used for in-page interactive components only.

---

## Blog — Level Select

Blog posts are "stages." Each post has typed frontmatter:

```yaml
---
title: "Why I Stopped Writing Tickets"
date: 2026-03-01
stage: 4          # manually assigned display number; must be unique
published: true   # false = locked stage, shown greyed out with ??? title
category: leadership
xp: 250           # shown in gold on the level select screen
excerpt: "..."
---
```

**Stage numbering:** Manually assigned. Stages must be unique — the content schema enforces this at build time via a Zod refinement. Stages are assigned sequentially as posts are written; gaps are allowed (e.g. stage 1, 2, 4 is valid).

**Level Select screen behaviour:**
- Unlocked stages (`published: true`): full colour, clickable, show XP value in gold
- Locked stages (`published: false`): greyed out, title replaced with `???`, date replaced with `STAGE N · ???`. Hardcode 2 locked placeholder entries at launch to make the screen feel alive.
- Clicking a stage loads the post as a full-screen arcade screen

**Blog post screen layout:**
- Full arcade cabinet chrome persists (marquee, bezel, scanlines)
- Post content renders inside the screen element
- Press Start 2P headings; body text at 9px / 2× line-height
- Code blocks: monospace, dark background panel, subtle border
- Images: full-width within the screen, rounded corners matching screen border-radius
- End of post: "← BACK TO LEVEL SELECT" navigation link
- No next/previous post navigation in v1

---

## Interactions & UX

### Attract Mode & Main Menu (Home Route)

The home route (`/`) manages two Vue component states:

**State 1 — Attract:**
1. Brief "power on" flash on load
2. Marquee scrolls: `★ JUSTIN KEEVERS ★ ENGINEERING LEADER ★ INSERT COIN ★`
3. High score counters animate up to hardcoded values (see High Scores section below)
4. `▶ PRESS START ◀` blinks
5. Any keypress or click → transitions to State 2

**State 2 — Main Menu:**
- Menu rendered inside the cabinet screen
- Arrow keys or mouse navigate; Enter or click selects
- Selecting a menu item triggers an Astro View Transition to the target page

**Returning home** (e.g. browser back, logo click) always shows State 2 (main menu), not State 1 (attract).

### High Score Values (Hardcoded)

Displayed on the attract screen. Values are hardcoded constants in a config file (`src/config/site.ts`), not derived from content:

| Label | Value |
|---|---|
| TEAMS GROWN | 12 |
| PRODUCTS SHIPPED | 8 |
| YRS EXPERIENCE | 10+ |

### Keyboard Navigation & Accessibility

- Arrow keys move `▶` cursor between menu items with CSS transition
- Enter selects the highlighted item; mouse/click works equivalently
- Vue menu component uses proper ARIA roles: `role="menu"` on the container, `role="menuitem"` on each item, `aria-current="true"` on the active item
- Focus is managed programmatically: when the menu mounts, focus moves to the first item
- Screen reader users hear the menu items announced correctly
- All interactive elements meet WCAG 2.1 AA contrast requirements within the arcade aesthetic

### Page Transitions

- Astro View Transitions API handles all page-to-page navigation
- Custom transition: CRT flicker/fade out → flicker/fade in
- Defined as a named `@keyframes` animation applied via Astro's `transition:animate` directive
- `prefers-reduced-motion`: transition replaced with an instant swap

### Mobile

- Cabinet scales to viewport width via `max-width` + responsive padding
- D-pad and action buttons in the control panel are **decorative only on all screen sizes** — they do not trigger actions. Navigation is menu-driven (tap menu items to navigate).
- Keyboard nav replaced with tap-to-select on menu items
- CRT effects retained (scanlines, glow)

---

## Easter Egg — Konami Code → Breakout Clone

**Trigger:** Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) detected via a global `keydown` listener registered in the Astro root layout.

**Effect:** The cabinet screen glitches (brief flicker animation), then the current screen content is replaced by the Breakout game canvas.

**Theme:** Bricks are skill/technology names (e.g. React, TypeScript, Go, AWS, Kubernetes). Clearing all bricks shows a congratulations screen with a cheeky message before returning to the previous screen.

**Exit:** Pressing Escape at any time dismisses the game and restores the previous screen content. A small `[ESC] EXIT` label is shown in the corner during gameplay.

**Implementation:**
- Vue component, canvas-based game loop
- Lazy-loaded (dynamic import) — zero impact on page performance until triggered
- Game state is local to the component; dismissing it unmounts the component cleanly
- Works on desktop only (Konami Code requires a keyboard). No mobile equivalent.

---

## Content Strategy

Content is TBD — the site must support placeholder content gracefully at launch and be easy to fill in over time. Each page section should have clearly commented placeholder slots. The `/work` and `/leadership` pages ship with placeholder copy at launch.

---

## Out of Scope

- CMS integration (Markdown files are sufficient)
- Analytics (no tracking at launch)
- Dark/light mode toggle (the site is always dark)
- Internationalisation
- Next/previous post navigation on blog posts (v1)
- Mobile easter egg (Konami Code requires a keyboard)
