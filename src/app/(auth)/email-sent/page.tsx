import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthButton } from "@/components/auth/auth-button";
import { Mailbox } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Email Sent - BrajConnect",
};

export default function EmailSentPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex justify-center sm:justify-start mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mailbox className="h-6 w-6" />
          </div>
        </div>
        <AuthHeader 
          title="Check your email" 
          description="We've sent a password reset link to your email. Click the link to reset your password." 
        />
        
        <div className="mt-8 space-y-4">
          <AuthButton type="button" className="w-full">
            Open email app
          </AuthButton>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Didn't receive the email?
            </p>
            <Button variant="outline" className="w-full">
              Click to resend
            </Button>
          </div>
          <div className="text-center mt-4">
            <Button variant="link" render={<Link href="/sign-in" />} className="text-muted-foreground hover:text-foreground">
              Return to Sign In
            </Button>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
