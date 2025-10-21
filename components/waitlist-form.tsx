"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("waitlist").insert([
        {
          email,
          name: name || null,
          business_type: businessType || null,
        },
      ]);

      if (error) {
        console.error("[v0] Waitlist insertion error:", error);
        throw error;
      }

      setIsSuccess(true);

      setTimeout(() => {
        setEmail("");
        setName("");
        setBusinessType("");
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("[v0] Failed to join waitlist:", error);
      alert("Failed to join waitlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="py-20 md:py-32 bg-gradient-to-br from-primary/5 to-secondary/5"
      id="waitlist"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl text-balance">
                Join the Waitlist
              </CardTitle>
              <CardDescription className="text-base md:text-lg text-pretty">
                Be among the first to experience the future of booking and
                payments in Ghana
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20"
                  >
                    <CheckCircle2 className="h-8 w-8 text-secondary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground">
                    🎉 You're on the waitlist!
                  </h3>
                  <p className="text-center text-muted-foreground">
                    We'll notify you soon when Book & Pay GH launches.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name (Optional)</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">
                      Business Type (Optional)
                    </Label>
                    <Select
                      value={businessType}
                      onValueChange={setBusinessType}
                    >
                      <SelectTrigger id="businessType" className="h-12">
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="barber">Barber Shop</SelectItem>
                        <SelectItem value="salon">Hair Salon</SelectItem>
                        <SelectItem value="spa">Spa & Wellness</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="fitness">Fitness & Gym</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Waitlist"
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
