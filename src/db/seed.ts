/**
 * Production-Ready Database Seed Script
 *
 * Inserts categories, subcategories, dynamic fields, and amenities.
 * Uses ON CONFLICT (slug) DO NOTHING for categories/subcategories
 * and ON CONFLICT (key, categoryId) DO NOTHING for dynamic fields,
 * so it is fully idempotent — safe to run multiple times.
 *
 * Run with: pnpm db:seed
 */

import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { category, subcategory, amenities } from "./schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "cat_retail",  slug: "retail",    name: "Retail & Shopping",       icon: "Store",       sortOrder: 1 },
  { id: "cat_food",    slug: "food",      name: "Food & Dining",            icon: "Utensils",    sortOrder: 2 },
  { id: "cat_home",    slug: "home",      name: "Home Services",            icon: "Wrench",      sortOrder: 3 },
  { id: "cat_health",  slug: "health",    name: "Health & Medical",         icon: "Stethoscope", sortOrder: 4 },
  { id: "cat_prof",    slug: "prof",      name: "Professional Services",    icon: "Briefcase",   sortOrder: 5 },
  { id: "cat_tech",    slug: "tech",      name: "Tech & Software",          icon: "Code",        sortOrder: 6 },
  { id: "cat_beauty",  slug: "beauty",    name: "Beauty & Spa",             icon: "Scissors",    sortOrder: 7 },
  { id: "cat_ent",     slug: "ent",       name: "Entertainment",            icon: "MonitorPlay", sortOrder: 8 },
  { id: "cat_cafe",    slug: "cafe",      name: "Cafe & Bakery",            icon: "Coffee",      sortOrder: 9 },
  { id: "cat_edu",     slug: "education", name: "Education & Training",     icon: "GraduationCap", sortOrder: 10 },
  { id: "cat_travel",  slug: "travel",    name: "Travel & Tourism",         icon: "MapPin",      sortOrder: 11 },
  { id: "cat_auto",    slug: "auto",      name: "Automotive",               icon: "Car",         sortOrder: 12 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Subcategories
// ─────────────────────────────────────────────────────────────────────────────
const SUBCATEGORIES = [
  // Food & Dining
  { id: "sub_restaurant",  slug: "restaurant",      name: "Restaurant",       categoryId: "cat_food" },
  { id: "sub_fastfood",    slug: "fast-food",        name: "Fast Food",        categoryId: "cat_food" },
  { id: "sub_dhaba",       slug: "dhaba",            name: "Dhaba",            categoryId: "cat_food" },
  { id: "sub_sweets",      slug: "sweet-shop",       name: "Sweet Shop",       categoryId: "cat_food" },
  // Retail
  { id: "sub_clothing",    slug: "clothing",         name: "Clothing",         categoryId: "cat_retail" },
  { id: "sub_electronics", slug: "electronics",      name: "Electronics",      categoryId: "cat_retail" },
  { id: "sub_grocery",     slug: "grocery",          name: "Grocery Store",    categoryId: "cat_retail" },
  { id: "sub_hardware",    slug: "hardware",         name: "Hardware",         categoryId: "cat_retail" },
  // Home Services
  { id: "sub_plumbing",    slug: "plumbing",         name: "Plumbing",         categoryId: "cat_home" },
  { id: "sub_electrical",  slug: "electrical",       name: "Electrical",       categoryId: "cat_home" },
  { id: "sub_cleaning",    slug: "cleaning",         name: "Cleaning",         categoryId: "cat_home" },
  // Health
  { id: "sub_clinic",      slug: "clinic",           name: "Clinic",           categoryId: "cat_health" },
  { id: "sub_pharmacy",    slug: "pharmacy",         name: "Pharmacy",         categoryId: "cat_health" },
  { id: "sub_hospital",    slug: "hospital",         name: "Hospital",         categoryId: "cat_health" },
  // Cafe & Bakery
  { id: "sub_cafe",        slug: "coffee-cafe",      name: "Coffee Cafe",      categoryId: "cat_cafe" },
  { id: "sub_bakery",      slug: "bakery",           name: "Bakery",           categoryId: "cat_cafe" },
  // Beauty
  { id: "sub_salon",       slug: "salon",            name: "Salon",            categoryId: "cat_beauty" },
  { id: "sub_spa",         slug: "spa",              name: "Spa",              categoryId: "cat_beauty" },
  // Tech
  { id: "sub_software",    slug: "software-dev",     name: "Software Development", categoryId: "cat_tech" },
  { id: "sub_repair",      slug: "computer-repair",  name: "Computer Repair",  categoryId: "cat_tech" },
  // Education
  { id: "sub_tuition",     slug: "tuition",          name: "Tuition",          categoryId: "cat_edu" },
  { id: "sub_coaching",    slug: "coaching",         name: "Coaching",         categoryId: "cat_edu" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Fields
// Each field is identified by (key, categoryId) for idempotency.
// ─────────────────────────────────────────────────────────────────────────────
const DYNAMIC_FIELDS: Array<{
  id: string;
  categoryId: string;
  label: string;
  key: string;
  inputType: "text" | "textarea" | "number" | "select" | "checkbox" | "radio" | "date" | "switch";
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  sortOrder: number;
}> = [
  // ── Food & Dining ──────────────────────────────────────────────────────────
  { id: "df_food_cuisine",   categoryId: "cat_food", key: "cuisine",           label: "Cuisine Type",       inputType: "text",   required: true,  placeholder: "e.g. North Indian, Italian, Chinese", helpText: "Primary cuisine served", sortOrder: 1 },
  { id: "df_food_seats",     categoryId: "cat_food", key: "seating_capacity",  label: "Seating Capacity",   inputType: "number", required: false, placeholder: "e.g. 50",   helpText: "Approximate number of seats",   sortOrder: 2 },
  { id: "df_food_wifi",      categoryId: "cat_food", key: "has_wifi",          label: "Free Wi-Fi",         inputType: "switch", required: false,                                                                        sortOrder: 3 },
  { id: "df_food_ac",        categoryId: "cat_food", key: "is_ac",             label: "Air Conditioned",    inputType: "switch", required: false,                                                                        sortOrder: 4 },
  { id: "df_food_delivery",  categoryId: "cat_food", key: "home_delivery",     label: "Home Delivery",      inputType: "switch", required: false,                                                                        sortOrder: 5 },
  { id: "df_food_type",      categoryId: "cat_food", key: "food_type",         label: "Food Type",          inputType: "select", required: true,  options: ["Pure Vegetarian", "Non-Vegetarian", "Vegan", "Mixed"],     sortOrder: 6 },
  { id: "df_food_timings",   categoryId: "cat_food", key: "serving_timings",   label: "Serving Timings",    inputType: "text",   required: false, placeholder: "e.g. Lunch & Dinner",                                   sortOrder: 7 },

  // ── Health & Medical ───────────────────────────────────────────────────────
  { id: "df_health_emrg",    categoryId: "cat_health", key: "emergency",         label: "Emergency Services", inputType: "switch", required: true,                                                                        sortOrder: 1 },
  { id: "df_health_icu",     categoryId: "cat_health", key: "icu_beds",          label: "ICU Beds",           inputType: "number", required: false, placeholder: "e.g. 10",                                               sortOrder: 2 },
  { id: "df_health_amb",     categoryId: "cat_health", key: "ambulance",         label: "Ambulance Service",  inputType: "switch", required: false,                                                                        sortOrder: 3 },
  { id: "df_health_spec",    categoryId: "cat_health", key: "speciality",        label: "Speciality",         inputType: "text",   required: true,  placeholder: "e.g. Cardiology, General Medicine",                     sortOrder: 4 },
  { id: "df_health_doc",     categoryId: "cat_health", key: "num_doctors",       label: "Number of Doctors",  inputType: "number", required: false, placeholder: "e.g. 5",                                                sortOrder: 5 },
  { id: "df_health_lab",     categoryId: "cat_health", key: "has_lab",           label: "Diagnostic Lab",     inputType: "switch", required: false,                                                                        sortOrder: 6 },

  // ── Retail & Shopping ─────────────────────────────────────────────────────
  { id: "df_retail_brand",   categoryId: "cat_retail", key: "brands_available",  label: "Brands Available",   inputType: "textarea", required: false, placeholder: "e.g. Nike, Adidas, Puma",                             sortOrder: 1 },
  { id: "df_retail_home_dlv",categoryId: "cat_retail", key: "home_delivery",     label: "Home Delivery",      inputType: "switch",   required: false,                                                                      sortOrder: 2 },
  { id: "df_retail_gst",     categoryId: "cat_retail", key: "gst_billing",       label: "GST Billing",        inputType: "switch",   required: false,                                                                      sortOrder: 3 },
  { id: "df_retail_upi",     categoryId: "cat_retail", key: "upi_payment",       label: "UPI/Digital Payment",inputType: "switch",   required: false,                                                                      sortOrder: 4 },

  // ── Beauty & Spa ──────────────────────────────────────────────────────────
  { id: "df_beauty_type",    categoryId: "cat_beauty", key: "service_for",       label: "Services For",       inputType: "select", required: true,  options: ["Ladies", "Gents", "Both", "Kids"],                        sortOrder: 1 },
  { id: "df_beauty_appt",    categoryId: "cat_beauty", key: "appointment_reqd",  label: "Appointment Required",inputType: "switch", required: false,                                                                       sortOrder: 2 },
  { id: "df_beauty_home",    categoryId: "cat_beauty", key: "home_service",      label: "Home Service Available",inputType:"switch", required: false,                                                                       sortOrder: 3 },

  // ── Tech & Software ───────────────────────────────────────────────────────
  { id: "df_tech_stack",     categoryId: "cat_tech", key: "tech_stack",          label: "Technology Stack",   inputType: "text",   required: false, placeholder: "e.g. React, Node.js, Python",                           sortOrder: 1 },
  { id: "df_tech_remote",    categoryId: "cat_tech", key: "remote_work",         label: "Remote Work Available",inputType:"switch", required: false,                                                                       sortOrder: 2 },
  { id: "df_tech_support",   categoryId: "cat_tech", key: "24_7_support",        label: "24/7 Support",       inputType: "switch", required: false,                                                                        sortOrder: 3 },

  // ── Cafe & Bakery ─────────────────────────────────────────────────────────
  { id: "df_cafe_wifi",      categoryId: "cat_cafe", key: "has_wifi",            label: "Free Wi-Fi",         inputType: "switch", required: false,                                                                        sortOrder: 1 },
  { id: "df_cafe_outdoor",   categoryId: "cat_cafe", key: "outdoor_seating",     label: "Outdoor Seating",    inputType: "switch", required: false,                                                                        sortOrder: 2 },
  { id: "df_cafe_specialty",  categoryId: "cat_cafe", key: "specialty",          label: "Signature Item",     inputType: "text",   required: false, placeholder: "e.g. Cold Brew, Chocolate Croissant",                   sortOrder: 3 },

  // ── Home Services ─────────────────────────────────────────────────────────
  { id: "df_home_emrg",      categoryId: "cat_home", key: "emergency_service",   label: "Emergency Service",  inputType: "switch", required: false,                                                                        sortOrder: 1 },
  { id: "df_home_est",       categoryId: "cat_home", key: "free_estimate",       label: "Free Estimate",      inputType: "switch", required: false,                                                                        sortOrder: 2 },
  { id: "df_home_area",      categoryId: "cat_home", key: "service_area",        label: "Service Area (km)",  inputType: "number", required: false, placeholder: "e.g. 10",                                               sortOrder: 3 },

  // ── Professional Services ─────────────────────────────────────────────────
  { id: "df_prof_exp",       categoryId: "cat_prof", key: "years_experience",    label: "Years of Experience",inputType: "number", required: false, placeholder: "e.g. 5",                                                sortOrder: 1 },
  { id: "df_prof_online",    categoryId: "cat_prof", key: "online_consultation", label: "Online Consultation",inputType: "switch", required: false,                                                                        sortOrder: 2 },
  { id: "df_prof_reg",       categoryId: "cat_prof", key: "registration_no",     label: "Registration No.",   inputType: "text",   required: false, placeholder: "Professional registration number",                       sortOrder: 3 },

  // ── Education ─────────────────────────────────────────────────────────────
  { id: "df_edu_board",      categoryId: "cat_edu", key: "board",                label: "Board / Curriculum", inputType: "select", required: false, options: ["CBSE", "ICSE", "State Board", "IB", "Other"],              sortOrder: 1 },
  { id: "df_edu_online",     categoryId: "cat_edu", key: "online_classes",       label: "Online Classes",     inputType: "switch", required: false,                                                                        sortOrder: 2 },
  { id: "df_edu_batch",      categoryId: "cat_edu", key: "batch_size",           label: "Batch Size",         inputType: "number", required: false, placeholder: "e.g. 20",                                               sortOrder: 3 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Amenities
// ─────────────────────────────────────────────────────────────────────────────
const AMENITIES = [
  { id: "am_wifi",      name: "Free Wi-Fi",        icon: "Wifi",           sortOrder: 1 },
  { id: "am_parking",   name: "Parking Available", icon: "ParkingSquare",  sortOrder: 2 },
  { id: "am_ac",        name: "Air Conditioned",   icon: "Wind",           sortOrder: 3 },
  { id: "am_card",      name: "Card Payment",      icon: "CreditCard",     sortOrder: 4 },
  { id: "am_upi",       name: "UPI Payment",       icon: "Smartphone",     sortOrder: 5 },
  { id: "am_disabled",  name: "Wheelchair Access", icon: "Accessibility",  sortOrder: 6 },
  { id: "am_delivery",  name: "Home Delivery",     icon: "Truck",          sortOrder: 7 },
  { id: "am_toilets",   name: "Restrooms",         icon: "MapPin",         sortOrder: 8 },
  { id: "am_cctv",      name: "CCTV Security",     icon: "ShieldCheck",    sortOrder: 9 },
  { id: "am_generator", name: "Power Backup",      icon: "Zap",            sortOrder: 10 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Starting database seed...\n");

  // 1. Categories — conflict on slug (stable natural key)
  console.log("📁 Seeding categories...");
  for (const cat of CATEGORIES) {
    await db
      .insert(category)
      .values({ ...cat, active: true })
      .onConflictDoNothing({ target: category.slug });
  }
  console.log(`   ✓ ${CATEGORIES.length} categories processed`);

  // 2. Subcategories — conflict on slug (unique per schema)
  console.log("📂 Seeding subcategories...");
  for (const sub of SUBCATEGORIES) {
    await db
      .insert(subcategory)
      .values({ ...sub, active: true, sortOrder: 0 })
      .onConflictDoNothing({ target: subcategory.slug });
  }
  console.log(`   ✓ ${SUBCATEGORIES.length} subcategories processed`);

  // 3. Dynamic Fields — conflict on (key, categoryId) to ensure idempotency
  //    Drizzle does not support multi-column conflict targets with onConflictDoNothing
  //    directly, so we use a raw SQL ON CONFLICT clause.
  console.log("🔧 Seeding dynamic fields...");
  for (const field of DYNAMIC_FIELDS) {
    await db.execute(sql`
      INSERT INTO dynamic_fields
        (id, "categoryId", label, key, "inputType", required, placeholder, "helpText", options, "sortOrder", active)
      VALUES
        (
          ${field.id},
          ${field.categoryId},
          ${field.label},
          ${field.key},
          ${field.inputType}::"input_type",
          ${field.required},
          ${field.placeholder ?? null},
          ${field.helpText ?? null},
          ${field.options ? JSON.stringify(field.options) : null}::jsonb,
          ${field.sortOrder},
          true
        )
      ON CONFLICT (key, "categoryId") DO NOTHING
    `);
  }
  console.log(`   ✓ ${DYNAMIC_FIELDS.length} dynamic fields processed`);

  // 4. Amenities — conflict on name (stable)
  console.log("⭐ Seeding amenities...");
  for (const am of AMENITIES) {
    await db.execute(sql`
      INSERT INTO amenities (id, name, icon, "sortOrder", active)
      VALUES (${am.id}, ${am.name}, ${am.icon}, ${am.sortOrder}, true)
      ON CONFLICT (name) DO NOTHING
    `);
  }
  console.log(`   ✓ ${AMENITIES.length} amenities processed`);

  console.log("\n✅ Seed complete!");
}

seed()
  .catch((err) => {
    console.error("\n❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => client.end());
