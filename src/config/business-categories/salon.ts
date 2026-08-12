import { CategoryConfig } from "@/lib/onboarding/types";

export const salonConfig: CategoryConfig = {
  id: "cat_salon",
  slug: "salon",
  name: "Salon & Beauty",
  icon: "Scissors",
  description: "Unisex Salons, Beauty Parlours, Spas, Makeup Studios & Grooming Centers",
  sections: [
    {
      id: "salon_overview",
      title: "Salon Classification",
      description: "Service format, clientele, and appointment policies",
      fields: [
        {
          id: "sal_type",
          name: "salonType",
          label: "Salon Category",
          type: "select",
          required: true,
          options: [
            { label: "Unisex Family Salon", value: "unisex" },
            { label: "Women's Beauty Salon & Parlour", value: "women_only" },
            { label: "Men's Salon & Traditional Barber", value: "men_only" },
            { label: "Luxury Day Spa & Wellness", value: "spa_wellness" },
            { label: "Bridal Studio & Academy", value: "bridal_studio" },
            { label: "Nail Art & Lash Extension Studio", value: "nail_studio" },
            { label: "Skin Care & Aesthetic Center", value: "skin_clinic" },
            { label: "Tattoo & Piercing Studio", value: "tattoo_studio" },
          ],
        },
        {
          id: "sal_appointment_policy",
          name: "bookingMode",
          label: "Booking & Visit Mode",
          type: "select",
          required: true,
          options: [
            { label: "Walk-Ins Welcome & Prior Appointments", value: "both" },
            { label: "Strictly by Prior Appointment", value: "appointment_only" },
            { label: "Walk-Ins Only", value: "walk_in_only" },
          ],
        },
        {
          id: "sal_doorstep_service",
          name: "homeServiceAvailable",
          label: "Doorstep / At-Home Beauty Service Available",
          type: "switch",
          defaultValue: false,
        },
      ],
    },
    {
      id: "salon_services",
      title: "Beauty & Grooming Services",
      description: "Select all categories of services provided",
      fields: [
        {
          id: "sal_services_list",
          name: "servicesOffered",
          label: "Available Service Departments",
          type: "checkbox_group",
          required: true,
          options: [
            { label: "Hair Cutting, Styling & Blowdry", value: "hair_styling" },
            { label: "Hair Coloring, Highlights & Balayage", value: "hair_color" },
            { label: "Keratin, Smoothening & Botoplex", value: "hair_treatment" },
            { label: "Advanced Facials & Cleanups", value: "facials" },
            { label: "Bridal Makeup & Groom Makeover", value: "bridal_makeup" },
            { label: "Party & Occasion Makeup", value: "party_makeup" },
            { label: "Manicure, Pedicure & Foot Spa", value: "manicure_pedicure" },
            { label: "Nail Art, Acrylic & Gel Extensions", value: "nail_extensions" },
            { label: "Full Body Massage & Spa Therapy", value: "body_spa" },
            { label: "Threading, Waxing & Detan", value: "waxing_threading" },
            { label: "Beard Styling & Shaving", value: "beard_grooming" },
          ],
        },
        {
          id: "sal_brands",
          name: "brandsUsed",
          label: "Cosmetic & Product Brands Used",
          type: "text",
          placeholder: "e.g. L'Oreal Professional, Schwarzkopf, MAC, Kryolan, O3+, Lotus",
        },
      ],
    },
  ],
  documentRequirements: [
    {
      id: "salon_trade_license",
      label: "Municipal Trade License / Shop Act Registration",
      description: "Registration certificate for operating salon/commercial establishment",
      required: true,
      acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    },
  ],
};
