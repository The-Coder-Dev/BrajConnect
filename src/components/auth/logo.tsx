import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Building2 className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-none tracking-tight">BrajConnect</span>
        <span className="text-xs text-muted-foreground font-medium">Business Portal</span>
      </div>
    </Link>
  );
}
