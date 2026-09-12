import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

/**
 * A content image lifted from the source Google Site and localized into
 * `public/images/content/`.
 *
 * Uses `assetPath()` so the GitHub Pages basePath is applied (repo rule), and
 * `next/image` with the project's global `images.unoptimized` so the static
 * export serves the file verbatim.
 *
 * Intrinsic dimensions are the source image's own naturalWidth/naturalHeight,
 * read from the live page at capture time — they are required by next/image and
 * keep the layout from shifting as each image loads.
 */
export default function ContentImage({
  src,
  alt,
  width,
  height,
}: {
  /** Path under /images/content, e.g. `/images/content/home-01.jpg`. */
  src: string
  alt: string
  width: number
  height: number
}) {
  return (
    <figure className="my-[22px]">
      <Image
        src={assetPath(src)}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full max-w-[860px] rounded-[4px] border border-[#e5e7eb]"
      />
    </figure>
  )
}
