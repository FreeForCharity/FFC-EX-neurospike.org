import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * `next/font` cannot be invoked outside Next's module scope under jest, so
 * these read the source and the font files rather than importing the module.
 *
 * WHAT THIS USED TO ASSERT, AND WHY IT WAS REPLACED
 * ------------------------------------------------
 * A hard-coded list of eight family names, eight CSS variables, and
 * `expect(latinMatches).toHaveLength(8)`. Every one of those assertions was a
 * restatement of the file's contents in a second place: the test passed
 * because someone had typed the same eight names twice, and it could not
 * distinguish a family the site renders from one nothing references. Four of
 * those eight were dead — reachable only through id selectors matching no
 * element in the built export — and this test was green the entire time, and
 * would have gone RED had anyone deleted them.
 *
 * The assertions below are derived from the files instead, so they hold for
 * whatever set of families the site ends up with:
 *
 *  - every `--font-*` the stylesheets and components USE is declared, and
 *  - every family declared has font files that exist and are real woff2, and
 *  - the build-time fetch does not come back.
 */
const ROOT = process.cwd()
const FONTS_TS = join(ROOT, 'src', 'lib', 'fonts.ts')
const FONTS_DIR = join(ROOT, 'src', 'fonts')

const source = readFileSync(FONTS_TS, 'utf8')

/** `variable: '--font-x'` declarations in fonts.ts. */
const declared = new Set(
  [...source.matchAll(/variable:\s*'(--font-[a-z0-9-]+)'/g)].map((match) => match[1])
)

/** `path: '../fonts/x.woff2'` entries in fonts.ts. */
const declaredFiles = [...source.matchAll(/path:\s*'\.\.\/fonts\/([^']+)'/g)].map(
  (match) => match[1]
)

/** Everywhere a `var(--font-*)` is actually consumed. */
function consumedVariables(): Map<string, string[]> {
  const found = new Map<string, string[]>()
  const files = [
    join(ROOT, 'src', 'app', 'globals.css'),
    ...walk(join(ROOT, 'src')).filter((file) => file.endsWith('.tsx')),
  ]

  for (const file of files) {
    if (!existsSync(file)) continue
    for (const match of readFileSync(file, 'utf8').matchAll(/var\((--font-[a-z0-9-]+)\)/g)) {
      found.set(match[1], [...(found.get(match[1]) ?? []), file])
    }
  }
  return found
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
  )
}

describe('lib/fonts', () => {
  it('declares at least one family', () => {
    expect(declared.size).toBeGreaterThan(0)
    expect(declaredFiles.length).toBeGreaterThan(0)
  })

  // THE REGRESSION THIS FILE EXISTS TO PREVENT. next/font/google fetches from
  // fonts.googleapis.com at build time, and Turbopack fails the build when
  // the CSS comes back with more than one `src` per face — a shape Google
  // picks from the User-Agent, which is not ours to pin. It killed a
  // production deploy and a PR's CI within one hour on 2026-09-27 (issue
  // #43). Self-hosting is not a mitigation: it removes the failure mode.
  //
  // Scoped to IMPORT STATEMENTS, not the whole file. The header comment in
  // fonts.ts names `next/font/google` several times explaining why it is
  // gone, and a naive `expect(source).not.toContain(...)` fails on the
  // documentation rather than on a regression — punishing the explanation and
  // teaching the next person to delete it.
  it('does not fetch fonts at build time', () => {
    const imports = [...source.matchAll(/^\s*import\s[^\n]*?from\s+'([^']+)'/gm)].map(
      (match) => match[1]
    )

    expect(imports).toContain('next/font/local')
    expect(imports).not.toContain('next/font/google')
  })

  // A dangling var() renders as an invalid declaration the browser drops, so
  // the element silently falls back to whatever it inherits — visible only to
  // someone looking at the right page in a browser.
  it('declares every --font-* variable the site uses', () => {
    const consumed = consumedVariables()
    const missing = [...consumed.keys()].filter((name) => !declared.has(name))

    expect(consumed.size).toBeGreaterThan(0)
    expect(missing).toEqual([])
  })

  // The other direction. A declared family nothing consumes is a font file
  // downloaded by every visitor for no reason — and, while this site used
  // next/font/google, was also a build-time fetch that could fail. Four such
  // families were carried for months.
  it('declares no family the site never uses', () => {
    const consumed = consumedVariables()
    const unused = [...declared].filter((name) => !consumed.has(name))

    expect(unused).toEqual([])
  })

  it('points every src at a file that exists', () => {
    for (const file of declaredFiles) {
      expect(existsSync(join(FONTS_DIR, file))).toBe(true)
    }
  })

  // `wOF2` is the WOFF2 magic number. A truncated or HTML-error-page download
  // would otherwise be committed and fail in the browser, not the build.
  it('ships real woff2 files and nothing else', () => {
    const onDisk = readdirSync(FONTS_DIR).filter((name) => name.endsWith('.woff2'))

    expect(onDisk.sort()).toEqual([...declaredFiles].sort())

    for (const file of onDisk) {
      const bytes = readFileSync(join(FONTS_DIR, file))
      expect(bytes.subarray(0, 4).toString('latin1')).toBe('wOF2')
    }
  })

  // `display: swap` on every face: the alternative is `auto`, where the text
  // is invisible until the file lands.
  it('uses swap display for every declared family', () => {
    const swaps = source.match(/display:\s*'swap'/g) ?? []

    expect(swaps).toHaveLength(declared.size)
  })

  // Bundled OFL files have to carry their licence. This is the record.
  it('records the licence beside the files', () => {
    const licence = readFileSync(join(FONTS_DIR, 'LICENSE.md'), 'utf8')

    expect(licence).toContain('SIL Open Font License')
    for (const file of declaredFiles) {
      expect(licence).toContain(file)
    }
  })
})
