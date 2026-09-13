import type { Metadata } from 'next'
import React from 'react'
import { siteUrl } from '@/lib/site.config'
import { PageShell, PageTitle, H2, P, UL, A, Lede } from '@/components/content'

export const metadata: Metadata = {
  title: 'Substacky',
  description:
    'Not Yet a Substack — essays and FAQs on techbio, science advocacy, deep tech product-market fit and early-stage fundraising.',
  alternates: { canonical: siteUrl('/substacky') },
}

export default function Substacky() {
  return (
    <PageShell>
      <PageTitle>Substacky</PageTitle>
      <Lede>Not Yet a Substack</Lede>

      <H2 id="y2025">2025</H2>
      <UL>
        <li>
          <A href="https://docs.google.com/document/d/1oXXM2kYTHJQU41CGEAZ_yUoHGWMZ73t6RBSzFiCrTRQ/edit">
            #1 — TechBio in the Mid 21st Century — JPM SF 2025
          </A>
        </li>
        <li>
          <A href="https://docs.google.com/document/d/10HcPVtOrlyHQ39pqW_vGgoQPIPOC8BKK8HjcNwX9iF0/edit">
            #2 — Standup for Science — March 2025
          </A>
        </li>
        <li>
          <A href="https://docs.google.com/document/d/1B8a1SPfjVV4GJQCfexOX8P_H2aNFVIAwbnuqBaazlcM/edit">
            #3 — Deep Tech Product-Market-Fit for Dummies
          </A>
        </li>
      </UL>

      <H2 id="y2024">2024</H2>
      <UL>
        <li>
          <A href="https://docs.google.com/document/d/1YNvbrRFM_PBrxIykz9Cf_wFsDX34gd76">
            How To Raise $$ If You Didn&apos;t Go to Stanford or Have Rich Friends
          </A>
        </li>
        <li>
          <A href="https://docs.google.com/document/d/1yzMhUwHrmzxHVW6PcBRuxYw4wLUrwLxOGDUxM2kPP5E">
            Pre &amp; Post-Incorporation FAQ
          </A>
        </li>
        <li>
          <A href="https://docs.google.com/document/d/1tdQ_6hsmaYU3FLHDQudb0OA9KXZ1GgbeW8eSKjQul8I">
            Seed Funding &amp; YC-SAFE FAQ
          </A>
        </li>
      </UL>

      <P>
        Mostly on US Pacific Time (GMT −7/8). Sometimes on US Eastern Time (GMT −4/5) or China
        Standard Time (GMT +8).
      </P>
    </PageShell>
  )
}
