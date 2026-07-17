import React from "react";
import { getOwnerBusiness } from "@/server/actions/business/owner";
import { getCategories } from "@/server/actions/category/get-categories";
import { db } from "@/db";
import { amenities, dynamicFields } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditBusinessClient } from "@/features/dashboard/owner";

export const metadata = {
  title: "Edit Business - BrajConnect",
};

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Fetch business details and verify ownership
  const bizRes = await getOwnerBusiness(id);
  if (!bizRes.success || !bizRes.data) {
    return notFound();
  }
  const biz = bizRes.data;

  // 2. Fetch categories
  const categories = await getCategories();

  // 3. Fetch all system amenities
  const allAmenities = await db.query.amenities.findMany({
    where: eq(amenities.active, true),
    orderBy: [asc(amenities.sortOrder)],
  });

  // 4. Fetch dynamic fields for the business's category
  const primaryCategoryId = biz.businessCategories?.[0]?.categoryId;
  const catFields = primaryCategoryId
    ? await db.query.dynamicFields.findMany({
        where: eq(dynamicFields.categoryId, primaryCategoryId),
        orderBy: [asc(dynamicFields.sortOrder)],
      })
    : [];

  return (
    <EditBusinessClient
      business={biz}
      categories={categories}
      allAmenities={allAmenities}
      dynamicFields={catFields}
    />
  );
}
