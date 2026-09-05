import "dotenv/config";
import { db } from "../db/index";
import { user, session, account } from "../db/schema/auth";
import { franchiseProfile } from "../db/schema/franchise-profile";
import { like, inArray } from "drizzle-orm";

async function main() {
  const users = await db.query.user.findMany({
    where: like(user.email, "%test_%@example.com%"),
  });

  const ids = users.map(u => u.id);
  if (ids.length > 0) {
    await db.delete(franchiseProfile).where(inArray(franchiseProfile.userId, ids));
    await db.delete(session).where(inArray(session.userId, ids));
    await db.delete(account).where(inArray(account.userId, ids));
    await db.delete(user).where(inArray(user.id, ids));
    console.log(`Cleaned up ${ids.length} test users`);
  } else {
    console.log("No test users found to clean up");
  }
}

main().catch(console.error).then(() => process.exit(0));
