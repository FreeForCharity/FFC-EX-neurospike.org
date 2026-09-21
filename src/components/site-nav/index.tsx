import React from 'react'
import Link from 'next/link'
import { siteConfig } from '@/lib/site.config'

/**
 * Top navigation, mirroring the source Google Sites nav one-for-one.
 *
 * Source styling (captured 2026-09-11): a full-width dark red bar, white text,
 * the site name pinned left and the five page links to its right. Order and
 * labels below are the source order and the source labels -- do not "tidy" them.
 *
 * The Footer-Only template ships an unused `components/header` built around
 * single-page anchor scrolling (`/#hero`, `/#team`). The migrated site has five
 * real routes, so anchor-spy navigation is the wrong shape; this is a plain
 * server-rendered nav with no client JS.
 *
 * HREFS ARE BARE ROUTE PATHS -- do NOT wrap them in sitePath().
 *
 * next/link applies `basePath` itself. Wrapping the href in sitePath() applies
 * it a SECOND time, and on a GitHub Pages project deploy every link in this nav
 * then points at `/<repo>/<repo>/...` and 404s. That shipped: the site was live
 * with all five nav links broken while 348 unit tests, 43 E2E tests, Lighthouse
 * and the link checker were green, because all of them run a build with no
 * base path, where sitePath() is the identity function and the bug is
 * invisible. scripts/check-drift.mjs now fails on the pattern statically.
 *
 * The rule: next/link and next/router take BARE paths; sitePath() is only for
 * hrefs Next does not process -- a raw <a> to a static file in public/, for
 * example (see the security.txt link in the vulnerability disclosure policy).
 */

const NAV_BG = '#a3201c'

const links = [
  { label: 'Neurospike', href: '/' },
  { label: 'Org & Leadership', href: '/org-leadership' },
  { label: 'Other Research: CNAGI', href: '/other-research-cnagi' },
  { label: 'Media & About', href: '/media-about' },
  { label: 'Substacky', href: '/substacky' },
]

export default function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 left-0 right-0 z-50 text-white"
      style={{ backgroundColor: NAV_BG }}
    >
      <div className="w-[94%] xl:w-[88%] mx-auto flex flex-wrap items-center gap-x-[24px] gap-y-[2px] py-[12px]">
        <Link
          href="/"
          className="text-[15px] font-[600] text-white no-underline mr-auto whitespace-nowrap"
        >
          {siteConfig.name}
        </Link>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-[13.5px] font-[500] text-white/90 hover:text-white no-underline whitespace-nowrap"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
