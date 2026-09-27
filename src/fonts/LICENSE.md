# Bundled font files

These `.woff2` files are redistributed from Google Fonts. Every family here is
licensed under the **SIL Open Font License, Version 1.1**, which expressly
permits redistribution — including bundled inside another work, as they are
here — provided the files are not sold on their own and the licence travels
with them. That is what this file is for.

| File                    | Family    | Weights covered    | Upstream                                    |
| ----------------------- | --------- | ------------------ | ------------------------------------------- |
| `open-sans-latin.woff2` | Open Sans | 400–800 (variable) | https://fonts.google.com/specimen/Open+Sans |
| `lato-latin-400.woff2`  | Lato      | 400                | https://fonts.google.com/specimen/Lato      |
| `lato-latin-700.woff2`  | Lato      | 700                | https://fonts.google.com/specimen/Lato      |
| `faustina-latin.woff2`  | Faustina  | 400–700 (variable) | https://fonts.google.com/specimen/Faustina  |
| `fauna-one-latin.woff2` | Fauna One | 400                | https://fonts.google.com/specimen/Fauna+One |

All files are the **`latin` subset only**, matching the `subsets: ['latin']`
the previous `next/font/google` declarations carried — so the character
coverage is unchanged from what the site shipped before.

Full licence text: <https://openfontlicense.org/open-font-license-official-text/>

## Why these files are committed

`next/font/google` fetches each family's CSS from `fonts.googleapis.com` **at
build time**, and Turbopack fails the build when that CSS comes back with more
than one `src` per face — a shape Google chooses from the request's
User-Agent, which is not ours to pin. It took down a production deploy and a
PR's CI within one hour on 2026-09-27. See issue #43 and the header comment in
`src/lib/fonts.ts`.

Nothing about this changes what a visitor downloads: `next/font/google`
already self-hosted these at runtime, so no page ever contacted Google.

Refresh the files with `pnpm run fonts` (`scripts/fetch-fonts.mjs`).
