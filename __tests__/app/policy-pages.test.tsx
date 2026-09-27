import React from 'react'
import { render, screen } from '@testing-library/react'
import { siteConfig } from '../../src/lib/site.config'

// Import page components and their metadata exports
import DonationPolicyPage, { metadata as donationMeta } from '../../src/app/donation-policy/page'
import SecurityAckPage, {
  metadata as securityMeta,
} from '../../src/app/security-acknowledgements/page'
import CookiePolicyPage, { metadata as cookieMeta } from '../../src/app/cookie-policy/page'
import TermsPage, { metadata as termsMeta } from '../../src/app/terms-of-service/page'
import PrivacyPage, { metadata as privacyMeta } from '../../src/app/privacy-policy/page'
import VulnDisclosurePage, {
  metadata as vulnMeta,
} from '../../src/app/vulnerability-disclosure-policy/page'

const pages = [
  { name: 'Donation Policy', Component: DonationPolicyPage, meta: donationMeta },
  { name: 'Security Acknowledgements', Component: SecurityAckPage, meta: securityMeta },
  { name: 'Cookie Policy', Component: CookiePolicyPage, meta: cookieMeta },
  { name: 'Terms of Service', Component: TermsPage, meta: termsMeta },
  { name: 'Privacy Policy', Component: PrivacyPage, meta: privacyMeta },
  { name: 'Vulnerability Disclosure Policy', Component: VulnDisclosurePage, meta: vulnMeta },
]

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

describe('Policy page metadata', () => {
  it.each(pages)('$name should export a title', ({ meta }) => {
    expect(meta.title).toBeDefined()
    expect(typeof meta.title).toBe('string')
    expect((meta.title as string).length).toBeGreaterThan(0)
  })

  it.each(pages)('$name should export a description', ({ meta }) => {
    expect(meta.description).toBeDefined()
    expect(typeof meta.description).toBe('string')
    expect((meta.description as string).length).toBeGreaterThan(0)
  })

  // A page's own title is the PAGE name only. The root layout's
  // `title.template` (`%s | <site name>`) appends the site name, so a page that
  // also carries it renders "Privacy Policy | Acme | Acme". The full
  // composition is asserted for every route in __tests__/app/sitemap.test.ts.
  it.each(pages)('$name title omits the site name the template appends', ({ meta }) => {
    expect(typeof meta.title).toBe('string')
    expect((meta.title as string).length).toBeGreaterThan(0)
    expect(meta.title as string).not.toMatch(
      new RegExp(`\\|\\s*${escapeForRegExp(siteConfig.name)}\\s*$`)
    )
  })
})

describe('Policy page rendering', () => {
  it.each(pages)(
    '$name owns exactly one main landmark with the skip target id',
    ({ Component }) => {
      render(<Component />)
      const mains = screen.getAllByRole('main')

      expect(mains).toHaveLength(1)
      expect(mains[0]).toHaveAttribute('id', 'main-content')
    }
  )

  it('Donation Policy renders heading and EIN', () => {
    render(<DonationPolicyPage />)
    expect(screen.getByText('Donation Policy')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(siteConfig.ein))).toBeInTheDocument()
  })

  it('Donation Policy contains expected sections', () => {
    render(<DonationPolicyPage />)
    expect(screen.getByText('Tax Deductibility')).toBeInTheDocument()
    expect(screen.getByText('Use of Donations')).toBeInTheDocument()
    expect(screen.getByText('Refund Policy')).toBeInTheDocument()
  })

  // getAllByText, not getByText: the page carries the contact address more than
  // once (the "How to Donate" section added in #39 offers it for cheque/wire
  // giving, and the contact section below already did). getByText THROWS on a
  // second match, so the single-element form made a legitimate content addition
  // look like a regression. Asserting over every match is also the stronger
  // check -- one address rendered as plain text rather than a mailto link would
  // now fail, where before only the first occurrence was ever examined.
  it('Donation Policy renders every contact email as a mailto link', () => {
    render(<DonationPolicyPage />)
    const emails = screen.getAllByText(siteConfig.contactEmail)

    expect(emails.length).toBeGreaterThan(0)
    for (const email of emails) {
      expect(email.closest('a')).toHaveAttribute('href', `mailto:${siteConfig.contactEmail}`)
    }
  })

  it('Security Acknowledgements renders heading', () => {
    render(<SecurityAckPage />)
    expect(screen.getByText('Security Acknowledgements')).toBeInTheDocument()
  })

  it('Security Acknowledgements links to vulnerability disclosure policy', () => {
    render(<SecurityAckPage />)
    const link = screen.getByText('Vulnerability Disclosure Policy')
    expect(link.closest('a')).toHaveAttribute('href', '/vulnerability-disclosure-policy')
  })

  it('Cookie Policy renders heading', () => {
    render(<CookiePolicyPage />)
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument()
  })

  it('Terms of Service renders heading', () => {
    render(<TermsPage />)
    expect(screen.getByRole('heading', { name: /Terms of Service/ })).toBeInTheDocument()
  })

  it('Privacy Policy renders heading', () => {
    render(<PrivacyPage />)
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('Vulnerability Disclosure Policy renders heading', () => {
    render(<VulnDisclosurePage />)
    expect(
      screen.getByRole('heading', { name: /Vulnerability Disclosure Policy/ })
    ).toBeInTheDocument()
  })
})
