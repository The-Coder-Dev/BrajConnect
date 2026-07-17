"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Globe,
  Plus,
  Trash,
  ChevronLeft,
  AlertTriangle,
  Heart,
  Layers,
} from "lucide-react";
import { FaFacebook as Facebook, FaInstagram as Instagram, FaLinkedin as Linkedin, FaYoutube as Youtube, FaTwitter as Twitter } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Server Actions
import { saveBusinessBasic } from "@/server/actions/business/onboarding/save-basic";
import { saveBusinessContact } from "@/server/actions/business/onboarding/save-contact";
import { saveBusinessLocation } from "@/server/actions/business/onboarding/save-location";
import { saveBusinessHours } from "@/server/actions/business/onboarding/save-hours";
import { saveBusinessSocials } from "@/server/actions/business/onboarding/save-socials";
import { saveBusinessDynamicFields } from "@/server/actions/business/onboarding/save-dynamic-fields";
import { saveBusinessServices } from "@/server/actions/business/onboarding/save-services";
import { saveBusinessAmenities } from "@/server/actions/business/owner";

interface EditBusinessClientProps {
  business: any;
  categories: any[];
  allAmenities: any[];
  dynamicFields: any[];
}

export function EditBusinessClient({
  business: initialBusiness,
  allAmenities,
  dynamicFields,
}: EditBusinessClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Business details reference
  const biz = initialBusiness;
  const isEditable = biz.status !== "pending_review" && biz.status !== "suspended";

  // Tab 1: Basic Info state
  const [basicInfo, setBasicInfo] = useState({
    name: biz.name || "",
    shortDescription: biz.shortDescription || "",
    description: biz.fullDescription || "",
    establishedYear: biz.establishedYear || "",
  });

  // Tab 2: Contact Info state
  const [contact, setContact] = useState({
    phone: biz.contact?.primaryPhone || "",
    whatsapp: biz.contact?.whatsapp || "",
    email: biz.contact?.email || "",
    website: biz.contact?.website || "",
    preferredContactMethod: biz.contact?.preferredContactMethod || "phone",
  });

  // Tab 3: Location state
  const [loc, setLoc] = useState({
    country: biz.location?.country || "India",
    state: biz.location?.state || "",
    district: biz.location?.district || "",
    city: biz.location?.city || "",
    locality: biz.location?.locality || "",
    address: biz.location?.address || "",
    postalCode: biz.location?.postalCode || "",
    latitude: biz.location?.latitude || "",
    longitude: biz.location?.longitude || "",
  });

  // Tab 4: Hours state
  const defaultHours = [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const existing = biz.hours?.find((h: any) => h.dayOfWeek === day);
    return {
      dayOfWeek: day,
      isClosed: existing ? existing.isClosed : false,
      is24Hours: existing ? existing.is24Hours : false,
      openTime: existing?.openTime || "09:00",
      closeTime: existing?.closeTime || "18:00",
    };
  });
  const [hours, setHours] = useState(defaultHours);

  // Tab 5: Social state
  const getSocialUrl = (platform: string) => {
    return biz.socials?.find((s: any) => s.platform === platform)?.url || "";
  };
  const [socials, setSocials] = useState({
    facebook: getSocialUrl("facebook"),
    instagram: getSocialUrl("instagram"),
    linkedin: getSocialUrl("linkedin"),
    youtube: getSocialUrl("youtube"),
    twitter: getSocialUrl("twitter"),
  });

  // Tab 6: Amenities state
  const initialSelectedAmenities = biz.businessAmenities?.map((a: any) => a.amenityId) || [];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialSelectedAmenities);

  // Tab 7: Services state
  const [services, setServices] = useState<any[]>(biz.services || []);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");

  // Tab 8: Dynamic fields state
  const initialFieldsValue: Record<string, string> = {};
  dynamicFields.forEach((field) => {
    const match = biz.businessFields?.find((f: any) => f.dynamicFieldId === field.id);
    initialFieldsValue[field.id] = match ? match.value : field.defaultValue || "";
  });
  const [fieldsValue, setFieldsValue] = useState<Record<string, string>>(initialFieldsValue);

  // ----------------------------------------------------
  // Save Actions
  // ----------------------------------------------------
  const handleSaveBasic = () => {
    if (!basicInfo.name) {
      toast.error("Business Name is required");
      return;
    }
    startTransition(async () => {
      const res = await saveBusinessBasic(biz.id, {
        name: basicInfo.name,
        shortDescription: basicInfo.shortDescription,
        description: basicInfo.description,
        establishedYear: basicInfo.establishedYear ? Number(basicInfo.establishedYear) : undefined,
      });

      if (res.success) {
        toast.success("Basic information updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update basic info");
      }
    });
  };

  const handleSaveContact = () => {
    startTransition(async () => {
      const res = await saveBusinessContact(biz.id, {
        primaryPhone: contact.phone,
        whatsapp: contact.whatsapp,
        email: contact.email,
        website: contact.website,
        preferredContactMethod: contact.preferredContactMethod as any,
      });

      if (res.success) {
        toast.success("Contact details updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update contact details");
      }
    });
  };

  const handleSaveLocation = () => {
    if (!loc.state || !loc.city || !loc.address || !loc.postalCode) {
      toast.error("State, City, Address, and Postal Code are required");
      return;
    }
    startTransition(async () => {
      const res = await saveBusinessLocation(biz.id, {
        country: loc.country,
        state: loc.state,
        district: loc.district || "",
        city: loc.city,
        locality: loc.locality || "",
        address: loc.address,
        postalCode: loc.postalCode,
        latitude: loc.latitude ? Number(loc.latitude) : undefined,
        longitude: loc.longitude ? Number(loc.longitude) : undefined,
      });

      if (res.success) {
        toast.success("Location settings updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update location details");
      }
    });
  };

  const handleSaveHours = () => {
    startTransition(async () => {
      const res = await saveBusinessHours(biz.id, hours);
      if (res.success) {
        toast.success("Opening hours updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save hours");
      }
    });
  };

  const handleSaveSocials = () => {
    startTransition(async () => {
      const validLinks = Object.entries(socials)
        .filter(([, url]) => url.trim().length > 0)
        .map(([platform, url]) => ({
          platform: (platform === "twitter" ? "x" : platform) as any,
          url: url.trim(),
        }));

      const res = await saveBusinessSocials(biz.id, validLinks);
      if (res.success) {
        toast.success("Social links updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save social links");
      }
    });
  };

  const handleSaveAmenities = () => {
    startTransition(async () => {
      const res = await saveBusinessAmenities(biz.id, selectedAmenities);
      if (res.success) {
        toast.success("Amenities updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save amenities");
      }
    });
  };

  const handleSaveServices = () => {
    startTransition(async () => {
      const formattedServices = services.map((s) => ({
        title: s.title || s.name || "",
        description: s.description || "",
      }));
      const res = await saveBusinessServices(biz.id, formattedServices);
      if (res.success) {
        toast.success("Services selection updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save services");
      }
    });
  };

  const handleSaveDynamicFields = () => {
    startTransition(async () => {
      const res = await saveBusinessDynamicFields(biz.id, fieldsValue);
      if (res.success) {
        toast.success("Specific category details updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save specific details");
      }
    });
  };

  // Helper arrays/objects
  const getDayName = (day: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
  };

  const addServiceLocal = () => {
    if (!newServiceName.trim()) {
      toast.error("Service name cannot be empty");
      return;
    }
    const nService = {
      id: `${Date.now()}`,
      title: newServiceName,
      description: newServiceDesc,
    };
    setServices([...services, nService]);
    setNewServiceName("");
    setNewServiceDesc("");
  };

  const removeServiceLocal = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const toggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((aid) => aid !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 p-5 border rounded-2xl border-border/40">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Edit Business Details</h1>
            {!isEditable && (
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full">
                Locked
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Modify listing details. Submitting changes to published listings keeps them active.
          </p>
        </div>
        <Link href={`/dashboard/businesses/${biz.id}`}>
          <Button variant="outline" className="rounded-xl h-10">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Details
          </Button>
        </Link>
      </div>

      {/* Warnings & Notices */}
      {!isEditable && (
        <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-5 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-amber-900">Editing is Disabled</h3>
            <p className="text-sm text-amber-700">
              {biz.status === "pending_review"
                ? "Editing is disabled while under review."
                : "This business is currently suspended. Please contact portal administrators to address policy violations."}
            </p>
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <Tabs defaultValue="basic" className="w-full">
        <div className="flex overflow-x-auto pb-2 border-b">
          <TabsList className="bg-muted/30 p-1 rounded-xl flex gap-1 h-auto shrink-0">
            <TabsTrigger value="basic" className="rounded-lg py-2 px-3.5 text-xs font-semibold gap-1.5"><Info className="h-3.5 w-3.5" /> Basic Info</TabsTrigger>
            <TabsTrigger value="contact" className="rounded-lg py-2 px-3.5 text-xs font-semibold gap-1.5"><Phone className="h-3.5 w-3.5" /> Contact Details</TabsTrigger>
            <TabsTrigger value="location" className="rounded-lg py-2 px-3.5 text-xs font-semibold gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location</TabsTrigger>
            <TabsTrigger value="hours" className="rounded-lg py-2 px-3.5 text-xs font-semibold gap-1.5"><Clock className="h-3.5 w-3.5" /> Opening Hours</TabsTrigger>
            <TabsTrigger value="socials" className="rounded-lg py-2 px-3.5 text-xs font-semibold gap-1.5"><Globe className="h-3.5 w-3.5" /> Social Links</TabsTrigger>
            <TabsTrigger value="amenities" className="rounded-lg py-2 px-3.5 text-xs font-semibold gap-1.5"><Heart className="h-3.5 w-3.5" /> Amenities</TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg py-2 px-3.5 text-xs font-semibold gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Services</TabsTrigger>
            {dynamicFields.length > 0 && (
              <TabsTrigger value="dynamic" className="rounded-lg py-2 px-3.5 text-xs font-semibold gap-1.5"><Layers className="h-3.5 w-3.5" /> Specific Details</TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* Tab 1: Basic Info */}
        <TabsContent value="basic" className="mt-6">
          <Card className="rounded-2xl border-border/50 bg-card">
            <CardHeader>
              <CardTitle>Basic Business Information</CardTitle>
              <CardDescription>Configure business names, descriptors, and operational timeline details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  disabled={!isEditable}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={basicInfo.shortDescription}
                  onChange={(e) => setBasicInfo({ ...basicInfo, shortDescription: e.target.value })}
                  disabled={!isEditable}
                  className="rounded-xl h-11"
                  placeholder="Summarize your business in 1-2 sentences"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                  disabled={!isEditable}
                  className="rounded-xl min-h-[120px]"
                  placeholder="Detail your offerings, products, mission, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={basicInfo.establishedYear}
                  onChange={(e) => setBasicInfo({ ...basicInfo, establishedYear: e.target.value })}
                  disabled={!isEditable}
                  className="rounded-xl h-11"
                  placeholder="e.g. 2018"
                />
              </div>
              {isEditable && (
                <Button className="rounded-xl h-10 px-5 mt-4" onClick={handleSaveBasic} disabled={isPending}>
                  Save changes
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Contact Info */}
        <TabsContent value="contact" className="mt-6">
          <Card className="rounded-2xl border-border/50 bg-card">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Setup ways clients can reach you directly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Primary Phone Number</Label>
                  <Input
                    id="phone"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={contact.whatsapp}
                    onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website Link</Label>
                  <Input
                    id="website"
                    value={contact.website}
                    onChange={(e) => setContact({ ...contact, website: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="preferredContactMethod">Preferred Contact Channel</Label>
                <Select
                  value={contact.preferredContactMethod}
                  onValueChange={(val) => setContact({ ...contact, preferredContactMethod: val })}
                  disabled={!isEditable}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Calls</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp Text</SelectItem>
                    <SelectItem value="email">Email Inbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isEditable && (
                <Button className="rounded-xl h-10 px-5 mt-4" onClick={handleSaveContact} disabled={isPending}>
                  Save changes
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Location */}
        <TabsContent value="location" className="mt-6">
          <Card className="rounded-2xl border-border/50 bg-card">
            <CardHeader>
              <CardTitle>Physical Location Settings</CardTitle>
              <CardDescription>Enter exact address coordinates and listings cities details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="address">Address line <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  value={loc.address}
                  onChange={(e) => setLoc({ ...loc, address: e.target.value })}
                  disabled={!isEditable}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City / Town <span className="text-red-500">*</span></Label>
                  <Input
                    id="city"
                    value={loc.city}
                    onChange={(e) => setLoc({ ...loc, city: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={loc.district}
                    onChange={(e) => setLoc({ ...loc, district: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                  <Input
                    id="state"
                    value={loc.state}
                    onChange={(e) => setLoc({ ...loc, state: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code / PIN <span className="text-red-500">*</span></Label>
                  <Input
                    id="postalCode"
                    value={loc.postalCode}
                    onChange={(e) => setLoc({ ...loc, postalCode: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={loc.latitude}
                    onChange={(e) => setLoc({ ...loc, latitude: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={loc.longitude}
                    onChange={(e) => setLoc({ ...loc, longitude: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
              {isEditable && (
                <Button className="rounded-xl h-10 px-5 mt-4" onClick={handleSaveLocation} disabled={isPending}>
                  Save changes
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Business Hours */}
        <TabsContent value="hours" className="mt-6">
          <Card className="rounded-2xl border-border/50 bg-card">
            <CardHeader>
              <CardTitle>Hours of Operation</CardTitle>
              <CardDescription>Setup weekly closed/open timings schedules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hours.map((day, idx) => (
                <div
                  key={day.dayOfWeek}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 last:border-0 last:pb-0 gap-3"
                >
                  <span className="font-semibold text-sm min-w-[100px]">{getDayName(day.dayOfWeek)}</span>
                  <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`closed-${idx}`}
                        checked={day.isClosed}
                        onCheckedChange={(val) => {
                          const newHours = [...hours];
                          newHours[idx].isClosed = val;
                          if (val) newHours[idx].is24Hours = false;
                          setHours(newHours);
                        }}
                        disabled={!isEditable}
                      />
                      <Label htmlFor={`closed-${idx}`} className="text-xs">Closed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`24hours-${idx}`}
                        checked={day.is24Hours}
                        onCheckedChange={(val) => {
                          const newHours = [...hours];
                          newHours[idx].is24Hours = val;
                          if (val) newHours[idx].isClosed = false;
                          setHours(newHours);
                        }}
                        disabled={!isEditable || day.isClosed}
                      />
                      <Label htmlFor={`24hours-${idx}`} className="text-xs">24 Hours</Label>
                    </div>
                    {!day.isClosed && !day.is24Hours && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={day.openTime}
                          onChange={(e) => {
                            const newHours = [...hours];
                            newHours[idx].openTime = e.target.value;
                            setHours(newHours);
                          }}
                          disabled={!isEditable}
                          className="w-20 rounded-lg h-9 text-xs text-center"
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <Input
                          type="text"
                          value={day.closeTime}
                          onChange={(e) => {
                            const newHours = [...hours];
                            newHours[idx].closeTime = e.target.value;
                            setHours(newHours);
                          }}
                          disabled={!isEditable}
                          className="w-20 rounded-lg h-9 text-xs text-center"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isEditable && (
                <Button className="rounded-xl h-10 px-5 mt-4" onClick={handleSaveHours} disabled={isPending}>
                  Save changes
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Social Links */}
        <TabsContent value="socials" className="mt-6">
          <Card className="rounded-2xl border-border/50 bg-card">
            <CardHeader>
              <CardTitle>Social Media Profiles</CardTitle>
              <CardDescription>Link social profiles to build brand identity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Facebook className="h-5 w-5 text-blue-600 shrink-0" />
                  <Input
                    placeholder="Facebook Profile URL"
                    value={socials.facebook}
                    onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="h-5 w-5 text-pink-600 shrink-0" />
                  <Input
                    placeholder="Instagram Profile URL"
                    value={socials.instagram}
                    onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-blue-700 shrink-0" />
                  <Input
                    placeholder="LinkedIn Company URL"
                    value={socials.linkedin}
                    onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Youtube className="h-5 w-5 text-red-600 shrink-0" />
                  <Input
                    placeholder="YouTube Channel URL"
                    value={socials.youtube}
                    onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="h-5 w-5 text-sky-500 shrink-0" />
                  <Input
                    placeholder="Twitter/X Profile URL"
                    value={socials.twitter}
                    onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                    disabled={!isEditable}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
              {isEditable && (
                <Button className="rounded-xl h-10 px-5 mt-4" onClick={handleSaveSocials} disabled={isPending}>
                  Save changes
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Amenities */}
        <TabsContent value="amenities" className="mt-6">
          <Card className="rounded-2xl border-border/50 bg-card">
            <CardHeader>
              <CardTitle>Amenities & Features</CardTitle>
              <CardDescription>Select standard features clients look for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {allAmenities.map((am) => {
                  const isSelected = selectedAmenities.includes(am.id);
                  return (
                    <div
                      key={am.id}
                      onClick={() => { if (isEditable) toggleAmenity(am.id); }}
                      className={`flex items-center space-x-3 p-3.5 border rounded-xl cursor-pointer select-none transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/40 bg-card text-muted-foreground hover:bg-slate-50/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!isEditable}
                        readOnly
                        className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 shrink-0"
                      />
                      <span className="text-sm font-semibold text-foreground">{am.name}</span>
                    </div>
                  );
                })}
              </div>
              {isEditable && (
                <Button className="rounded-xl h-10 px-5 mt-4" onClick={handleSaveAmenities} disabled={isPending}>
                  Save changes
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7: Services */}
        <TabsContent value="services" className="mt-6">
          <Card className="rounded-2xl border-border/50 bg-card">
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
              <CardDescription>List individual offerings, prices, and catalogs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service list table */}
              {services.length > 0 ? (
                <div className="space-y-3">
                  {services.map((srv) => (
                    <div key={srv.id} className="flex justify-between items-start border p-3.5 rounded-xl border-border/40 bg-muted/10">
                      <div>
                        <p className="text-sm font-bold text-foreground">{srv.title || srv.name}</p>
                        {srv.description && (
                          <p className="text-xs text-muted-foreground mt-1">{srv.description}</p>
                        )}
                      </div>
                      {isEditable && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 shrink-0"
                          onClick={() => removeServiceLocal(srv.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-6 border border-dashed rounded-xl">
                  No services added yet. Fill out the catalog creator below.
                </p>
              )}

              {/* Catalog creator */}
              {isEditable && (
                <div className="p-4 border rounded-xl bg-muted/20 border-border/40 space-y-4">
                  <p className="text-sm font-bold">Add Service Option</p>
                  <div className="space-y-2">
                    <Label htmlFor="srv-name">Service Title</Label>
                    <Input
                      id="srv-name"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="rounded-xl h-11"
                      placeholder="e.g. Hair Cut & Style"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="srv-desc">Description</Label>
                    <Textarea
                      id="srv-desc"
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      className="rounded-xl h-20 min-h-[80px]"
                      placeholder="Brief details about the service"
                    />
                  </div>
                  <Button type="button" variant="outline" className="rounded-xl h-10 px-4" onClick={addServiceLocal}>
                    <Plus className="mr-1 h-4 w-4" /> Add Service to Catalog
                  </Button>
                </div>
              )}

              {isEditable && (
                <Button className="rounded-xl h-10 px-5 mt-4" onClick={handleSaveServices} disabled={isPending}>
                  Save catalog changes
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 8: Dynamic Fields */}
        {dynamicFields.length > 0 && (
          <TabsContent value="dynamic" className="mt-6">
            <Card className="rounded-2xl border-border/50 bg-card">
              <CardHeader>
                <CardTitle>Specific Details</CardTitle>
                <CardDescription>Enter details required for this category segment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {dynamicFields.map((field) => {
                  return (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>

                      {field.inputType === "text" || field.inputType === "number" || field.inputType === "date" ? (
                        <Input
                          id={field.id}
                          type={field.inputType}
                          value={fieldsValue[field.id] || ""}
                          onChange={(e) => setFieldsValue({ ...fieldsValue, [field.id]: e.target.value })}
                          disabled={!isEditable}
                          className="rounded-xl h-11"
                        />
                      ) : field.inputType === "textarea" ? (
                        <Textarea
                          id={field.id}
                          value={fieldsValue[field.id] || ""}
                          onChange={(e) => setFieldsValue({ ...fieldsValue, [field.id]: e.target.value })}
                          disabled={!isEditable}
                          className="rounded-xl min-h-[100px]"
                        />
                      ) : field.inputType === "checkbox" || field.inputType === "switch" ? (
                        <div className="flex items-center space-x-2 h-11">
                          <Switch
                            id={field.id}
                            checked={fieldsValue[field.id] === "true"}
                            onCheckedChange={(val) =>
                              setFieldsValue({ ...fieldsValue, [field.id]: String(val) })
                            }
                            disabled={!isEditable}
                          />
                          <Label htmlFor={field.id} className="text-sm font-normal">Yes</Label>
                        </div>
                      ) : field.inputType === "select" ? (
                        <Select
                          value={fieldsValue[field.id] || ""}
                          onValueChange={(val) => setFieldsValue({ ...fieldsValue, [field.id]: val })}
                          disabled={!isEditable}
                        >
                          <SelectTrigger className="rounded-xl h-11">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(field.options) ? field.options.map((opt: string, i: number) => (
                              <SelectItem key={i} value={opt}>{opt}</SelectItem>
                            )) : null}
                          </SelectContent>
                        </Select>
                      ) : null}

                      {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
                    </div>
                  );
                })}
                {isEditable && (
                  <Button className="rounded-xl h-10 px-5 mt-4" onClick={handleSaveDynamicFields} disabled={isPending}>
                    Save changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
