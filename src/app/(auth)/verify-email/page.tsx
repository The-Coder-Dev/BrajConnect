import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthButton } from "@/components/auth/auth-button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Verify your email - BrajConnect",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex justify-center sm:justify-start mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
        <AuthHeader 
          title="Verify your email" 
          description="We've sent a verification link to your email address. Please click the link to verify your account." 
        />
        
        <div className="mt-8">
          <AuthButton type="button" render={<Link href="/sign-in" />} className="w-full">
            Return to Sign In
          </AuthButton>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
