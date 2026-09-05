import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

async function main() {
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS fa_partner_opportunity_unique_idx 
    ON franchise_applications ("franchisePartnerId", "opportunityId");
  `;
  console.log("Successfully created unique index fa_partner_opportunity_unique_idx");
}

main().catch(console.error).finally(() => sql.end());
