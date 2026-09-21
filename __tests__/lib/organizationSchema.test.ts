import { organizationSchema } from '../../src/lib/organizationSchema'
import { siteConfig, siteUrl } from '../../src/lib/site.config'

describe('organization JSON-LD', () => {
  // IDENTITY fields are asserted against siteConfig rather than repeated as
  // literals, so a rebrand cannot make this suite red for a correct site.
  // Schema constants -- `@context`, `@type`, `nonprofitStatus` -- are asserted
  // as literals on purpose: they are not config-derived, and pinning them is
  // the point (a silent change to `nonprofitStatus` would misstate the
  // organization's tax status to every consumer of the markup).
  it('derives identity from siteConfig', () => {
    const schema = organizationSchema()

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema.name).toBe(siteConfig.name)
    expect(schema.url).toBe(siteUrl('/'))
    expect(schema.description).toBe(siteConfig.description)
    expect(schema.email).toBe(siteConfig.contactEmail)
    expect(schema.taxID).toBe(siteConfig.ein)
  })

  // The whole point of the block: without sameAs, a crawler has no reason to
  // connect this domain to the verified nonprofit records.
  it('links the verified nonprofit profiles via sameAs', () => {
    const sameAs = organizationSchema().sameAs as string[]

    expect(sameAs).toContain(siteConfig.guidestar.profileUrl)
    expect(sameAs).toContain(siteConfig.guidestar.directProfileUrl)
  })

  // An empty href is the documented "disabled" state for a social link, and an
  // empty string in sameAs is invalid structured data.
  it('omits disabled social links rather than emitting empty strings', () => {
    const sameAs = (organizationSchema().sameAs as string[]) ?? []

    expect(sameAs).not.toContain('')
    for (const url of sameAs) expect(url.trim()).toBe(url)
    for (const { href } of siteConfig.social) {
      if (href.trim()) expect(sameAs).toContain(href.trim())
    }
  })

  it('states 501(c)(3) status and an absolute logo URL', () => {
    const schema = organizationSchema()

    expect(schema.nonprofitStatus).toBe('Nonprofit501c3')
    expect(String(schema.logo).startsWith(siteConfig.url)).toBe(true)
  })

  // foundingDate is not in SiteConfig and is published nowhere on the site, so
  // emitting one would assert a fact about the organization that nobody has
  // supplied. See issue #24.
  it('does not invent facts that are absent from config', () => {
    const schema = organizationSchema()

    expect(schema).not.toHaveProperty('foundingDate')
    expect(schema).not.toHaveProperty('address')
    expect(JSON.stringify(schema)).not.toMatch(/PENDING|TODO|example\.com/i)
  })

  it('serialises to valid JSON with no script-closing sequence', () => {
    const raw = JSON.stringify(organizationSchema()).replace(/</g, '\\u003c')

    expect(() => JSON.parse(raw)).not.toThrow()
    expect(raw).not.toContain('</')
    expect(JSON.parse(raw).name).toBe(siteConfig.name)
  })
})
