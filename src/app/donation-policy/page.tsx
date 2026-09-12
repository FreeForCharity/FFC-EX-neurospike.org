import type { Metadata } from 'next'
import { siteConfig, siteUrl } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Donation Policy',
  description: `Donation Policy for ${siteConfig.name}`,
  // Own canonical: without it Next inherits the layout's, which points at the home page.
  alternates: { canonical: siteUrl('/donation-policy') },
}

export default function DonationPolicy() {
  return (
    <main id="main-content" className="ffc-container py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-[var(--font-faustina)] text-[48px] leading-[60px] mb-8">
          Donation Policy
        </h1>

        <div className="prose max-w-none font-[var(--font-lato)] text-[18px] leading-[28px]">
          <p>
            <strong>Effective Date:</strong> January 1, 2024
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Tax Deductibility
          </h2>
          <p>
            NeuroSpike is a qualified 501(c)(3) public charity (EIN: 42-2753465). Donations are
            tax-deductible to the full extent allowed by law.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Use of Donations
          </h2>
          <p>
            Donations support {siteConfig.name}&apos;s mission and the work described on this site,
            including:
          </p>
          <ul>
            <li>Our research and program activities</li>
            <li>The tools, data and infrastructure that work depends on</li>
            <li>Administrative costs necessary to operate our programs</li>
          </ul>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Donation Processing
          </h2>
          <p>
            Donations are processed securely through our payment partners. You will receive a
            receipt for tax purposes via email after your donation is processed.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Refund Policy
          </h2>
          <p>
            We generally do not provide refunds for donations. However, if you believe an error has
            occurred, please contact us within 30 days of your donation.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Privacy
          </h2>
          <p>
            Donor information is kept confidential and will not be shared with third parties except
            as required by law.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Contact Us
          </h2>
          <p>For questions about donations or this policy, please contact us at:</p>
          <p>
            Email:{' '}
            <a href="mailto:rlee@codex.stanford.edu" className="text-primary hover:underline">
              rlee@codex.stanford.edu
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
