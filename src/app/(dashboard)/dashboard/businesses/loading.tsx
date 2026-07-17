export default function BusinessesLoading() {
  return (
    <div className="space-y-8 py-4 animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted rounded-lg" />
          <div className="h-5 w-72 bg-muted/60 rounded-lg" />
        </div>
        <div className="h-10 w-44 bg-muted rounded-xl" />
      </div>

      {/* Business cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="h-32 bg-muted" />
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-5 w-40 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-muted/60 rounded" />
              <div className="h-3 w-2/3 bg-muted/60 rounded" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-20 bg-muted rounded-full" />
                <div className="h-8 w-24 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
