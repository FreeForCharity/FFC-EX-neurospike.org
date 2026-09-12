import type { Metadata } from 'next'
import React from 'react'
import { siteUrl } from '@/lib/site.config'
import { PageShell, PageTitle, H2, H3, P, UL, OL, A, Lede } from '@/components/content'
import ContentImage from '@/components/content/ContentImage'

export const metadata: Metadata = {
  title: 'Neurospike FRO | Executive Summary',
  description:
    'Executive summary of the NeuroSpike Focused Research Organization: Age-Related Fast-Spike Neuron Decline (FSND) as a unifying paradigm for age-related functional decline.',
  alternates: { canonical: siteUrl('/') },
}

export default function Home() {
  return (
    <PageShell>
      <PageTitle>Neurospike FRO</PageTitle>
      <Lede>
        Executive Summary — NeuroSpike FRO. Below, and also available as a stand-alone document.
      </Lede>

      <H2 id="materials">Materials</H2>
      <UL>
        <li>Executive Summary — below and as a stand-alone document</li>
        <li>FRO Presentation — Vitalist Bay, May 2026</li>
        <li>Andy Galpin: power vs strength vs muscle mass</li>
        <li>Review Paper</li>
        <li>
          Proposed Longitudinal Study — &ldquo;Essentially, if you can jump an inch off the ground,
          is this a good binary predictor of Mortality &amp; Morbidity?&rdquo;
        </li>
        <li>Knowledge Node Maps</li>
      </UL>
      <ContentImage
        src="/images/content/home-01.jpg"
        alt="Neurospike FRO executive summary visual"
        width={1082}
        height={817}
      />
      <ContentImage
        src="/images/content/home-02.jpg"
        alt="Neurospike FRO supporting figure"
        width={512}
        height={449}
      />
      <ContentImage
        src="/images/content/home-03.jpg"
        alt="Neurospike FRO supporting figure"
        width={481}
        height={425}
      />

      <H2 id="fro">1. Focused Research Organization (FRO)</H2>
      <P>
        An FRO is a time-bound, technically ambitious effort designed to produce high-impact public
        goods that unblock scientific progress.
      </P>
      <P>
        <A href="https://www.convergentresearch.org">https://www.convergentresearch.org</A>
      </P>
      <P>
        A Focused Research Organization (FRO) is a time-limited (3 to 7 year), mission-driven,
        non-profit, or startup-structured entity designed to accelerate scientific progress by
        tackling, mid-scale, &ldquo;bottleneck&rdquo; projects. FROs bridge the gap between academia
        and industry by developing public-good tools, datasets, and infrastructures that are too
        large for labs and not profitable for companies.
      </P>
      <P>
        <A href="https://fas.org/publication/focused-research-organizations-a-new-model-for-scientific-research">
          https://fas.org/publication/focused-research-organizations-a-new-model-for-scientific-research
        </A>
      </P>

      <H2 id="meta-question">2. Meta Question</H2>
      <P>
        Our FRO presents a unifying hypothesis for the biology of aging while simultaneously posing
        a structural meta-question regarding modern bioscience research. We propose Age-Related
        Fast-Spike Neuron Decline (FSND) as a rubric to formalize the study of a primary, systemic
        driver of functional decline as a distinct scientific field. By bootstrapping the science of
        FSND, we aim to determine how far a translation-ready framework can be developed entirely in
        silico, starting with a seminal review paper and a radically lean resource model.
      </P>
      <P>
        This meta-question rests on an underlying broader proposition— that computational biology
        will become &ldquo;the new biology&rdquo; in much the way that theoretical physics became
        &ldquo;the new physics&rdquo; about one century ago. Quantum physicists drove monumental
        progress through pure Gedankenexperiments (thought experiments) and mathematical modeling,
        thus making theoretical physics a real science and note mere abstract philosophy. By doing a
        deep dive into theory and math, a physicist could emerge with profound, structurally sound
        insights before eventually turning to experimental validation. If the true promise of
        computational biology is to be realized, modern biologists must demonstrate this same
        theoretical power, this time with in silico compute instead of paper and chalkboard.
      </P>

      <H2 id="review-paper">3. Review Paper</H2>
      <P>
        We suggest you review the Abstract &amp; Introduction of our Review Paper: Age-Related
        Fast-Spike Neuron Degeneration (FSND) &amp; Eventual Collapse: A Unifying Paradigm for
        Understanding Age-Related Functional Decline
      </P>

      <H2 id="initial-projects">4. Initial Projects</H2>
      <P>(discussed in review paper)</P>
      <OL>
        <li>Atlas of Fast-Spike Neurons in the Human Nervous System</li>
        <li>Estimates of Functional Spike Rate Minimums Across Neural Subsystems</li>
        <li>Triage &amp; Preservation Strategies of Functional Spike Rate Minimums</li>
      </OL>

      <H2 id="subsequent-projects">5. Subsequent Projects</H2>
      <P>(discussed in review paper, likely carried out by for-commercial spinouts)</P>
      <UL>
        <li>General Cell Model of FSN Phenotype</li>
        <li>Systemic &amp; Molecular Diagnostics</li>
        <li>Mitochondrial Modification</li>
        <li>Pharmacological Modulation</li>
        <li>Gene Therapies</li>
      </UL>

      <H2 id="contact">Contact</H2>
      <H3>Robert H Lee — Director</H3>
      <P>
        <A href="https://www.linkedin.com/in/goldspruce">https://www.linkedin.com/in/goldspruce</A>
      </P>
      <P>
        <A href="mailto:rlee@codex.stanford.edu">rlee at codex.stanford.edu</A>
      </P>
      <P>
        Mostly on US Pacific Time (GMT −7/8). Sometimes on US Eastern Time (GMT −4/5) or China
        Standard Time (GMT +8).
      </P>
    </PageShell>
  )
}
