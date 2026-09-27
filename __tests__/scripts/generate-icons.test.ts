import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * The generator is an ESM script, so these run it through node the way
 * generate-og-card.test.ts does rather than importing it into jest's
 * transform pipeline.
 */
function evaluate(expression: string): unknown {
  const script = join(process.cwd(), 'scripts', 'generate-icons.mjs')
  const result = spawnSync(
    'node',
    [
      '--input-type=module',
      '-e',
      `const m = await import(${JSON.stringify(script)});\nprocess.stdout.write(JSON.stringify(${expression}))`,
    ],
    { cwd: process.cwd(), encoding: 'utf8' }
  )

  if (result.status !== 0) {
    throw new Error(`node exited ${result.status}: ${result.stderr}`)
  }
  return JSON.parse(result.stdout)
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

describe('icon generator', () => {
  // Importing the module must not render or write anything: every test here
  // would otherwise overwrite the committed icons on each run.
  it('does not render when imported', () => {
    const targets = evaluate('m.ICON_TARGETS') as { file: string; size: number }[]

    expect(targets.map((t) => t.file)).toEqual([
      'icon.png',
      'apple-icon.png',
      'android-chrome-192x192.png',
      'android-chrome-512x512.png',
      'web-app-manifest-512x512.png',
    ])
  })

  // iOS does not honour alpha in a touch icon -- it composites onto black.
  // Every other target renders transparency correctly, and an opaque white
  // square behind a 512px manifest icon would be visible on Android.
  it('gives the Apple touch icon an opaque background and nothing else', () => {
    const targets = evaluate('m.ICON_TARGETS') as { file: string; background: string | null }[]
    const opaque = targets.filter((t) => t.background !== null)

    expect(opaque).toHaveLength(1)
    expect(opaque[0].file).toBe('apple-icon.png')
  })

  it('packs the favicon largest-first, so a 16px-only reader still gets an entry', () => {
    expect(evaluate('m.FAVICON_SIZES')).toEqual([48, 32, 16])
  })
})

describe('buildIco', () => {
  // The offsets are the part of an ICO that is easy to get wrong and
  // impossible to notice: a browser handed a bad offset renders no favicon
  // and reports nothing. So this reconstructs the container and checks that
  // each declared offset/length actually lands on the payload it claims.
  it('writes a header, one directory entry per image, and correct offsets', () => {
    const ico = Buffer.from(
      evaluate(
        "m.buildIco([{size:48,bytes:Buffer.alloc(30,1)},{size:16,bytes:Buffer.alloc(10,2)}]).toString('base64')"
      ) as string,
      'base64'
    )

    expect(ico.readUInt16LE(0)).toBe(0) // reserved
    expect(ico.readUInt16LE(2)).toBe(1) // type 1 = icon
    expect(ico.readUInt16LE(4)).toBe(2) // two images

    // header (6) + 2 entries (32) + payloads (30 + 10)
    expect(ico.length).toBe(6 + 32 + 40)

    expect(ico.readUInt8(6)).toBe(48) // first entry width
    expect(ico.readUInt32LE(6 + 8)).toBe(30) // first entry byte length
    expect(ico.readUInt32LE(6 + 12)).toBe(38) // first entry offset
    expect(ico.readUInt8(22)).toBe(16) // second entry width
    expect(ico.readUInt32LE(22 + 8)).toBe(10)
    expect(ico.readUInt32LE(22 + 12)).toBe(68) // 38 + 30

    // The payloads are where the offsets say they are, not merely present.
    expect(ico.subarray(38, 68).every((byte) => byte === 1)).toBe(true)
    expect(ico.subarray(68, 78).every((byte) => byte === 2)).toBe(true)
  })

  // A 256px image is written as 0 in the single-byte width/height fields.
  it('encodes 256 as 0 in the single-byte dimension fields', () => {
    const ico = Buffer.from(
      evaluate("m.buildIco([{size:256,bytes:Buffer.alloc(4,9)}]).toString('base64')") as string,
      'base64'
    )

    expect(ico.readUInt8(6)).toBe(0)
    expect(ico.readUInt8(7)).toBe(0)
  })

  // THE CASE THE OLD CODE GOT BACKWARDS. It wrote `size % 256` under a
  // comment claiming the modulo prevented a corrupt entry.
  // `Buffer.writeUInt8` already throws above 255 -- the modulo REMOVED that
  // protection, and 512 would have been silently written as 0, which an ICO
  // reader reads as 256. The comment was defending the line that caused the
  // corruption it warned about.
  //
  // The message is asserted, not just the throw: a RangeError from Buffer
  // satisfies `toThrow()` too while saying nothing about which size was wrong.
  it.each([512, 0, -1, 1.5])('refuses %p rather than truncating it to a byte', (size) => {
    expect(() =>
      evaluate(`m.buildIco([{size:${JSON.stringify(size)},bytes:Buffer.alloc(4,9)}])`)
    ).toThrow(/not a valid icon size/)
  })

  it('refuses to write an empty icon', () => {
    expect(() => evaluate('m.buildIco([])')).toThrow()
  })
})

describe('the icons actually committed to public/', () => {
  // These assert on the FILES, because the point of the generator is the
  // files: until it ran, every one of them was a cropped Free For Charity
  // wordmark, and src/lib/organizationSchema.ts published the 512px one as
  // NeuroSpike's `logo` in JSON-LD on every page. No existing check looks at
  // what an icon depicts, so that shipped green.
  const publicDir = join(process.cwd(), 'public')

  it.each([
    ['icon.png', 32],
    ['apple-icon.png', 180],
    ['android-chrome-192x192.png', 192],
    ['android-chrome-512x512.png', 512],
    ['web-app-manifest-512x512.png', 512],
  ])('%s is a PNG of exactly %ipx square', (file, size) => {
    const bytes = readFileSync(join(publicDir, file))

    expect(bytes.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true)
    // IHDR width/height are big-endian uint32s at byte 16 and 20.
    expect(bytes.readUInt32BE(16)).toBe(size)
    expect(bytes.readUInt32BE(20)).toBe(size)
  })

  it('favicon.ico is a well-formed container whose entries account for the file', () => {
    const ico = readFileSync(join(publicDir, 'favicon.ico'))

    expect(ico.readUInt16LE(0)).toBe(0)
    expect(ico.readUInt16LE(2)).toBe(1)

    const count = ico.readUInt16LE(4)
    expect(count).toBe(3)

    let accounted = 6 + count * 16
    for (let index = 0; index < count; index += 1) {
      const entry = 6 + index * 16
      const declared = ico.readUInt8(entry) || 256
      const length = ico.readUInt32LE(entry + 8)
      const offset = ico.readUInt32LE(entry + 12)
      const payload = ico.subarray(offset, offset + length)

      expect(payload.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true)
      // The embedded PNG really is the size the directory advertises.
      expect(payload.readUInt32BE(16)).toBe(declared)
      accounted += length
    }

    expect(accounted).toBe(ico.length)
  })
})
