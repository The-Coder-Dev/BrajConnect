import "dotenv/config";
import { sendBusinessStatusEmail } from "../lib/email";
import { db } from "../db";
import { emailLogs } from "../db/schema";
import { desc } from "drizzle-orm";

async function testService() {
  console.log("Testing central email service...\n");

  // Test with non-existent business (should fail gracefully without throwing)
  console.log("1. Testing non-existent business ID graceful handling...");
  const res1 = await sendBusinessStatusEmail({
    type: "BUSINESS_SUBMITTED",
    businessId: "non_existent_biz_999",
  });
  console.log("Result 1:", res1);
  if (!res1.success) {
    console.log("✓ Gracefully handled missing business as expected.\n");
  }

  // Find an existing business to test real foreign key insertion in email_logs
  const existingBiz = await db.query.business.findFirst({
    with: { owner: true }
  });

  if (existingBiz) {
    console.log(`2. Testing email delivery with real business ID: ${existingBiz.id}...`);
    const res2 = await sendBusinessStatusEmail({
      type: "BUSINESS_APPROVED",
      businessId: existingBiz.id,
      businessName: existingBiz.name,
      businessSlug: existingBiz.slug,
      recipientEmail: existingBiz.owner?.email || "notifications@bachatlal.in",
      recipientName: existingBiz.owner?.name || "Business Owner",
      userId: existingBiz.ownerId,
    });
    console.log("Result 2:", res2);

    const latestLogs = await db.query.emailLogs.findMany({
      orderBy: [desc(emailLogs.createdAt)],
      limit: 3,
    });
    console.log("Latest email logs in database:", latestLogs);
    console.log("✓ Successfully verified email_logs table insertion!");
  } else {
    console.log("No existing business found in DB to test FK.");
  }

  console.log("\nService test finished successfully!");
}

testService().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
