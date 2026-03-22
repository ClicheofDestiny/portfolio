# Arcade Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal portfolio website styled as an 80s arcade cabinet with a blog, keyboard navigation, and a Konami Code–triggered Breakout easter egg.

**Architecture:** Astro handles routing and static generation. Vue 3 components handle all interactive state (attract mode, menus, blog level select, easter egg). Every page shares a single `BaseLayout.astro` that renders the cabinet chrome (marquee, bezel, CRT effects, controls). Page-to-page navigation uses the Astro View Transitions API with a custom CRT flicker animation.

**Tech Stack:** Astro 6, Vue 3, hand-written CSS, `@fontsource/press-start-2p`, Vitest + Vue Test Utils, Vercel

**Note on @astrojs/vue v6:** The `appEntrypoint` option was removed. Use the `app` option instead if registering global Vue plugins (e.g. `app({ app } => { app.use(plugin) })`). The plan tasks do not require global Vue plugin registration so this should not arise, but be aware if debugging integration issues.

---

## File Structure

```
C:/Portfolio/
├── src/
│   ├── config/
│   │   └── site.ts                        # Site metadata, high score values, nav items
│   ├── content/
│   │   ├── schema.ts                      # Zod schema for blog posts (no astro:content import — testable)
│   │   ├── config.ts                      # Astro content collection definition (imports schema.ts)
│   │   └── blog/
│   │       ├── 01-placeholder-post.md     # Locked placeholder (published: false)
│   │       └── 02-placeholder-post.md     # Locked placeholder (published: false)
│   ├── layouts/
│   │   └── BaseLayout.astro               # Full cabinet wrapper — marquee, bezel, screen, controls
│   ├── components/
│   │   ├── Marquee.astro                  # Scrolling marquee strip
│   │   ├── CabinetControls.astro          # Decorative d-pad + action buttons
│   │   ├── AttractMode.vue                # Attract mode: high scores, blink, press start
│   │   ├── ArcadeMenu.vue                 # Main menu: keyboard nav, ARIA, cursor animation
│   │   ├── LevelSelect.vue                # Blog index: stage list with lock/unlock state
│   │   ├── KonamiListener.vue             # Global Konami code detector (wraps app)
│   │   └── BreakoutGame.vue               # Breakout clone: canvas game loop (lazy loaded)
│   ├── pages/
│   │   ├── index.astro                    # Home: mounts AttractMode + ArcadeMenu
│   │   ├── about.astro                    # Player Profile
│   │   ├── work.astro                     # Game History
│   │   ├── leadership.astro               # How I Play
│   │   ├── writing/
│   │   │   ├── index.astro                # Level Select (mounts LevelSelect.vue)
│   │   │   └── [slug].astro               # Individual blog post
│   │   └── contact.astro                  # Insert Coin
│   └── styles/
│       ├── global.css                     # CSS variables, reset, cabinet structure
│       ├── crt.css                        # Scanlines, neon glow, vignette mixins
│       ├── typography.css                 # Press Start 2P sizing scale + line-height rules
│       └── transitions.css               # View Transitions API keyframes (CRT flicker)
├── tests/
│   └── unit/
│       ├── config/
│       │   └── site.test.ts               # Site config shape validation
│       ├── content/
│       │   └── schema.test.ts             # Blog frontmatter schema
│       └── components/
│           ├── ArcadeMenu.test.ts         # Keyboard nav logic, ARIA state
│           ├── KonamiListener.test.ts     # Konami sequence detection
│           └── BreakoutGame.test.ts       # Ball physics, collision, brick clearing
├── public/
│   └── fonts/                             # (auto-populated by @fontsource at build)
├── astro.config.mjs
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `astro.config.mjs`
- Create: `vitest.config.ts`
- Create: `tsconfig.json`
- Create: `package.json` (via npm init)

- [ ] **Step 1: Scaffold Astro project**

```bash
cd C:/Portfolio
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
```

Expected: Astro project files created in `C:/Portfolio`. Answer "Yes" to overwrite if prompted (the spec doc is already committed).

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/vue vue
npm install @fontsource/press-start-2p
npm install -D vitest @vitejs/plugin-vue @vue/test-utils happy-dom
```

- [ ] **Step 3: Configure Astro with Vue + View Transitions**

Replace the contents of `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
  output: 'static',
});
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
});
```

- [ ] **Step 5: Add test script to package.json**

In `package.json`, add to the `scripts` section:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Verify Astro dev server starts**

```bash
npm run dev
```

Expected: Server running at `http://localhost:4321`. Stop with Ctrl+C.

- [ ] **Step 7: Create GitHub repo and push**

```bash
gh repo create justin-keevers-portfolio --public --source=. --push
```

If `gh` is not installed, create the repo at github.com manually, then:

```bash
git remote add origin https://github.com/<your-username>/justin-keevers-portfolio.git
git push -u origin master
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: scaffold Astro + Vue project with Vitest"
```

---

## Task 2: Site Config + Content Schema

**Files:**
- Create: `src/config/site.ts`
- Create: `src/content/schema.ts`
- Create: `src/content/config.ts`
- Create: `src/content/blog/01-placeholder-post.md`
- Create: `src/content/blog/02-placeholder-post.md`
- Create: `tests/unit/config/site.test.ts`
- Create: `tests/unit/content/schema.test.ts`

- [ ] **Step 1: Write failing test for site config**

Create `tests/unit/config/site.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { siteConfig } from '../../../src/config/site';

describe('siteConfig', () => {
  it('has a name', () => {
    expect(siteConfig.name).toBeTypeOf('string');
    expect(siteConfig.name.length).toBeGreaterThan(0);
  });

  it('has high score entries with numeric values', () => {
    expect(siteConfig.highScores).toHaveLength(3);
    siteConfig.highScores.forEach(entry => {
      expect(entry.label).toBeTypeOf('string');
      expect(entry.value).toBeTypeOf('string');
    });
  });

  it('has nav items with label and href', () => {
    expect(siteConfig.nav.length).toBeGreaterThan(0);
    siteConfig.nav.forEach(item => {
      expect(item.label).toBeTypeOf('string');
      expect(item.href).toMatch(/^\//);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/unit/config/site.test.ts
```

Expected: FAIL — `Cannot find module '../../../src/config/site'`

- [ ] **Step 3: Create site config**

Create `src/config/site.ts`:

```ts
export const siteConfig = {
  name: 'Justin Keevers',
  tagline: 'Engineering Leader',
  marquee: '★ JUSTIN KEEVERS ★ ENGINEERING LEADER ★ INSERT COIN ★',

  highScores: [
    { rank: '1ST', label: 'TEAMS GROWN', value: '×12' },
    { rank: '2ND', label: 'PRODUCTS SHIPPED', value: '×8' },
    { rank: '3RD', label: 'YRS EXPERIENCE', value: '×10+' },
  ],

  nav: [
    { key: '1', label: 'ABOUT ME', href: '/about' },
    { key: '2', label: 'MY WORK', href: '/work' },
    { key: '3', label: 'HOW I LEAD', href: '/leadership' },
    { key: '4', label: 'WRITING', href: '/writing' },
    { key: '5', label: 'CONTACT', href: '/contact' },
  ],

  social: {
    linkedin: 'https://linkedin.com/in/justinkeevers',
    github: 'https://github.com/justinkeevers',
    email: 'hello@justinkeevers.com',
  },
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/unit/config/site.test.ts
```

Expected: PASS — 3 tests passing

