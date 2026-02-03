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

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@meditation.org',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('✅ Admin user created');

    // Create Content Manager
    const managerPassword = await bcrypt.hash('manager123', 10);
    const manager = await User.create({
      name: 'Content Manager',
      email: 'manager@meditation.org',
      password: managerPassword,
      role: 'content_manager',
    });
    console.log('✅ Content manager created');

    // Create Content Reviewer
    const reviewerPassword = await bcrypt.hash('reviewer123', 10);
    const reviewer = await User.create({
      name: 'Content Reviewer',
      email: 'reviewer@meditation.org',
      password: reviewerPassword,
      role: 'content_reviewer',
    });
    console.log('✅ Content reviewer created');

    // Create events from Buddha-CEO website
    const events = await Event.create([
      {
        title: 'Vibe - Meditation for Confidence, Clarity & Manifestation',
        description: 'A 40-day Online Program for Youth & Graduating Students. Experience transformation through meditation with Master Chandra. This program is designed to help young minds build confidence, gain clarity, and manifest their dreams through the power of meditation.',
        type: 'beginner_online',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-03-28'),
        timings: '7:00 to 8:00 AM IST | 8:30 to 9:30 PM US ET',
        imageUrl: 'https://static.wixstatic.com/media/6add23_c6a79b8fb661467e89d4e6cc5f03289e~mv2.png/v1/crop/x_502,y_0,w_795,h_600/fill/w_432,h_326,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/vibe%20bg.png',
        maxParticipants: 500,
        currentRegistrations: 127,
        status: 'upcoming',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          venue: 'Online & Pyramid Valley',
          latitude: 12.9716,
          longitude: 77.5946,
        },
      },
      {
        title: 'Renew - Excellence through Meditation',
        description: 'A 40-Day Online Scientific Meditation Program for Leaders, Professionals, Entrepreneurs & Seekers. Join us for this transformative journey to renew your mind, body, and spirit through proven meditation techniques.',
        type: 'advanced_online',
        startDate: new Date('2025-04-05'),
        endDate: new Date('2025-05-14'),
        timings: '6:30 to 7:30 AM IST',
        imageUrl: 'https://static.wixstatic.com/media/6add23_6a4d91f1fe1746a2a1bd49f48e81571f~mv2.jpg/v1/crop/x_596,y_0,w_3439,h_2595/fill/w_432,h_326,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/breathing-space-calming-image-with-great-blank-copy-space-ai-generated.jpg',
        maxParticipants: 300,
        currentRegistrations: 89,
        status: 'upcoming',
        location: {
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          venue: 'Online & Pyramid Valley',
          latitude: 13.0827,
          longitude: 80.2707,
        },
      },
      {
        title: 'Beginner Physical Program - Bangalore',
        description: 'In-person meditation program for beginners. Learn foundational techniques in a serene environment.',
        type: 'beginner_physical',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-10'),
        timings: '6:00 AM - 8:00 AM',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        maxParticipants: 50,
        currentRegistrations: 42,
        status: 'upcoming',
        location: {
          address: 'Pyramid Valley International',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          venue: 'Pyramid Valley International',
          latitude: 12.9716,
          longitude: 77.5946,
        },
      },
      {
        title: '2nd Global Conference of Meditation Leaders 2025',
        description: 'Join meditation leaders from around the world for this transformative conference featuring Master Chandra and other renowned meditation teachers. Network, learn, and grow with the global meditation community.',
        type: 'conference',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-17'),
        timings: '9:00 AM - 6:00 PM IST',
        imageUrl: 'https://static.wixstatic.com/media/6add23_05e57531f48246498cb143ac7d687e3c~mv2.jpg/v1/fill/w_679,h_525,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6add23_05e57531f48246498cb143ac7d687e3c~mv2.jpg',
        maxParticipants: 1000,
        currentRegistrations: 456,
        status: 'upcoming',
        location: {
          address: 'Pyramid Valley International',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          venue: 'Pyramid Valley International',
          latitude: 12.9716,
          longitude: 77.5946,
        },
      },
      {
        title: 'Meditation Retreat in Himalayas',
        description: 'Join us for a transformative 7-day meditation retreat in the serene Himalayan mountains. Experience inner peace like never before.',
        type: 'advanced_physical',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-07'),
        timings: '5:00 AM - 8:00 PM',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        maxParticipants: 30,
        currentRegistrations: 15,
        status: 'upcoming',
        location: {
          address: 'Rishikesh',
          city: 'Rishikesh',
          state: 'Uttarakhand',
          country: 'India',
          venue: 'Himalayan Meditation Center',
          latitude: 30.0869,
          longitude: 78.2676,
        },
      },
      {
        title: 'Corporate Wellness Workshop',
        description: 'Special meditation workshop for corporate professionals. Reduce stress and improve productivity.',
        type: 'beginner_online',
        startDate: new Date('2025-05-15'),
        endDate: new Date('2025-05-15'),
        timings: '6:00 PM - 8:00 PM IST',
        imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
        maxParticipants: 100,
        currentRegistrations: 45,
        status: 'upcoming',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          venue: 'Online (Zoom)',
          latitude: 19.0760,
          longitude: 72.8777,
        },
      },
    ]);
    console.log(`✅ Created ${events.length} events`);

    // Create team members from Buddha-CEO
    const teamMembers = await Content.create([
      {
        title: 'Dr. Chandra Pulamarasetti',
        type: 'team_member',
        status: 'published',
        content: {
          role: 'Founder & CEO',
          image: 'https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_183,h_48,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png',
          bio: 'Former corporate leader with 25+ years of experience in the IT industry. Having served in various leadership roles in multinational companies, Dr. Chandra experienced the transformative power of meditation and dedicated his life to bringing these ancient techniques to modern leaders. He is the author of several books on meditation and mindfulness.',
          linkedin: 'https://linkedin.com/in/chandra',
          quote: 'Meditation is not just about closing your eyes. It is about opening your mind to infinite possibilities.',
        },
        createdBy: admin._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: 'Padma Shri Dr. RV Ramani',
        type: 'team_member',
        status: 'published',
        content: {
          role: 'Founder and Managing Trustee, Sankara Eye Foundation',
          image: 'https://static.wixstatic.com/media/ea3b9d_9fbb22065652401f96ef1ad93fb50c0a~mv2.jpg/v1/fill/w_229,h_159,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Padma%20Shri%20Dr_%20RV%20Ramani%20Founder%20and%20Man.jpg',
          bio: 'Renowned ophthalmologist and social entrepreneur. Recipient of Padma Shri award for his contributions to eye care. He has been practicing meditation for over 30 years and attributes his success and clarity to his daily meditation practice.',
          quote: '"We are that infinite energy with unlimited capability. The entire world is one big family. Meditation helps us to realize these concepts and live them. The 40-day meditation program is really transformative."',
        },
        createdBy: admin._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: 'Padma Shri D. R. Kaarthikeyan',
        type: 'team_member',
        status: 'published',
        content: {
          role: 'Former Director-CBI, NHRC, CRPF',
          image: 'https://i.ytimg.com/vi/MSUXw7Dxle8/maxresdefault.jpg',
          bio: 'Distinguished police officer and recipient of Padma Shri award. Known for his integrity and dedication to public service. He credits meditation for giving him the inner strength and clarity to handle challenging situations throughout his career.',
        },
        createdBy: admin._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: 'Dr. S.V. Balasubramaniam',
        type: 'team_member',
        status: 'published',
        content: {
          role: 'Founder and Chairman, Bannari Amman Group',
          image: 'https://i.ytimg.com/vi/s4vH34O7rOs/maxresdefault.jpg',
          bio: 'Industrialist and philanthropist. Founder of the Bannari Amman Group, one of South India\'s leading business conglomerates. A strong advocate of meditation in the corporate world.',
        },
        createdBy: admin._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
    ]);
    console.log(`✅ Created ${teamMembers.length} team members`);

    // Create testimonials from Buddha-CEO with actual YouTube videos
    const testimonials = await Content.create([
      {
        title: 'Padma Shri D. R. Kaarthikeyan',
        type: 'testimonial',
        status: 'published',
        content: {
          subtitle: 'Former Director-CBI, NHRC, CRPF',
          videoUrl: 'https://www.youtube.com/watch?v=MSUXw7Dxle8',
          image: 'https://i.ytimg.com/vi/MSUXw7Dxle8/maxresdefault.jpg',
          quote: 'Meditation has given me the inner strength and clarity to handle even the most challenging situations in my career.',
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: 'Dr. S.V. Balasubramaniam',
        type: 'testimonial',
        status: 'published',
        content: {
          subtitle: 'Founder and Chairman, Bannari Amman Group',
          videoUrl: 'https://www.youtube.com/watch?v=s4vH34O7rOs',
          image: 'https://i.ytimg.com/vi/s4vH34O7rOs/hqdefault.jpg',
          quote: 'Meditation has been instrumental in my personal and professional growth, bringing balance and success.',
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: 'Inner Change Through Meditation Transforms Everything',
        type: 'testimonial',
        status: 'published',
        content: {
          subtitle: 'Master Chandra #patriji #meditation',
          videoUrl: 'https://www.youtube.com/watch?v=gDcPRh5Gu4A',
          image: 'https://i.ytimg.com/vi/gDcPRh5Gu4A/maxresdefault.jpg',
          quote: 'The inner transformation through meditation is what creates outer change in all aspects of life.',
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: 'From Vertigo to Victory: A Senior Leader\'s Journey',
        type: 'testimonial',
        status: 'published',
        content: {
          subtitle: 'Raji Iyengar',
          videoUrl: 'https://www.youtube.com/watch?v=_5NTRAnF-Ic',
          image: 'https://i.ytimg.com/vi/_5NTRAnF-Ic/maxresdefault.jpg',
          quote: 'How meditation helped overcome severe vertigo and transformed both health and career.',
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: 'Regaining Health Through Meditation',
        type: 'testimonial',
        status: 'published',
        content: {
          subtitle: 'Health Transformation Story',
          videoUrl: 'https://www.youtube.com/watch?v=13AItqOsrDM',
          image: 'https://i.ytimg.com/vi/13AItqOsrDM/maxresdefault.jpg',
          quote: 'A powerful testimony of how meditation practices helped regain health and vitality.',
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: 'How MEDITATION Helped Achieve 10/10 in Board Exams',
        type: 'testimonial',
        status: 'published',
        content: {
          subtitle: 'Indrani Krishna Mohan',
          videoUrl: 'https://www.youtube.com/watch?v=9QSKyMf98uY',
          image: 'https://i.ytimg.com/vi/9QSKyMf98uY/maxresdefault.jpg',
          quote: 'Achieving perfect scores through the power of meditation and focus.',
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
    ]);
    console.log(`✅ Created ${testimonials.length} testimonials`);

    // Create sample achievements
    const achievements = await Content.create([
      {
        title: '50,000+ Lives Transformed',
        type: 'achievement',
        status: 'published',
        content: {
          icon: 'award',
          category: 'Impact',
          year: '2024',
          description: 'Through our meditation programs worldwide',
          highlights: ['Programs conducted globally', 'Transformed lives across 25+ countries', 'Continued growing impact'],
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: '100+ Corporate Programs',
        type: 'achievement',
        status: 'published',
        content: {
          icon: 'trending',
          category: 'Corporate',
          year: '2024',
          description: 'Delivered to leading organizations globally',
          highlights: ['Fortune 500 companies', 'Leadership development programs', 'Employee wellness initiatives'],
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: '2 Global Conferences',
        type: 'achievement',
        status: 'published',
        content: {
          icon: 'users',
          category: 'Events',
          year: '2024',
          description: 'Successfully organized meditation leader conferences',
          highlights: ['Global meditation leaders', 'Cross-cultural exchange', 'Research presentations'],
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: '15+ Years of Service',
        type: 'achievement',
        status: 'published',
        content: {
          icon: 'target',
          category: 'Milestone',
          year: '2024',
          description: 'Dedicated to spreading meditation and wellness',
          highlights: ['Consistent service', 'Growing community', 'Established methodologies'],
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: '25+ Global Centers',
        type: 'achievement',
        status: 'published',
        content: {
          icon: 'trending',
          category: 'Expansion',
          year: '2024',
          description: 'Meditation centers established worldwide',
          highlights: ['Multiple countries', 'Trained instructors', 'Regular programs'],
        },
        createdBy: manager._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
    ]);
    console.log(`✅ Created ${achievements.length} achievements`);

    // Create resources from Buddha-CEO with actual videos and links
    const resources = await Resource.insertMany([
      // Concept Videos
      {
        title: 'Satya & Ahimsa in Every Word, Every Action',
        type: 'video',
        description: 'Master Chandra teaches about truth (Satya) and non-violence (Ahimsa) in every word and action.',
        thumbnailUrl: 'https://i.ytimg.com/vi/DDcYmHt-wwQ/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=DDcYmHt-wwQ',
        category: 'Teachings',
        order: 1,
      },
      {
        title: 'Why Meditation Feels Good',
        type: 'video',
        description: 'Understanding the science and feeling behind why meditation feels so good. #buddhaceo #meditation',
        thumbnailUrl: 'https://i.ytimg.com/vi/W7r5kxpgWyk/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=W7r5kxpgWyk',
        category: 'Concept Videos',
        order: 2,
      },
      {
        title: 'Meditation Helps Gain Radiant Health, Energy and Memory Power',
        type: 'video',
        description: 'Discover how meditation practices can help you gain radiant health, boundless energy, and enhanced memory power.',
        thumbnailUrl: 'https://i.ytimg.com/vi/RUH6F0aEU7g/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=RUH6F0aEU7g',
        category: 'Health & Wellness',
        order: 3,
      },
      {
        title: 'Meditation Eliminates Addictions and Reduces Food Cravings',
        type: 'video',
        description: 'Learn how meditation can help eliminate addictions and reduce food cravings naturally.',
        thumbnailUrl: 'https://i.ytimg.com/vi/ZTH-ma9nMiY/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=ZTH-ma9nMiY',
        category: 'Health & Wellness',
        order: 4,
      },
      // Guided Meditations
      {
        title: 'Breath Mindfulness Meditation - Quantum Field of Possibilities',
        type: 'video',
        description: 'Guided breath mindfulness meditation to connect with the quantum field of possibilities.',
        thumbnailUrl: 'https://i.ytimg.com/vi/n_99IlB3V-Y/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=n_99IlB3V-Y',
        category: 'Guided Meditations',
        order: 5,
      },
      {
        title: 'Breath Mindfulness Meditation - Staying in the Present!',
        type: 'video',
        description: 'Practice staying in the present moment with this guided breath mindfulness meditation.',
        thumbnailUrl: 'https://i.ytimg.com/vi/QlMdcXWXYEY/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=QlMdcXWXYEY',
        category: 'Guided Meditations',
        order: 6,
      },
      // Books (placeholder - would need actual PDFs)
      {
        title: 'Anapanasati Meditation - Beginner\'s Guide',
        type: 'book',
        description: 'A comprehensive guide to breath mindfulness meditation practice. Learn the fundamentals and benefits of Anapanasati.',
        thumbnailUrl: 'https://static.wixstatic.com/media/ea3b9d_2185c2caa3754f35ac4323cb2705ec0f~mv2.png/v1/fill/w_264,h_174,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/shutterstock_1864523959LOGO.png',
        downloadUrl: null, // Would be actual PDF in production
        category: 'Beginner',
        order: 1,
      },
      // Links
      {
        title: 'Pyramid Valley International',
        type: 'link',
        description: 'The International Headquarters of PSSM - Learn more about meditation and spiritual science at the world\'s largest meditation pyramid.',
        thumbnailUrl: null,
        linkUrl: 'https://pyramidvalley.org',
        category: 'Meditation Centers',
        order: 1,
      },
      {
        title: 'Buddha-CEO Quantum Foundation',
        type: 'link',
        description: 'Official website - Empowering leaders to grow their organizations with a higher sense of purpose towards their employees, communities and the larger society.',
        thumbnailUrl: 'https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_183,h_48,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png',
        linkUrl: 'https://www.buddhaceo.org',
        category: 'Organizations',
        order: 2,
      },
    ]);
    console.log(`✅ Created ${resources.length} resources`);

    // Create vision and mission
    const visionMission = await Content.create([
      {
        title: 'Our Vision',
        type: 'service',
        status: 'published',
        content: {
          description: 'To create a world where every individual experiences inner peace and radiant health through the practice of meditation, leading to a compassionate and harmonious global community.',
        },
        createdBy: admin._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
      {
        title: 'Our Mission',
        type: 'service',
        status: 'published',
        content: {
          description: 'Empower leaders, professionals, and individuals with transformative meditation wisdom and techniques, fostering personal growth, organizational excellence, and social responsibility.',
        },
        createdBy: admin._id,
        reviewedBy: reviewer._id,
        publishedAt: new Date(),
      },
    ]);
    console.log(`✅ Created vision and mission`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@meditation.org / admin123');
    console.log('   Manager: manager@meditation.org / manager123');
    console.log('   Reviewer: reviewer@meditation.org / reviewer123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
