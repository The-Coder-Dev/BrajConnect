"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { AuthInput } from "./auth-input";
import { PasswordInput } from "./password-input";
import { AuthButton } from "./auth-button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signInSchema, type SignInInput } from "@/lib/validations/auth/sign-in";

export function SignInForm() {
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
        toast.error(error.message || "Failed to sign in. Please check your credentials.");
        return;
      }

      toast.success("Signed in successfully!");
      const session = await authClient.getSession();
      if ((session?.data?.user as { role?: string })?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
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
      
      <div className="space-y-2">
        <PasswordInput 
          id="password"
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
              id="remember" 
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        <Label htmlFor="remember" className="text-sm font-normal">
          Remember me for 30 days
        </Label>
      </div>
      
      <AuthButton type="submit" className="mt-2" isLoading={isSubmitting}>
        Sign In
      </AuthButton>
    </form>
  );
}
