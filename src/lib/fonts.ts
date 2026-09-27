import localFont from 'next/font/local'

/**
 * The site's four typefaces, served from files committed to src/fonts/.
 *
 * WHY NOT `next/font/google`
 * --------------------------
 * `next/font/google` fetches each family's CSS from fonts.googleapis.com **at
 * build time**, and Turbopack rejects the result outright when the CSS comes
 * back with more than one `src` per face:
 *
 *     Error: Turbopack build failed with 20 errors:
 *     Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
 *     next/font/google queries have exactly one entry
 *
 * Google picks that shape from the request's User-Agent and the choice is not
 * ours to pin. On 2026-09-27 it fired twice within an hour -- on Montserrat,
 * then on Raleway -- and one of the two killed a **production deploy** (run
 * 36345293189) on a commit that had built clean twice minutes earlier. The
 * other failed CI on a PR whose diff touched one workflow file and two tests.
 * Issue #43 has the full measurement.
 *
 * Committing the files removes the build-time network entirely. This is not a
 * retry or a mitigation: the failure mode cannot occur.
 *
 * NOTHING CHANGES FOR A VISITOR. `next/font/google` already self-hosted these
 * at runtime -- it bundled them into the build output and served them from
 * this origin -- so no page ever contacted Google, before or after. Only the
 * *fetch* moved, from build time to a committed file. The bytes are the same
 * woff2 files Google serves, `latin` subset, matching the `subsets: ['latin']`
 * every declaration already carried.
 *
 * Refresh them with `pnpm run fonts`.
 *
 * FOUR FAMILIES, NOT EIGHT
 * ------------------------
 * This file used to declare Raleway, Cantata One, Montserrat and Cinzel as
 * well. Each was reachable only through an id selector in globals.css --
 * `#raleway-font`, `#cantata-font`, `#montserrat-font`, `#cinzel` -- and a
 * search of the built export found **zero** elements carrying any of those
 * ids. They were template scaffolding the content lift orphaned, and every
 * one was a build-time fetch that could fail. Raleway is the family that took
 * CI down on #42.
 *
 * Their rules are gone from globals.css too. If a future page needs one back,
 * add it to scripts/fetch-fonts.mjs and re-run it -- do not reach for
 * `next/font/google`, which is the dependency this removed.
 *
 * VARIABLE FONTS
 * --------------
 * Open Sans and Faustina are variable: ONE file covers every weight, declared
 * as a range. Lato is static, so it needs a file per weight. The set that
 * needs five files was serving eight families before.
 */

/** Body copy hook (`.aria-font`, `#header`, `#abeezee`). */
export const openSans = localFont({
  src: [{ path: '../fonts/open-sans-latin.woff2', weight: '400 800', style: 'normal' }],
  display: 'swap',
  variable: '--font-open-sans',
  // The system stack the browser uses for the ~100ms before the file lands,
  // and permanently if it fails to. Without an explicit fallback, `display:
  // swap` falls back to the generic default and the reflow is larger.
  fallback: ['system-ui', 'sans-serif'],
})

/** `.lato-font`, the donation policy body, and the `--font-sans` token. */
export const lato = localFont({
  src: [
    { path: '../fonts/lato-latin-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/lato-latin-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-lato',
  fallback: ['system-ui', 'sans-serif'],
})

/** The `body` face and every heading; also the `--font-serif-display` token. */
export const faustina = localFont({
  src: [{ path: '../fonts/faustina-latin.woff2', weight: '400 700', style: 'normal' }],
  display: 'swap',
  variable: '--font-faustina',
  fallback: ['Georgia', 'serif'],
})

/** The `--font-serif` token and `#fauna-font`. */
export const faunaOne = localFont({
  src: [{ path: '../fonts/fauna-one-latin.woff2', weight: '400', style: 'normal' }],
  display: 'swap',
  variable: '--font-fauna-one',
  fallback: ['Georgia', 'serif'],
})
