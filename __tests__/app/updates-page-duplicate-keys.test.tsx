import React from 'react'
import { render } from '@testing-library/react'

/**
 * A SEPARATE FILE because the fixture has to be in place before the page
 * module loads, and `jest.mock` is scoped to one module registry. The rest of
 * the page's tests run against the real content in src/data/updates/ — which
 * is exactly why they cannot cover this: today's two entries have distinct
 * dates and titles, so the collision is invisible until the charity posts the
 * entry that causes it.
 *
 * THE BUG THIS EXISTS TO PREVENT. The key was `${entry.date}-${entry.title}`,
 * and neither field is unique: two posts can share a date, and
 * __tests__/data/updates.test.ts deliberately permits a repeated headline.
 * Measured against that key, React logs:
 *
 *   Encountered two children with the same key ... Non-unique keys may cause
 *   children to be duplicated and/or omitted — the behavior is unsupported
 *
 * Note what the first render does NOT tell you: both articles appear. The
 * damage is to reconciliation on a later render, so asserting on the rendered
 * count would pass against the broken key. The WARNING is the signal, so that
 * is what this asserts on.
 */
jest.mock('@/data/updates', () => ({
  __esModule: true,
  isSafeLinkUrl: () => true,
  updatesByYear: () => [
    [
      '2026',
      [
        { date: '2026-09-27', title: 'Same headline', body: 'first' },
        { date: '2026-09-27', title: 'Same headline', body: 'second' },
      ],
    ],
  ],
}))

// Imported AFTER the mock in source order, but jest hoists `jest.mock` above
// the imports, so the page sees the fixture.
import UpdatesPage from '../../src/app/updates/page'

describe('The Latest page: entries sharing a date AND a title', () => {
  it('renders both without a duplicate-key warning', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    try {
      const { container } = render(<UpdatesPage />)

      expect(container.querySelectorAll('article')).toHaveLength(2)

      const warnings = spy.mock.calls.map((call) => String(call[0])).join('\n')
      expect(warnings).not.toMatch(/same key/i)
    } finally {
      spy.mockRestore()
    }
  })
})
