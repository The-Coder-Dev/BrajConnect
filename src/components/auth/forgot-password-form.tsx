"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { AuthInput } from "./auth-input";
import { AuthButton } from "./auth-button";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth/forgot-password";

export function ForgotPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    try {
      type AuthClientExt = typeof authClient & {
        forgetPassword: (data: { email: string; redirectTo?: string }) => Promise<{ data: unknown; error: { message?: string } | null }>;
      };
      
      const client = authClient as AuthClientExt;
      const { data, error } = await client.forgetPassword({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error(error.message || "Failed to send reset link. Please try again.");
        return;
      }

      toast.success("Reset link sent!");
      router.push("/email-sent");
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <AuthInput 
        label="Email Address"
        type="email"
        id="email"
        placeholder="you@company.com"
        icon={Mail}
        disabled={isSubmitting}
        error={errors.email?.message}
        {...register("email")}
      />
      
      <AuthButton type="submit" className="mt-2" isLoading={isSubmitting}>
        Send reset link
      </AuthButton>
    </form>
  );
}
