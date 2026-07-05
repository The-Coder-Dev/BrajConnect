import { requireAuth } from "@/lib/auth/guards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ShieldCheck, BriefcaseBusiness, LifeBuoy, CheckCircle2, History } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = {
  title: "Dashboard - BrajConnect",
};

export default async function DashboardPage() {
  const { user } = await requireAuth();

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome, {user.name}</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Manage your account and explore the BrajConnect ecosystem.
        </p>
      </div>

      {/* Quick Stats / Info Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl shadow-sm border-border/50 bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(user.createdAt).getFullYear()}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-border/50 bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Email Verification</CardTitle>
            <ShieldCheck className={user.emailVerified ? "h-4 w-4 text-blue-500" : "h-4 w-4 text-amber-500"} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.emailVerified ? "Verified" : "Pending"}</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {user.email}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-6 tracking-tight">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/profile" className="group h-full">
            <Card className="rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50 h-full">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Edit Profile</CardTitle>
                <CardDescription>Manage your personal details</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/register-business" className="group h-full">
            <Card className="rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-red-100/50 bg-red-50/30 h-full">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                  <BriefcaseBusiness className="h-5 w-5 text-red-600" />
                </div>
                <CardTitle className="text-lg text-red-900">Add Business</CardTitle>
                <CardDescription className="text-red-700/80">Register on the platform</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/support" className="group h-full">
            <Card className="rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50 h-full">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <LifeBuoy className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Support</CardTitle>
                <CardDescription>Get help and contact us</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold mb-6 tracking-tight">Recent Activity</h2>
        <EmptyState 
          icon={History}
          title="No recent activity"
          description="You haven't performed any significant account actions recently. Once you update your profile, it will appear here."
        />
      </div>
    </div>
  );
}
