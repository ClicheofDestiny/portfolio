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

/about          → "PLAYER PROFILE"
                  Who Justin is, his story, what he cares about.

/work           → "GAME HISTORY"
                  Companies, roles, and impact. Content TBD — structure
                  should support placeholder content gracefully.

/leadership     → "HOW I PLAY"
                  Approach to leading teams, values, working style.

/writing        → "LEVEL SELECT"
                  Blog index. Posts listed as numbered stages with XP values.
                  Locked stages (future posts) shown greyed out with ???.

/writing/[slug] → Individual blog post screen.
                  Readable prose. Press Start 2P headings, comfortable
                  line-height for body text.

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

**Press Start 2P** (Google Fonts) used everywhere — headings, body copy, UI chrome, navigation. Most authentic to the arcade aesthetic. Body text at 8–9px with 2× line-height for readability at small sizes.

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
| Styling | Hand-written CSS | No framework — 90% of styles are custom (glow, scanlines, animations) |
| Fonts | Google Fonts (Press Start 2P) | Self-hostable for performance |
| Content | Astro content collections | Blog posts as Markdown with typed frontmatter |
| Deployment | Vercel or Netlify | Free tier, fits static Astro perfectly |

No CSS framework (Tailwind etc.) — the visual language is too custom for utility classes to add value.

---

## Blog — Level Select

Blog posts are "stages." Each post has:

```yaml
---
title: "Why I Stopped Writing Tickets"
date: 2026-03-01
stage: 4          # display number
category: leadership
xp: 250           # shown on level select screen
excerpt: "..."
---
```

**Level Select screen behaviour:**
- Unlocked stages: full colour, clickable, show XP value in gold
- Locked/upcoming stages: greyed out, `???` title, `STAGE N · ???` date
- Clicking a stage loads the post as a full-screen arcade screen

---

## Interactions & UX

### Attract Mode (Home)
1. Brief "power on" flash on load
2. Marquee scrolls: `★ JUSTIN KEEVERS ★ ENGINEERING LEADER ★ INSERT COIN ★`
3. High score counters tick up to final values
4. `▶ PRESS START ◀` blinks
5. Any keypress or click → screen-wipe transition to main menu

### Keyboard Navigation
- Arrow keys move `▶` cursor between menu items with animated transition
- Enter selects the highlighted item
- Mouse/click works equivalently
- Natural accessibility — no extra ARIA work needed beyond semantic HTML

### Page Transitions
- CRT flicker/fade out → flicker/fade in between all pages
- Reinforces the "one machine, many screens" illusion

### Mobile
- Cabinet scales to viewport width
- D-pad and action buttons remain visible as tap targets
- Keyboard nav replaced with tap-to-select on menu items
- CRT effects retained (scanlines, glow), animation intensity unchanged

---

## Easter Egg — Konami Code → Breakout Clone

**Trigger:** Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) on any page.

**Effect:** The cabinet screen "glitches," then launches a Breakout clone rendered inside the screen element.

**Theme:** Bricks are skill/technology names or logos (e.g. React, TypeScript, Go, AWS, Kubernetes). Clearing all bricks shows a brief congratulations screen with a cheeky message.

**Implementation:** Vue component, canvas-based game loop, loaded lazily so it doesn't affect page performance. Konami sequence detected via global keydown listener.

---

## Content Strategy

Content is TBD — the site must support placeholder content gracefully at launch and be easy to fill in over time. Each page section should have clear, obvious slots for content to be dropped into without redesigning the layout.

---

## Out of Scope

- CMS integration (Markdown files are sufficient)
- Analytics beyond basic page views
- Dark/light mode toggle (the site is always dark)
- Internationalisation
