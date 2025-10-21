import { CheckCircle2 } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Business Profile",
      description:
        "Set up your business details, services, and pricing in minutes. Add your logo and customize your booking page.",
    },
    {
      number: "02",
      title: "Share Your Booking Link",
      description: "Get a unique booking link to share with customers via WhatsApp, social media, or your website.",
    },
    {
      number: "03",
      title: "Accept Bookings & Payments",
      description:
        "Customers book appointments and pay instantly. You get notified and can manage everything from your dashboard.",
    },
  ]

  return (
    <section className="py-20 md:py-32" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl text-balance">How It Works</h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Get started in three simple steps and start accepting bookings today
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="group relative flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex items-start gap-6 md:flex-1">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-2xl font-bold text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                    {step.number}
                  </div>

                  <div className="flex-1 pt-2">
                    <h3 className="mb-3 text-xl font-semibold text-foreground md:text-2xl">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 h-full w-0.5 bg-gradient-to-b from-primary/50 to-transparent md:left-8" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 p-8 md:p-12">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary">
                <CheckCircle2 className="h-8 w-8 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-semibold text-foreground md:text-2xl">
                  Built for Ghanaian Businesses
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We understand the local market. Mobile money integration, local payment methods, and support in your
                  language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
