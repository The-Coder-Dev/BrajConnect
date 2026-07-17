import 'dotenv/config';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  const connectionString = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL or DATABASE_DIRECT_URL must be set');
  }

  const sql = postgres(connectionString, { prepare: false });

  try {
    console.log('🔧 Applying schema migration for app-specific tables...\n');

    // Step 1: Create enum types if they don't exist
    const enumStatements = [
      `DO $$ BEGIN CREATE TYPE business_status AS ENUM('draft', 'pending_review', 'published', 'rejected', 'suspended', 'archived'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
      `DO $$ BEGIN CREATE TYPE verification_status AS ENUM('not_submitted', 'pending', 'verified', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
      `DO $$ BEGIN CREATE TYPE social_platform AS ENUM('website', 'instagram', 'facebook', 'linkedin', 'youtube', 'x', 'whatsapp', 'telegram'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
      `DO $$ BEGIN CREATE TYPE preferred_contact_method AS ENUM('phone', 'whatsapp', 'email'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
      `DO $$ BEGIN CREATE TYPE document_type AS ENUM('gst', 'pan', 'registration_certificate', 'trade_license', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
      `DO $$ BEGIN CREATE TYPE input_type AS ENUM('text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'date', 'switch'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    ];

    for (const stmt of enumStatements) {
      await sql.unsafe(stmt);
    }
    console.log('✓ Enums applied');

    // Step 2: Add 'switch' if input_type already existed without it
    await sql.unsafe(`ALTER TYPE input_type ADD VALUE IF NOT EXISTS 'switch'`);
    console.log('✓ "switch" ensured in input_type enum');

    // Step 3: Apply app-specific tables using IF NOT EXISTS
    const tableSQL = fs.readFileSync(
      path.join(process.cwd(), 'src', 'db', 'migrate-tables.sql'),
      'utf8'
    );
    const statements = tableSQL.split('---BREAK---').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await sql.unsafe(stmt);
    }
    console.log('✓ Tables applied');

    console.log('\n✅ Migration complete!');
  } catch (err: any) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();

