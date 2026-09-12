import type { Metadata } from 'next'
import React from 'react'
import { siteUrl } from '@/lib/site.config'
import { PageShell, PageTitle, H2, P, UL, A } from '@/components/content'
import ContentImage from '@/components/content/ContentImage'

export const metadata: Metadata = {
  title: 'Media & About | Neurospike FRO',
  description:
    'About Robert H. Lee — deep tech investing, early-stage operations, academic publications and media appearances.',
  alternates: { canonical: siteUrl('/media-about') },
}

export default function MediaAbout() {
  return (
    <PageShell>
      <PageTitle>Media &amp; About</PageTitle>

      <P>
        Robert is a VP and/or LP at various seed-stage &ldquo;deep tech&rdquo; Silicon Valley funds
        focused on tech bio. Early-stage ops at two non-VC funded companies (enterprise &amp;
        consumer) with small, successful exits. Fractional COO and General Counsel by day. MS in
        Theoretical Neuroscience at GIMBC at night. Below are some of his media appearances.
      </P>
      <P>
        He has led and instructed some of the most notable investors and founders in Silicon Valley,
        including a FAANG founder, on freediving and big-wave surf survival experiences.
      </P>
      <P>His LinkedIn, Github and personal webpage are linked below.</P>

      <H2 id="publications">Academic publications</H2>
      <UL>
        <li>
          <A href="https://orcid.org/0000-0003-4074-2247">ORCID — 0000-0003-4074-2247</A>
        </li>
      </UL>

      <H2 id="media">Media</H2>
      <P>Featured in these photos from CNN and NYT, covering the same series of events.</P>
      <UL>
        <li>
          <A href="https://www.cnn.com/2013/11/18/us/free-diver-death">CNN</A>
        </li>
        <li>
          <A href="https://www.nytimes.com/2013/11/19/sports/testing-limits-of-a-niche-sport-diver-met-fate-7">
            The New York Times
          </A>
        </li>
      </UL>
      <ContentImage
        src="/images/content/media-01.jpg"
        alt="Robert H. Lee, media appearance"
        width={404}
        height={413}
      />
      <ContentImage
        src="/images/content/media-02.png"
        alt="Press coverage featuring Robert H. Lee"
        width={902}
        height={1420}
      />
      <ContentImage
        src="/images/content/media-03.jpg"
        alt="Press coverage featuring Robert H. Lee"
        width={1280}
        height={1707}
      />

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
