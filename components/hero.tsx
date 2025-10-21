"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Coming Soon to Ghana
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl animate-fade-in-up text-balance">
            Simplify Bookings & Payments for Your Business
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl animate-fade-in-up text-pretty leading-relaxed">
            Book & Pay GH helps Ghanaian service businesses manage appointments and accept payments seamlessly. Perfect
            for barbers, salons, photographers, and more.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up">
            <Link href="/login">
              <Button size="lg" className="group w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" onClick={scrollToWaitlist}>
              Join Waitlist
            </Button>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
            <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Easy Booking</h3>
              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                Let customers book appointments 24/7 with our simple interface
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <CreditCard className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Secure Payments</h3>
              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                Accept mobile money and card payments instantly
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-card-foreground">Business Insights</h3>
              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                Track your revenue and bookings with detailed analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
