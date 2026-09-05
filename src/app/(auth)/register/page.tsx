import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthFooter } from "@/components/auth/auth-footer";
import Link from "next/link";
import { requireGuest } from "@/lib/auth/guards";
import { Building2, Compass, Briefcase, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Join BachatLal - Choose Account Type",
  description: "Select how you would like to join the BachatLal community.",
};

const accountTypes = [
  {
    id: "visitor",
    title: "Visitor",
    description: "Browse businesses, explore local offers, and discover public community content.",
    href: "/sign-up",
    icon: Compass,
    badge: "Public Access",
    accent: "border-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20 hover:border-blue-500",
    iconColor: "text-blue-600 bg-blue-100 dark:bg-blue-900/50",
    buttonText: "Join as Visitor",
  },
  {
    id: "business_owner",
    title: "Business Owner",
    description: "Register and list your business, attract verified local customers, and scale.",
    href: "/sign-up",
    icon: Building2,
    badge: "List & Grow",
    accent: "border-primary/20 bg-primary/5 hover:border-primary",
    iconColor: "text-primary bg-primary/10",
    buttonText: "Register Business",
  },
  {
    id: "franchise_partner",
    title: "Franchise Partner",
    description: "Find and apply for available franchise opportunities with established regional brands.",
    href: "/register/franchise",
    icon: Briefcase,
    badge: "Franchise Hub",
    accent: "border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 hover:border-amber-500 shadow-sm hover:shadow-md",
    iconColor: "text-amber-600 bg-amber-100 dark:bg-amber-900/50",
    buttonText: "Apply as Franchise Partner",
    highlight: true,
  },
];

export default async function RegisterPage() {
  await requireGuest();

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl mx-auto">
        <AuthCard>
          <AuthHeader
            title="Join BachatLal"
            description="Choose how you want to get started with our platform"
          />

          <div className="grid gap-4 mt-6">
            {accountTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  key={type.id}
                  href={type.href}
                  className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${type.accent}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-xl shrink-0 ${type.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                          {type.title}
                        </h3>
                        {type.highlight && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center gap-1 text-xs font-semibold text-primary shrink-0 self-end sm:self-center">
                    <span>{type.buttonText}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign In
            </Link>{" "}
            or{" "}
            <Link
              href="/login/franchise"
              className="font-medium text-amber-600 hover:underline underline-offset-4"
            >
              Franchise Partner Login
            </Link>
          </p>

          <AuthFooter />
        </AuthCard>
      </div>
    </AuthLayout>
  );
}
