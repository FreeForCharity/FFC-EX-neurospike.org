import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/pageMetadata'
import React from 'react'
import { PageShell, PageTitle, H2, H3, P, A, Lede } from '@/components/content'
import { updatesByYear, isSafeLinkUrl } from '@/data/updates'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = pageMetadata({
  title: 'The Latest',
  description:
    'News and announcements from Neurospike FRO — funding, publications, advisors and milestones.',
  path: '/updates',
})

/**
 * Renders `2026-09-27` as `27 September 2026` without pulling in a date
 * library or depending on the runtime's default locale.
 *
 * Parsed from the STRING rather than via `new Date(iso)`: the Date
 * constructor reads a bare `YYYY-MM-DD` as UTC midnight and then formats it
 * in the local zone, so anywhere west of Greenwich the date renders as the
 * day before. That is the kind of bug that is invisible to CI (which runs in
 * UTC) and visible to every visitor in the Americas — including this
 * charity's own project lead, who is on US Pacific.
 */
export function formatDate(iso: string): string {
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  // MATCHED WHOLE, not split on '-'. Splitting accepted anything whose third
  // segment merely existed, so `2026-09-27T00:00:00Z` produced the literal
  // string "NaN September 2026" — Number('27T00:00:00Z') is NaN and the old
  // truthiness guard passed it. That contradicted this function's own stated
  // contract, which is worse than the bug. Raised by Copilot on #50.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return iso

  const [, year, month, day] = match
  const name = MONTHS[Number(month) - 1]

  // A month outside 01-12 has no name; render the input rather than
  // "undefined". A bad date in a JSON file should look wrong, not crash the
  // build — __tests__/data/updates.test.ts is what actually rejects it.
  if (!name) return iso

  return `${Number(day)} ${name} ${year}`
}

export default function Updates() {
  const years = updatesByYear()

  return (
    <PageShell>
      <PageTitle>The Latest From NeuroSpike</PageTitle>
      <Lede>News and announcements from the FRO.</Lede>

      {years.length === 0 ? (
        /*
          The empty state is not decoration. This page ships with very few
          entries and may legitimately have none, and a page whose body is an
          empty <div> reads as broken rather than as new.
        */
        <P>
          No updates posted yet. In the meantime, the <A href="/substacky">Substacky</A> page
          collects longer essays, and <A href="/media-about">Media &amp; About</A> has press
          coverage.
        </P>
      ) : (
        years.map(([year, entries]) => (
          <section key={year}>
            <H2 id={`y${year}`}>{year}</H2>
            {/*
              The index is IN THE KEY, not decoration. `date`-`title` alone is
              not unique: two posts can share a date, and __tests__/data
              deliberately permits a repeated headline (an annual "Grant
              renewed", say). Measured with two entries sharing both fields,
              React logs "Encountered two children with the same key" and
              says the resulting reconciliation is unsupported -- children
              may be duplicated or omitted. Raised by Copilot on #50.

              Index alone would be worse: it re-keys every later entry when a
              post is inserted. Together they are unique within the list and
              stable for everything above the insertion point.
            */}
            {entries.map((entry, i) => (
              <article key={`${entry.date}-${entry.title}-${i}`} className="mb-[26px]">
                <H3>{entry.title}</H3>
                {/*
                  <time dateTime> gives the machine-readable form while the
                  text stays human — the two must not drift, which is why both
                  come from the same `entry.date`.
                */}
                <p className="text-[14px] text-[#666] mb-[6px]">
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                </p>
                <P>{entry.body}</P>
                {entry.linkUrl && entry.linkLabel && isSafeLinkUrl(entry.linkUrl) ? (
                  <P>
                    <A href={entry.linkUrl}>{entry.linkLabel}</A>
                  </P>
                ) : null}
              </article>
            ))}
          </section>
        ))
      )}

      <H2 id="elsewhere">Elsewhere</H2>
      <P>
        Longer pieces are on <A href="/substacky">Substacky</A>. Press and interviews are on{' '}
        <A href="/media-about">Media &amp; About</A>. The project lead also writes at{' '}
        <A href="https://fl0wstate.com/neuro/">fl0wstate.com/neuro</A>.
      </P>

      <P>
        To suggest something for this page, email{' '}
        <A href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</A>.
      </P>
    </PageShell>
  )
}
