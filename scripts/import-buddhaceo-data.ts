import { config } from 'dotenv';
import path from 'path';

async function main() {
  // Load .env.local explicitly
  const envPath = path.resolve(process.cwd(), '.env.local');
  const result = config({ path: envPath });

  if (!result.parsed) {
    console.error('Warning: .env.local file not found or could not be parsed');
    console.error('Make sure .env.local exists with MONGODB_URI defined');
    process.exit(1);
  }

  // Dynamic imports after environment is loaded
  const connectDB = (await import('@/lib/mongodb')).default;
  const Content = (await import('@/lib/models/Content')).default;
  const Resource = (await import('@/lib/models/Resource')).default;
  const Event = (await import('@/lib/models/Event')).default;
  const User = (await import('@/lib/models/User')).default;

  // Scraped data from Buddha CEO website
  const buddhaCEOData = {
    testimonials: [
      {
        title: "Padma Shri D. R. Kaarthikeyan - Former Director-CBI, NHRC, CRPF",
        type: "testimonial" as const,
        content: {
          testimonial: "Former Director of CBI, NHRC, and CRPF shares their experience with meditation",
          author: "Padma Shri D. R. Kaarthikeyan",
          position: "Former Director-CBI, NHRC, CRPF",
          videoUrl: "https://www.youtube.com/watch?v=MSUXw7Dxle8",
          thumbnailUrl: "https://i.ytimg.com/vi/MSUXw7Dxle8/maxresdefault.jpg"
        },
        isFeatured: true,
        status: "published" as const
      },
      {
        title: "Dr. S.V. Balasubramaniam - Bannari Amman Group",
        type: "testimonial" as const,
        content: {
          testimonial: "Founder and Chairman of Bannari Amman Group shares their meditation journey",
          author: "Dr. S.V. Balasubramaniam",
          position: "Founder and Chairman, Bannari Amman Group",
          videoUrl: "https://www.youtube.com/watch?v=s4vH34O7rOs",
          thumbnailUrl: "https://i.ytimg.com/vi/s4vH34O7rOs/hqdefault.jpg"
        },
        isFeatured: true,
        status: "published" as const
      },
      {
        title: "Inner Change Through Meditation Transforms Everything",
        type: "testimonial" as const,
        content: {
          testimonial: "How meditation transforms everything from within - #patriji #meditation",
          author: "Buddha CEO Quantum Foundation",
          videoUrl: "https://www.youtube.com/watch?v=gDcPRh5Gu4A",
          thumbnailUrl: "https://i.ytimg.com/vi/gDcPRh5Gu4A/maxresdefault.jpg"
        },
        status: "published" as const
      },
      {
        title: "From Vertigo to Victory: A Senior Leaders Life-Changing Meditation Journey",
        type: "testimonial" as const,
        content: {
          testimonial: "Raji Iyengar shares how meditation helped overcome vertigo and achieve victory",
          author: "Raji Iyengar",
          videoUrl: "https://www.youtube.com/watch?v=_5NTRAnF-Ic",
          thumbnailUrl: "https://i.ytimg.com/vi/_5NTRAnF-Ic/maxresdefault.jpg"
        },
        status: "published" as const
      },
      {
        title: "Regaining Health Through Meditation",
        type: "testimonial" as const,
        content: {
          testimonial: "How meditation helped in regaining health and wellness",
          author: "Buddha CEO Quantum Foundation",
          videoUrl: "https://www.youtube.com/watch?v=13AItqOsrDM",
          thumbnailUrl: "https://i.ytimg.com/vi/13AItqOsrDM/maxresdefault.jpg"
        },
        status: "published" as const
      },
      {
        title: "How MEDITATION Helped Achieve 10/10 in Board Exams",
        type: "testimonial" as const,
        content: {
          testimonial: "Indrani Krishna Mohan shares how meditation helped achieve perfect scores in board exams",
          author: "Indrani Krishna Mohan",
          position: "Student",
          videoUrl: "https://www.youtube.com/watch?v=9QSKyMf98uY",
          thumbnailUrl: "https://i.ytimg.com/vi/9QSKyMf98uY/maxresdefault.jpg"
        },
        isFeatured: true,
        status: "published" as const
      },
      {
        title: "Padma Shri Dr. RV Ramani - Founder and Managing Trustee",
        type: "testimonial" as const,
        content: {
          testimonial: "We are that infinite energy with unlimited capability. The entire world is one big family. Meditation helps us to realize these concepts and live them. The 40-day meditation program is really transformative.",
          author: "Padma Shri Dr. RV Ramani",
          position: "Founder and Managing Trustee, Sankara Eye Foundation",
          imageUrl: "https://static.wixstatic.com/media/ea3b9d_9fbb22065652401f96ef1ad93fb50c0a~mv2.jpg/v1/fill/w_229,h_159,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Padma%20Shri%20Dr_%20RV%20Ramani%20Founder%20and%20Man.jpg"
        },
        isFeatured: true,
        status: "published" as const
      }
    ],

    videos: [
      {
        title: "Satya & Ahimsa in Every Word, Every Action by Master Chandra",
        type: "video_content" as const,
        content: {
          description: "Master Chandra explains the importance of Satya (truth) and Ahimsa (non-violence) in every word and action",
          videoUrl: "https://www.youtube.com/watch?v=DDcYmHt-wwQ",
          thumbnailUrl: "https://i.ytimg.com/vi/DDcYmHt-wwQ/maxresdefault.jpg",
          category: "Teachings",
          tags: ["satya", "ahimsa", "meditation", "master chandra"]
        },
        status: "published" as const
      },
      {
        title: "Why Meditation Feels Good",
        type: "video_content" as const,
        content: {
          description: "Understanding the science behind why meditation feels good and its benefits",
          videoUrl: "https://www.youtube.com/watch?v=W7r5kxpgWyk",
          thumbnailUrl: "https://i.ytimg.com/vi/W7r5kxpgWyk/maxresdefault.jpg",
          category: "Concept Videos",
          tags: ["buddhaceo", "chandrapulamarasetti", "meditation", "conceptvideos"]
        },
        status: "published" as const
      },
      {
        title: "Meditation Helps Gain Radiant Health, Energy and Memory Power",
        type: "video_content" as const,
        content: {
          description: "Learn how meditation practice can help you gain radiant health, boundless energy, and improved memory power",
          videoUrl: "https://www.youtube.com/watch?v=RUH6F0aEU7g",
          thumbnailUrl: "https://i.ytimg.com/vi/RUH6F0aEU7g/maxresdefault.jpg",
          category: "Benefits",
          tags: ["health", "energy", "memory", "meditation"]
        },
        status: "published" as const
      },
      {
        title: "Meditation Eliminates Addictions and Reduces Food Cravings",
        type: "video_content" as const,
        content: {
          description: "Discover how meditation can help eliminate addictions and reduce food cravings naturally",
          videoUrl: "https://www.youtube.com/watch?v=ZTH-ma9nMiY",
          thumbnailUrl: "https://i.ytimg.com/vi/ZTH-ma9nMiY/sddefault.jpg",
          category: "Benefits",
          tags: ["addiction", "food cravings", "meditation", "health"]
        },
        status: "published" as const
      },
      {
        title: "Breath Mindfulness Meditation - Quantum Field of Possibilities",
        type: "video_content" as const,
        content: {
          description: "Explore the quantum field of possibilities through breath mindfulness meditation",
          videoUrl: "https://www.youtube.com/watch?v=n_99IlB3V-Y",
          thumbnailUrl: "https://i.ytimg.com/vi/n_99IlB3V-Y/maxresdefault.jpg",
          category: "Meditation Techniques",
          tags: ["breath mindfulness", "quantum field", "meditation"]
        },
        status: "published" as const
      },
      {
        title: "Breath Mindfulness Meditation - Staying in the Present",
        type: "video_content" as const,
        content: {
          description: "Learn to stay in the present moment through breath mindfulness meditation practice",
          videoUrl: "https://www.youtube.com/watch?v=QlMdcXWXYEY",
          thumbnailUrl: "https://i.ytimg.com/vi/QlMdcXWXYEY/maxresdefault.jpg",
          category: "Meditation Techniques",
          tags: ["breath mindfulness", "present moment", "meditation"]
        },
        status: "published" as const
      }
    ],

    events: [
      {
        title: "Vibe - Meditation for Confidence, Clarity & Manifestation",
        description: "A 40-day Online Program for Youth & Graduating Students focused on building confidence, clarity, and manifestation through meditation practice.",
        type: "beginner_online" as const,
        startDate: new Date("2025-11-10T07:00:00"),
        endDate: new Date("2025-12-19T08:00:00"),
        timings: "7:00 to 8:00 AM IST | 8:30 to 9:30 PM US ET",
        imageUrl: "https://static.wixstatic.com/media/6add23_c6a79b8fb661467e89d4e6cc5f03289e~mv2.png/v1/crop/x_502,y_0,w_795,h_600/fill/w_432,h_326,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/vibe%20bg.png",
        registrationLink: "https://www.buddhaceo.org",
        status: "upcoming" as const,
        location: {
          online: true,
          city: "Online",
          country: "Global"
        }
      },
      {
        title: "Excellence through Meditation - Renew",
        description: "A 40-Day Online Scientific Meditation Program for Leaders, Professionals, Entrepreneurs & Seekers to achieve excellence through meditation.",
        type: "advanced_online" as const,
        startDate: new Date("2026-01-26T07:00:00"),
        endDate: new Date("2026-03-06T08:00:00"),
        timings: "7:00 to 8:00 AM IST | 8:30 to 9:30 PM US ET",
        imageUrl: "https://static.wixstatic.com/media/6add23_6a4d91f1fe1746a2a1bd49f48e81571f~mv2.jpg/v1/crop/x_596,y_0,w_3439,h_2595/fill/w_432,h_326,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/breathing-space-calming-image-with-great-blank-copy-space-ai-generated.jpg",
        registrationLink: "https://www.buddhaceo.org",
        status: "upcoming" as const,
        location: {
          online: true,
          city: "Online",
          country: "Global"
        }
      }
    ],

    resources: [
      {
        title: "Beginner's Guided Meditation with Music",
        type: "video" as const,
        description: "Beginner's introduction to meditation - Try this 15 minutes Guided Meditation with Music, and offer calmness and quietude to your mind.",
        videoUrl: "https://www.youtube.com/watch?v=example",
        category: "Guided Meditation",
        order: 1,
        thumbnailUrl: "https://static.wixstatic.com/media/ea3b9d_2185c2caa3754f35ac4323cb2705ec0f~mv2.png/v1/fill/w_264,h_174,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/shutterstock_1864523959LOGO.png"
      }
    ],

    corporateProgram: {
      title: "Corporate Meditation Programs",
      type: "mixed_media" as const,
      content: {
        description: "Buddha CEO provides transformative meditation wisdom & techniques in a compassionate and friendly environment. Through various programs - online and onsite - and content, we empower leaders to grow their organizations with a higher sense of purpose, towards their employees, communities and the larger society.",
        programDetails: "Our corporate meditation programs are designed to help leaders and organizations achieve excellence through meditation practice. We offer both online and onsite programs tailored to corporate needs.",
        imageUrl: "https://static.wixstatic.com/media/ea3b9d_19632804424d49dd8cbd71463fb199c9~mv2.png/v1/fill/w_264,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screen%20Shot%202021-03-20%20at%207_50_12%20PM.png"
      },
      status: "published" as const
    }
  };

  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database');

    // Find or create admin user for import
    console.log('\n🔍 Checking for admin user...');
    let adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      console.log('⚠️  No admin user found. Creating default admin user...');
      const bcrypt = (await import('bcryptjs')).default;
      const hashedPassword = await bcrypt.hash('admin123', 10);

      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@meditation-institute.org',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@meditation-institute.org');
    } else {
      console.log(`✅ Using existing admin user: ${adminUser.email}`);
    }

    let importStats = {
      testimonials: 0,
      videos: 0,
      events: 0,
      resources: 0,
      corporate: 0,
      errors: [] as string[]
    };

    // Import Testimonials
    console.log('\n📥 Importing testimonials...');
    for (const testimonial of buddhaCEOData.testimonials) {
      try {
        const existingContent = await Content.findOne({ title: testimonial.title });
        if (existingContent) {
          console.log(`⚠️  Testimonial already exists: ${testimonial.title}`);
          continue;
        }

        await Content.create({
          ...testimonial,
          createdBy: adminUser!._id
        });
        importStats.testimonials++;
        console.log(`✅ Imported: ${testimonial.title}`);
      } catch (error: any) {
        importStats.errors.push(`Testimonial "${testimonial.title}": ${error.message}`);
        console.error(`❌ Error importing testimonial: ${error.message}`);
      }
    }

    // Import Videos
    console.log('\n📥 Importing educational videos...');
    for (const video of buddhaCEOData.videos) {
      try {
        const existingContent = await Content.findOne({ title: video.title });
        if (existingContent) {
          console.log(`⚠️  Video already exists: ${video.title}`);
          continue;
        }

        await Content.create({
          ...video,
          createdBy: adminUser!._id
        });
        importStats.videos++;
        console.log(`✅ Imported: ${video.title}`);
      } catch (error: any) {
        importStats.errors.push(`Video "${video.title}": ${error.message}`);
        console.error(`❌ Error importing video: ${error.message}`);
      }
    }

    // Import Events
    console.log('\n📥 Importing events...');
    for (const eventData of buddhaCEOData.events) {
      try {
        const existingEvent = await Event.findOne({ title: eventData.title });
        if (existingEvent) {
          console.log(`⚠️  Event already exists: ${eventData.title}`);
          continue;
        }

        await Event.create(eventData);
        importStats.events++;
        console.log(`✅ Imported: ${eventData.title}`);
      } catch (error: any) {
        importStats.errors.push(`Event "${eventData.title}": ${error.message}`);
        console.error(`❌ Error importing event: ${error.message}`);
      }
    }

    // Import Resources
    console.log('\n📥 Importing resources...');
    for (const resource of buddhaCEOData.resources) {
      try {
        const existingResource = await Resource.findOne({ title: resource.title });
        if (existingResource) {
          console.log(`⚠️  Resource already exists: ${resource.title}`);
          continue;
        }

        await Resource.create(resource);
        importStats.resources++;
        console.log(`✅ Imported: ${resource.title}`);
      } catch (error: any) {
        importStats.errors.push(`Resource "${resource.title}": ${error.message}`);
        console.error(`❌ Error importing resource: ${error.message}`);
      }
    }

    // Import Corporate Program Content
    console.log('\n📥 Importing corporate program information...');
    try {
      const existingCorporate = await Content.findOne({ title: buddhaCEOData.corporateProgram.title });
      if (!existingCorporate) {
        await Content.create({
          ...buddhaCEOData.corporateProgram,
          createdBy: adminUser!._id
        });
        importStats.corporate++;
        console.log(`✅ Imported: ${buddhaCEOData.corporateProgram.title}`);
      } else {
        console.log(`⚠️  Corporate program already exists`);
      }
    } catch (error: any) {
      importStats.errors.push(`Corporate Program: ${error.message}`);
      console.error(`❌ Error importing corporate program: ${error.message}`);
    }

    // Print Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Testimonials imported: ${importStats.testimonials}`);
    console.log(`✅ Videos imported: ${importStats.videos}`);
    console.log(`✅ Events imported: ${importStats.events}`);
    console.log(`✅ Resources imported: ${importStats.resources}`);
    console.log(`✅ Corporate programs imported: ${importStats.corporate}`);
    console.log(`❌ Errors: ${importStats.errors.length}`);

    if (importStats.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      importStats.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    console.log('\n✅ Import completed!');
    process.exit(0);

  } catch (error: any) {
    console.error('❌ Fatal error during import:', error);
    process.exit(1);
  }
}

main();