- [ ] **Step 5: Write failing test for content schema**

Create `tests/unit/content/schema.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { blogSchema } from '../../../src/content/schema';

describe('blogSchema', () => {
  it('accepts valid frontmatter', () => {
    const result = blogSchema.safeParse({
      title: 'Test Post',
      date: new Date('2026-01-01'),
      stage: 1,
      published: true,
      category: 'leadership',
      xp: 100,
      excerpt: 'A short excerpt.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = blogSchema.safeParse({ title: 'No stage' });
    expect(result.success).toBe(false);
  });

  it('rejects non-positive stage number', () => {
    const result = blogSchema.safeParse({
      title: 'Bad stage',
      date: new Date(),
      stage: 0,
      published: true,
      category: 'leadership',
      xp: 100,
      excerpt: 'Excerpt.',
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

```bash
npm test -- tests/unit/content/schema.test.ts
```

Expected: FAIL — `Cannot find module '../../../src/content/config'`

- [ ] **Step 7: Create content schema and collection definition**

Create `src/content/schema.ts` — pure Zod, no `astro:content` import so Vitest can import it directly:

```ts
import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string(),
  date: z.date(),
  stage: z.number().int().positive(),
  published: z.boolean(),
  category: z.string(),
  xp: z.number().int().positive(),
  excerpt: z.string(),
});
```

Create `src/content/config.ts` — Astro's collection definition, imports the schema from above:

```ts
import { defineCollection } from 'astro:content';
import { blogSchema } from './schema';

const blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

export const collections = { blog };
```

- [ ] **Step 8: Run test to verify it passes**

```bash
npm test -- tests/unit/content/schema.test.ts
```

Expected: PASS — 3 tests passing

- [ ] **Step 9: Create placeholder blog posts**

Create `src/content/blog/01-placeholder-post.md`:

```markdown
---
title: "Coming Soon"
date: 2026-06-01
stage: 1
published: false
category: leadership
xp: 200
excerpt: "Coming soon."
---

Coming soon.
```

Create `src/content/blog/02-placeholder-post.md`:

```markdown
---
title: "Coming Soon"
date: 2026-07-01
stage: 2
published: false
category: engineering
xp: 150
excerpt: "Coming soon."
---

Coming soon.
```

- [ ] **Step 10: Commit**

```bash
git add src/config/site.ts src/content/ tests/unit/config/ tests/unit/content/
git commit -m "feat: add site config and blog content schema"
```

---

## Task 3: Global Styles + CRT Effects

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/crt.css`
- Create: `src/styles/typography.css`
- Create: `src/styles/transitions.css`

No unit tests for CSS. Verification is visual (dev server).

- [ ] **Step 1: Create CSS variables and reset**

Create `src/styles/global.css`:

```css
/* @fontsource handles the @font-face declaration — just import it */
@import '@fontsource/press-start-2p';

:root {
  --bg:        #0f0f1f;
  --cabinet:   #1a1a40;
  --bezel:     #0d0d28;
  --chrome:    #1e1e4a;
  --border:    #2a2a5a;
  --cyan:      #2fffff;
  --violet:    #7b2fff;
  --pink:      #ff2faa;
  --blue:      #2f6fff;
  --gold:      #ffd700;
  --white:     #e8e8ff;
  --dim:       #3a3a6a;

  --font-pixel: 'Press Start 2P', monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { background: var(--bg); color: var(--white); font-family: var(--font-pixel); }

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 16px 48px;
  background: var(--bg);
}

a { color: var(--cyan); text-decoration: none; }
a:hover { text-decoration: underline; }
```

- [ ] **Step 2: Create CRT effects**

Create `src/styles/crt.css`:

```css
/* Apply to .screen elements */
.crt {
  position: relative;
  overflow: hidden;
}

/* Scanlines */
.crt::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.18) 2px,
    rgba(0, 0, 0, 0.18) 4px
  );
  pointer-events: none;
  z-index: 10;
}

/* Vignette */
.crt::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 20, 0.85) 100%);
  pointer-events: none;
  z-index: 11;
}

/* Neon glow utilities */
.glow-cyan   { text-shadow: 0 0 6px var(--cyan),  0 0 16px var(--cyan),  0 0 32px rgba(47,255,255,0.4); }
.glow-violet { text-shadow: 0 0 6px var(--violet), 0 0 16px var(--violet); }
.glow-pink   { text-shadow: 0 0 6px var(--pink),   0 0 16px var(--pink); }
.glow-gold   { text-shadow: 0 0 6px var(--gold),   0 0 16px var(--gold); }

/* Screen border glow */
.screen-glow {
  box-shadow:
    inset 0 0 60px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(47, 255, 255, 0.15),
    0 0 40px rgba(123, 45, 255, 0.1);
}

@media (prefers-reduced-motion: reduce) {
  .crt::after, .crt::before { display: none; }
  .glow-cyan, .glow-violet, .glow-pink, .glow-gold { text-shadow: none; }
}
```

- [ ] **Step 3: Create typography scale**

Create `src/styles/typography.css`:

```css
/* All text uses Press Start 2P. Scale in px — the font renders crisply at integer sizes. */

.text-xxl  { font-size: 24px; line-height: 1.4; }
.text-xl   { font-size: 18px; line-height: 1.4; }
.text-lg   { font-size: 14px; line-height: 1.6; }
.text-md   { font-size: 10px; line-height: 2; }
.text-base { font-size: 9px;  line-height: 2; }
.text-sm   { font-size: 8px;  line-height: 2; }
.text-xs   { font-size: 7px;  line-height: 2; }
.text-xxs  { font-size: 6px;  line-height: 2; }

/* Letter spacing for all-caps labels */
.label { letter-spacing: 2px; }

/* Blink animation for PRESS START */
.blink { animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .blink { animation: none; }
}
```

- [ ] **Step 4: Create View Transitions animations**

Create `src/styles/transitions.css`:

```css
/* CRT flicker transition for Astro View Transitions */

@keyframes crt-out {
  0%   { opacity: 1; filter: brightness(1); }
  40%  { opacity: 0.8; filter: brightness(2) blur(1px); }
  60%  { opacity: 0.1; filter: brightness(0.2); }
  80%  { opacity: 0.6; filter: brightness(3) blur(2px); }
  100% { opacity: 0; filter: brightness(0); }
}

@keyframes crt-in {
  0%   { opacity: 0; filter: brightness(0); }
  20%  { opacity: 0.5; filter: brightness(3) blur(2px); }
  40%  { opacity: 0.2; filter: brightness(0.5); }
  70%  { opacity: 0.9; filter: brightness(1.5) blur(1px); }
  100% { opacity: 1; filter: brightness(1); }
}

::view-transition-old(main-screen) {
  animation: crt-out 0.25s ease-in forwards;
}

::view-transition-new(main-screen) {
  animation: crt-in 0.3s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(main-screen),
  ::view-transition-new(main-screen) {
    animation: none;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/
git commit -m "feat: add global styles, CRT effects, typography scale, and view transitions"
```

---

## Task 4: BaseLayout + Cabinet Chrome

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Marquee.astro`
- Create: `src/components/CabinetControls.astro`
- Modify: `src/pages/index.astro` (apply layout to verify it renders)

- [ ] **Step 1: Create Marquee component**

Create `src/components/Marquee.astro`:

```astro
---
interface Props { text: string; }
const { text } = Astro.props;
---
<div class="marquee" aria-hidden="true">
  <span>{text}&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;{text}</span>
</div>

