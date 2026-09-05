import 'dotenv/config';
import postgres from 'postgres';

async function migrateFranchise() {
  const connectionString = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL or DATABASE_DIRECT_URL must be set');
  }

  const sql = postgres(connectionString, { prepare: false });

  try {
    console.log('🚀 Running Franchise migration...\n');

    // 1. Alter user_role enum
    console.log('1. Updating user_role enum...');
    await sql.unsafe(`ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'franchise_partner'`);
    console.log('✓ Added franchise_partner to user_role');

    // 2. Create Enums
    console.log('2. Creating franchise enums...');
    await sql.unsafe(`
      DO $$ BEGIN
        CREATE TYPE franchise_applicant_type AS ENUM ('individual', 'company');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await sql.unsafe(`
      DO $$ BEGIN
        CREATE TYPE franchise_opportunity_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'closed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await sql.unsafe(`
      DO $$ BEGIN
        CREATE TYPE franchise_application_status AS ENUM ('submitted', 'under_review', 'approved', 'rejected', 'withdrawn');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✓ Franchise enums created or already exist');

    // 3. Create franchise_profiles table
    console.log('3. Creating franchise_profiles table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS franchise_profiles (
        "id" text PRIMARY KEY NOT NULL,
        "userId" text NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
        "applicantType" franchise_applicant_type NOT NULL,
        "fullName" text,
        "mobileNumber" text,
        "currentOccupation" text,
        "previousExperience" text,
        "reasonForApplying" text,
        "companyName" text,
        "companyEmail" text,
        "companyPhone" text,
        "companyWebsite" text,
        "gstNumber" text,
        "panNumber" text,
        "companyDescription" text,
        "authorizedPersonName" text,
        "authorizedPersonDesignation" text,
        "authorizedPersonEmail" text,
        "authorizedPersonPhone" text,
        "preferredState" text NOT NULL,
        "preferredCity" text NOT NULL,
        "investmentCapacity" text NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS franchise_profile_user_id_idx ON franchise_profiles ("userId");`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS franchise_profile_applicant_type_idx ON franchise_profiles ("applicantType");`);
    console.log('✓ franchise_profiles table & indexes ready');

    // 4. Create franchise_opportunities table
    console.log('4. Creating franchise_opportunities table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS franchise_opportunities (
        "id" text PRIMARY KEY NOT NULL,
        "businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
        "ownerId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "title" text NOT NULL,
        "slug" text NOT NULL UNIQUE,
        "description" text NOT NULL,
        "franchiseFee" text NOT NULL,
        "estimatedInvestment" text NOT NULL,
        "investmentRange" text,
        "expectedSetupCost" text,
        "availableState" text NOT NULL,
        "availableCity" text NOT NULL,
        "preferredArea" text,
        "territoryType" text,
        "minSpaceRequired" text NOT NULL,
        "experienceRequired" text,
        "eligibilityRequirements" text,
        "availableUnits" integer DEFAULT 1 NOT NULL,
        "trainingProvided" text,
        "marketingSupport" text,
        "operationalSupport" text,
        "initialSetupSupport" text,
        "agreementDuration" text,
        "renewalTerms" text,
        "termsConditions" text,
        "requiredDocuments" text,
        "status" franchise_opportunity_status DEFAULT 'draft' NOT NULL,
        "rejectionReason" text,
        "approvedAt" timestamp,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS fo_business_id_idx ON franchise_opportunities ("businessId");`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS fo_owner_id_idx ON franchise_opportunities ("ownerId");`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS fo_status_idx ON franchise_opportunities ("status");`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS fo_slug_idx ON franchise_opportunities ("slug");`);
    console.log('✓ franchise_opportunities table & indexes ready');

    // 5. Create franchise_applications table
    console.log('5. Creating franchise_applications table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS franchise_applications (
        "id" text PRIMARY KEY NOT NULL,
        "opportunityId" text NOT NULL REFERENCES "franchise_opportunities"("id") ON DELETE CASCADE,
        "businessId" text NOT NULL REFERENCES "business"("id") ON DELETE CASCADE,
        "franchisePartnerId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "applicantType" franchise_applicant_type NOT NULL,
        "applicantName" text NOT NULL,
        "email" text NOT NULL,
        "phone" text NOT NULL,
        "preferredLocation" text NOT NULL,
        "investmentCapacity" text NOT NULL,
        "businessExperience" text,
        "relevantExperience" text,
        "whyInterested" text,
        "additionalComments" text,
        "documentUrl" text,
        "status" franchise_application_status DEFAULT 'submitted' NOT NULL,
        "reviewNotes" text,
        "reviewedBy" text REFERENCES "user"("id") ON DELETE SET NULL,
        "reviewedAt" timestamp,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS fa_opportunity_id_idx ON franchise_applications ("opportunityId");`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS fa_business_id_idx ON franchise_applications ("businessId");`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS fa_partner_id_idx ON franchise_applications ("franchisePartnerId");`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS fa_status_idx ON franchise_applications ("status");`);
    console.log('✓ franchise_applications table & indexes ready');

    console.log('\n🎉 All franchise tables and enums successfully created!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrateFranchise();
