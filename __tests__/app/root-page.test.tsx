import React from 'react'
import { render, screen } from '@testing-library/react'

import RootPage from '../../src/app/page'
import { canonicalPath, siteUrl } from '../../src/lib/site.config'
import { metadata } from '../../src/app/page'

// This suite used to mock `src/app/home-page` and assert that the root route
// delegated to it. That premise no longer holds: this site's `/` renders its
// own content directly, so the mock silently applied to nothing and the test
// failed for the right reason but told the reader the wrong story. Asserting
// the route's actual contract — one main landmark, a canonical tag, real
// content — holds whether or not a fork delegates.
describe('Root page (app/page.tsx)', () => {
  it('should render without crashing', () => {
    const { container } = render(<RootPage />)
    expect(container).toBeTruthy()
  })

  it('should own the main landmark targeted by the skip link', () => {
    render(<RootPage />)
    const mains = screen.getAllByRole('main')

    expect(mains).toHaveLength(1)
    expect(mains[0]).toHaveAttribute('id', 'main-content')
  })

  it('should render a single top-level heading', () => {
    render(<RootPage />)
    const h1s = screen.getAllByRole('heading', { level: 1 })

    expect(h1s).toHaveLength(1)
    expect(h1s[0].textContent?.trim().length).toBeGreaterThan(0)
  })

  it('should declare its own canonical URL at the site root', () => {
    // Without this the route inherits the layout's canonical, which is also the
    // site root — correct here by coincidence, and wrong on every other route.
    expect(metadata.alternates?.canonical).toBe(siteUrl('/'))
    expect(siteUrl('/')).toMatch(new RegExp(`${canonicalPath('/')}$`))
  })
})
