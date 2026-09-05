import { config } from "dotenv";
config();
import { auth } from "../lib/auth";

async function main() {
  console.log("auth.api methods:", Object.keys(auth.api).filter(k => k.toLowerCase().includes('sign')));
  console.log("auth.api.signUpEmail:", typeof auth.api.signUpEmail);
  console.log("auth.api.signInEmail:", typeof auth.api.signInEmail);
}

main().catch(console.error).then(() => process.exit(0));
