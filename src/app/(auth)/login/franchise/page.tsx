import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthFooter } from "@/components/auth/auth-footer";
import Link from "next/link";
import { FranchiseLoginForm } from "@/components/auth/franchise-login-form";
import { requireGuest } from "@/lib/auth/guards";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const metadata = {
  title: "Franchise Partner Login - BachatLal",
  description: "Sign in to explore franchise opportunities and manage your applications.",
};

export default async function FranchiseLoginPage() {
  await requireGuest();

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Franchise Partner Login"
          description="Sign in to explore franchise opportunities and manage your applications."
        />

        <FranchiseLoginForm />

        <div className="mt-8 pt-6 border-t border-border/40 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have a franchise account yet?
          </p>
          <Button
            variant="outline"
            className="w-full h-10 rounded-xl font-semibold border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            render={<Link href="/register/franchise" />}
          >
            <UserPlus className="h-4 w-4 mr-2" /> Create Franchise Account
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Are you a business owner?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline underline-offset-4">
            Owner Sign In
          </Link>
        </p>

        <AuthFooter />
      </AuthCard>
    </AuthLayout>
  );
}
