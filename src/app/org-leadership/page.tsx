import type { Metadata } from 'next'
import React from 'react'
import { siteUrl } from '@/lib/site.config'
import { PageShell, PageTitle, H2, H3, P, UL, A, Lede, MissingAsset } from '@/components/content'

export const metadata: Metadata = {
  title: 'Org & Leadership | Neurospike FRO',
  description:
    'NeuroSpike operates as a lean virtual biotech during Phase 0 and Phase 1, and is recruiting science advisors and consultants.',
  alternates: { canonical: siteUrl('/org-leadership') },
}

export default function OrgLeadership() {
  return (
    <PageShell>
      <PageTitle>Org &amp; Leadership</PageTitle>
      <Lede>Lean Biotech Operation — Phase 0 &amp; 1</Lede>

      <P>
        NeuroSpike is designed for maximum capital efficiency. During Phase 0 &amp; Phase 1, the FRO
        will operate as a lean virtual biotech. The project lead will act as the sole internal
        employee and principal architect, leveraging modern in-silico pipelines and managing a
        decentralized network of specialized consultants.
      </P>
      <P>
        We are immediately recruiting for such science advisors and consultants. They will provide
        fractional, high-leverage strategic guidance during our in-silico validation of Phases 0 and
        1. As the FRO scales from Phase 1 to Phase 2, advisors and consultants will have the
        opportunity to take leadership in spinning out and operating spin out TX companies.
      </P>
      <P>
        Less experienced consultants will receive active mentorship from the project lead, who
        brings experience as a biotech angel investor and venture partner.
      </P>

      <H2 id="science-needs">Our immediate science needs include</H2>
      <UL>
        <li>
          <strong>Translational Science Lead (Assay &amp; Bench Strategy):</strong> Experienced
          bench lab scientists to design and validate our plans for molecular approaches and assay
          frameworks (no wet lab execution in Phase 0).
        </li>
        <li>
          <strong>Lead Computational Biologist (In-Silico):</strong> An in-silico bioscientist to
          architect and lead computational modeling and biomarker validation.
        </li>
        <li>
          <strong>Head of AI / Machine Learning:</strong> An ML/LLM generalist to architect the data
          engineering pipelines and computational infrastructure.
        </li>
      </UL>

      <H2 id="project-lead">Project Lead</H2>
      <H3>Robert H. Lee</H3>
      <UL>
        <li>
          <strong>Scientific Background:</strong> BS in Computational Biology; published researcher
          with experience from Yale Medical School, MS in Neuroscience.
        </li>
        <li>
          <strong>Legal &amp; Commercial Background:</strong> Silicon Valley attorney with extensive
          experience in corporate formation, funding, and tech transfer.
        </li>
      </UL>
      <MissingAsset label="Leadership / organization visuals from the source Org & Leadership page (3 images)." />

      <H2 id="links">Links</H2>
      <UL>
        <li>
          <A href="https://linkedin.com/in/goldspruce">LinkedIn</A>
        </li>
        <li>
          <A href="https://github.com/goldspruce">GitHub</A>
        </li>
        <li>
          <A href="https://fl0wstate.com/neuro/">Personal webpage</A>
        </li>
      </UL>

      <P>
        Mostly on US Pacific Time (GMT −7/8). Sometimes on US Eastern Time (GMT −4/5) or China
        Standard Time (GMT +8).
      </P>
    </PageShell>
  )
}
