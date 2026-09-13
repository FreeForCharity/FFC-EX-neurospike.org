import { siteConfig, siteUrl } from '@/lib/site.config'
import { assetPath } from '@/lib/assetPath'

/**
 * schema.org `NGO` JSON-LD for this charity, derived entirely from
 * src/lib/site.config.ts.
 *
 * Every value here already exists in config and is already published on the
 * site in human-readable form; nothing is invented and nothing new has to be
 * maintained. The point is to make the same facts machine-readable, so a
 * search engine or a charity aggregator can connect this site to the verified
 * nonprofit records rather than treating them as unrelated pages:
 *
 *  - `taxID` / `nonprofitStatus` are what donor-advised-fund tools and charity
 *    databases read to confirm 501(c)(3) status.
 *  - `sameAs` is the link that ties this domain to the GuideStar and Candid
 *    profiles. Without it those profiles and this site are, to a crawler,
 *    three unrelated things about an organization with a similar name.
 *
 * `NGO` rather than `ResearchOrganization`: both are defensible for an FRO,
 * and `NGO` is the type whose properties (`taxID`, `nonprofitStatus`) carry
 * the 501(c)(3) facts. If the charity would rather assert the research
 * identity, `ResearchOrganization` is a one-word change here -- see #24.
 *
 * OMITTED ON PURPOSE: `foundingDate` is not in config and is not published
 * anywhere on the site, so asserting one would be inventing a fact about the
 * organization. Add it to SiteConfig first if it should appear.
 */
export function organizationSchema(): Record<string, unknown> {
  const sameAs = [siteConfig.guidestar.profileUrl, siteConfig.guidestar.directProfileUrl]
    .concat(siteConfig.social.map((link) => link.href))
    .map((url) => url.trim())
    .filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: siteConfig.name,
    url: siteUrl('/'),
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    // Absolute: consumers of JSON-LD do not resolve relative URLs against the
    // page the way a browser does.
    logo: `${siteConfig.url}${assetPath('/web-app-manifest-512x512.png')}`,
    taxID: siteConfig.ein,
    nonprofitStatus: 'Nonprofit501c3',
    ...(sameAs.length ? { sameAs } : {}),
  }
}
