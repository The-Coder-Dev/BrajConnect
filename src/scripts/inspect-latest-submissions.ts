import "dotenv/config";
import { db } from "../db";
import { business, user, emailLogs } from "../db/schema";
import { desc } from "drizzle-orm";

async function inspect() {
  console.log("--- Latest 5 Businesses ---");
  const businesses = await db.query.business.findMany({
    orderBy: [desc(business.createdAt)],
    limit: 5,
    with: {
      owner: true,
    },
  });
  console.log(
    businesses.map((b) => ({
      id: b.id,
      name: b.name,
      status: b.status,
      ownerEmail: b.owner?.email,
      ownerName: b.owner?.name,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }))
  );

  console.log("\n--- Latest 10 Email Logs ---");
  const logs = await db.query.emailLogs.findMany({
    orderBy: [desc(emailLogs.createdAt)],
    limit: 10,
  });
  console.log(logs);
}

inspect().catch(console.error);
