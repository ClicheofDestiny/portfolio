# Cabinet Controls — Interactive Buttons

**Date:** 2026-03-31
**Status:** Approved

## Goal

Convert the decorative arcade cabinet controls (d-pad + A/B/C/D buttons) into real, clickable buttons. Clicking the directional buttons and A/B feeds into the same Konami code buffer as keyboard input, enabling the easter egg game to be triggered entirely on-screen.

## Architecture

### Input routing

Two input sources feed a single Konami buffer in `KonamiListener.vue`:

1. **Keyboard** — existing `window keydown` listener (unchanged)
2. **Button clicks** — `CabinetControls.vue` dispatches `new CustomEvent('cabinet-input', { detail: { key: '...' } })` on `window`; `KonamiListener` adds a second listener for this event

Both sources call the same `pushKey(key)` function in `KonamiListener`.

### Components changed

| File | Change |
|------|--------|
| `src/components/CabinetControls.astro` | Deleted — replaced by Vue component |
| `src/components/CabinetControls.vue` | New interactive Vue island |
| `src/layouts/BaseLayout.astro` | Import `CabinetControls.vue`, add `client:load` |
| `src/components/KonamiListener.vue` | Listen for `cabinet-input` event in addition to `keydown` |

## Button Mappings

| Button | `CustomEvent` key | Konami role |
|--------|-------------------|-------------|
| ▲ | `ArrowUp` | positions 1, 2 |
| ▼ | `ArrowDown` | positions 3, 4 |
| ◀ | `ArrowLeft` | positions 5, 7 |
| ▶ | `ArrowRight` | positions 6, 8 |
| A | `a` | position 10 |
| B | `b` | position 9 |
| C | — | visual only |
| D | — | visual only |
| ● (center) | — | visual only |

## Press Style (Option C — press-down + glow)

Applied via CSS `:active` pseudo-class:

- **Action buttons (A/B/C/D):** `translateY(2px)`, box-shadow depth collapses `0 3px → 0 1px`, glow radius expands, `filter: brightness(1.4)`. 60ms transition.
- **D-pad buttons:** `scale(0.9)`, background lightens, cyan glow appears.
- **Hover:** subtle background lighten on d-pad buttons; no hover state on action buttons (matches physical arcade feel).

## Accessibility

- `<button>` elements replace `<div>` elements throughout
- `aria-label` on each directional button (`"Up"`, `"Down"`, `"Left"`, `"Right"`)
- `aria-label` on action buttons (`"A"`, `"B"`, `"C"`, `"D"`)
- `aria-hidden="true"` retained on the wrapping `.controls` div is removed — controls are now interactive
- `tabindex` not needed; native `<button>` is focusable by default
