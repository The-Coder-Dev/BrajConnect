import "dotenv/config";
import postgres from "postgres";

async function migrate() {
  const url = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL or DATABASE_DIRECT_URL");

  const sql = postgres(url, { max: 1 });

  console.log("Creating email_logs table if not exists...");
  await sql`
    CREATE TABLE IF NOT EXISTS "email_logs" (
      "id" text PRIMARY KEY NOT NULL,
      "userId" text,
      "businessId" text,
      "recipientEmail" text NOT NULL,
      "event" text NOT NULL,
      "status" text NOT NULL,
      "providerMessageId" text,
      "error" text,
      "sentAt" timestamp,
      "createdAt" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "email_logs_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action,
      CONSTRAINT "email_logs_businessId_business_id_fk" FOREIGN KEY ("businessId") REFERENCES "public"."business"("id") ON DELETE set null ON UPDATE no action
    );
  `;

  console.log("Creating index on email_logs (businessId, createdAt)...");
  await sql`
    CREATE INDEX IF NOT EXISTS "email_logs_business_id_idx" ON "email_logs" ("businessId");
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS "email_logs_user_id_idx" ON "email_logs" ("userId");
  `;

  console.log("email_logs table migration completed successfully! 🎉");
  await sql.end();
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
