import { BusinessSetupAssistant } from "@/features/business-onboarding/components/assistant";
import { requireAuth } from "@/lib/auth/guards";

export const metadata = {
  title: "Setup Business - BrajConnect",
};

export default async function BusinessSetupPage() {
  // Protect this route, requires authentication
  await requireAuth();

  return <BusinessSetupAssistant />;
}
