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

  // 1. Verify ownership first — the category ID is needed for dynamic fields
  const bizRes = await getOwnerBusiness(id);
  if (!bizRes.success || !bizRes.data) {
    return notFound();
  }
  const biz = bizRes.data;

  const primaryCategoryId = biz.businessCategories?.[0]?.categoryId;

  // 2. Fetch all remaining data in parallel — these three queries are fully
  //    independent of each other and only require the categoryId from step 1.
  const [categories, allAmenities, catFields] = await Promise.all([
    getCategories(),
    db.query.amenities.findMany({
      where: eq(amenities.active, true),
      orderBy: [asc(amenities.sortOrder)],
    }),
    primaryCategoryId
      ? db.query.dynamicFields.findMany({
          where: eq(dynamicFields.categoryId, primaryCategoryId),
          orderBy: [asc(dynamicFields.sortOrder)],
        })
      : Promise.resolve([]),
  ]);

  return (
    <EditBusinessClient
      business={biz}
      categories={categories}
      allAmenities={allAmenities}
      dynamicFields={catFields}
    />
  );
}
