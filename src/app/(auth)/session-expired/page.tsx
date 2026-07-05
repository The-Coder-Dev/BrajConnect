import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthButton } from "@/components/auth/auth-button";
import { Clock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Session Expired - BrajConnect",
};

export default function SessionExpiredPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex justify-center sm:justify-start mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock className="h-6 w-6" />
          </div>
        </div>
        <AuthHeader 
          title="Session Expired" 
          description="Your session has expired due to inactivity. Please sign in again to continue." 
        />
        
        <div className="mt-8">
          <AuthButton type="button" render={<Link href="/sign-in" />} className="w-full">
            Sign In Again
          </AuthButton>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
