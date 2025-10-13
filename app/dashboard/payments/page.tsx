import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PaymentsTable } from "@/components/dashboard/payments-table"
import { PaymentsSummary } from "@/components/dashboard/payments-summary"

export default async function PaymentsPage() {
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
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-2">Track your revenue and payment history</p>
      </div>

      <PaymentsSummary />
      <PaymentsTable />
    </div>
  )
}
