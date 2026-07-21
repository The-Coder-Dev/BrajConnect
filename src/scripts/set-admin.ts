import { config } from "dotenv";
config();
// import { postgres } from "postgres";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL is missing from environment.");
  process.exit(1);
}

const targetEmail = process.argv[2];

if (!targetEmail) {
  console.log("Usage: pnpm set-admin <email>");
  console.log("Example: pnpm set-admin admin@brajconnect.com");
  process.exit(1);
}

const sql = require("postgres")(dbUrl);

async function setAdminRole() {
  try {
    const users = await sql`SELECT id, name, email, role FROM "user" WHERE email = ${targetEmail}`;

    if (users.length === 0) {
      console.error(`❌ User with email "${targetEmail}" was not found in the database.`);
      console.log("Tip: The user must sign up / create an account on BrajConnect first!");
      process.exit(1);
    }

    await sql`UPDATE "user" SET role = 'admin' WHERE email = ${targetEmail}`;
    console.log(`✅ Success! Updated user "${targetEmail}" to role 'admin'.`);

    const updated = await sql`SELECT id, name, email, role FROM "user" WHERE role = 'admin'`;
    console.log("\n📋 All Current Admin Users:");
    console.table(updated);
  } catch (err) {
    console.error("Error setting admin role:", err);
  } finally {
    await sql.end();
  }
}

setAdminRole();
