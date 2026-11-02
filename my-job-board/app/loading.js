export default function Loading() {
  return <section className="container-wide py-16" role="status" aria-live="polite"><p className="eyebrow">A MOMENT FOR YOUR NEXT MOVE</p><h1 className="text-3xl font-medium mt-4 mb-8">Getting things ready…</h1><div className="grid gap-4" aria-hidden="true">{[1, 2, 3].map(item => <div key={item} className="h-28 rounded-xl border border-border bg-white animate-pulse" />)}</div><span className="sr-only">Loading page</span></section>;
}
