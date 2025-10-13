import { redirect } from "next/navigation"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { WaitlistForm } from "@/components/waitlist-form"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <WaitlistForm />
      <Footer />
    </main>
  )
}
