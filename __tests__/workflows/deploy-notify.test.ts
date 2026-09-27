import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Guards the failure notification in .github/workflows/deploy.yml.
 *
 * WHY THIS TEST EXISTS
 * --------------------
 * The `notify-failure` job used to declare `needs: [deploy]` and fire only on
 * `needs.deploy.result == 'failure'`. But when the `build` job fails, `deploy`
 * does not fail -- it is SKIPPED, so its result is 'skipped' and that
 * condition is false.
 *
 * `build` is also the likelier of the two to fail: it runs the install, the
 * typecheck and `next build`, while `deploy` is essentially
 * `actions/deploy-pages`. So the one stage nobody was told about was the one
 * that actually breaks.
 *
 * Observed on 2026-09-27, run 36345293189 on `main`: production build failed,
 * `deploy` skipped, `notify-failure` skipped, no issue opened, live site
 * silently left on the previous commit -- while the commit carried a green
 * tick, because CI runs its own `next build` and reports separately.
 *
 * The assertion is deliberately DERIVED rather than hard-coded: it reads the
 * pipeline's job names out of the file and requires the notification to cover
 * every one of them. A third stage added later fails this test until it is
 * covered, which a test asserting the two names we happen to have today would
 * not do.
 *
 * Parsed with regexes rather than a YAML library on purpose -- this repo has
 * no YAML parser in its dependency tree, and adding one to read four lines is
 * a worse trade than a scoped parse of a file whose shape is fixed by GitHub.
 */
const WORKFLOW = join(process.cwd(), '.github', 'workflows', 'deploy.yml')

function readWorkflow(): string {
  return readFileSync(WORKFLOW, 'utf8')
}

/** Top-level job ids: two-space indented keys under `jobs:`. */
function jobNames(source: string): string[] {
  const jobsBlock = source.slice(source.indexOf('\njobs:'))
  return [...jobsBlock.matchAll(/^ {2}([a-z][a-z0-9-]*):$/gm)].map((match) => match[1])
}

/** The value of a key inside a named job, e.g. `needs` or `if`. */
function jobField(source: string, job: string, field: string): string {
  const start = source.indexOf(`\n  ${job}:\n`)
  expect(start).toBeGreaterThan(-1)

  const rest = source.slice(start + 1)
  const end = rest.search(/\n {2}[a-z][a-z0-9-]*:\n/)
  const block = end === -1 ? rest : rest.slice(0, end)

  const match = new RegExp(`^ {4}${field}:(.*)$`, 'm').exec(block)
  expect(match).not.toBeNull()
  return (match as RegExpExecArray)[1].trim()
}

describe('deploy.yml failure notification', () => {
  const source = readWorkflow()
  const jobs = jobNames(source)
  const pipeline = jobs.filter((job) => job !== 'notify-failure')

  it('has the pipeline this test thinks it has', () => {
    expect(jobs).toContain('notify-failure')
    expect(pipeline).toEqual(['build', 'deploy'])
  })

  it('depends on every pipeline job, not just the last one', () => {
    const needs = jobField(source, 'notify-failure', 'needs')

    for (const job of pipeline) {
      expect(needs).toContain(job)
    }
  })

  // The actual defect: a condition naming only the LAST job is false when an
  // earlier one fails, because the later job is skipped rather than failed.
  it('fires when any pipeline job fails, not only the last one', () => {
    const condition = jobField(source, 'notify-failure', 'if')

    for (const job of pipeline) {
      expect(condition).toContain(`needs.${job}.result == 'failure'`)
    }
  })

  // `always()` is what lets the job run at all once an upstream job has
  // failed. Without it the whole condition is unreachable and the
  // failure-result checks above are decorative.
  it('runs even though an upstream job failed', () => {
    expect(jobField(source, 'notify-failure', 'if')).toContain('always()')
  })

  // The skip-not-fail behaviour the whole thing turns on: `deploy` must be
  // gated on `build` for a build failure to skip it. If that dependency were
  // ever removed, `deploy` would run against a missing artifact instead.
  it('keeps deploy gated on build', () => {
    expect(jobField(source, 'deploy', 'needs')).toContain('build')
  })
})
