import React from 'react'

/**
 * Shared prose primitives for the lifted Neurospike content.
 *
 * The Footer-Only template ships no content-section system (it is a footer,
 * policy pages and analytics scaffolding), so these exist to give the migrated
 * Google Sites content a consistent typographic treatment without pulling in a
 * second design language. Styling deliberately mirrors the policy pages already
 * in `src/app/*-policy/page.tsx` so the whole site reads as one document.
 */

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="pt-[140px] pb-[54px]">
      <div className="py-[27px] w-[90%] md:w-[80%] mx-auto">
        <div className="aria-font">{children}</div>
      </div>
    </main>
  )
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-[34px] text-[#222] pb-[16px] leading-[1.15em] font-[600]">{children}</h1>
  )
}

export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="text-[17px] text-[#444] pb-[20px] leading-[28px] font-[500]">{children}</p>
}

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-[26px] leading-[32px] font-[700] text-[#333] mt-[36px] mb-[12px] scroll-mt-[120px]"
    >
      {children}
    </h2>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[20px] leading-[26px] font-[700] text-[#333] mt-[24px] mb-[10px]">
      {children}
    </h3>
  )
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] text-[#555] pb-[12px] leading-[26px] font-[500]">{children}</p>
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc pl-[24px] pb-[14px] text-[15px] text-[#555] leading-[26px] font-[500] space-y-[8px]">
      {children}
    </ul>
  )
}

export function OL({ children }: { children: React.ReactNode }) {
  return (
    <ol className="list-decimal pl-[24px] pb-[14px] text-[15px] text-[#555] leading-[26px] font-[500] space-y-[8px]">
      {children}
    </ol>
  )
}

/**
 * External link from lifted content.
 *
 * New-tab behaviour applies to http(s) destinations only. `mailto:` and `tel:`
 * hand off to a mail client or dialler rather than navigating, so opening a tab
 * for them leaves a blank window behind; `rel="noopener"` is likewise
 * meaningless for a non-browsing scheme.
 */
export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const opensInBrowser = /^https?:\/\//i.test(href)

  return (
    <a
      href={href}
      target={opensInBrowser ? '_blank' : undefined}
      rel={opensInBrowser ? 'noopener noreferrer' : undefined}
      className="text-[#1a4fd6] underline underline-offset-2 hover:text-[#12379b] break-words"
    >
      {children}
    </a>
  )
}
