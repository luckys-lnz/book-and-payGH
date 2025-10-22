"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, Save, Upload, X, Image as ImageIcon } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

export function BusinessForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    business_name: "",
    description: "",
    category: "",
    phone: "",
    email: "",
    location: "",
    logo_url: "",
    cover_url: "",
    currency: "GHS",
    timezone: "Africa/Accra",
    booking_page_enabled: true,
    booking_page_title: "",
    booking_page_description: "",
    require_deposit: false,
    deposit_amount: 0,
    deposit_percent: 0,
    payment_methods: [] as string[],
  });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const { toast } = useToast();

  // Load existing business data
  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: business, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows returned
          console.error("Error loading business data:", error);
          return;
        }

        if (business) {
          setFormData({
            business_name: business.business_name || "",
            description: business.description || "",
            category: business.category || "",
            phone: business.phone || "",
            email: business.email || "",
            location: business.location || "",
            logo_url: business.logo_url || "",
            cover_url: business.cover_url || "",
            currency: business.currency || "GHS",
            timezone: business.timezone || "Africa/Accra",
            booking_page_enabled: business.booking_page_enabled ?? true,
            booking_page_title: business.booking_page_title || "",
            booking_page_description: business.booking_page_description || "",
            require_deposit: business.require_deposit || false,
            deposit_amount: business.deposit_amount || 0,
            deposit_percent: business.deposit_percent || 0,
            payment_methods: business.payment_methods || [],
          });
        }
      } catch (error) {
        console.error("Error loading business data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadBusinessData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save business information.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("businesses").upsert({
        user_id: user.id,
        business_name: formData.business_name,
        description: formData.description || null,
        category: formData.category || null,
        phone: formData.phone || null,
        email: formData.email || null,
        location: formData.location || null,
        logo_url: formData.logo_url || null,
        cover_url: formData.cover_url || null,
        currency: formData.currency,
        timezone: formData.timezone,
        booking_page_enabled: formData.booking_page_enabled,
        booking_page_title: formData.booking_page_title || null,
        booking_page_description: formData.booking_page_description || null,
        require_deposit: formData.require_deposit,
        deposit_amount: formData.deposit_amount || null,
        deposit_percent: formData.deposit_percent || null,
        payment_methods: formData.payment_methods,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Business information saved successfully!",
      });
    } catch (error) {
      console.error("Error saving business data:", error);
      toast({
        title: "Error",
        description: "Failed to save business information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    field: string,
    value: string | boolean | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File, type: "logo" | "cover") => {
    const supabase = getSupabaseBrowserClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `business-${type}s/${fileName}`;

    try {
      if (type === "logo") {
        setIsUploadingLogo(true);
      } else {
        setIsUploadingCover(true);
      }

      const { error: uploadError } = await supabase.storage
        .from("business-assets")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("business-assets")
        .getPublicUrl(filePath);

      const fieldName = type === "logo" ? "logo_url" : "cover_url";
      setFormData((prev) => ({ ...prev, [fieldName]: data.publicUrl }));

      toast({
        title: "Success",
        description: `${
          type === "logo" ? "Logo" : "Cover image"
        } uploaded successfully!`,
      });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${
          type === "logo" ? "logo" : "cover image"
        }. Please try again.`,
        variant: "destructive",
      });
    } finally {
      if (type === "logo") {
        setIsUploadingLogo(false);
      } else {
        setIsUploadingCover(false);
      }
    }
  };

  const removeImage = (type: "logo" | "cover") => {
    const fieldName = type === "logo" ? "logo_url" : "cover_url";
    setFormData((prev) => ({ ...prev, [fieldName]: "" }));
  };

  if (isLoadingData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Update your business details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              placeholder="e.g., Kwame's Barber Shop"
              value={formData.business_name}
              onChange={(e) => handleChange("business_name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your business and services..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Business Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select business category" />
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

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+233 XX XXX XXXX"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="business@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Osu, Accra"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleChange("currency", value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GHS">GHS (Ghana Cedi)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => handleChange("timezone", value)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Accra">
                    Africa/Accra (GMT+0)
                  </SelectItem>
                  <SelectItem value="Africa/Lagos">
                    Africa/Lagos (GMT+1)
                  </SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Business Logo</Label>
            <div className="flex items-center gap-4">
              {formData.logo_url ? (
                <div className="relative">
                  <img
                    src={formData.logo_url}
                    alt="Business logo"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removeImage("logo")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "logo");
                  }}
                  className="hidden"
                  id="logo-upload"
                  disabled={isUploadingLogo}
                />
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingLogo}
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
              {formData.cover_url ? (
                <div className="relative">
                  <img
                    src={formData.cover_url}
                    alt="Business cover"
                    className="w-32 h-20 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removeImage("cover")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "cover");
                  }}
                  className="hidden"
                  id="cover-upload"
                  disabled={isUploadingCover}
                />
                <Label htmlFor="cover-upload" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingCover}
                  >
                    {isUploadingCover ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Cover
                      </>
                    )}
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          {/* Booking Page Settings */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Booking Page Settings</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="booking-enabled">Enable Booking Page</Label>
                <p className="text-sm text-muted-foreground">
                  Allow customers to book appointments online
                </p>
              </div>
              <Switch
                id="booking-enabled"
                checked={formData.booking_page_enabled}
                onCheckedChange={(checked) =>
                  handleChange("booking_page_enabled", checked)
                }
              />
            </div>

            {formData.booking_page_enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="booking_title">Booking Page Title</Label>
                  <Input
                    id="booking_title"
                    placeholder="e.g., Book Your Appointment"
                    value={formData.booking_page_title}
                    onChange={(e) =>
                      handleChange("booking_page_title", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking_description">
                    Booking Page Description
                  </Label>
                  <Textarea
                    id="booking_description"
                    placeholder="Describe your booking process..."
                    value={formData.booking_page_description}
                    onChange={(e) =>
                      handleChange("booking_page_description", e.target.value)
                    }
                  />
                </div>
              </>
            )}
          </div>

          {/* Payment Settings */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Payment Settings</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-deposit">Require Deposit</Label>
                <p className="text-sm text-muted-foreground">
                  Require customers to pay a deposit when booking
                </p>
              </div>
              <Switch
                id="require-deposit"
                checked={formData.require_deposit}
                onCheckedChange={(checked) =>
                  handleChange("require_deposit", checked)
                }
              />
            </div>

            {formData.require_deposit && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit_amount">Deposit Amount</Label>
                  <Input
                    id="deposit_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.deposit_amount}
                    onChange={(e) =>
                      handleChange(
                        "deposit_amount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit_percent">Deposit Percentage</Label>
                  <Input
                    id="deposit_percent"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00"
                    value={formData.deposit_percent}
                    onChange={(e) =>
                      handleChange(
                        "deposit_percent",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
