#!/usr/bin/env node
/**
 * Downloads the self-hosted font files in src/fonts/ from Google Fonts.
 *
 *   pnpm run fonts
 *
 * WHY THE SITE SELF-HOSTS RATHER THAN USING next/font/google
 * ----------------------------------------------------------
 * `next/font/google` fetches each family's CSS from fonts.googleapis.com **at
 * build time**. Turbopack then rejects the result outright when the CSS comes
 * back carrying more than one `src` entry per face:
 *
 *     Error: Turbopack build failed with 20 errors:
 *     Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
 *     next/font/google queries have exactly one entry
 *
 * Google decides that shape from the request's User-Agent -- a modern one
 * gets a single woff2 `src`, an unrecognised one gets a legacy multi-`src`
 * block -- and the choice is not ours to make or to pin. On 2026-09-27 it hit
 * twice in one hour, on Montserrat and then on Raleway, and one of the two
 * killed a **production deploy** (run 36345293189). The same commit had built
 * clean twice minutes earlier. See issue #43.
 *
 * Self-hosting removes the build-time network entirely: the bytes are in the
 * repository, so the build is deterministic and offline-capable. It is not a
 * retry, a pin, or a mitigation -- the failure mode cannot occur.
 *
 * WHAT IS NOT CHANGED BY THIS
 * ---------------------------
 * Nothing about what a visitor downloads. `next/font/google` already
 * self-hosts at runtime -- it bundles the files into the build output and
 * serves them from this origin. The page never contacted Google either way.
 * This moves the *fetch* from build time to a committed file.
 *
 * SUBSETS
 * -------
 * `latin` only, matching the `subsets: ['latin']` every declaration already
 * carried, so the character coverage is unchanged. `next/font/local` has no
 * per-file `unicode-range`, which is another reason to take exactly one
 * subset: two files for one weight would give the browser two faces of the
 * same weight and it would simply use the first.
 *
 * LICENSING
 * ---------
 * All four families are under the SIL Open Font License 1.1, which permits
 * redistribution including bundled in a repository. src/fonts/LICENSE.md
 * records this alongside the files.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'src', 'fonts')

/**
 * A modern desktop Chrome UA, stated explicitly rather than left to whatever
 * node sends.
 *
 * This is the whole reason the upstream failure exists: Google serves a
 * single-`src` woff2 block to a UA it recognises and a legacy multi-`src`
 * block to one it does not. Sending a default node UA here would fetch the
 * legacy shape and defeat the point of the script.
 */
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/**
 * The families the site actually renders, and the weights it asks for.
 *
 * It used to declare EIGHT. Raleway, Cantata One, Montserrat and Cinzel were
 * reachable only through id selectors in globals.css -- `#raleway-font`,
 * `#cantata-font`, `#montserrat-font`, `#cinzel` -- and a search of the built
 * export found zero elements carrying any of those ids. They were template
 * scaffolding that the content lift orphaned, and every one was a build-time
 * fetch that could fail. Raleway is in fact the family that took CI down on
 * PR #42, on a diff that touched nothing but a workflow file and two tests.
 */
export const FAMILIES = [
  { family: 'Open Sans', file: 'open-sans-latin.woff2', weights: [400, 500, 600, 700, 800] },
  { family: 'Lato', file: 'lato-latin-{weight}.woff2', weights: [400, 700] },
  { family: 'Faustina', file: 'faustina-latin.woff2', weights: [400, 500, 600, 700] },
  { family: 'Fauna One', file: 'fauna-one-latin.woff2', weights: [400] },
]

/**
 * Parses the `latin` @font-face blocks out of a css2 response.
 *
 * Google labels each block with a subset comment immediately before it, which
 * is the only machine-readable marker of which subset a file covers -- the
 * `unicode-range` would have to be interpreted instead.
 */
export function parseLatinFaces(css) {
  const blocks = [...css.matchAll(/\/\*\s*([a-z0-9-]+)\s*\*\/\s*@font-face\s*\{(.*?)\}/gs)]

  return blocks
    .filter(([, subset]) => subset === 'latin')
    .map(([, , body]) => {
      const weight = /font-weight:\s*([0-9]+)\s*;/.exec(body)
      const sources = [...body.matchAll(/url\(([^)]+)\)\s*format\('([^']+)'\)/g)]

      // The exact condition Turbopack asserts. If Google ever answers this
      // script with the legacy shape, fail loudly here rather than committing
      // a file chosen from an ambiguous list.
      //
      // The two messages are deliberately distinct. A legacy block is BOTH
      // multi-src and non-woff2, so a caller -- or a test -- that only knows
      // "it threw" cannot tell which guard fired, and removing either one
      // looks identical from the outside. That is the same failure as
      // asserting on an exit code without reading the output.
      if (sources.length !== 1) {
        throw new Error(`multi-src face: expected exactly one src, got ${sources.length}`)
      }
      if (sources[0][2] !== 'woff2') {
        throw new Error(`unexpected format: expected woff2, got ${sources[0][2]}`)
      }

      return { weight: weight ? Number(weight[1]) : null, url: sources[0][1] }
    })
}

async function get(url, asText) {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`)
  return asText ? response.text() : Buffer.from(await response.arrayBuffer())
}

// Guarded so the exports above can be imported by a test without fetching.
if (import.meta.url === `file://${process.argv[1]}`) {
  await mkdir(OUT_DIR, { recursive: true })

  for (const { family, file, weights } of FAMILIES) {
    const query = `${family.replace(/ /g, '+')}:wght@${weights.join(';')}`
    const css = await get(`https://fonts.googleapis.com/css2?family=${query}&display=swap`, true)
    const faces = parseLatinFaces(css)

    // Without this, a CSS format change upstream makes the script write
    // NOTHING and exit 0 -- the whole run reports success, src/fonts/ keeps
    // whatever it had, and the next person to add a family finds no file and
    // no error. An empty result is the one outcome that must never look like
    // a completed download.
    if (faces.length === 0) {
      throw new Error(
        `No latin @font-face blocks found for ${family}. The css2 response format ` +
          `may have changed; inspect it before trusting this script again.`
      )
    }

    // A variable font answers every requested weight with ONE file, so the
    // distinct urls -- not the weight count -- decide how many files to write.
    const distinct = [...new Set(faces.map((face) => face.url))]

    for (const url of distinct) {
      const weight = faces.find((face) => face.url === url).weight
      const name = file.replace('{weight}', String(weight))
      const bytes = await get(url, false)

      if (bytes.subarray(0, 4).toString('latin1') !== 'wOF2') {
        throw new Error(`${url} is not a woff2 file`)
      }

      await writeFile(path.join(OUT_DIR, name), bytes)
      console.log(`Wrote src/fonts/${name} (${family}, ${bytes.length} bytes)`)
    }

    if (distinct.length === 1 && weights.length > 1) {
      console.log(`  ${family} is a variable font: one file covers ${weights.join('/')}`)
    }
  }
}
