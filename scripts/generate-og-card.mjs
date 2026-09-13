#!/usr/bin/env node
/**
 * Renders public/og-card.png -- the 1200x630 social card (issue #23).
 *
 * Run after changing name, tagline or shortDescription in site.config.ts:
 *
 *   pnpm run og:card
 *
 * WHY A COMMITTED PNG AND NOT `src/app/opengraph-image.tsx`
 * --------------------------------------------------------
 * Next's file convention is the obvious answer and it is wrong for this
 * deployment. Measured on a real `NEXT_PUBLIC_BASE_PATH` build before this
 * script existed:
 *
 *   <meta property="og:image"
 *         content="https://freeforcharity.github.io/opengraph-image?9c0da00d"/>
 *
 * The base path is missing. Next injects that URL from `metadataBase` without
 * consulting `basePath`, so on a project-path GitHub Pages deploy the card
 * 404s -- the same "the URL was composed by a path that does not know about
 * the prefix" failure that took every navigation link down in #17, arriving
 * from the other direction. The convention also writes the file with NO
 * extension (`out/opengraph-image`), which GitHub Pages does not serve as
 * image/png.
 *
 * A file in public/ referenced through assetPath() has neither problem: that
 * helper is the site's single answer to the base path and is already what
 * every other asset uses.
 *
 * The font is ImageResponse's bundled sans face -- deliberately no font file
 * and no network fetch, so this runs in CI and offline.
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { ImageResponse } from 'next/og.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = path.join(ROOT, 'public', 'og-card.png')

// Imported from the TypeScript source rather than duplicated: the card must
// say what the site says, and a second copy of the brand strings is exactly
// how the two drift apart.
const { siteConfig, cardDescription } = await import(
  path.join(ROOT, 'src', 'lib', 'site.config.ts')
)

export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630

const ACCENT = '#5eead4'
const BODY = '#c7cbe0'
const FOOTNOTE = '#9aa1c0'

const el = React.createElement

function card() {
  return el(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '72px 80px',
        backgroundColor: siteConfig.themeColor,
        color: '#ffffff',
      },
    },
    // A rule rather than a logo: the site ships no wordmark, and blowing the
    // 512px app icon up to card size is the artefact this card replaces.
    el('div', { style: { display: 'flex', width: 120, height: 10, backgroundColor: ACCENT } }),
    el(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      el('div', { style: { display: 'flex', fontSize: 84, lineHeight: 1.05 } }, siteConfig.name),
      el(
        'div',
        { style: { display: 'flex', fontSize: 38, marginTop: 18, color: ACCENT } },
        siteConfig.tagline
      ),
      el(
        'div',
        { style: { display: 'flex', fontSize: 28, marginTop: 26, lineHeight: 1.4, color: BODY } },
        cardDescription()
      )
    ),
    el(
      'div',
      { style: { display: 'flex', fontSize: 24, color: FOOTNOTE } },
      `Supported by ${siteConfig.supportedBy.name} · EIN ${siteConfig.ein}`
    )
  )
}

const response = new ImageResponse(card(), { width: CARD_WIDTH, height: CARD_HEIGHT })
const bytes = Buffer.from(await response.arrayBuffer())

if (bytes.subarray(1, 4).toString('latin1') !== 'PNG') {
  throw new Error('ImageResponse did not return a PNG')
}

await writeFile(OUTPUT, bytes)
console.log(
  `Wrote ${path.relative(ROOT, OUTPUT)} (${CARD_WIDTH}x${CARD_HEIGHT}, ${bytes.length} bytes)`
)
