import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/pageMetadata'
import React from 'react'
import { PageShell, PageTitle, H2, H3, P, UL, A, Lede } from '@/components/content'
import TeamMemberCard from '@/components/ui/TeamMemberCard'
import { team } from '@/data/team'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = pageMetadata({
  title: 'Org & Leadership',
  description:
    'Neurospike operates as a lean virtual biotech during Phase 0 and Phase 1, and is recruiting science advisors and consultants.',
  path: '/org-leadership',
})

export default function OrgLeadership() {
  return (
    <PageShell>
      <PageTitle>Org &amp; Leadership</PageTitle>
      <Lede>Lean Biotech Operation — Phase 0 &amp; 1</Lede>

      <P>
        Neurospike is designed for maximum capital efficiency. During Phase 0 &amp; Phase 1, the FRO
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

      {/*
        The roster in src/data/team/ was maintained but rendered nowhere: the
        content lift replaced the template home page, orphaning the component
        that used to display it (#25). Rendered here rather than reusing
        components/home-page/TheFreeForCharityTeam, which hardcodes an <h1>
        reading "The Free For Charity Team" -- FFC's branding, and a second
        <h1> on a page that already has one.
      */}
      <H2 id="people">People</H2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] my-[22px]">
        {team.map((member) => (
          <TeamMemberCard
            key={member.name}
            name={member.name}
            role={member.role}
            linkedinUrl={member.linkedinUrl}
          />
        ))}
      </div>

      {/*
        Restored from the source Google Sites page, where it closed the
        Project Lead section. The conversion dropped it, and with it the only
        statement of the STATE OF INCORPORATION anywhere on the site -- the
        501(c)(3) status and the EIN survived in the footer and the JSON-LD,
        "California" did not.

        "NeuroSpike Corporation" is the legal name on the IRS determination,
        deliberately spelled differently from siteConfig.name ("Neurospike
        FRO"), which is the public branding -- see the note beside `ein` in
        site.config.ts. A legal-status sentence has to use the legal name, so
        this one string is exempt from the brand normalisation in #22. The EIN
        and the Candid link are read from config so they cannot drift from the
        footer's copies.
      */}
      <H2 id="legal-status">Legal status</H2>
      <P>
        NeuroSpike Corporation is a California non-profit corporation and an IRS 501(c)(3) public
        charity, EIN {siteConfig.ein}. Verify our status on our{' '}
        <A href={siteConfig.guidestar.directProfileUrl}>Candid profile</A>.
      </P>

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
