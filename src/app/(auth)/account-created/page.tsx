import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthButton } from "@/components/auth/auth-button";
import { Rocket } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Account Created - BrajConnect",
};

export default function AccountCreatedPage() {
  return (
    <AuthLayout>
      <AuthCard>
        
        <AuthHeader 
          title="Account Created" 
          description="Your business account has been successfully created. Welcome to the portal!" 
        />
        
        <div className="mt-8">
          <AuthButton type="button" render={<Link href="/dashboard" />} className="w-full">
            Go to Dashboard
          </AuthButton>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
