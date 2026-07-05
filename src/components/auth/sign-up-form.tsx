"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { AuthInput } from "./auth-input";
import { PasswordInput } from "./password-input";
import { AuthButton } from "./auth-button";
import { Mail, User } from "lucide-react";
import { toast } from "sonner";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth/sign-up";

export function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpInput) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (error) {
        toast.error(error.message || "Failed to create account. Please try again.");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/account-created");
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <AuthInput 
        label="Full Name"
        type="text"
        id="name"
        placeholder="John Doe"
        icon={User}
        disabled={isSubmitting}
        error={errors.name?.message}
        {...register("name")}
      />

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
      
      <PasswordInput 
        label="Password"
        id="password"
        placeholder="Create a strong password"
        disabled={isSubmitting}
        error={errors.password?.message}
        {...register("password")}
      />
      
      <AuthButton type="submit" className="mt-2" isLoading={isSubmitting}>
        Create account
      </AuthButton>
    </form>
  );
}
