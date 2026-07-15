import { db } from "./src/db";
import { category } from "./src/db/schema/category";

async function main() {
  const cats = await db.select().from(category);
  console.log("Categories in DB:", cats.length);
  process.exit(0);
}

main().catch(console.error);
