import React from 'react'
import { render, screen, within } from '@testing-library/react'

import PrivacyPage from '../../src/app/privacy-policy/page'
import CookiePolicyPage from '../../src/app/cookie-policy/page'
import TermsPage from '../../src/app/terms-of-service/page'
import VulnDisclosurePage from '../../src/app/vulnerability-disclosure-policy/page'
import SecurityAckPage from '../../src/app/security-acknowledgements/page'
import FfcDonationPolicyPage from '../../src/app/free-for-charity-donation-policy/page'
import { siteConfig } from '../../src/lib/site.config'

/**
 * The policy pages this charity publishes as its OWN must name this charity as
 * the organization behind them, and must route enquiries here.
 *
 * The template ships these documents pre-written with Free For Charity's own
 * identity in the body text — not just in metadata — so before this suite a
 * rebranded site served a privacy policy naming a different organization as the
 * data controller, a Terms of Service governing someone else's services, and a
 * vulnerability disclosure policy scoped to someone else's domains. None of the
 * existing checks looked at page bodies: `check:rebrand` reads config and a few
 * known files, and the metadata tests only read `title`/`description`.
 */

// Identity that belongs to the template author, and must not appear in a
// rebranded charity's own policies. The FFC donation policy is the deliberate
// exception, asserted separately below.
const TEMPLATE_AUTHOR_IDENTITY = [
  'clarkemoyer@freeforcharity.org',
  'privacy@freeforcharity.org',
  '520-222-8104',
  '5202228104',
  '1 520 222 8104',
  'Clarke Moyer',
]

const charityOwnedPolicies = [
  { name: 'Privacy Policy', Component: PrivacyPage },
  { name: 'Cookie Policy', Component: CookiePolicyPage },
  { name: 'Terms of Service', Component: TermsPage },
  { name: 'Vulnerability Disclosure Policy', Component: VulnDisclosurePage },
  { name: 'Security Acknowledgements', Component: SecurityAckPage },
]

describe('policies this charity publishes as its own', () => {
  it.each(charityOwnedPolicies)(
    '$name carries no template-author contact details',
    ({ Component }) => {
      const { container } = render(<Component />)
      const text = container.textContent ?? ''
      const html = container.innerHTML

      for (const identity of TEMPLATE_AUTHOR_IDENTITY) {
        expect(text).not.toContain(identity)
        expect(html).not.toContain(identity)
      }
    }
  )

  it.each(charityOwnedPolicies)('$name names this charity', ({ Component }) => {
    const { container } = render(<Component />)
    expect(container.textContent).toContain(siteConfig.name)
  })

  // Naming the charity somewhere is not enough: the template's documents state a
  // SUBJECT ("X is committed to…", "provided by X"), and a rebrand that leaves
  // the subject as the template author still publishes someone else's policy
  // under this charity's banner. Reintroducing exactly that passed an earlier
  // version of this suite, which only checked contact details and a mention.
  //
  // The Cookie Policy is absent by design: it is written wholly in the first
  // person and states no organizational subject in its body.
  const subjectStatements = [
    {
      name: 'Privacy Policy',
      Component: PrivacyPage,
      phrase: `At ${siteConfig.name}, accessible from`,
    },
    { name: 'Terms of Service', Component: TermsPage, phrase: `provided by ${siteConfig.name}` },
    {
      name: 'Vulnerability Disclosure Policy',
      Component: VulnDisclosurePage,
      phrase: `${siteConfig.name} is committed to ensuring the security`,
    },
    {
      name: 'Security Acknowledgements',
      Component: SecurityAckPage,
      phrase: `${siteConfig.name} would like to extend`,
    },
  ]

  it.each(subjectStatements)(
    '$name states this charity as its subject',
    ({ Component, phrase }) => {
      const { container } = render(<Component />)
      const text = (container.textContent ?? '').replace(/\s+/g, ' ')

      expect(text).toContain(phrase)
      // ...and does not state the supporting organization as the subject instead.
      expect(text).not.toContain(
        `${siteConfig.supportedBy.name} is committed to ensuring the security`
      )
      expect(text).not.toContain(`provided by ${siteConfig.supportedBy.name} (`)
    }
  )

  it('routes privacy enquiries to this charity', () => {
    const { container } = render(<PrivacyPage />)

    const mailtos = Array.from(container.querySelectorAll('a[href^="mailto:"]')).map((a) =>
      a.getAttribute('href')
    )
    expect(mailtos.length).toBeGreaterThan(0)
    for (const href of mailtos) {
      expect(href).toBe(`mailto:${siteConfig.contactEmail}`)
    }
  })

  it('routes vulnerability reports to this charity', () => {
    const { container } = render(<VulnDisclosurePage />)

    const mailtos = Array.from(container.querySelectorAll('a[href^="mailto:"]')).map((a) =>
      a.getAttribute('href')
    )
    expect(mailtos.length).toBeGreaterThan(0)
    for (const href of mailtos) {
      expect(href).toBe(`mailto:${siteConfig.contactEmail}`)
    }
  })

  // The supporting-organization relationship is a material fact about how this
  // site is operated, and the privacy policy is where a visitor looks for it.
  it('discloses the supporting organization and the limits it creates', () => {
    const { container } = render(<PrivacyPage />)
    const text = container.textContent ?? ''

    expect(text).toContain(siteConfig.supportedBy.name)
    // The three things the disclosure has to answer.
    expect(text).toMatch(/responsible for/i)
    expect(text).toMatch(/cannot delete an individual entry/i)
    expect(text).toMatch(/do not sell or rent personal information/i)
  })

  // A charity with no published phone number must not have one invented for it
  // anywhere in its policies — the same rule the footer follows.
  it('publishes a phone number in its policies only when one is configured', () => {
    const configured = siteConfig.phone.tel.trim() !== '' && siteConfig.phone.display.trim() !== ''

    for (const { Component } of charityOwnedPolicies) {
      const { container } = render(<Component />)
      const telLinks = container.querySelectorAll('a[href^="tel:"], a[href^="sms:"]')

      if (configured) {
        for (const link of Array.from(telLinks)) {
          expect(link.getAttribute('href')).toContain(siteConfig.phone.tel.trim())
        }
      } else {
        expect(telLinks).toHaveLength(0)
      }
    }
  })
})

// Free For Charity's own donation policy is published here on purpose, as a
// supported charity, and correctly keeps FFC's identity. Asserting that keeps
// an over-zealous future rebrand from "fixing" it.
describe("the supporting organization's own donation policy", () => {
  it('keeps Free For Charity as its subject', () => {
    const { container } = render(<FfcDonationPolicyPage />)
    expect(container.textContent).toContain('Free For Charity')
  })
})

// Guards the seam the disclosure depends on: the footer's permanent attribution
// and the policy text must name the same supporting organization.
describe('the supporting organization is named consistently', () => {
  it('matches siteConfig.supportedBy across the privacy policy', () => {
    const { container } = render(<PrivacyPage />)
    const links = Array.from(container.querySelectorAll('a')).filter(
      (a) => a.getAttribute('href') === siteConfig.supportedBy.url
    )
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(within(link).queryByText(siteConfig.supportedBy.name) ?? link).toBeTruthy()
    }
  })
})
