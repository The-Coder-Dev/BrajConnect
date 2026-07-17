import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { DEFAULT_USER_ROLE } from '@/lib/auth/roles';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://bachatlal.in",
  trustedOrigins: ["https://bachatlal.in", "https://www.bachatlal.in", "http://localhost:3000"],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema
    }
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: "https://www.bachatlal.in/api/auth/callback/google",
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: DEFAULT_USER_ROLE,
      }
    }
  }
});
