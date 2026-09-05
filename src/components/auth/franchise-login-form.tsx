"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { AuthInput } from "./auth-input";
import { PasswordInput } from "./password-input";
import { AuthButton } from "./auth-button";
import { Mail, Briefcase } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signInSchema, type SignInInput } from "@/lib/validations/auth/sign-in";

export function FranchiseLoginForm() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: SignInInput) => {
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials. Please check your email and password.");
        return;
      }

      // Fetch authenticated session to inspect user role
      const session = await authClient.getSession();
      const role = (session?.data?.user as { role?: string })?.role;

      if (role === "franchise_partner") {
        toast.success("Welcome back to your Franchise Portal!");
        router.push("/franchise/dashboard");
      } else if (role === "admin") {
        toast.info("Logged in with Admin account. Redirecting to Admin Console...");
        router.push("/admin");
      } else {
        // Business owner or visitor
        toast.info("Logged in. Redirecting to Owner Dashboard...");
        router.push("/dashboard");
      }

      router.refresh();
    } catch (err: unknown) {
      console.error("Franchise login error:", err);
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <AuthInput
        label="Franchise Email Address"
        type="email"
        id="franchise-email"
        placeholder="partner@example.com"
        icon={Mail}
        disabled={isSubmitting}
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="space-y-2">
        <PasswordInput
          id="franchise-password"
          placeholder="••••••••"
          disabled={isSubmitting}
          error={errors.password?.message}
          {...register("password")}
          label={
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium">Password</span>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
          }
        />
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="remember-franchise"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        <Label htmlFor="remember-franchise" className="text-sm font-normal">
          Keep me signed in on this device
        </Label>
      </div>

      <AuthButton type="submit" className="mt-2 w-full" isLoading={isSubmitting}>
        <Briefcase className="h-4 w-4 mr-2" /> Sign In to Franchise Portal
      </AuthButton>
    </form>
  );
}
