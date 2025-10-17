import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BusinessForm } from "@/components/dashboard/business-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BusinessPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Business Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business information and settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BusinessForm />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Make the most of your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-1">Add a logo</h4>
                <p className="text-muted-foreground">
                  A professional logo builds trust with customers
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Complete your description
                </h4>
                <p className="text-muted-foreground">
                  Tell customers what makes your business special
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Keep contact info updated
                </h4>
                <p className="text-muted-foreground">
                  Make it easy for customers to reach you
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
