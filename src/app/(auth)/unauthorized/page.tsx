import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthButton } from "@/components/auth/auth-button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Unauthorized Access - BrajConnect",
};

export default function UnauthorizedPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex justify-center sm:justify-start mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
        <AuthHeader 
          title="Access Denied" 
          description="You do not have permission to access this resource. Please contact your administrator if you believe this is an error." 
        />
        
        <div className="mt-8">
          <AuthButton type="button" render={<Link href="/dashboard" />} className="w-full">
            Return to Dashboard
          </AuthButton>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
