export default function DashboardLoading() {
  return (
    <div className="space-y-10 py-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-muted rounded-lg" />
          <div className="h-5 w-96 bg-muted/60 rounded-lg" />
        </div>
        <div className="h-10 w-44 bg-muted rounded-xl" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
            </div>
            <div className="h-8 w-12 bg-muted rounded-lg" />
            <div className="h-3 w-28 bg-muted/60 rounded" />
          </div>
        ))}
      </div>

      {/* Main area skeleton */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-40 bg-muted rounded" />
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <div className="h-40 bg-muted" />
            <div className="p-6 space-y-3">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="h-4 w-full bg-muted/60 rounded" />
              <div className="h-4 w-2/3 bg-muted/60 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-36 bg-muted rounded" />
          <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
