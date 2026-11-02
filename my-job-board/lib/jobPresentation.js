// Compute time-sensitive display metadata when preparing database results.
export function presentJob(document) {
  const job = JSON.parse(JSON.stringify(document));
  return { ...job, closed: Boolean(job.deadline && new Date(job.deadline).getTime() <= Date.now()) };
}
