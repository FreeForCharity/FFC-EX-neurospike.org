#!/usr/bin/env node
/**
 * Renders the app icons and favicon from the NeuroSpike brand mark.
 *
 *   pnpm run icons
 *
 * WHY THIS EXISTS
 * ---------------
 * Until this script ran, every icon in public/ was the one the Footer-Only
 * template ships -- a *cropped* Free For Charity wordmark. `icon.png` reads
 * "FRE / FOR / CHA." and `web-app-manifest-512x512.png` reads "FREI / FOR /
 * CHA". So NeuroSpike's browser tab, its iOS home-screen icon and its
 * installed-PWA icon all carried a truncated version of a *different*
 * organization's name.
 *
 * That last file is the expensive one. `src/lib/organizationSchema.ts` uses
 * it as the NGO's `logo`:
 *
 *     logo: `${siteConfig.url}${assetPath('/web-app-manifest-512x512.png')}`
 *
 * which is emitted as JSON-LD on every page. A crawler reading that record
 * was being told, in machine-readable form, that NeuroSpike Corporation's
 * logo is a picture of the letters "FREI FOR CHA" -- a false statement about
 * the organization in exactly the record that charity aggregators and search
 * engines read. Nothing was broken, every file resolved 200, and no check
 * looks at what an icon depicts, so this was invisible to CI in both
 * directions.
 *
 * WHERE THE SOURCE CAME FROM
 * --------------------------
 * public/Images/neurospike-logo.png, contributed by @goldspruce in #39 (as a
 * JPEG with the transparency checkerboard baked into the pixels; see #40 for
 * how the alpha channel was recovered). It is the charity's own artwork --
 * a circular badge, an action-potential trace drawn as an ocean wave.
 *
 * WHY ImageResponse AND NOT sharp
 * -------------------------------
 * `next/og` is already a dependency (scripts/generate-og-card.mjs uses it),
 * so this adds no package for a job that runs a handful of times a year.
 * satori accepts a `data:` URI for <img>, and resvg rasterizes it.
 *
 * Note `next/og.js`, with the extension: `next` ships no `exports` map, so
 * the bare specifier throws ERR_MODULE_NOT_FOUND from an ESM script.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { ImageResponse } from 'next/og.js'
import { isPng } from './png-signature.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const SOURCE = path.join(PUBLIC_DIR, 'Images', 'neurospike-logo.png')

const el = React.createElement

/**
 * The sizes the site actually references, and where each one is read from.
 *
 * `background` is null for a transparent icon and a colour string for one
 * that must be opaque. Only Apple needs the latter: iOS does not honour
 * alpha in a touch icon and composites whatever is behind it, which is black
 * -- so a transparent apple-icon.png ships a navy badge floating on a black
 * square. Every other target renders alpha correctly.
 */
export const ICON_TARGETS = [
  // src/lib/siteMetadata.ts -> icons.icon
  { file: 'icon.png', size: 32, background: null },
  // src/lib/siteMetadata.ts -> icons.apple
  { file: 'apple-icon.png', size: 180, background: '#ffffff' },
  // src/app/manifest.ts -> icons[]
  { file: 'android-chrome-192x192.png', size: 192, background: null },
  { file: 'android-chrome-512x512.png', size: 512, background: null },
  // src/lib/organizationSchema.ts -> logo  (the JSON-LD claim above)
  { file: 'web-app-manifest-512x512.png', size: 512, background: null },
]

/** The sizes packed into favicon.ico, largest first. */
export const FAVICON_SIZES = [48, 32, 16]

export function iconElement(dataUri, size, background) {
  return el(
    'div',
    {
      style: {
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        ...(background ? { backgroundColor: background } : {}),
      },
    },
    el('img', { src: dataUri, width: size, height: size })
  )
}

/**
 * Packs PNGs into an .ico container.
 *
 * ICO has carried PNG payloads verbatim since Vista, and every browser this
 * site targets reads them, so there is no BMP encoding step here. The header
 * is 6 bytes, then one 16-byte directory entry per image, then the payloads.
 *
 * A 256px image is written as 0 in the width/height bytes -- those fields are
 * a single byte each, so 256 does not fit. Nothing here reaches 256, but the
 * modulo is kept because omitting it is how this function would silently
 * write a corrupt entry if a larger size were ever added to FAVICON_SIZES.
 */
export function buildIco(pngs) {
  if (pngs.length === 0) throw new Error('buildIco: no images')

  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: 1 = icon
  header.writeUInt16LE(pngs.length, 4)

  const directory = Buffer.alloc(16 * pngs.length)
  let offset = header.length + directory.length

  pngs.forEach(({ size, bytes }, index) => {
    const entry = index * 16
    directory.writeUInt8(size % 256, entry + 0) // width  (0 means 256)
    directory.writeUInt8(size % 256, entry + 1) // height
    directory.writeUInt8(0, entry + 2) // palette size: 0 = truecolour
    directory.writeUInt8(0, entry + 3) // reserved
    directory.writeUInt16LE(1, entry + 4) // colour planes
    directory.writeUInt16LE(32, entry + 6) // bits per pixel
    directory.writeUInt32LE(bytes.length, entry + 8)
    directory.writeUInt32LE(offset, entry + 12)
    offset += bytes.length
  })

  return Buffer.concat([header, directory, ...pngs.map((png) => png.bytes)])
}

async function renderPng(dataUri, size, background) {
  const response = new ImageResponse(iconElement(dataUri, size, background), {
    width: size,
    height: size,
  })
  const bytes = Buffer.from(await response.arrayBuffer())

  // ImageResponse returning something that is not a PNG would otherwise be
  // written straight to public/ and only surface in a browser, months later.
  if (!isPng(bytes)) {
    throw new Error(`ImageResponse did not return a PNG for ${size}x${size}`)
  }

  return bytes
}

// Guarded so the exports above can be imported by a test without rendering.
if (import.meta.url === `file://${process.argv[1]}`) {
  const source = await readFile(SOURCE)
  const dataUri = `data:image/png;base64,${source.toString('base64')}`

  for (const { file, size, background } of ICON_TARGETS) {
    const bytes = await renderPng(dataUri, size, background)
    await writeFile(path.join(PUBLIC_DIR, file), bytes)
    console.log(`Wrote public/${file} (${size}x${size}, ${bytes.length} bytes)`)
  }

  const frames = []
  for (const size of FAVICON_SIZES) {
    frames.push({ size, bytes: await renderPng(dataUri, size, null) })
  }
  const ico = buildIco(frames)
  await writeFile(path.join(PUBLIC_DIR, 'favicon.ico'), ico)
  console.log(`Wrote public/favicon.ico (${FAVICON_SIZES.join('/')}, ${ico.length} bytes)`)
}
