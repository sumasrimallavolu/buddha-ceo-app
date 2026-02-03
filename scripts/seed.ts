// This script MUST load environment variables BEFORE importing anything else
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// Verify environment variables are loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  console.error(`📂 Looking for env file at: ${envPath}`);
  process.exit(1);
}

// Now import and run the seed function
import('./../lib/seed.js');
