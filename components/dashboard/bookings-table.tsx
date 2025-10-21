"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_id: string;
  service_name?: string;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  payment_status: string;
  total_amount: number;
}

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadBookings = async () => {
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

        // Get bookings with service information
        const { data: bookingsData, error } = await supabase
          .from("bookings")
          .select(
            `
            *,
            services:service_id (
              name
            )
          `
          )
          .eq("business_id", business.id)
          .order("scheduled_start", { ascending: false });

        if (error) {
          console.error("Error loading bookings:", error);
          return;
        }

        const formattedBookings: Booking[] =
          bookingsData?.map((booking: any) => ({
            id: booking.id,
            customer_name: booking.customer_name,
            customer_phone: booking.customer_phone,
            customer_email: booking.customer_email,
            service_id: booking.service_id,
            service_name: booking.services?.name,
            scheduled_start: booking.scheduled_start,
            scheduled_end: booking.scheduled_end,
            status: booking.status,
            payment_status: booking.payment_status,
            total_amount: booking.total_amount,
          })) || [];

        setBookings(formattedBookings);
      } catch (error) {
        console.error("Error loading bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setIsUpdating(bookingId);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) {
        throw error;
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      toast({
        title: "Success",
        description: `Booking ${newStatus} successfully!`,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB"),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No bookings found. Bookings will appear here when customers make
            appointments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {booking.customer_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.customer_phone}
                      </p>
                      {booking.customer_email && (
                        <p className="text-xs text-muted-foreground">
                          {booking.customer_email}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {booking.service_name || "Service"}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-foreground">
                        {formatDateTime(booking.scheduled_start).date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(booking.scheduled_start).time}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {booking.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "confirmed")
                            }
                            disabled={isUpdating === booking.id}
                          >
                            {isUpdating === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-secondary" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "cancelled")
                            }
                            disabled={isUpdating === booking.id}
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusUpdate(booking.id, "completed")
                          }
                          disabled={isUpdating === booking.id}
                        >
                          {isUpdating === booking.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-secondary" />
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
