/**
 * The PNG signature check shared by the two generators that write PNGs into
 * public/ -- generate-icons.mjs and generate-og-card.mjs.
 *
 * It lives in its own module rather than in either generator so neither has
 * to import the other: the card generator depending on the icon generator
 * would be a dependency that exists only because a helper happened to be
 * defined there first.
 */

/** The full 8-byte PNG signature: \x89 P N G \r \n \x1a \n. */
export const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

/**
 * True only for a buffer long enough to hold a signature that matches.
 *
 * ALL EIGHT BYTES, not the `PNG` in the middle of them. Three ASCII letters
 * occur by accident in plenty of binary data, so a three-byte check passes
 * for files that are not PNGs -- and the callers' whole job is to stop
 * something that is not a PNG being written into public/, where it would
 * next be noticed in a browser, months later.
 *
 * The trailing bytes are the point rather than padding: `\r\n` and `\x1a`
 * are in the signature precisely so that a transport which mangles line
 * endings, or truncates at a DOS end-of-file, corrupts the signature instead
 * of silently corrupting the image data.
 *
 * A SHORT BUFFER IS HANDLED, AND NOT BY AN EXPLICIT LENGTH CHECK. This first
 * read `bytes.length >= 8 && bytes.subarray(0, 8).equals(...)`, which looks
 * like the careful version and is dead code: `Buffer.subarray` clamps rather
 * than throwing, so a 3-byte buffer is compared as a 3-byte subarray and
 * `equals` is false because the lengths differ. Mutation testing caught it --
 * deleting the length guard changed no test result, which is the definition
 * of a check that cannot fail. It is gone rather than kept for reassurance,
 * because a condition that can never be false reads as protection while
 * providing none. The short-buffer cases stay in the test: they pin the
 * BEHAVIOUR, which is what callers depend on, however it is delivered.
 *
 * `Buffer.isBuffer` is not redundant in the same way -- a plain Uint8Array
 * has no `.equals`, so without it this throws rather than returning false.
 */
export function isPng(bytes) {
  return Buffer.isBuffer(bytes) && bytes.subarray(0, 8).equals(PNG_SIGNATURE)
}
