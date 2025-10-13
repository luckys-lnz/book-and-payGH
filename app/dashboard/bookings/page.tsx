import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { BookingsFilter } from "@/components/dashboard/bookings-filter"

export default async function BookingsPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground mt-2">Manage all your customer appointments</p>
      </div>

      <BookingsFilter />
      <BookingsTable />
    </div>
  )
}
