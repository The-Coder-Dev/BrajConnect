import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

import { requireGuest } from "@/lib/auth/guards";

export const metadata = {
  title: "Set new password - BrajConnect",
};

export default async function ResetPasswordPage() {
  await requireGuest();

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader 
          title="Set new password" 
          description="Your new password must be different to previously used passwords" 
        />
        
        <ResetPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
}
