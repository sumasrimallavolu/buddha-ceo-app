// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const mongoose = require('mongoose');

const testimonials = [
  {
    title: 'Meditation Experience',
    subtitle: 'Program Participant',
    quote: 'This meditation program has transformed my life in ways I never imagined. The techniques are simple yet profound.',
    videoUrl: 'https://www.youtube.com/watch?v=9QSKyMf98uY',
    type: 'testimonial',
    category: 'Transformation',
    order: 3,
    status: 'published'
  },
  {
    title: 'Inner Peace Journey',
    subtitle: 'Meditation Practitioner',
    quote: 'Finding inner peace through this practice has been the greatest gift. The guidance and support are exceptional.',
    videoUrl: 'https://www.youtube.com/watch?v=_5NTRAnF-Ic',
    type: 'testimonial',
    category: 'Transformation',
    order: 4,
    status: 'published'
  }
];

async function addTestimonials() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Get the Resource model
    const Resource = mongoose.model('Resource', new mongoose.Schema({}, {
      strict: false,
      collection: 'resources'
    }));
    
    console.log('📝 Adding YouTube testimonials to database...\n');
    
    for (const testimonial of testimonials) {
      // Check if already exists
      const existing = await Resource.findOne({
        videoUrl: testimonial.videoUrl
      });
      
      if (existing) {
        console.log(`⚠️  Already exists: ${testimonial.title}`);
        await Resource.updateOne(
          { _id: existing._id },
          { 
            $set: { 
              ...testimonial,
              updatedAt: new Date()
            }
          }
        );
        console.log(`   ✅ Updated testimonial`);
        console.log('');
        continue;
      }
      
      testimonial.createdAt = new Date();
      testimonial.updatedAt = new Date();
      
      const created = await Resource.create(testimonial);
      console.log(`✅ Created: ${created.title}`);
      console.log(`   Video: ${created.videoUrl}`);
      console.log(`   ID: ${created._id}`);
      console.log('');
    }
    
    console.log('✅ YouTube testimonials added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTestimonials();
