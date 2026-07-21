export default function SupportLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-10 w-28 bg-muted rounded-lg" />
        <div className="h-5 w-48 bg-muted/60 rounded-lg" />
      </div>

      {/* Two support cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <div className="h-12 w-12 bg-muted rounded-lg" />
            <div className="space-y-2">
              <div className="h-5 w-36 bg-muted rounded" />
              <div className="h-4 w-full bg-muted/60 rounded" />
              <div className="h-4 w-3/4 bg-muted/60 rounded" />
            </div>
            <div className="h-10 w-full bg-muted rounded-lg" />
          </div>
        ))}
      </div>

      {/* FAQ section */}
      <div className="pt-6 space-y-4">
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="rounded-2xl border border-border/50 bg-card p-8 flex flex-col items-center gap-3">
          <div className="h-12 w-12 bg-muted rounded-full" />
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-4 w-80 bg-muted/60 rounded" />
        </div>
      </div>
    </div>
  );
}
