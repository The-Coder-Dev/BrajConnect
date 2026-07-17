import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, BookOpen, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = {
  title: "Support - BrajConnect",
};

export default async function SupportPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Support</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Need help? We&apos;re here for you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl shadow-sm border-border/50 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader>
            <div className="bg-blue-50 w-fit p-3 rounded-lg mb-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Browse our guides and FAQs to find answers quickly.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full rounded-lg">View Documentation</Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-border/50 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader>
            <div className="bg-blue-50 w-fit p-3 rounded-lg mb-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Can&apos;t find what you&apos;re looking for? Send us a message.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full rounded-lg">Contact Us</Button>
          </CardContent>
        </Card>
      </div>

      <div className="pt-6">
        <h2 className="text-xl font-bold mb-4 tracking-tight">Frequently Asked Questions</h2>
        <EmptyState 
          icon={LifeBuoy}
          title="FAQ coming soon"
          description="We are compiling a list of frequently asked questions to help you navigate the platform better."
        />
      </div>
    </div>
  );
}
