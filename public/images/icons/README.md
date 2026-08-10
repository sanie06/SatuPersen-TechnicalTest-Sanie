# Step & benefit icons

Drop custom icons for the landing page sections here. They are served straight
from `public/`, so a file at `public/images/icons/foo.png` is referenced in code
as `/images/icons/foo.png` — no import, no build step.

## Expected files

| File | Used by |
|---|---|
| `jawab-dengan-jujur.svg` | "Cara Memaksimalkan Hasil Psikotes", card 01 |
| `tempat-tenang.svg` | "Cara Memaksimalkan Hasil Psikotes", card 02 |
| `refleksi-hasil.svg` | "Cara Memaksimalkan Hasil Psikotes", card 03 |
| `diskusikan-hasil.svg` | "Cara Memaksimalkan Hasil Psikotes", card 04 |

Any card without a file here keeps its Heroicon, so these can be added one at a
time without the page breaking in between.

## Specs

- **Format** — SVG preferred; PNG with a transparent background also works. To
  switch format, change the `image` path in
  `app/composables/useLandingContent.ts`; nothing else cares.
- **Size** — SVG scales, so only the aspect ratio matters; export on a square
  canvas, ideally `viewBox="0 0 24 24"`. For PNG use 96x96 px: it renders at
  24x24, so that covers 3x displays. Anything under 72x72 will look soft.
- **Colour** — baked into the file. These render as `<img>`, so CSS cannot tint
  them the way it tints the Heroicons they replace. That also means an animated
  SVG keeps animating: the `prefers-reduced-motion` rule in `main.css` does not
  reach inside a document loaded through `<img>`.
- **Padding** — leave little to none inside the canvas; the icon is already
  small on screen.
