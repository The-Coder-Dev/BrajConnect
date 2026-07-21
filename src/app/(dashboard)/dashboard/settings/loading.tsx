export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-9 w-48 bg-muted rounded-lg" />
        <div className="h-5 w-64 bg-muted/60 rounded-lg" />
      </div>

      {/* Preferences card */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="p-6 space-y-2 border-b border-border/50">
          <div className="h-6 w-28 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted/60 rounded" />
        </div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-muted rounded-lg shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="h-8 w-20 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone card */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="p-6 space-y-2 border-b border-border/50">
          <div className="h-6 w-28 bg-red-100 rounded" />
          <div className="h-4 w-48 bg-muted/60 rounded" />
        </div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-muted rounded-lg shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-48 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="h-8 w-28 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
