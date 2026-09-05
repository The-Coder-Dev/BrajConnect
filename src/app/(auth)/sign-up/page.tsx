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
  title: "Create an Account - BachatLal",
  description: "Join BachatLal and scale your business.",
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
        
        <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-xs text-amber-900 dark:text-amber-200">
            Looking for franchise opportunities?{" "}
            <Link href="/register/franchise" className="font-bold text-amber-700 dark:text-amber-400 hover:underline">
              Join as a Franchise Partner &rarr;
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
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
