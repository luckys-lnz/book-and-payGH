"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface RevenueData {
  name: string;
  revenue: number;
  date: string;
}

export function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
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

      // Get payments for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: payments, error } = await supabase
        .from("payments")
        .select("amount, created_at")
        .eq("business_id", business.id)
        .eq("status", "completed")
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading revenue data:", error);
        return;
      }

      // Group payments by day
      const revenueByDay: { [key: string]: number } = {};
      
      // Initialize all 7 days with 0 revenue
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        revenueByDay[dateKey] = 0;
      }

      // Add actual revenue data
      payments?.forEach((payment) => {
        const date = new Date(payment.created_at).toISOString().split('T')[0];
        if (revenueByDay[date] !== undefined) {
          revenueByDay[date] += payment.amount;
        }
      });

      // Convert to chart data format
      const chartData: RevenueData[] = Object.entries(revenueByDay).map(([date, revenue]) => {
        const day = new Date(date);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
          name: dayNames[day.getDay()],
          revenue: Math.round(revenue * 100) / 100, // Round to 2 decimal places
          date: date,
        };
      });

      setData(chartData);
    } catch (error) {
      console.error("Error loading revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Revenue</CardTitle>
          <CardDescription>Your earnings for the past 7 days</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Revenue</CardTitle>
        <CardDescription>Your earnings for the past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₵${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`GH₵ ${value}`, 'Revenue']}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `${payload[0].payload.date} (${label})`;
                }
                return label;
              }}
            />
            <Bar 
              dataKey="revenue" 
              fill="hsl(var(--primary))" 
              radius={[8, 8, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
