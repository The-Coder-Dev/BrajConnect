import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

import { requireGuest } from "@/lib/auth/guards";

export const metadata = {
  title: "Forgot Password - BrajConnect",
};

export default async function ForgotPasswordPage() {
  await requireGuest();

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader 
          title="Reset your password" 
          description="Enter your email and we'll send you a link to reset your password" 
        />
        
        <ForgotPasswordForm />

        <div className="mt-8 text-center">
          <Button variant="ghost" render={<Link href="/sign-in" />} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to log in
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
