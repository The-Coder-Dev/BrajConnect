"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "./password-input";
import { AuthButton } from "./auth-button";
import { toast } from "sonner";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth/reset-password";

export function ResetPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: values.password,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password. Please try again.");
        return;
      }

      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <PasswordInput 
        label="New Password"
        id="password"
        placeholder="••••••••"
        disabled={isSubmitting}
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordInput 
        label="Confirm Password"
        id="confirmPassword"
        placeholder="••••••••"
        disabled={isSubmitting}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      
      <AuthButton type="submit" className="mt-2" isLoading={isSubmitting}>
        Reset password
      </AuthButton>
    </form>
  );
}
