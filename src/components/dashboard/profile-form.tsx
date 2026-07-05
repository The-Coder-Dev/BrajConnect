"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phoneNumber: "",
      bio: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || "BC";
  };

  const onSubmit = async (values: ProfileInput) => {
    try {
      // For now, Better Auth handles name out of the box natively
      const { data, error } = await authClient.updateUser({
        name: values.name,
        // Optional custom fields can be implemented via fetch to custom API later
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Avatar Section */}
      <Card className="rounded-xl shadow-sm border-border/50 md:col-span-4 h-fit">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your avatar</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 pb-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="text-3xl bg-blue-50 text-blue-600 font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" className="w-full rounded-lg">
            <Upload className="mr-2 h-4 w-4" />
            Upload new picture
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Max file size: 2MB. Allowed formats: JPG, PNG.
          </p>
        </CardContent>
      </Card>

      {/* Details Section */}
      <Card className="rounded-xl shadow-sm border-border/50 md:col-span-8">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="rounded-lg"
                  disabled={isSubmitting}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  disabled={true}
                  className="bg-muted/50 cursor-not-allowed rounded-lg"
                  {...register("email")}
                />
                <p className="text-xs text-muted-foreground">Email addresses cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 000-0000"
                  className="rounded-lg"
                  disabled={isSubmitting}
                  {...register("phoneNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="United States"
                  className="rounded-lg"
                  disabled={isSubmitting}
                  {...register("country")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  className="rounded-lg"
                  disabled={isSubmitting}
                  {...register("city")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  className="rounded-lg"
                  disabled={isSubmitting}
                  {...register("state")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little bit about yourself..."
                className="resize-none rounded-lg"
                rows={4}
                disabled={isSubmitting}
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500 font-medium">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="rounded-lg px-8">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
