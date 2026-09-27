import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

/**
 * ESM script, so this runs it through node the way the other script tests do.
 * The module's fetching half is behind an `import.meta.url` guard, so
 * importing it here downloads nothing.
 */
function evaluate(expression: string): unknown {
  const script = join(process.cwd(), 'scripts', 'fetch-fonts.mjs')
  const result = spawnSync(
    'node',
    [
      '--input-type=module',
      '-e',
      `const m = await import(${JSON.stringify(script)});\nprocess.stdout.write(JSON.stringify(${expression}))`,
    ],
    { cwd: process.cwd(), encoding: 'utf8' }
  )

  if (result.status !== 0) {
    throw new Error(`node exited ${result.status}: ${result.stderr}`)
  }
  return JSON.parse(result.stdout)
}

/** One `latin` @font-face block in the shape Google actually returns. */
function face(weight: number, url: string, format = 'woff2'): string {
  return `/* latin */
@font-face {
  font-family: 'Example';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url(${url}) format('${format}');
  unicode-range: U+0000-00FF;
}`
}

const LATIN_EXT = `/* latin-ext */
@font-face {
  font-family: 'Example';
  font-style: normal;
  font-weight: 400;
  src: url(https://example.invalid/ext.woff2) format('woff2');
  unicode-range: U+0100-02BA;
}`

function parse(css: string): { weight: number; url: string }[] {
  return evaluate(`m.parseLatinFaces(${JSON.stringify(css)})`) as { weight: number; url: string }[]
}

describe('parseLatinFaces', () => {
  it('keeps the latin faces and drops every other subset', () => {
    const faces = parse([LATIN_EXT, face(400, 'https://example.invalid/a.woff2')].join('\n'))

    expect(faces).toEqual([{ weight: 400, url: 'https://example.invalid/a.woff2' }])
  })

  // A variable font answers every requested weight with the SAME file, which
  // is why the script dedupes on url rather than counting weights.
  it('reports one entry per face even when they share a file', () => {
    const shared = 'https://example.invalid/variable.woff2'
    const faces = parse([face(400, shared), face(700, shared)].join('\n'))

    expect(faces.map((f) => f.weight)).toEqual([400, 700])
    expect(new Set(faces.map((f) => f.url)).size).toBe(1)
  })

  // THE UPSTREAM FAILURE THIS WHOLE CHANGE IS ABOUT. Google returns a legacy
  // multi-`src` block to a User-Agent it does not recognise, and Turbopack
  // rejects exactly that with "next/font/google queries have exactly one
  // entry". If it ever answers this script that way, it must fail at the
  // download rather than pick one url from an ambiguous list.
  it('refuses a legacy multi-src face instead of guessing', () => {
    const legacy = `/* latin */
@font-face {
  font-family: 'Example';
  font-weight: 400;
  src: url(https://example.invalid/a.eot) format('embedded-opentype'), url(https://example.invalid/a.woff) format('woff');
  unicode-range: U+0000-00FF;
}`

    expect(() => parse(legacy)).toThrow()
  })

  it('refuses a face that is not woff2', () => {
    expect(() => parse(face(400, 'https://example.invalid/a.ttf', 'truetype'))).toThrow()
  })

  // An empty result is the one outcome that must never look like a completed
  // download: the caller would write no files and exit 0, leaving src/fonts/
  // untouched and reporting success. Asserted here as the parse returning
  // nothing; the caller turns that into a thrown error.
  it('returns nothing for CSS it does not recognise, rather than inventing a face', () => {
    expect(parse('/* cyrillic */\n@font-face { font-family: X; }')).toEqual([])
    expect(parse('')).toEqual([])
  })
})

describe('the families the script is configured to fetch', () => {
  it('matches what src/lib/fonts.ts declares', () => {
    const families = evaluate('m.FAMILIES') as { family: string; weights: number[] }[]

    expect(families.map((f) => f.family).sort()).toEqual([
      'Fauna One',
      'Faustina',
      'Lato',
      'Open Sans',
    ])
    for (const entry of families) {
      expect(entry.weights.length).toBeGreaterThan(0)
    }
  })
})
