import type { Metadata } from 'next'
import React from 'react'
import { siteUrl } from '@/lib/site.config'
import { PageShell, PageTitle, H2, H3, P, UL, A, Lede } from '@/components/content'
import ContentImage from '@/components/content/ContentImage'

export const metadata: Metadata = {
  title: 'Other Research: CNAGI',
  description:
    'Mechanistic Empathy: Decoding by Contrasting Layers (DoLa) as a Functional Analogue to Inhibitory Control in Theory of Mind.',
  alternates: { canonical: siteUrl('/other-research-cnagi') },
}

export default function OtherResearchCnagi() {
  return (
    <PageShell>
      <PageTitle>Other Research: CNAGI</PageTitle>
      <Lede>CNAGI &amp; AI Theory of Mind</Lede>

      <ContentImage
        name="cnagi-01.jpg"
        alt="CNAGI and AI Theory of Mind overview"
        width={402}
        height={642}
      />

      <H2 id="sally-anne">Sally-Anne &ldquo;false belief&rdquo; test</H2>
      <P>Simon Baron-Cohen — Borat&apos;s brother.</P>
      <P>
        &ldquo;Sally has a basket. Anne has a box. Sally has a marble. She puts the marble into her
        basket. Sally goes out for a walk. Anne takes the marble out of the basket and puts it into
        the box. Now Sally comes back. She wants to play with her marble. Where will Sally look for
        the marble?&rdquo; — Human children cannot pass this test until the age of four.
      </P>
      <P>
        &ldquo;Theory of mind refers to the capacity to understand other individuals by ascribing
        mental states to them. A theory of mind includes the understanding that others&apos;
        beliefs, desires, intentions, emotions, and thoughts may be different from one&apos;s
        own.&rdquo; — Wikipedia
      </P>

      <H2 id="mechanistic-empathy">
        Mechanistic Empathy: Decoding by Contrasting Layers (DoLa) as a Functional Analogue to
        Inhibitory Control in Theory of Mind
      </H2>

      <H3>Abstract</H3>
      <P>
        <A href="https://github.com/goldspruce/DoLa">https://github.com/goldspruce/DoLa</A>
      </P>
      <P>
        Large Language Models (LLMs) frequently struggle with hallucination. This phenomenon occurs
        when a model prioritizes high-probability statistical associations over factual truth or
        specific context. Recent advancements in interpretability, specifically Decoding by
        Contrasting Layers (DoLa), have mitigated this issue by subtracting the logits of early
        transformer layers from those of later layers (Chuang et al., 2024). This paper proposes
        that DoLa is not merely a noise-reduction technique. Instead, it functions as an analogue to
        the cognitive mechanism of inhibitory control required for Theory of Mind (ToM) in human
        psychology.
      </P>
      <P>
        In cognitive science, successful ToM performance requires the inhibition of the egocentric
        or reality-centric perspective to allow the representation of another&apos;s mental state to
        emerge. We argue that the early layers of an LLM function as the reflexive cognitive
        substrate. These layers encode strong statistical priors that mirror a reality bias, such as
        the most common association with an object. The later layers, conversely, encode
        context-dependent reasoning but remain polluted by these initial reflexes. By mathematically
        subtracting the early-layer logits, DoLa effectively decouples the raw statistical reflexes
        of the model from its higher-order reasoning.
      </P>
      <P>
        This subtraction operation mirrors the decoupling mechanism in the human brain, where the
        inhibition of the default mode allows for the simulation of alternative perspectives. We
        demonstrate that applying contrastive decoding to ToM tasks in LLMs significantly improves
        performance on False Belief benchmarks. These findings suggest that hallucination in AI and
        egocentric bias in humans may share a common structural etiology, which is the failure to
        inhibit lower-order associations. These findings offer a novel framework for Mechanistic
        Theory of Mind and posit that empathy in artificial systems may be an emergent property of
        subtractive processing rather than additive complexity.
      </P>
      <P>
        <em>
          Keywords: Large Language Models, Theory of Mind, DoLa, Inhibitory Control, Mechanistic
          Interpretability, False Belief Task.
        </em>
      </P>

      <H3>References</H3>
      <UL>
        <li>
          Chuang, Y.-S., Dang, Y., Wang, N., &amp; Glass, J. (2024). DoLa: Decoding by contrasting
          layers improves factuality in large language models. arXiv.{' '}
          <A href="https://arxiv.org/abs/2309.03883">https://arxiv.org/abs/2309.03883</A>
        </li>
        <li>
          Li, X. L., &amp; Liang, P. (2023). Contrastive decoding: Open-ended text generation as
          optimization. arXiv.{' '}
          <A href="https://arxiv.org/abs/2210.15097">https://arxiv.org/abs/2210.15097</A>
        </li>
        <li>
          Prelec, D., Seung, H. S., &amp; McCoy, J. (2017). A solution to the single-question crowd
          wisdom problem. Nature, 541(7638), 532–535.{' '}
          <A href="https://doi.org/10.1038/nature21054">https://doi.org/10.1038/nature21054</A>
        </li>
      </UL>

      <H2 id="sample-code">Sample code</H2>
      <P>LLM Theory of Mind Subtraction Test — see more here.</P>
      <ContentImage
        name="cnagi-02.png"
        alt="LLM Theory of Mind subtraction test — sample code"
        width={1260}
        height={1118}
      />
      <P>
        <strong>Why Harrisburg Wins:</strong> Even though Philadelphia got more votes (65%), it
        performed worse than expected (85%). Harrisburg received fewer votes (35%), but it performed
        better than expected (10%). The &ldquo;Surprise&rdquo; signal reveals the hidden expert
        knowledge.
      </P>

      <H2 id="transformer-analogy">2. The Transformer Analogy (DoLa / Contrastive Decoding)</H2>
      <P>
        Recent research (such as DoLa and Contrastive Decoding) applies this exact logic to Large
        Language Models (LLMs) to detect hallucinations.
      </P>
      <P>In this analogy, the Layers of the Transformer act as the &ldquo;Population.&rdquo;</P>
      <UL>
        <li>
          <strong>The &ldquo;Crowd&rdquo; = Early Layers (e.g., Layer 2 of 32).</strong> The early
          layers function like the uninformed majority. They rely on &ldquo;n-gram
          probability&rdquo; and superficial associations. When they see &ldquo;Capital of
          Pennsylvania,&rdquo; they reflexively activate &ldquo;Philadelphia&rdquo; because those
          words appear together frequently in the training data. Analogy: This is the
          &ldquo;Predicted Vote&rdquo; (The Baseline/Prior).
        </li>
        <li>
          <strong>The &ldquo;Expert&rdquo; = Late Layers (e.g., Layer 32 of 32).</strong> The late
          layers function like the informed minority. They have processed the full context and logic
          of the sentence. They activate &ldquo;Harrisburg&rdquo; because they have done the
          reasoning. However, they are still &ldquo;polluted&rdquo; by the signals from the early
          layers. Analogy: This is the &ldquo;Actual Vote&rdquo; (The Mixture).
        </li>
      </UL>

      <H3>The &ldquo;SP&rdquo; Calculation in AI</H3>
      <P>
        To find the truth, DoLa performs a mathematical operation equivalent to Prelec&apos;s
        algorithm:
      </P>
      <ContentImage
        name="cnagi-03.png"
        alt="The SP calculation expressed as a formula"
        width={826}
        height={114}
      />
      <ContentImage
        name="cnagi-04.png"
        alt="Worked SP calculation and results table"
        width={1280}
        height={895}
      />
      <P>
        <strong>Conclusion:</strong> Just as Prelec subtracts the &ldquo;Crowd&apos;s
        Expectation&rdquo; to find the Expert Truth, DoLa techniques subtract the &ldquo;Early
        Layer&apos;s Reflex&rdquo; to find the Model&apos;s Reasoning. Both methods work by
        filtering out the &ldquo;obvious&rdquo; (but often wrong) statistical noise.
      </P>
      <P>
        Here is the analogy mapping the Prelec SP Algorithm and Transformer Layers directly to the
        Sally-Anne Test from psychology.
      </P>
      <P>
        This analogy works perfectly because the core challenge in all three scenarios is{' '}
        <strong>Inhibitory Control</strong>: the ability to suppress a strong, obvious signal
        (Access to Reality Factual Bias) to reveal a subtle, correct signal (Truth/Belief).
      </P>

      <H2 id="scenario">The Scenario: The Sally-Anne Test</H2>
      <UL>
        <li>Sally puts a marble in the Basket and leaves.</li>
        <li>Anne moves the marble to the Box.</li>
        <li>Sally returns.</li>
        <li>Question: Where will Sally look?</li>
        <li>
          The &ldquo;Child&rdquo; Answer (Access to Reality Factual Bias): &ldquo;The Box&rdquo;
          (Because that is where it actually is).
        </li>
        <li>
          The &ldquo;Adult&rdquo; Answer (Theory of Mind): &ldquo;The Basket&rdquo; (Because that is
          where she thinks it is).
        </li>
      </UL>

      <H2 id="grand-analogy">The Grand Analogy: Calculating the &ldquo;Mental State&rdquo;</H2>
      <P>
        In this framework, the Surprisingly Popular (SP) algorithm acts as the cognitive mechanism
        that allows an AI (or a human) to pass the test.
      </P>

      <H3>1. The &ldquo;Naive&rdquo; Layer = The Child (Reality Bias)</H3>
      <UL>
        <li>
          <strong>In Psychology:</strong> The child sees the marble in the Box. This signal is
          overwhelming. They cannot &ldquo;un-know&rdquo; reality.
        </li>
        <li>
          <strong>In AI (Early Layers):</strong> The model sees the token &ldquo;Box&rdquo;
          associated with the marble&apos;s position in the text. The statistical correlation
          &ldquo;Marble → Box&rdquo; is extremely high.
        </li>
        <li>
          <strong>In Prelec (The Crowd):</strong> The majority sees &ldquo;Big City →
          Philadelphia.&rdquo; It is the obvious, surface-level answer.
        </li>
      </UL>

      <H3>2. The &ldquo;Expert&rdquo; Layer = The Confused Adult (Mixed State)</H3>
      <UL>
        <li>
          <strong>In Psychology:</strong> An adult knows the marble is in the Box, but also
          simulates Sally&apos;s mind (Basket). The adult holds both representations.
        </li>
        <li>
          <strong>In AI (Late Layers):</strong> The model still knows the &ldquo;Box&rdquo;
          association (it hasn&apos;t forgotten the text), but it has computed the
          &ldquo;Basket&rdquo; logic. The probabilities are split (e.g., 60% Basket, 40% Box).
        </li>
        <li>
          <strong>In Prelec (The Expert):</strong> The expert knows Harrisburg, but also knows
          everyone else will pick Philadelphia.
        </li>
      </UL>

      <H3>3. The &ldquo;Subtraction&rdquo; (SP) = Inhibitory Control</H3>
      <P>
        This is the magic step. The algorithm subtracts the Naive signal from the Expert signal.
      </P>
      <UL>
        <li>
          <strong>The &ldquo;Box&rdquo; Signal cancels out:</strong> Since both the Child and the
          Adult know the marble is in the Box, subtracting them removes the &ldquo;Access to Reality
          Factual Bias.&rdquo;
        </li>
        <li>
          <strong>The &ldquo;Basket&rdquo; Signal remains:</strong> Only the Adult knows
          (&ldquo;understands&rdquo;) the reality about the Basket. Therefore, the
          &ldquo;Basket&rdquo; becomes the Surprisingly Popular answer.
        </li>
      </UL>

      <ContentImage
        name="cnagi-05.png"
        alt="Inhibitory control subtraction, expressed as a formula"
        width={838}
        height={89}
      />
      <ContentImage
        name="cnagi-06.png"
        alt="Prelec SP algorithm mapped to transformer layers"
        width={1280}
        height={1231}
      />
      <ContentImage
        name="cnagi-07.png"
        alt="The grand analogy: Sally-Anne, Prelec and DoLa side by side"
        width={1280}
        height={1310}
      />

      <P>
        Mostly on US Pacific Time (GMT −7/8). Sometimes on US Eastern Time (GMT −4/5) or China
        Standard Time (GMT +8).
      </P>
    </PageShell>
  )
}
