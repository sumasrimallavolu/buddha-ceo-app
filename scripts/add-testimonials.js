const { MongoClient } = require('mongodb');

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
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('resources');
    
    for (const testimonial of testimonials) {
      const existing = await collection.findOne({
        videoUrl: testimonial.videoUrl
      });
      
      if (existing) {
        console.log(`Testimonial already exists: ${testimonial.title}`);
        await collection.updateOne(
          { _id: existing._id },
          { $set: { ...testimonial, updatedAt: new Date() } }
        );
        console.log(`Updated testimonial: ${testimonial.title}`);
        continue;
      }
      
      testimonial.createdAt = new Date();
      testimonial.updatedAt = new Date();
      
      const result = await collection.insertOne(testimonial);
      console.log(`Created testimonial: ${testimonial.title} (ID: ${result.insertedId})`);
    }
    
    console.log('Testimonials added successfully!');
  } catch (error) {
    console.error('Error adding testimonials:', error);
  } finally {
    await client.close();
  }
}

addTestimonials();
