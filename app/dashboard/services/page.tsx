import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ServicesList } from "@/components/dashboard/services-list"
import { AddServiceDialog } from "@/components/dashboard/add-service-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ServicesPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground mt-2">Manage the services you offer to customers</p>
        </div>
        <AddServiceDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </AddServiceDialog>
      </div>

      <ServicesList />
    </div>
  )
}
