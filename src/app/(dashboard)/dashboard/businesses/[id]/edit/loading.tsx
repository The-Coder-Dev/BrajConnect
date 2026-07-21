export default function EditBusinessLoading() {
  return (
    <div className="space-y-8 py-4 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 p-5 border rounded-2xl border-border/40">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-muted rounded-lg" />
          <div className="h-4 w-80 bg-muted/60 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-muted rounded-xl" />
          <div className="h-10 w-28 bg-muted rounded-xl" />
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-muted rounded-lg" />
        ))}
      </div>
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-10 w-full bg-muted/60 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-28 w-full bg-muted/60 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-lg" />
      </div>
    </div>
  );
}