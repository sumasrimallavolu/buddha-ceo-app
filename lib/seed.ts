// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// Now we can import other modules
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Content, Event, Resource, TeacherEnrollment } from './models';
import connectDB from './mongodb';

async function seed() {
  try {
    await connectDB();
    console.log('🌱 Seeding database with Buddha-CEO Quantum Foundation data...');

    // Clear existing data
    await User.deleteMany({});
    await Content.deleteMany({});
    await Event.deleteMany({});
    await Resource.deleteMany({});
    await TeacherEnrollment.deleteMany({});

    // Get default credentials from environment variables or use fallbacks
    // ⚠️  SECURITY WARNING: These are default credentials for development only.
    //    In production, override these via environment variables and change immediately after first login.
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@meditation.org';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const managerEmail = process.env.DEFAULT_MANAGER_EMAIL || 'manager@meditation.org';
    const managerPassword = process.env.DEFAULT_MANAGER_PASSWORD || 'manager123';
    const reviewerEmail = process.env.DEFAULT_REVIEWER_EMAIL || 'reviewer@meditation.org';
    const reviewerPassword = process.env.DEFAULT_REVIEWER_PASSWORD || 'reviewer123';

    // Create Admin User
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log('✅ Admin user created');

    // Create Content Manager
    const managerHashedPassword = await bcrypt.hash(managerPassword, 10);
    const manager = await User.create({
      name: 'Content Manager',
      email: managerEmail,
      password: managerHashedPassword,
      role: 'content_manager',
    });
    console.log('✅ Content manager created');

    // Create Content Reviewer
    const reviewerHashedPassword = await bcrypt.hash(reviewerPassword, 10);
    const reviewer = await User.create({
      name: 'Content Reviewer',
      email: reviewerEmail,
      password: reviewerHashedPassword,
      role: 'content_reviewer',
    });
    console.log('✅ Content reviewer created');
          

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
    console.log(`   Manager: ${managerEmail} / ${managerPassword}`);
    console.log(`   Reviewer: ${reviewerEmail} / ${reviewerPassword}`);
    console.log('\n⚠️  SECURITY REMINDER: Change these passwords immediately after first login!');
    console.log('   Navigate to /admin/users to manage user accounts.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
