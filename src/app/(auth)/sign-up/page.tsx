import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthFooter } from "@/components/auth/auth-footer";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { AuthDivider } from "@/components/auth/auth-divider";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

import { requireGuest } from "@/lib/auth/guards";

export const metadata = {
  title: "Create an Account - BrajConnect",
  description: "Join BrajConnect and scale your business.",
};

export default async function SignUpPage() {
  await requireGuest();

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader 
          title="Create an account" 
          description="Get started with your free business account today" 
        />
        
        <SignUpForm />

        <AuthDivider />
        
        <SocialLoginButtons />
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline underline-offset-4">
            Back to Login
          </Link>
        </p>

        <AuthFooter />
      </AuthCard>
    </AuthLayout>
  );
}
