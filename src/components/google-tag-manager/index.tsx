'use client'

import Script from 'next/script'

// Google Tag Manager ID.
//
// Deliberately EMPTY until a Neurospike container is provisioned (FFC workflow
// 704 / the 5xx Google lane). The template ships Free For Charity's own
// container here, and leaving it in place would send this charity's visitor
// analytics to FFC's property -- which is why `rebrand-check` calls it out.
// An empty id disables both tags below rather than emitting a snippet that
// requests `gtm.js?id=` and fails in the browser.
//
// Do NOT name the template's container id in this comment: rebrand-check greps
// the file for that literal, so quoting it here re-triggers the very warning
// this change clears.
export const GTM_ID: string = ''

/**
 * Both components take an optional `gtmId` that defaults to GTM_ID above.
 * The prop exists so the test suite can exercise BOTH branches — configured and
 * unconfigured — on any fork. Without it, a charity awaiting its container (the
 * state every new site starts in) can only ever test the null branch, so the
 * markup these components emit once a container IS provisioned would ship
 * unverified. Production code passes nothing and gets the module constant.
 */
type GoogleTagManagerProps = { gtmId?: string }

export default function GoogleTagManager({ gtmId = GTM_ID }: GoogleTagManagerProps = {}) {
  // Trim first: a whitespace-only id is unconfigured, not configured. Without
  // this it passes the truthiness check and the snippet requests
  // `gtm.js?id=%20%20`, which fails in the browser exactly like an empty id.
  const id = gtmId.trim()
  if (!id) return null
  return (
    <>
      {/* Google Tag Manager Script - loaded with lazyOnload for better performance */}
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${id}');
          `,
        }}
      />
    </>
  )
}

// Export a component for the noscript iframe that goes in the body
export function GoogleTagManagerNoScript({ gtmId = GTM_ID }: GoogleTagManagerProps = {}) {
  const id = gtmId.trim()
  if (!id) return null
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