<style>
.marquee {
  background: linear-gradient(90deg, var(--violet), var(--cyan), var(--pink), var(--violet));
  background-size: 300% 100%;
  animation: marquee-flow 4s linear infinite;
  padding: 8px 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: 8px;
  letter-spacing: 2px;
  color: #000;
  font-weight: bold;
  text-align: center;
}

@keyframes marquee-flow {
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .marquee { animation: none; background: var(--violet); color: var(--white); }
}
</style>
```

- [ ] **Step 2: Create CabinetControls component**

Create `src/components/CabinetControls.astro`:

```astro
---
// Decorative only — no interactive behaviour
---
<div class="controls" aria-hidden="true">
  <div class="d-pad">
    <div></div><div class="d-btn">▲</div><div></div>
    <div class="d-btn">◀</div><div class="d-btn center">●</div><div class="d-btn">▶</div>
    <div></div><div class="d-btn">▼</div><div></div>
  </div>
  <div class="label-area">PLAYER 1</div>
  <div class="action-buttons">
    <div class="btn-row">
      <button class="action-btn btn-cyan">A</button>
      <button class="action-btn btn-pink">B</button>
    </div>
    <div class="btn-row">
      <button class="action-btn btn-gold">C</button>
      <button class="action-btn btn-violet">D</button>
    </div>
  </div>
</div>

