const { MongoClient } = require('mongodb');

async function checkTestimonials() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('resources');
    
    const testimonials = await collection.find({ type: 'testimonial' }).toArray();
    
    console.log(`Found ${testimonials.length} testimonials:`);
    testimonials.forEach(t => {
      console.log(`- ${t.title} (${t.videoUrl}) - Status: ${t.status}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkTestimonials();
