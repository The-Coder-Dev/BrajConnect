import { requireAuth } from "@/lib/auth/guards";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata = {
  title: "My Profile - BrajConnect",
};

export default async function ProfilePage() {
  const { user } = await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and how others see you.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
