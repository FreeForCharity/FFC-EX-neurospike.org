import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  updates,
  updatesNewestFirst,
  updatesByYear,
  isSafeLinkUrl,
  type Update,
} from '../../src/data/updates'

/**
 * `src/data/updates/` is edited by the charity, not by developers, so the
 * failure modes worth guarding are the ones a non-developer hits: a date
 * typed the wrong way round, a link with no label, a file added to the folder
 * that nothing imports.
 *
 * Each of those is SILENT without a test. A bad date sorts into the wrong
 * year; an unlabelled link renders nothing at all; an unimported file simply
 * never appears. None of them break the build, so the person who wrote the
 * post would see the site deploy successfully and their update missing.
 */
const DIR = join(process.cwd(), 'src', 'data', 'updates')

/*
  The per-entry suites below use it.each, which runs zero cases when the array
  is empty. That is the intended behaviour, not a hole: with no posts there is
  no content to validate, and the folder-vs-array test still runs and still
  requires both sides to agree at zero.
*/

describe('updates data', () => {
  /*
    NOT `expect(updates.length).toBeGreaterThan(0)`. This page documents an
    empty state and renders one deliberately, so requiring an entry would turn
    "the charity has not posted yet" into a CI failure — a content decision
    breaking the build. Raised by Copilot on #50, and it was right: the suite
    asserted the opposite of what the page promises.

    What is worth pinning is that the array is a well-formed list, whatever
    length it has.
  */
  it('is an array', () => {
    expect(Array.isArray(updates)).toBe(true)
  })

  it.each(updates)('$title has a real YYYY-MM-DD date', (entry: Update) => {
    expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    // Not just the shape: 2026-02-30 matches the regex and is not a date.
    // Compared back as a string so the check cannot be satisfied by JS's
    // silent roll-over into the next month.
    const [y, m, d] = entry.date.split('-').map(Number)
    const parsed = new Date(Date.UTC(y, m - 1, d))
    expect(parsed.toISOString().slice(0, 10)).toBe(entry.date)
  })

  it.each(updates)('$title has non-empty title and body', (entry: Update) => {
    expect(entry.title.trim().length).toBeGreaterThan(0)
    expect(entry.body.trim().length).toBeGreaterThan(0)
  })

  // The page renders the link only when BOTH are present, so a half-filled
  // pair is a post whose call to action silently vanishes.
  it.each(updates)('$title has both link fields or neither', (entry: Update) => {
    expect(Boolean(entry.linkUrl)).toBe(Boolean(entry.linkLabel))
  })

  it.each(updates.filter((e) => e.linkUrl))('$title has a safe link', (entry: Update) => {
    expect(isSafeLinkUrl(entry.linkUrl as string)).toBe(true)
  })

  /*
    Calls the REAL validator, not a copy of its regex. The first version of
    this test inlined `/^(https:\/\/|\/)/` and asserted the literal against
    itself, so reverting the rule in the source changed nothing and the
    mutation went undetected — a test grading its own answer sheet. Found by
    mutation testing, after Copilot found the permissive regex on #50.

    isSafeLinkUrl is also consulted by the page at render time, so an unsafe
    URL in a JSON file produces no link rather than an href nobody vouched for.
  */
  it.each([
    ['https://example.org', true],
    ['/media-about', true],
    ['//evil.example', false],
    ['http://example.org', false],
    ['javascript:alert(1)', false],
    ['data:text/html,x', false],
    ['', false],
  ])('isSafeLinkUrl(%s) === %s', (url, expected) => {
    expect(isSafeLinkUrl(url as string)).toBe(expected)
  })

  /*
    The array is hand-maintained, which is the price of a static export.
    This is what stops a file being added and forgotten.

    Compared as a CANONICAL MULTISET, not by title membership. The first
    version built a Set of titles and asked whether each file's title was in
    it — which two entries sharing a headline defeat outright. Measured, with
    `a.json` and `b.json` both titled "Same headline" and the array importing
    `a.json` twice: lengths matched, every title was "present", the old
    assertion returned **true**, and `b.json` was missing from the site.

    Sorting both sides and comparing the whole entry closes it: a file that
    nothing imports has no counterpart, whatever it is called. Raised by
    Copilot on #50.
  */
  it('imports every JSON file in the folder, exactly once', () => {
    const canon = (entry: Update) => JSON.stringify(Object.entries(entry).sort())
    const onDisk = readdirSync(DIR).filter((f) => f.endsWith('.json'))

    expect(onDisk.length).toBe(updates.length)

    const fromDisk = onDisk
      .map((file) => canon(JSON.parse(readFileSync(join(DIR, file), 'utf8')) as Update))
      .sort()

    expect(updates.map(canon).sort()).toEqual(fromDisk)
  })

  it('documents the format for the people who edit it', () => {
    const readme = readFileSync(join(DIR, 'README.md'), 'utf8')

    expect(readme).toContain('YYYY-MM-DD')
    expect(readme).toContain('src/data/updates.ts')
  })
})

describe('updates ordering', () => {
  const sample: Update[] = [
    { date: '2025-01-02', title: 'older', body: 'x' },
    { date: '2026-06-01', title: 'newest', body: 'x' },
    { date: '2025-12-31', title: 'middle', body: 'x' },
  ]

  it('sorts newest first', () => {
    expect(updatesNewestFirst(sample).map((e) => e.title)).toEqual(['newest', 'middle', 'older'])
  })

  it('does not mutate the input', () => {
    const before = sample.map((e) => e.title)
    updatesNewestFirst(sample)

    expect(sample.map((e) => e.title)).toEqual(before)
  })

  it('groups by year, newest year first, newest entry first inside', () => {
    expect(updatesByYear(sample)).toEqual([
      ['2026', [sample[1]]],
      ['2025', [sample[2], sample[0]]],
    ])
  })

  // The page maps over this, so an empty array must be a clean empty result
  // rather than a crash — and that is the state the page's own empty branch
  // exists to render.
  it('handles no entries at all', () => {
    expect(updatesByYear([])).toEqual([])
    expect(updatesNewestFirst([])).toEqual([])
  })
})
