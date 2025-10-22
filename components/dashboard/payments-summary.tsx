"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Clock, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface PaymentSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingAmount: number;
  pendingCount: number;
}

export function PaymentsSummary() {
  const [summary, setSummary] = useState<PaymentSummary>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingAmount: 0,
    pendingCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPaymentSummary();
  }, []);

  const loadPaymentSummary = async () => {
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

      // Get total revenue (all time)
      const { data: totalPayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("business_id", business.id)
        .eq("status", "completed");

      // Get monthly revenue (current month)
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const { data: monthlyPayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("business_id", business.id)
        .eq("status", "completed")
        .gte("created_at", currentMonth.toISOString());

      // Get pending payments
      const { data: pendingPayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("business_id", business.id)
        .eq("status", "pending");

      const totalRevenue =
        totalPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const monthlyRevenue =
        monthlyPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const pendingAmount =
        pendingPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const pendingCount = pendingPayments?.length || 0;

      setSummary({
        totalRevenue,
        monthlyRevenue,
        pendingAmount,
        pendingCount,
      });
    } catch (error) {
      console.error("Error loading payment summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const summaryData = [
    {
      title: "Total Revenue",
      value: `GH₵ ${summary.totalRevenue.toLocaleString()}`,
      change: "All time",
      icon: DollarSign,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "This Month",
      value: `GH₵ ${summary.monthlyRevenue.toLocaleString()}`,
      change: "Current month",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending",
      value: `GH₵ ${summary.pendingAmount.toLocaleString()}`,
      change: `${summary.pendingCount} payments`,
      icon: Clock,
      color: "text-foreground",
      bgColor: "bg-muted",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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
    <div className="grid gap-4 md:grid-cols-3">
      {summaryData.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  item.bgColor
                )}
              >
                <Icon className={cn("h-5 w-5", item.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {item.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.change}
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
