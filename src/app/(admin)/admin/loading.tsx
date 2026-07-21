import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-24 rounded-3xl bg-muted/40 w-full" />

      {/* Grid Stat Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="rounded-2xl border border-border/40 p-6 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-3 w-36 rounded-lg" />
          </Card>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-2xl border border-border/40 p-6 space-y-4">
            <Skeleton className="h-6 w-40 rounded-lg" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="rounded-2xl border border-border/40 p-6 space-y-4">
            <Skeleton className="h-6 w-36 rounded-lg" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
