"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, TrendingUp, Users, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeServices: number;
  totalCustomers: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    activeServices: 0,
    totalCustomers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Get business
        const { data: business } = await supabase
          .from("businesses")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!business) return;

        // Get bookings count
        const { count: bookingsCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("business_id", business.id);

        // Get total revenue from payments
        const { data: payments } = await supabase
          .from("payments")
          .select("amount")
          .eq("status", "completed")
          .eq("business_id", business.id);

        // Get services count from services table
        const { count: servicesCount } = await supabase
          .from("services")
          .select("*", { count: "exact", head: true })
          .eq("business_id", business.id)
          .eq("available", true);

        // Get unique customers count
        const { data: customers } = await supabase
          .from("bookings")
          .select("customer_name")
          .eq("business_id", business.id);

        const uniqueCustomers = new Set(
          customers?.map((c: any) => c.customer_name) || []
        ).size;

        const totalRevenue =
          payments?.reduce(
            (sum: number, payment: any) => sum + payment.amount,
            0
          ) || 0;

        setStats({
          totalBookings: bookingsCount || 0,
          totalRevenue,
          activeServices: servicesCount || 0,
          totalCustomers: uniqueCustomers,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsData = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      change: "All time",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Revenue",
      value: `GH₵ ${stats.totalRevenue.toLocaleString()}`,
      change: "Total earned",
      icon: CreditCard,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Active Services",
      value: stats.activeServices.toString(),
      change: "Available now",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      change: "Unique customers",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  stat.bgColor
                )}
              >
                <Icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
