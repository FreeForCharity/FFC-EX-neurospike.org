import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

/**
 * A content image lifted from the source Google Site and localized into
 * `public/Images/content/`.
 *
 * Callers pass the FILE NAME only. The directory and `assetPath()` are applied
 * here, in the one place that knows about them, for two reasons:
 *
 *  - a reference site cannot get the directory or its case wrong, and there is
 *    no prefix to keep in sync across a dozen call sites;
 *  - `scripts/check-drift.mjs` requires every `/Images/...` reference to be
 *    wrapped in `assetPath()` so GitHub Pages subpath deploys keep working.
 *    Passing a full path as a prop put a bare `src="/Images/..."` at each call
 *    site, which the guard reads as unwrapped even though this component does
 *    wrap it. Building the path here makes the guard's rule true rather than
 *    something to be excepted.
 *
 * Intrinsic dimensions are the source image's own naturalWidth/naturalHeight,
 * read from the live page at capture time — they are required by next/image and
 * keep the layout from shifting as each image loads.
 */
export default function ContentImage({
  name,
  alt,
  width,
  height,
}: {
  /** File name within `public/Images/content`, e.g. `home-01.jpg`. */
  name: string
  alt: string
  width: number
  height: number
}) {
  return (
    <figure className="my-[22px]">
      <Image
        // Directory inlined inside assetPath() rather than held in a named
        // constant: scripts/check-drift.mjs accepts an "/Images/..." literal
        // only when assetPath( appears just before it, and a bare exported
        // constant reads to the guard as an unwrapped reference. Capital `I`
        // matches the repo's /Images and /Svgs directories — GitHub Pages is
        // case-sensitive, and a lowercase path 404s there while resolving fine
        // on a case-insensitive local filesystem.
        src={assetPath(`/Images/content/${name}`)}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full max-w-[860px] rounded-[4px] border border-[#e5e7eb]"
      />
    </figure>
  )
}
