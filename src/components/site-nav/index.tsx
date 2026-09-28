import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'
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

/**
 * `external: true` renders a raw <a target="_blank" rel="noopener noreferrer">
 * instead of a next/link. It is deliberately kept with no entry using it yet.
 *
 * ONLY EVER USE IT WITH AN ABSOLUTE URL (https://...). A raw <a> is not
 * processed by Next, so a same-origin href like '/foo' bypasses `basePath`
 * and 404s on a project-path GitHub Pages deploy -- the same class of bug
 * described above, reached from the opposite direction: there, sitePath()
 * applied the prefix twice; here, nothing applies it at all. Both are
 * invisible in a local build, where the prefix is empty. A same-origin
 * destination belongs in the non-external branch, which is what next/link is
 * for. Raised by Copilot on #40.
 *
 * It arrived in #39 carrying a "The Latest From NeuroSpike" item pointed at
 * https://sites.google.com/view/neurospike/ -- the Google Site this repo was
 * migrated OFF. That target was removed rather than shipped: the migration's
 * measured result was zero sites.google.com and zero googleusercontent
 * references in the deployed pages, and a nav link is the single most
 * prominent place to undo that. It would also send visitors from the new site
 * back to the old one, where content diverges the moment either is edited.
 *
 * THE REQUEST BEHIND IT WAS RIGHT, AND IS NOW SERVED. @goldspruce asked twice
 * for "a prominent link ... that says something like 'The Latest From
 * NeuroSpike'". Removing his entry answered the destination objection and
 * left the need unmet for a fortnight. `/updates` is that destination, on a
 * site we control, so the nav item below is a plain internal link and needs
 * no `external` treatment at all.
 *
 * The MECHANISM is still kept, still unused, for a genuine off-site
 * destination later -- a real Substack, say. Do not re-point it at the
 * Google Site.
 */
const links: { label: string; href: string; external?: boolean }[] = [
  { label: 'Neurospike', href: '/' },
  { label: 'Org & Leadership', href: '/org-leadership' },
  { label: 'Other Research: CNAGI', href: '/other-research-cnagi' },
  { label: 'Media & About', href: '/media-about' },
  { label: 'Substacky', href: '/substacky' },
  { label: 'The Latest', href: '/updates' },
]

export default function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 left-0 right-0 z-50 text-white"
      style={{ backgroundColor: NAV_BG }}
    >
      <div className="w-[94%] xl:w-[88%] mx-auto flex flex-wrap items-center gap-x-[24px] gap-y-[2px] py-[12px]">
        {/*
          The brand mark, contributed by @goldspruce in #39. It arrived as an
          orphan file -- committed to public/Images/ and referenced by nothing
          -- so until this wiring it was work the charity did that the site
          never showed. It is decorative here: the site name sits beside it as
          real text, so alt="" keeps a screen reader from announcing the same
          link twice.

          assetPath() is required for /Images/... references (see
          ContentImage.tsx and the guard in scripts/check-drift.mjs). The href
          stays BARE -- next/link applies basePath itself; see the warning at
          the top of this file.
        */}
        <Link
          href="/"
          className="flex items-center gap-[10px] text-[15px] font-[600] text-white no-underline mr-auto whitespace-nowrap"
        >
          <Image
            src={assetPath('/Images/neurospike-logo.png')}
            alt=""
            width={30}
            height={30}
            className="h-[30px] w-[30px]"
            priority
          />
          {siteConfig.name}
        </Link>
        {links.map((l) => {
          // One string for both branches. It was duplicated, and the two
          // copies would have drifted the first time anyone restyled the nav
          // while no entry used the external branch -- which is every day so
          // far, since the branch is deliberately unused. Raised by Copilot
          // on #40.
          const linkClass =
            'text-[13.5px] font-[500] text-white/90 hover:text-white no-underline whitespace-nowrap'

          return l.external ? (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {l.label}
            </a>
          ) : (
            <Link key={l.href} href={l.href} className={linkClass}>
              {l.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
