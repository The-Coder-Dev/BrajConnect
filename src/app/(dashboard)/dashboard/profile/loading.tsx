export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-9 w-36 bg-muted rounded-lg" />
        <div className="h-5 w-72 bg-muted/60 rounded-lg" />
      </div>

      {/* Profile Form Skeleton */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
        {/* Avatar + Name row */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="h-4 w-56 bg-muted/60 rounded" />
          </div>
        </div>

        {/* Form fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-10 w-full bg-muted/60 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="h-10 w-28 bg-muted rounded-lg" />
      </div>

      {/* Password section */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-10 w-full bg-muted/60 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-10 w-full bg-muted/60 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-muted rounded-lg" />
      </div>
    </div>
  );
}
