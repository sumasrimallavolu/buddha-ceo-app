const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

// Define the schema inline
const testimonialSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  quote: String,
  videoUrl: String,
  thumbnailUrl: String,
  type: String,
  category: String,
  order: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
});

const testimonials = [
  {
    title: 'Meditation Experience',
    subtitle: 'Program Participant',
    quote: 'This meditation program has transformed my life in ways I never imagined. The techniques are simple yet profound.',
    videoUrl: 'https://www.youtube.com/watch?v=9QSKyMf98uY',
    type: 'testimonial',
    category: 'Transformation',
    order: 1,
    status: 'published'
  },
  {
    title: 'Inner Peace Journey',
    subtitle: 'Meditation Practitioner',
    quote: 'Finding inner peace through this practice has been the greatest gift. The guidance and support are exceptional.',
    videoUrl: 'https://www.youtube.com/watch?v=_5NTRAnF-Ic',
    type: 'testimonial',
    category: 'Transformation',
    order: 2,
    status: 'published'
  }
];

async function addTestimonials() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    const Resource = mongoose.model('Resource', testimonialSchema);
    
    console.log('📝 Adding testimonials to database...\n');
    
    for (const testimonial of testimonials) {
      // Check if already exists
      const existing = await Resource.findOne({
        videoUrl: testimonial.videoUrl
      });
      
      if (existing) {
        console.log(`⚠️  Already exists: ${testimonial.title}`);
        console.log(`   Video: ${testimonial.videoUrl}`);
        
        // Update if needed
        if (existing.status !== 'published') {
          await Resource.findByIdAndUpdate(existing._id, { 
            status: 'published',
            updatedAt: new Date()
          });
          console.log(`   ✅ Updated status to 'published'`);
        }
        console.log('');
        continue;
      }
      
      // Create new testimonial
      testimonial.createdAt = new Date();
      testimonial.updatedAt = new Date();
      
      const created = await Resource.create(testimonial);
      console.log(`✅ Created: ${created.title}`);
      console.log(`   ID: ${created._id}`);
      console.log(`   Video: ${created.videoUrl}`);
      console.log('');
    }
    
    // Count total testimonials
    const totalCount = await Resource.countDocuments({ type: 'testimonial' });
    const publishedCount = await Resource.countDocuments({ 
      type: 'testimonial', 
      status: 'published' 
    });
    
    console.log('📊 Summary:');
    console.log(`   Total testimonials: ${totalCount}`);
    console.log(`   Published: ${publishedCount}`);
    console.log('\n✅ Testimonials added successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding testimonials:', error);
    process.exit(1);
  }
}

addTestimonials();
