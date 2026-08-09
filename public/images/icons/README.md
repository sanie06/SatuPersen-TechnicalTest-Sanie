# Step & benefit icons

Drop custom icons for the landing page sections here. They are served straight
from `public/`, so a file at `public/images/icons/foo.png` is referenced in code
as `/images/icons/foo.png` — no import, no build step.

## Expected files

| File | Used by |
|---|---|
| `jawab-dengan-jujur.png` | "Cara Memaksimalkan Hasil Psikotes", card 01 |

Any card without a file here keeps its Heroicon, so these can be added one at a
time without the page breaking in between.

## Specs

- **Format** — PNG with a transparent background, or SVG. To switch format,
  change the `image` path in `app/pages/index.vue`; nothing else cares.
- **Size** — 96x96 px. Rendered at 24x24, so this covers 3x displays with room
  to spare. Anything under 72x72 will look soft.
- **Colour** — baked into the file. These render as `<img>`, so CSS cannot tint
  them the way it tints the Heroicons they replace.
- **Padding** — leave little to none inside the canvas; the icon is already
  small on screen.