<style>
.controls {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--cabinet);
}
.d-pad {
  display: grid;
  grid-template-columns: repeat(3, 18px);
  grid-template-rows: repeat(3, 18px);
  gap: 2px;
}
.d-btn {
  background: var(--chrome);
  border: 1px solid var(--border);
  border-radius: 2px;
  display: flex; align-items: center; justify-content: center;
  font-size: 7px; color: var(--dim);
}
.d-btn.center { color: var(--violet); }
.label-area { font-size: 6px; color: var(--dim); letter-spacing: 1px; text-align: center; }
.btn-row { display: flex; gap: 6px; margin-bottom: 6px; }
.action-buttons { display: flex; flex-direction: column; align-items: flex-end; }
.action-btn {
  width: 28px; height: 28px; border-radius: 50%;
  font-size: 7px; font-family: var(--font-pixel);
  display: flex; align-items: center; justify-content: center;
  cursor: default; border: 2px solid rgba(0,0,0,0.3);
  color: #000;
}
.btn-cyan   { background: var(--cyan);   box-shadow: 0 3px 0 #007a80, 0 0 10px var(--cyan); }
.btn-pink   { background: var(--pink);   box-shadow: 0 3px 0 #7a0055, 0 0 10px var(--pink); }
.btn-gold   { background: var(--gold);   box-shadow: 0 3px 0 #806e00, 0 0 10px var(--gold); }
.btn-violet { background: var(--violet); box-shadow: 0 3px 0 #3a0080, 0 0 10px var(--violet); color: #fff; }
</style>
```

- [ ] **Step 3: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import { ViewTransitions } from 'astro:transitions';
import Marquee from '../components/Marquee.astro';
import CabinetControls from '../components/CabinetControls.astro';
import { siteConfig } from '../config/site';
import '../styles/global.css';
import '../styles/crt.css';
import '../styles/typography.css';
import '../styles/transitions.css';

interface Props {
  title: string;
  screenTitle?: string;
}
const { title, screenTitle } = Astro.props;
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | {siteConfig.name}</title>
  <ViewTransitions />
</head>
<body>
  <div class="cabinet">
    <Marquee text={siteConfig.marquee} />

    <div class="bezel">
      {screenTitle && (
        <div class="screen-title text-xxs label glow-violet">{screenTitle}</div>
      )}
      <div class="screen crt screen-glow" transition:name="main-screen" transition:animate="none">
        <div class="screen-inner">
          <slot />
        </div>
      </div>
    </div>

    <CabinetControls />

    <div class="coin-slot text-xxs label">— INSERT COIN TO CONTINUE —</div>
  </div>
</body>
</html>

<style>
.cabinet {
  width: 100%;
  max-width: 600px;
  background: linear-gradient(160deg, var(--chrome) 0%, var(--bezel) 50%, var(--cabinet) 100%);
  border-radius: 18px 18px 8px 8px;
  border: 2px solid var(--border);
  box-shadow:
    0 0 0 1px rgba(123,45,255,0.3),
    0 0 40px rgba(47,255,255,0.1),
    0 0 80px rgba(123,45,255,0.08);
  overflow: hidden;
}
.bezel {
  padding: 14px;
  background: var(--bezel);
  border-bottom: 2px solid var(--border);
}
.screen-title {
  color: var(--violet);
  margin-bottom: 6px;
}
.screen {
  background: #00000f;
  border-radius: 5px;
  border: 2px solid #111130;
  min-height: 360px;
}
.screen-inner {
  padding: 24px 20px;
  position: relative;
  z-index: 2;
}
.coin-slot {
  text-align: center;
  padding: 8px;
  color: var(--dim);
  border-top: 1px solid var(--border);
}
</style>
```

- [ ] **Step 4: Apply BaseLayout to index page and verify**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home">
  <p class="text-sm glow-cyan">Cabinet is working.</p>
</BaseLayout>
```

- [ ] **Step 5: Start dev server and verify cabinet renders**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: Cabinet chrome visible — marquee, bezel, screen with scanlines, controls, coin slot.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ src/components/Marquee.astro src/components/CabinetControls.astro src/pages/index.astro
git commit -m "feat: add BaseLayout with cabinet chrome, marquee, and controls"
```

---

## Task 5: Attract Mode

**Files:**
- Create: `src/components/AttractMode.vue`
- Modify: `src/pages/index.astro`
- Create: `tests/unit/components/AttractMode.test.ts`

- [ ] **Step 1: Write failing tests for AttractMode**

Create `tests/unit/components/AttractMode.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AttractMode from '../../../src/components/AttractMode.vue';
import { siteConfig } from '../../../src/config/site';

describe('AttractMode', () => {
  it('renders all high score entries', () => {
    const wrapper = mount(AttractMode);
    siteConfig.highScores.forEach(entry => {
      expect(wrapper.text()).toContain(entry.label);
    });
  });

  it('emits "start" when clicked', async () => {
    const wrapper = mount(AttractMode);
    await wrapper.trigger('click');
    expect(wrapper.emitted('start')).toBeTruthy();
  });

  it('emits "start" when any key is pressed', async () => {
    const wrapper = mount(AttractMode);
    await wrapper.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('start')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/unit/components/AttractMode.test.ts
```

Expected: FAIL — component not found

- [ ] **Step 3: Create AttractMode component**

Create `src/components/AttractMode.vue`:

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { siteConfig } from '../config/site';

const emit = defineEmits<{ start: [] }>();

function handleStart() {
  emit('start');
}

function handleKeydown() {
  emit('start');
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown, { once: true });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="attract" @click="handleStart" tabindex="0" role="button" aria-label="Press any key to start">
    <div class="title-line1 text-xxl glow-cyan">{{ siteConfig.name.split(' ')[0].toUpperCase() }}</div>
    <div class="title-line2 text-lg glow-violet">{{ siteConfig.name.split(' ')[1].toUpperCase() }}</div>
    <div class="tagline text-xxs label glow-pink">★ {{ siteConfig.tagline.toUpperCase() }} ★</div>

    <div class="high-scores">
      <div class="scores-label text-xxs label">— HIGH SCORES —</div>
      <div
        v-for="entry in siteConfig.highScores"
        :key="entry.rank"
        class="score-row text-xs"
      >
        <span class="rank glow-pink">{{ entry.rank }}</span>
        <span class="score-label">{{ entry.label }}</span>
        <span class="score-val glow-gold">{{ entry.value }}</span>
      </div>
    </div>

    <div class="press-start text-xs blink">▶ PRESS START ◀</div>
  </div>
</template>

<style scoped>
.attract {
  text-align: center;
  padding: 12px 0;
  cursor: pointer;
  outline: none;
}
.title-line1 { margin-bottom: 4px; }
.title-line2 { margin-bottom: 8px; }
.tagline { margin-bottom: 20px; }
.high-scores {
  background: rgba(47, 255, 255, 0.04);
  border: 1px solid rgba(47, 255, 255, 0.15);
  border-radius: 4px;
  padding: 12px;
  margin: 0 auto 20px;
  max-width: 320px;
}
.scores-label { color: var(--cyan); margin-bottom: 10px; display: block; }
.score-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.rank { color: var(--pink); }
.score-label { color: var(--white); opacity: 0.8; }
.score-val { color: var(--gold); }
.press-start { color: var(--white); opacity: 0.8; }
</style>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/unit/components/AttractMode.test.ts
```

Expected: PASS — 3 tests passing

- [ ] **Step 5: Wire AttractMode into index page**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import AttractMode from '../components/AttractMode.vue';
---
<BaseLayout title="Home">
  <AttractMode client:load />
  {/* TODO Task 6: replace with HomeScreen.vue for attract → menu state machine */}
</BaseLayout>
```

Note: `@start` is not wired yet — that happens in Task 6 when `HomeScreen.vue` is created. This file is replaced entirely in Task 6 Step 5.

- [ ] **Step 6: Commit**

```bash
git add src/components/AttractMode.vue src/pages/index.astro tests/unit/components/AttractMode.test.ts
git commit -m "feat: add AttractMode component with high scores and press-start"
```

---

## Task 6: Arcade Menu + Home State Machine

**Files:**
- Create: `src/components/ArcadeMenu.vue`
- Modify: `src/pages/index.astro`
- Create: `tests/unit/components/ArcadeMenu.test.ts`

- [ ] **Step 1: Write failing tests for ArcadeMenu**

Create `tests/unit/components/ArcadeMenu.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ArcadeMenu from '../../../src/components/ArcadeMenu.vue';
import { siteConfig } from '../../../src/config/site';

describe('ArcadeMenu', () => {
  it('renders all nav items', () => {
    const wrapper = mount(ArcadeMenu);
    siteConfig.nav.forEach(item => {
      expect(wrapper.text()).toContain(item.label);
    });
  });

  it('first item is selected by default', () => {
    const wrapper = mount(ArcadeMenu);
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items[0].attributes('aria-selected')).toBe('true');
    expect(items[1].attributes('aria-selected')).toBe('false');
  });

  it('ArrowDown moves selection to next item', async () => {
    const wrapper = mount(ArcadeMenu);
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items[0].attributes('aria-selected')).toBe('false');
    expect(items[1].attributes('aria-selected')).toBe('true');
  });

  it('ArrowUp wraps from first to last item', async () => {
    const wrapper = mount(ArcadeMenu);
    await wrapper.trigger('keydown', { key: 'ArrowUp' });
    const items = wrapper.findAll('[role="menuitem"]');
    const last = items[items.length - 1];
    expect(last.attributes('aria-selected')).toBe('true');
  });

  it('ArrowDown wraps from last to first item', async () => {
    const wrapper = mount(ArcadeMenu);
    const lastIndex = siteConfig.nav.length - 1;
    // Move to last item
    for (let i = 0; i < lastIndex; i++) {
      await wrapper.trigger('keydown', { key: 'ArrowDown' });
    }
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    const items = wrapper.findAll('[role="menuitem"]');
    expect(items[0].attributes('aria-selected')).toBe('true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/unit/components/ArcadeMenu.test.ts
```

Expected: FAIL — component not found

- [ ] **Step 3: Create ArcadeMenu component**

Create `src/components/ArcadeMenu.vue`:

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { siteConfig } from '../config/site';

const selectedIndex = ref(0);

function move(dir: 1 | -1) {
  const len = siteConfig.nav.length;
  selectedIndex.value = (selectedIndex.value + dir + len) % len;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); move(-1); }
  if (e.key === 'Enter') {
    window.location.href = siteConfig.nav[selectedIndex.value].href;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <nav aria-label="Main menu">
    <div class="menu-title text-xxs label glow-violet">— SELECT MODE —</div>
    <ul role="menu" class="menu-list">
      <li
        v-for="(item, i) in siteConfig.nav"
        :key="item.href"
        role="menuitem"
        :aria-selected="i === selectedIndex ? 'true' : 'false'"
        class="menu-item text-xs"
        :class="{ active: i === selectedIndex }"
        @click="() => window.location.href = item.href"
        @mouseenter="selectedIndex = i"
        tabindex="0"
      >
        <span class="cursor" aria-hidden="true">{{ i === selectedIndex ? '▶' : '\u00A0' }}</span>
        <span class="key glow-violet">[{{ item.key }}]</span>
        <span class="item-label">{{ item.label }}</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.menu-title { color: var(--gold); margin-bottom: 14px; display: block; }
.menu-list { list-style: none; }
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  color: var(--dim);
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 3px;
  transition: color 0.1s;
  outline: none;
}
.menu-item.active {
  background: rgba(47, 255, 255, 0.06);
  color: var(--cyan);
  text-shadow: 0 0 8px var(--cyan);
  border: 1px solid rgba(47, 255, 255, 0.15);
}
.menu-item:not(.active) { border: 1px solid transparent; }
.cursor { color: var(--pink); width: 12px; display: inline-block; }
.key { font-size: 7px; }
.item-label { flex: 1; }
</style>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/unit/components/ArcadeMenu.test.ts
```

Expected: PASS — 5 tests passing

- [ ] **Step 5: Wire attract + menu state machine into home page**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HomeScreen from '../components/HomeScreen.vue';
---
<BaseLayout title="Home">
  <HomeScreen client:load />
</BaseLayout>
```

Create `src/components/HomeScreen.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import AttractMode from './AttractMode.vue';
import ArcadeMenu from './ArcadeMenu.vue';

// If navigating back to home, always show menu (not attract)
const showMenu = ref(
  typeof window !== 'undefined' && window.history.length > 1
);
</script>

<template>
  <ArcadeMenu v-if="showMenu" />
  <AttractMode v-else @start="showMenu = true" />
</template>
```

- [ ] **Step 6: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: Attract mode shows, pressing any key or clicking transitions to the menu, arrow keys navigate the menu.

- [ ] **Step 7: Commit**

```bash
git add src/components/ArcadeMenu.vue src/components/HomeScreen.vue src/pages/index.astro tests/unit/components/ArcadeMenu.test.ts
git commit -m "feat: add ArcadeMenu with keyboard nav and ARIA, home state machine"
```

---

## Task 7: Content Pages (About, Work, Leadership, Contact)

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/work.astro`
- Create: `src/pages/leadership.astro`
- Create: `src/pages/contact.astro`

No unit tests — these are static content pages. Verification is visual.

- [ ] **Step 1: Create About page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="About" screenTitle="PLAYER PROFILE">
  <section class="page-section">
    <h1 class="text-md glow-cyan">PLAYER PROFILE</h1>

    <div class="stat-block">
      <div class="stat-row text-xs">
        <span class="stat-key">NAME</span>
        <span class="stat-val">JUSTIN KEEVERS</span>
      </div>
      <div class="stat-row text-xs">
        <span class="stat-key">CLASS</span>
        <span class="stat-val">ENGINEERING LEADER</span>
      </div>
      <div class="stat-row text-xs">
        <span class="stat-key">EXP</span>
        <span class="stat-val glow-gold">10+ YRS</span>
      </div>
    </div>

    <div class="bio text-xs">
      <!-- PLACEHOLDER: Replace with your story -->
      <p>I build teams that ship. Not just code — products people actually use.</p>
      <p>The engineering part comes naturally. The people part took longer to learn.</p>
    </div>

    <div class="values">
      <h2 class="text-xs glow-violet">CORE STATS</h2>
      <!-- PLACEHOLDER: Replace with your values -->
      <div class="value-item text-xxs">★ TEAMS OVER INDIVIDUALS</div>
      <div class="value-item text-xxs">★ SHIP IT, THEN IMPROVE IT</div>
      <div class="value-item text-xxs">★ FEEDBACK IS A GIFT</div>
    </div>
  </section>

  <a href="/" class="back-link text-xxs">← BACK TO MENU</a>
</BaseLayout>

<style>
.page-section { margin-bottom: 20px; }
h1 { margin-bottom: 16px; }
.stat-block {
  background: rgba(47,255,255,0.04);
  border: 1px solid rgba(47,255,255,0.15);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
}
.stat-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
.stat-key { color: var(--dim); }
.stat-val { color: var(--white); }
.bio p { margin-bottom: 12px; color: var(--white); opacity: 0.85; }
.values h2 { margin-bottom: 10px; }
.value-item { color: var(--cyan); margin-bottom: 6px; }
.back-link { color: var(--violet); display: inline-block; margin-top: 16px; }
</style>
```

- [ ] **Step 2: Create Work page**

Create `src/pages/work.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="My Work" screenTitle="GAME HISTORY">
  <h1 class="text-md glow-cyan">GAME HISTORY</h1>
  <p class="text-xxs" style="color:var(--dim);margin-bottom:16px;">MISSIONS COMPLETED</p>

  <div class="timeline">
    <!-- PLACEHOLDER: Replace each mission with real experience -->
    <div class="mission">
      <div class="mission-header text-xs">
        <span class="company glow-pink">COMPANY NAME</span>
        <span class="dates text-xxs">2022 – NOW</span>
      </div>
      <div class="role text-xxs glow-violet">ENGINEERING MANAGER</div>
      <p class="impact text-xxs"><!-- PLACEHOLDER: 1–3 lines of impact --></p>
    </div>

    <div class="mission">
      <div class="mission-header text-xs">
        <span class="company glow-pink">COMPANY NAME</span>
        <span class="dates text-xxs">2019 – 2022</span>
      </div>
      <div class="role text-xxs glow-violet">SENIOR SOFTWARE ENGINEER</div>
      <p class="impact text-xxs"><!-- PLACEHOLDER: 1–3 lines of impact --></p>
    </div>
  </div>

  <a href="/" class="back-link text-xxs">← BACK TO MENU</a>
</BaseLayout>

<style>
h1 { margin-bottom: 4px; }
.timeline { margin-top: 8px; }
.mission {
  border: 1px solid rgba(47,255,255,0.15);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 10px;
  background: rgba(47,255,255,0.02);
}
.mission-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.company { color: var(--pink); }
.dates { color: var(--dim); }
.role { margin-bottom: 6px; }
.impact { color: var(--white); opacity: 0.75; line-height: 2; }
.back-link { color: var(--violet); display: inline-block; margin-top: 16px; }
</style>
```

- [ ] **Step 3: Create Leadership page**

Create `src/pages/leadership.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="How I Lead" screenTitle="HOW I PLAY">
  <h1 class="text-md glow-cyan">HOW I PLAY</h1>

  <div class="moves">
    <!-- PLACEHOLDER: Replace with your real leadership principles -->
    <div class="move">
      <h2 class="move-name text-xs glow-violet">MOVE 01: TRUST FIRST</h2>
      <p class="move-desc text-xxs"><!-- PLACEHOLDER: Short description of this principle --></p>
    </div>

    <div class="move">
      <h2 class="move-name text-xs glow-violet">MOVE 02: CLEAR THE PATH</h2>
      <p class="move-desc text-xxs"><!-- PLACEHOLDER: Short description --></p>
    </div>

    <div class="move">
      <h2 class="move-name text-xs glow-violet">MOVE 03: SHIP IT</h2>
      <p class="move-desc text-xxs"><!-- PLACEHOLDER: Short description --></p>
    </div>
  </div>

  <a href="/" class="back-link text-xxs">← BACK TO MENU</a>
</BaseLayout>

<style>
h1 { margin-bottom: 16px; }
.move {
  border-left: 2px solid var(--violet);
  padding: 8px 12px;
  margin-bottom: 12px;
}
.move-name { margin-bottom: 6px; }
.move-desc { color: var(--white); opacity: 0.8; }
.back-link { color: var(--violet); display: inline-block; margin-top: 16px; }
</style>
```

- [ ] **Step 4: Create Contact page**

Create `src/pages/contact.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { siteConfig } from '../config/site';
---
<BaseLayout title="Contact" screenTitle="INSERT COIN">
  <h1 class="text-md glow-cyan">INSERT COIN</h1>
  <p class="text-xxs" style="color:var(--dim);margin-bottom:20px;">READY TO CONNECT?</p>

  <div class="links">
    <a href={`mailto:${siteConfig.social.email}`} class="link-item text-xs">
      <span class="link-icon glow-pink">✉</span>
      <span class="link-label">EMAIL</span>
    </a>
    <a href={siteConfig.social.linkedin} target="_blank" rel="noopener" class="link-item text-xs">
      <span class="link-icon glow-cyan">in</span>
      <span class="link-label">LINKEDIN</span>
    </a>
    <a href={siteConfig.social.github} target="_blank" rel="noopener" class="link-item text-xs">
      <span class="link-icon glow-violet">gh</span>
      <span class="link-label">GITHUB</span>
    </a>
  </div>

  <a href="/" class="back-link text-xxs">← BACK TO MENU</a>
</BaseLayout>

<style>
h1 { margin-bottom: 4px; }
.links { margin-top: 8px; }
.link-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border: 1px solid rgba(47,255,255,0.15);
  border-radius: 4px;
  margin-bottom: 8px;
  color: var(--white);
  transition: background 0.15s;
}
.link-item:hover { background: rgba(47,255,255,0.06); text-decoration: none; }
.link-icon { width: 20px; text-align: center; }
.back-link { color: var(--violet); display: inline-block; margin-top: 16px; }
</style>
```

- [ ] **Step 5: Verify all pages in browser**

```bash
npm run dev
```

Visit `/about`, `/work`, `/leadership`, `/contact`. Expected: Each page renders inside the cabinet chrome with the correct screen title. Back links work.

- [ ] **Step 6: Commit**

```bash
git add src/pages/about.astro src/pages/work.astro src/pages/leadership.astro src/pages/contact.astro
git commit -m "feat: add placeholder content pages (about, work, leadership, contact)"
```

---

## Task 8: Blog — Level Select + Post Pages

**Astro 6 note:** The content collection uses the `glob()` loader (migrated in Task 4). With the glob loader, entries no longer have a `slug` property — they have an `id` property (the filename without extension, e.g. `01-placeholder-post`). The `getStaticPaths` and `LevelSelect` implementations in this task must use `post.id` instead of `post.slug` everywhere.

**Files:**
- Create: `src/components/LevelSelect.vue`
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[slug].astro`

- [ ] **Step 1: Write failing tests for LevelSelect**

Create `tests/unit/components/LevelSelect.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LevelSelect from '../../../src/components/LevelSelect.vue';

const stages = [
  { slug: 'post-one', title: 'Post One', stage: 1, published: true, xp: 200, category: 'leadership', date: '2026-01-01' },
  { slug: 'post-two', title: 'Post Two', stage: 2, published: false, xp: 150, category: 'engineering', date: '2026-02-01' },
];

describe('LevelSelect', () => {
  it('renders all stages', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    expect(wrapper.findAll('[data-stage]')).toHaveLength(2);
  });

  it('shows title for published stages', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    expect(wrapper.text()).toContain('POST ONE');
  });

  it('shows ??? for unpublished stages', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    expect(wrapper.text()).toContain('???');
  });

  it('shows XP value for published stages', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    expect(wrapper.text()).toContain('200');
  });

  it('published stages have a link, locked stages do not', () => {
    const wrapper = mount(LevelSelect, { props: { stages } });
    const links = wrapper.findAll('a[href]');
    expect(links).toHaveLength(1);
    expect(links[0].attributes('href')).toContain('post-one');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/unit/components/LevelSelect.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create LevelSelect component**

Create `src/components/LevelSelect.vue`:

```vue
<script setup lang="ts">
interface Stage {
  slug: string;
  title: string;
  stage: number;
  published: boolean;
  xp: number;
  category: string;
  date: string;
}

defineProps<{ stages: Stage[] }>();
</script>

<template>
  <div class="level-select">
    <h1 class="text-md glow-cyan">LEVEL SELECT</h1>

    <div
      v-for="s in stages"
      :key="s.slug"
      :data-stage="s.stage"
      class="stage-item"
      :class="{ locked: !s.published }"
    >
      <template v-if="s.published">
        <a :href="`/writing/${s.slug}`" class="stage-link">
          <span class="stage-xp text-xxs glow-gold">+{{ s.xp }} XP</span>
          <div class="stage-title text-xs">{{ s.title.toUpperCase() }}</div>
          <div class="stage-meta text-xxs">
            STAGE {{ String(s.stage).padStart(2, '0') }} · {{ s.date }} · {{ s.category.toUpperCase() }}
          </div>
        </a>
      </template>
      <template v-else>
        <span class="stage-xp text-xxs locked-xp">LOCKED</span>
        <div class="stage-title text-xs locked-title">???</div>
        <div class="stage-meta text-xxs">STAGE {{ String(s.stage).padStart(2, '0') }} · ???</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
h1 { margin-bottom: 16px; }
.stage-item {
  border: 1px solid rgba(47,255,255,0.15);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(47,255,255,0.02);
  position: relative;
}
.stage-item.locked { opacity: 0.35; }
.stage-link { display: block; text-decoration: none; color: inherit; }
.stage-link:hover .stage-title { color: var(--cyan); text-shadow: 0 0 8px var(--cyan); }
.stage-xp { position: absolute; top: 12px; right: 12px; color: var(--gold); }
.locked-xp { color: var(--dim); }
.stage-title { color: var(--white); margin-bottom: 4px; padding-right: 60px; }
.locked-title { color: var(--dim); }
.stage-meta { color: var(--dim); }
</style>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/unit/components/LevelSelect.test.ts
```

Expected: PASS — 5 tests passing

- [ ] **Step 5: Create Writing index page**

Create `src/pages/writing/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import LevelSelect from '../../components/LevelSelect.vue';

const allPosts = await getCollection('blog');
const stages = allPosts
  .sort((a, b) => a.data.stage - b.data.stage)
  .map(post => ({
    slug: post.slug,
    title: post.data.title,
    stage: post.data.stage,
    published: post.data.published,
    xp: post.data.xp,
    category: post.data.category,
    date: post.data.date.toISOString().slice(0, 10),
  }));
---
<BaseLayout title="Writing" screenTitle="LEVEL SELECT">
  <LevelSelect client:load stages={stages} />
  <a href="/" class="back-link text-xxs">← BACK TO MENU</a>
</BaseLayout>

<style>
.back-link { color: var(--violet); display: inline-block; margin-top: 16px; }
</style>
```

- [ ] **Step 6: Create blog post page**

Create `src/pages/writing/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => data.published);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<BaseLayout title={post.data.title} screenTitle={`STAGE ${String(post.data.stage).padStart(2,'0')}`}>
  <div class="post-header">
    <h1 class="text-md glow-cyan">{post.data.title.toUpperCase()}</h1>
    <div class="post-meta text-xxs">
      <span class="glow-violet">{post.data.category.toUpperCase()}</span>
      <span style="color:var(--dim)"> · {post.data.date.toISOString().slice(0,10)}</span>
      <span class="glow-gold"> · +{post.data.xp} XP</span>
    </div>
  </div>

  <div class="post-body text-xs">
    <Content />
  </div>

  <a href="/writing" class="back-link text-xxs">← BACK TO LEVEL SELECT</a>
</BaseLayout>

<style>
.post-header { margin-bottom: 16px; }
h1 { margin-bottom: 6px; }
.post-meta { margin-bottom: 0; }
.post-body { line-height: 2; color: var(--white); opacity: 0.9; }
.post-body :global(h2) { color: var(--cyan); font-size: 9px; margin: 16px 0 8px; }
.post-body :global(h3) { color: var(--violet); font-size: 8px; margin: 12px 0 6px; }
.post-body :global(p)  { margin-bottom: 12px; }
.post-body :global(code) {
  background: rgba(47,255,255,0.06);
  border: 1px solid rgba(47,255,255,0.15);
  padding: 2px 6px;
  border-radius: 2px;
  font-family: var(--font-pixel);
  font-size: 7px;
}
.post-body :global(pre) {
  background: rgba(0,0,0,0.4);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 12px;
  overflow-x: auto;
  margin-bottom: 12px;
}
.post-body :global(img) {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 12px;
}
.back-link { color: var(--violet); display: inline-block; margin-top: 20px; }
</style>
```

- [ ] **Step 7: Verify in browser**

```bash
npm run dev
```

Visit `/writing`. Expected: Level Select screen with 2 locked placeholder stages. No published post links.

- [ ] **Step 8: Commit**

```bash
git add src/components/LevelSelect.vue src/pages/writing/ tests/unit/components/LevelSelect.test.ts
git commit -m "feat: add blog with Level Select and post pages"
```

---

## Task 9: Easter Egg — Konami Code + Breakout Clone

**Files:**
- Create: `src/components/KonamiListener.vue`
- Create: `src/components/BreakoutGame.vue`
- Modify: `src/layouts/BaseLayout.astro`
- Create: `tests/unit/components/KonamiListener.test.ts`
- Create: `tests/unit/components/BreakoutGame.test.ts`

- [ ] **Step 1: Write failing tests for Konami detection**

Create `tests/unit/components/KonamiListener.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { isKonamiComplete, KONAMI_SEQUENCE } from '../../../src/components/KonamiListener.vue';

describe('Konami sequence detection', () => {
  it('returns false for incomplete sequence', () => {
    const partial = KONAMI_SEQUENCE.slice(0, 5);
    expect(isKonamiComplete(partial)).toBe(false);
  });

  it('returns true for exact sequence', () => {
    expect(isKonamiComplete([...KONAMI_SEQUENCE])).toBe(true);
  });

  it('returns false for wrong sequence', () => {
    const wrong = [...KONAMI_SEQUENCE];
    wrong[0] = 'ArrowDown';
    expect(isKonamiComplete(wrong)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/unit/components/KonamiListener.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create KonamiListener component**

Create `src/components/KonamiListener.vue`:

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';

export const KONAMI_SEQUENCE = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];

export function isKonamiComplete(buffer: string[]): boolean {
  if (buffer.length !== KONAMI_SEQUENCE.length) return false;
  return buffer.every((key, i) => key === KONAMI_SEQUENCE[i]);
}

const BreakoutGame = defineAsyncComponent(() => import('./BreakoutGame.vue'));

const buffer = ref<string[]>([]);
const active = ref(false);

function handleKeydown(e: KeyboardEvent) {
  if (active.value) return;
  buffer.value = [...buffer.value, e.key].slice(-KONAMI_SEQUENCE.length);
  if (isKonamiComplete(buffer.value)) {
    active.value = true;
    buffer.value = [];
  }
}

function dismiss() {
  active.value = false;
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <slot />
  <Teleport to="body">
    <BreakoutGame v-if="active" @dismiss="dismiss" />
  </Teleport>
</template>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/unit/components/KonamiListener.test.ts
```

Expected: PASS — 3 tests passing

- [ ] **Step 5: Write failing tests for Breakout game logic**

Create `tests/unit/components/BreakoutGame.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  moveBall,
  checkPaddleCollision,
  checkBrickCollisions,
  type Ball,
  type Paddle,
  type Brick,
} from '../../../src/components/BreakoutGame.vue';

const makeBall = (overrides: Partial<Ball> = {}): Ball => ({
  x: 200, y: 200, vx: 3, vy: -3, radius: 6, ...overrides,
});
const makePaddle = (overrides: Partial<Paddle> = {}): Paddle => ({
  x: 150, y: 380, width: 80, height: 10, ...overrides,
});
const makeBrick = (overrides: Partial<Brick> = {}): Brick => ({
  x: 0, y: 0, width: 60, height: 20, label: 'React', alive: true, ...overrides,
});

describe('moveBall', () => {
  it('advances ball by velocity', () => {
    const ball = makeBall({ x: 100, y: 100, vx: 3, vy: -3 });
    const next = moveBall(ball, 400, 400);
    expect(next.x).toBe(103);
    expect(next.y).toBe(97);
  });

  it('bounces off left wall', () => {
    const ball = makeBall({ x: 4, vx: -3 });
    const next = moveBall(ball, 400, 400);
    expect(next.vx).toBeGreaterThan(0);
  });

  it('bounces off right wall', () => {
    const ball = makeBall({ x: 396, vx: 3 });
    const next = moveBall(ball, 400, 400);
    expect(next.vx).toBeLessThan(0);
  });

  it('bounces off top wall', () => {
    const ball = makeBall({ y: 4, vy: -3 });
    const next = moveBall(ball, 400, 400);
    expect(next.vy).toBeGreaterThan(0);
  });
});

describe('checkPaddleCollision', () => {
  it('reverses vy when ball hits paddle', () => {
    const ball = makeBall({ x: 190, y: 374, vy: 3 });
    const paddle = makePaddle({ x: 150, y: 380 });
    const next = checkPaddleCollision(ball, paddle);
    expect(next.vy).toBeLessThan(0);
  });

  it('does not reverse vy when ball is above paddle', () => {
    const ball = makeBall({ x: 190, y: 200, vy: 3 });
    const paddle = makePaddle({ x: 150, y: 380 });
    const next = checkPaddleCollision(ball, paddle);
    expect(next.vy).toBeGreaterThan(0);
  });
});

describe('checkBrickCollisions', () => {
  it('kills a brick when ball hits it', () => {
    const ball = makeBall({ x: 30, y: 14, vy: 3 });
    const bricks = [makeBrick({ x: 0, y: 0, width: 60, height: 20 })];
    const { bricks: updated } = checkBrickCollisions(ball, bricks);
    expect(updated[0].alive).toBe(false);
  });

  it('reverses ball vy on brick hit', () => {
    const ball = makeBall({ x: 30, y: 14, vy: 3 });
    const bricks = [makeBrick({ x: 0, y: 0, width: 60, height: 20 })];
    const { ball: updated } = checkBrickCollisions(ball, bricks);
    expect(updated.vy).toBeLessThan(0);
  });

  it('does not affect dead bricks', () => {
    const ball = makeBall({ x: 30, y: 14, vy: 3 });
    const bricks = [makeBrick({ x: 0, y: 0, alive: false })];
    const { bricks: updated } = checkBrickCollisions(ball, bricks);
    expect(updated[0].alive).toBe(false);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

```bash
npm test -- tests/unit/components/BreakoutGame.test.ts
```

Expected: FAIL

- [ ] **Step 7: Create BreakoutGame component**

Create `src/components/BreakoutGame.vue`:

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { siteConfig } from '../config/site';

// ── Types ────────────────────────────────────────────────────────
export interface Ball   { x: number; y: number; vx: number; vy: number; radius: number; }
export interface Paddle { x: number; y: number; width: number; height: number; }
export interface Brick  { x: number; y: number; width: number; height: number; label: string; alive: boolean; }

// ── Pure game logic (exported for testing) ───────────────────────
export function moveBall(ball: Ball, W: number, H: number): Ball {
  let { x, y, vx, vy } = ball;
  x += vx; y += vy;
  if (x - ball.radius <= 0)  { x = ball.radius;      vx = Math.abs(vx); }
  if (x + ball.radius >= W)  { x = W - ball.radius;  vx = -Math.abs(vx); }
  if (y - ball.radius <= 0)  { y = ball.radius;       vy = Math.abs(vy); }
  return { ...ball, x, y, vx, vy };
}

export function checkPaddleCollision(ball: Ball, paddle: Paddle): Ball {
  const inX = ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width;
  const inY = ball.y + ball.radius >= paddle.y && ball.y + ball.radius <= paddle.y + paddle.height + ball.radius;
  if (inX && inY && ball.vy > 0) {
    return { ...ball, vy: -Math.abs(ball.vy) };
  }
  return ball;
}

export function checkBrickCollisions(ball: Ball, bricks: Brick[]): { ball: Ball; bricks: Brick[] } {
  let newBall = { ...ball };
  const newBricks = bricks.map(brick => {
    if (!brick.alive) return brick;
    const hit =
      ball.x + ball.radius > brick.x &&
      ball.x - ball.radius < brick.x + brick.width &&
      ball.y + ball.radius > brick.y &&
      ball.y - ball.radius < brick.y + brick.height;
    if (hit) {
      newBall = { ...newBall, vy: -newBall.vy };
      return { ...brick, alive: false };
    }
    return brick;
  });
  return { ball: newBall, bricks: newBricks };
}

// ── Component ────────────────────────────────────────────────────
const emit = defineEmits<{ dismiss: [] }>();

const SKILLS = ['React', 'Vue', 'TypeScript', 'Go', 'AWS', 'K8s', 'Python', 'SQL', 'Rust', 'Docker', 'Node', 'Git'];
const W = 400, H = 400;
const PADDLE_W = 80, PADDLE_H = 10;
const BALL_R = 6;
const BRICK_COLS = 4, BRICK_ROWS = 3, BRICK_W = 80, BRICK_H = 24, BRICK_PAD = 10;

const canvasRef = ref<HTMLCanvasElement | null>(null);
const won = ref(false);
let animFrame = 0;

let ball:   Ball   = { x: W/2, y: H/2, vx: 3, vy: -3, radius: BALL_R };
let paddle: Paddle = { x: (W - PADDLE_W)/2, y: H - 30, width: PADDLE_W, height: PADDLE_H };
let bricks: Brick[] = [];

function initBricks() {
  bricks = [];
  let idx = 0;
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: BRICK_PAD + c * (BRICK_W + BRICK_PAD),
        y: 40 + r * (BRICK_H + BRICK_PAD),
        width: BRICK_W, height: BRICK_H,
        label: SKILLS[idx++ % SKILLS.length],
        alive: true,
      });
    }
  }
}

function draw(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#00000f';
  ctx.fillRect(0, 0, W, H);

  // Bricks
  bricks.forEach(b => {
    if (!b.alive) return;
    ctx.fillStyle = '#7b2fff33';
    ctx.strokeStyle = '#7b2fff';
    ctx.lineWidth = 1;
    ctx.fillRect(b.x, b.y, b.width, b.height);
    ctx.strokeRect(b.x, b.y, b.width, b.height);
    ctx.fillStyle = '#2fffff';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(b.label, b.x + b.width/2, b.y + b.height/2 + 3);
  });

  // Paddle
  ctx.fillStyle = '#ff2faa';
  ctx.shadowColor = '#ff2faa';
  ctx.shadowBlur = 10;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.shadowBlur = 0;

  // Ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#2fffff';
  ctx.shadowColor = '#2fffff';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;

  // ESC hint
  ctx.fillStyle = '#3a3a6a';
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('[ESC] EXIT', 6, H - 6);
}

function loop() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ball = moveBall(ball, W, H);
  ball = checkPaddleCollision(ball, paddle);
  const result = checkBrickCollisions(ball, bricks);
  ball = result.ball;
  bricks = result.bricks;

  // Ball fell below screen
  if (ball.y - ball.radius > H) {
    ball = { x: W/2, y: H/2, vx: 3, vy: -3, radius: BALL_R };
  }

  // All bricks cleared
  if (bricks.every(b => !b.alive)) {
    won.value = true;
    return;
  }

  draw(ctx);
  animFrame = requestAnimationFrame(loop);
}

function handleMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  paddle.x = Math.max(0, Math.min(W - paddle.width, x - paddle.width / 2));
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('dismiss');
  if (e.key === 'ArrowLeft')  paddle.x = Math.max(0, paddle.x - 15);
  if (e.key === 'ArrowRight') paddle.x = Math.min(W - paddle.width, paddle.x + 15);
}

onMounted(() => {
  initBricks();
  window.addEventListener('keydown', handleKeydown);
  animFrame = requestAnimationFrame(loop);
});

onUnmounted(() => {
  cancelAnimationFrame(animFrame);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="breakout-overlay" @click.self="$emit('dismiss')">
    <div class="breakout-container">
      <div class="breakout-header text-xxs glow-pink">★ BONUS STAGE ★</div>
      <div v-if="won" class="win-screen text-xs">
        <p class="glow-gold">YOU WIN!</p>
        <p style="color:var(--dim);margin-top:8px;">You cleared the stack.</p>
        <p style="color:var(--dim);">Now go ship something.</p>
        <button @click="$emit('dismiss')" class="win-btn text-xxs">← BACK</button>
      </div>
      <canvas
        v-else
        ref="canvasRef"
        :width="W"
        :height="H"
        @mousemove="handleMouseMove"
      />
    </div>
  </div>
</template>

<style scoped>
.breakout-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.breakout-container {
  border: 2px solid var(--violet);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(123,45,255,0.4);
}
.breakout-header {
  background: var(--violet);
  color: #000;
  text-align: center;
  padding: 6px;
  letter-spacing: 2px;
}
canvas { display: block; cursor: none; }
.win-screen {
  background: #00000f;
  width: 400px; height: 400px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 4px;
}
.win-btn {
  margin-top: 16px;
  background: none;
  border: 1px solid var(--violet);
  color: var(--violet);
  font-family: var(--font-pixel);
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 3px;
}
.win-btn:hover { background: rgba(123,45,255,0.1); }
</style>
```

- [ ] **Step 8: Run tests to verify they pass**

```bash
npm test -- tests/unit/components/BreakoutGame.test.ts
```

Expected: PASS — 8 tests passing

- [ ] **Step 9: Wire KonamiListener into BaseLayout**

In `src/layouts/BaseLayout.astro`, import and wrap the body content:

```astro
---
// Add to existing imports:
import KonamiListener from '../components/KonamiListener.vue';
---
```

Wrap `<div class="cabinet">` inside `<KonamiListener client:load>`:

```astro
<body>
  <KonamiListener client:load>
    <div class="cabinet">
      <!-- existing cabinet content -->
    </div>
  </KonamiListener>
</body>
```

- [ ] **Step 10: Verify easter egg in browser**

```bash
npm run dev
```

Open `http://localhost:4321`. Type the Konami Code: `↑ ↑ ↓ ↓ ← → ← → b a`. Expected: Breakout game appears over the cabinet. Move paddle with mouse or arrow keys. ESC dismisses.

- [ ] **Step 11: Commit**

```bash
git add src/components/KonamiListener.vue src/components/BreakoutGame.vue src/layouts/BaseLayout.astro tests/unit/components/KonamiListener.test.ts tests/unit/components/BreakoutGame.test.ts
git commit -m "feat: add Konami Code easter egg with Breakout clone"
```

---

## Task 10: Build, Final Checks, and Deploy

**Files:**
- No new files

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: No errors. Output in `dist/`.

- [ ] **Step 3: Preview production build locally**

```bash
npm run preview
```

Open `http://localhost:4321`. Verify: all pages load, transitions work, blog level select shows, easter egg fires.

- [ ] **Step 4: Add `.gitignore` entries**

Ensure `dist/` and `.superpowers/` are in `.gitignore`. Add if missing:

```
dist/
.superpowers/
```

- [ ] **Step 5: Push to GitHub**

```bash
git add .
git commit -m "feat: production build verified"
git push
```

- [ ] **Step 6: Deploy to Vercel**

```bash
npx vercel
```

Follow prompts: link to the GitHub repo, accept default settings (Astro is auto-detected). Expected: Deploy URL printed to terminal.

Note: The site uses `output: 'static'` in `astro.config.mjs` — no Vercel adapter is needed. Vercel auto-detects Astro static output and serves the `dist/` folder directly.

- [ ] **Step 7: Verify live deployment**

Open the Vercel URL. Verify: all pages render correctly, no 404s.

- [ ] **Step 8: Final commit**

```bash
git add .
git commit -m "chore: add Vercel config and deployment"
git push
```

---

## Summary

| Task | Deliverable |
|---|---|
| 1 | Astro + Vue project scaffolded, on GitHub |
| 2 | Site config, blog schema, placeholder posts |
| 3 | Global styles, CRT effects, typography, transitions |
| 4 | BaseLayout with full cabinet chrome |
| 5 | Attract mode with high scores |
| 6 | Arcade menu with keyboard nav and ARIA |
| 7 | About, Work, Leadership, Contact pages |
| 8 | Blog — Level Select and post pages |
| 9 | Konami Code → Breakout easter egg |
| 10 | Build, test, deploy to Vercel |
