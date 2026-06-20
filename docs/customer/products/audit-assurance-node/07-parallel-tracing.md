# Audit Assurance Node Parallel Tracing

## Purpose

Parallel tracing helps customers prove that concurrent audit execution behaved
as expected and that host results were not dropped, duplicated, or reordered in
a way that affects evidence handling.

## What Is Traced

For each run, the pipeline logs:

- `RunId` for the whole execution.
- Worker identifier for each parallel slot.
- Target host and transport.
- Queueing and dispatch events.
- Adapter entry, start, completion, and exit events.
- Start time, end time, and duration.
- Exit code, success state, and error details.
- Result acceptance or rejection after contract validation.
- Final deterministic host ordering before reporting and bundle handling.

## Confirming Parallel Execution

Parallel execution is confirmed by overlapping execution windows for different
hosts. If Host A starts before Host B finishes and Host B starts before Host A
finishes, the run contains true concurrency.

If configured parallelism is `1`, execution is intentionally sequential and
parallel overlap checks should be skipped.

## Detecting Dropped Or Duplicated Results

Parallel tracing should compare the inventory count with queueing, dispatch,
completion, and final result counts. A mismatch can indicate a lost host,
failed worker handoff, or result aggregation issue.

Final result grouping by hostname helps identify duplicate records before
evidence and reports are treated as authoritative.

## Deterministic Ordering

Parallel workers may complete in different orders on each run. Before final
reporting and bundle generation, results are sorted by stable fields such as
target host, script path, and transport. This keeps report output predictable
even when execution is concurrent.

## Customer Controls

Before increasing parallelism:

- Confirm target owners have approved concurrent audit load.
- Confirm network paths, credentials, and target services can handle the
  planned concurrency.
- Confirm maintenance windows allow the total execution profile.
- Start with low parallelism and increase only after reviewing logs.
- Monitor failed adapters, timeouts, and target resource pressure.

## Troubleshooting Parallel Runs

When a host fails in a parallel run:

1. Filter logs by `RunId`.
2. Find the host queueing event.
3. Identify the assigned worker.
4. Follow that worker through adapter entry, execution, and completion.
5. Check whether the adapter failed or the result was rejected by contract
   validation.
6. Compare final sorted result order with the expected host list.

## Related Guidance

- [Logging and observability](logging-observability.md)
- [Operational limits](operational-limits.md)
- [Runtime validation](runtime-validation.md)
