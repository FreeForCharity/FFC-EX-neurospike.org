// Updates / news data, rendered by src/app/updates/page.tsx.
//
// TO POST AN UPDATE: add a JSON file to ./updates/ and add one import + one
// array entry below. Nothing else. The page groups by year, sorts newest
// first, and handles the empty case on its own.
//
// This mirrors src/data/team.ts deliberately: that is the pattern this repo
// already uses for editable content, and a second, cleverer one would be a
// second thing to learn. `import` of a JSON file rather than reading the
// directory at runtime, because the site is a STATIC EXPORT — there is no
// server to list files, and a build-time glob would need bundler config that
// the template does not carry.

import siteLaunch from './updates/2026-09-27-site-launch.json'
import zeffy from './updates/2026-09-26-zeffy.json'

export type Update = {
  /**
   * ISO date, `YYYY-MM-DD`. Used for grouping, sorting and the <time>
   * element's machine-readable attribute, so the format is not cosmetic --
   * __tests__/data/updates.test.ts rejects anything else.
   */
  date: string
  /** Headline. One line; the page renders it as the entry's heading. */
  title: string
  /** A short paragraph. Plain text — no markup is parsed. */
  body: string
  /**
   * Optional outbound link. Both fields go together: a URL with no label
   * renders nothing, because an unlabelled link is not usable by anyone
   * navigating with a screen reader or a keyboard.
   */
  linkUrl?: string
  linkLabel?: string
}

/**
 * Order here does not matter -- the page sorts by date. Listing them newest
 * first anyway so the file reads the way the page does.
 */
export const updates: Update[] = [siteLaunch, zeffy]

/**
 * Whether an entry's `linkUrl` is safe to render.
 *
 * `https://` or a SINGLE leading slash. Everything else is rejected and the
 * page renders no link at all, rather than an attribute it cannot vouch for.
 *
 * Runtime code, not a test helper, because src/data/updates/*.json is edited
 * by the charity and its values become an href. The shapes that matter:
 *
 *  - `//evil.example` — protocol-relative: starts with a slash, LEAVES THE
 *    ORIGIN. A naive /^(https:\/\/|\/)/ accepts it. That was this rule's
 *    first version and it lived only inside a test, where reverting it
 *    changed no behaviour — mutation testing caught that it graded its own
 *    answer sheet.
 *  - `javascript:` / `data:` — script execution from a content file.
 *  - `http://` — silently downgrades a visitor to plaintext.
 */
export function isSafeLinkUrl(url: string): boolean {
  return /^https:\/\//i.test(url) || /^\/(?!\/)/.test(url)
}

/** Newest first. Stable for entries sharing a date (JSON order wins). */
export function updatesNewestFirst(entries: Update[] = updates): Update[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Entries grouped by calendar year, newest year first, matching how
 * /substacky/ presents its essays.
 */
export function updatesByYear(entries: Update[] = updates): [string, Update[]][] {
  const byYear = new Map<string, Update[]>()

  for (const entry of updatesNewestFirst(entries)) {
    const year = entry.date.slice(0, 4)
    byYear.set(year, [...(byYear.get(year) ?? []), entry])
  }

  return [...byYear.entries()].sort((a, b) => b[0].localeCompare(a[0]))
}
