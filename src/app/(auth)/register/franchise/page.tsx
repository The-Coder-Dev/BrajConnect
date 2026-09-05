import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthFooter } from "@/components/auth/auth-footer";
import Link from "next/link";
import { FranchiseSignUpForm } from "@/components/auth/franchise-sign-up-form";
import { requireGuest } from "@/lib/auth/guards";

export const metadata = {
  title: "Franchise Partner Registration - BachatLal",
  description: "Join BachatLal as a Franchise Partner and discover high-growth business opportunities.",
};

export default async function FranchiseRegisterPage() {
  await requireGuest();

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl mx-auto">
        <AuthCard>
          <AuthHeader
            title="Join BachatLal as a Franchise Partner"
            description="Find the right franchise opportunity and grow your business with BachatLal."
          />

          <FranchiseSignUpForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already registered as a Franchise Partner?{" "}
            <Link
              href="/login/franchise"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign In to Franchise Portal
            </Link>
          </p>

          <AuthFooter />
        </AuthCard>
      </div>
    </AuthLayout>
  );
}
