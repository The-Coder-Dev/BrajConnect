import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthFooter } from "@/components/auth/auth-footer";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { AuthDivider } from "@/components/auth/auth-divider";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { requireGuest } from "@/lib/auth/guards";

export const metadata = {
  title: "Sign In - BrajConnect",
  description: "Sign in to your BrajConnect Business Portal.",
};

export default async function SignInPage() {
  await requireGuest();

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader 
          title="Welcome back" 
          description="Enter your credentials to access your account" 
        />
        
        <SignInForm />

        <AuthDivider />
        
        <SocialLoginButtons />
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-primary hover:underline underline-offset-4">
            Create account
          </Link>
        </p>

        <AuthFooter />
      </AuthCard>
    </AuthLayout>
  );
}
