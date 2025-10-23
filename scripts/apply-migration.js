#!/usr/bin/env node

/**
 * Script pour appliquer la migration multi-tenant sur Supabase
 * Usage: node scripts/apply-migration.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY are required');
  console.error('Please set them in your .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  try {
    console.log('🚀 Starting multi-tenant migration...\n');

    // Lire le fichier de migration
    const migrationPath = join(__dirname, '../supabase/migrations/20251022223423_saas_multi_tenant.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded');
    console.log('📊 Executing SQL migration...\n');

    // Note: L'API Supabase ne permet pas d'exécuter du SQL arbitraire directement
    // Il faut utiliser le Dashboard ou le CLI
    console.log('⚠️  This script requires Supabase CLI or Dashboard access');
    console.log('\n📋 Please follow these steps:\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/axljdeabsorjtzaxnxrd/sql/new');
    console.log('2. Copy the content of: supabase/migrations/20251022223423_saas_multi_tenant.sql');
    console.log('3. Paste it in the SQL editor');
    console.log('4. Click "Run" to execute the migration\n');

    console.log('Alternative: Use Supabase CLI');
    console.log('npx supabase link --project-ref axljdeabsorjtzaxnxrd');
    console.log('npx supabase db push\n');

    // Vérifier la connexion
    const { data, error } = await supabase.from('company_info').select('*').limit(1);

    if (error) {
      console.error('❌ Error connecting to Supabase:', error.message);
    } else {
      console.log('✅ Successfully connected to Supabase');
      console.log('📊 Current company_info data:', data);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyMigration();
