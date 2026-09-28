import React from 'react'
import { render, screen } from '@testing-library/react'
import UpdatesPage, { metadata, formatDate } from '../../src/app/updates/page'
import { updates } from '../../src/data/updates'
import { routes } from '../../src/app/sitemap'

describe('The Latest page', () => {
  it('owns exactly one main landmark with the skip target id', () => {
    render(<UpdatesPage />)
    const mains = screen.getAllByRole('main')

    expect(mains).toHaveLength(1)
    expect(mains[0]).toHaveAttribute('id', 'main-content')
  })

  it('renders the heading goldspruce asked for', () => {
    render(<UpdatesPage />)

    expect(screen.getByRole('heading', { name: /The Latest From NeuroSpike/i })).toBeInTheDocument()
  })

  it('renders every update', () => {
    render(<UpdatesPage />)

    for (const entry of updates) {
      expect(screen.getByText(entry.title)).toBeInTheDocument()
    }
  })

  // The <time> element carries the machine-readable date; the visible text is
  // for people. They come from one field, and this is what stops them
  // drifting apart if the formatting is ever changed.
  it('gives every entry a machine-readable date matching its data', () => {
    const { container } = render(<UpdatesPage />)
    const times = [...container.querySelectorAll('time')]

    expect(times).toHaveLength(updates.length)
    expect(times.map((t) => t.getAttribute('dateTime')).sort()).toEqual(
      updates.map((e) => e.date).sort()
    )
  })

  // Derived from the data, so editing src/data/updates/*.json — which is the
  // entire point of that folder — cannot fail CI for an unrelated reason.
  it('renders each entry date as text', () => {
    render(<UpdatesPage />)

    for (const entry of updates) {
      expect(screen.getByText(formatDate(entry.date))).toBeInTheDocument()
    }
  })

  it('links onward rather than dead-ending', () => {
    render(<UpdatesPage />)

    expect(screen.getAllByRole('link', { name: /Substacky/i })[0]).toHaveAttribute(
      'href',
      '/substacky'
    )
  })

  it('exports page metadata for the route', () => {
    expect(metadata.title).toBe('The Latest')
    expect(typeof metadata.description).toBe('string')
  })

  /**
   * The sitemap list is HAND-MAINTAINED, so a new route is invisible to search
   * engines until someone remembers it. That is exactly the kind of omission
   * nothing else reports — the page works, it just never gets indexed.
   */
  it('is listed in the sitemap', () => {
    expect(routes.map((r) => r.path)).toContain('/updates')
  })
})

/**
 * THE BUG THIS EXISTS TO PREVENT. `new Date('2026-09-27')` is UTC midnight,
 * and formatting it in a zone west of Greenwich renders 26 September. CI runs
 * in UTC, so a naive implementation is correct on the runner and wrong for
 * every visitor in the Americas — including this charity's project lead, who
 * is on US Pacific.
 *
 * TESTED ON THE PURE FUNCTION, for two reasons found the hard way:
 *
 *  - `process.env.TZ` set inside a running test does nothing (node reads the
 *    zone once at startup). Measured: that version passed against the naive
 *    implementation.
 *  - Re-rendering the page under `jest.isolateModules` to inject a fixture
 *    loads a second React, and `next/link` then dies on a null context.
 *
 * Sabotaging `Date` around the function pins the property that matters — the
 * text comes from the STRING and never touches a timezone-aware API — with no
 * rendering, no module juggling, and no dependence on live content.
 */
describe('formatDate', () => {
  function withoutDate<T>(fn: () => T): T {
    const RealDate = global.Date
    try {
      global.Date = class {
        constructor() {
          throw new Error('formatDate must not use Date — it is timezone-dependent')
        }
      } as unknown as DateConstructor
      return fn()
    } finally {
      global.Date = RealDate
    }
  }

  it.each([
    ['2026-09-27', '27 September 2026'],
    ['2026-01-01', '1 January 2026'],
    ['2025-12-31', '31 December 2025'],
  ])('renders %s as %s without constructing a Date', (iso, expected) => {
    expect(withoutDate(() => formatDate(iso))).toBe(expected)
  })

  /*
    A bad date in a JSON file should look wrong on the page, not crash the
    build — the data test is what actually rejects it.

    `2026-09-27T00:00:00Z` is the case that broke the contract: splitting on
    '-' gave a third segment of `27T00:00:00Z`, whose Number() is NaN, and the
    old truthiness guard let it through as the literal string
    "NaN September 2026". A full-string match fixes it. Raised by Copilot
    on #50 — an ISO timestamp is an entirely plausible thing for someone to
    paste into a `date` field.
  */
  it.each([
    ['2026-09-27T00:00:00Z', 'an ISO timestamp'],
    ['not-a-date', 'free text'],
    ['2026-13-01', 'a month that does not exist'],
    ['2026-9-27', 'an unpadded month'],
    ['', 'an empty string'],
  ])('returns %s unchanged (%s)', (input) => {
    expect(withoutDate(() => formatDate(input))).toBe(input)
  })

  it('never emits NaN or undefined', () => {
    for (const input of ['2026-09-27T00:00:00Z', '2026-13-01', 'x', '2026-09-27']) {
      const out = withoutDate(() => formatDate(input))
      expect(out).not.toMatch(/NaN|undefined/)
    }
  })
})
