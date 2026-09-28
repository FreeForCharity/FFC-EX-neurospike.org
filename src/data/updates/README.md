# Posting an update

Everything on **The Latest From NeuroSpike** (`/updates/`) comes from this
folder. You do not need to touch any page code.

## 1. Add a file here

Name it `YYYY-MM-DD-short-slug.json`. The filename is for humans — the `date`
**inside** the file is what the page sorts and groups by.

```json
{
  "date": "2026-11-04",
  "title": "First science advisor joins",
  "body": "Dr. Example has joined as our Translational Science Lead, covering assay design and bench strategy for Phase 0.",
  "linkUrl": "https://example.org/announcement",
  "linkLabel": "Read the announcement"
}
```

| field       | required | notes                                                    |
| ----------- | -------- | -------------------------------------------------------- |
| `date`      | yes      | `YYYY-MM-DD`. Anything else fails the test suite.        |
| `title`     | yes      | One line. Rendered as the entry heading.                 |
| `body`      | yes      | A short paragraph. Plain text — **no HTML or Markdown**. |
| `linkUrl`   | no       | Must be `https://` (or an internal path starting `/`).   |
| `linkLabel` | no       | Required **with** `linkUrl` — see below.                 |

## 2. Register it in `src/data/updates.ts`

Two lines: an `import`, and an entry in the `updates` array. The file says
where.

That step exists because this site is a **static export** — there is no
server at runtime to list a directory, so every entry has to be imported at
build time.

## Things the checks will stop you doing

These are enforced by `__tests__/data/updates.test.ts`, so a mistake fails CI
rather than reaching the site:

- **A date that isn't `YYYY-MM-DD`,** or one that isn't a real calendar date
  (`2026-02-30` is caught).
- **A `linkUrl` with no `linkLabel`, or the reverse.** An unlabelled link is
  unusable with a screen reader or a keyboard, so the page renders nothing at
  all rather than a bare URL — the test makes that a build failure instead of
  a silent omission.
- **An empty `title` or `body`.**
- **A file in this folder that nothing imports.** Easy to do, and the entry
  would simply never appear; the test compares the folder against the array.

## If you post nothing

The page handles it: with no entries it shows a short note pointing at
Substacky and Media & About, rather than an empty page that reads as broken.
