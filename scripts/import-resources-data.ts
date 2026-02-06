import mongoose from 'mongoose';
import { config } from 'dotenv';
import Resource from '../lib/models/Resource';

// Load environment variables from .env.local
config({ path: '.env.local' });

const resources = [
  // Books
  {
    title: 'Introduction to Meditation',
    type: 'book',
    description: 'A comprehensive guide to starting your meditation journey',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    downloadUrl: '/downloads/intro-meditation.pdf',
    category: 'Beginner',
    order: 1,
    status: 'published' as const,
  },
  {
    title: 'Advanced Meditation Techniques',
    type: 'book',
    description: 'Deepen your practice with advanced methods',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    downloadUrl: '/downloads/advanced-meditation.pdf',
    category: 'Advanced',
    order: 2,
    status: 'published' as const,
  },
  {
    title: 'Anapanasati: The Art of Breath Awareness',
    type: 'book',
    description: 'Master the fundamental technique of mindfulness through breathing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    downloadUrl: '/downloads/anapanasati.pdf',
    category: 'Techniques',
    order: 3,
    status: 'published' as const,
  },

  // Videos
  {
    title: 'Why Meditation Feels Good',
    type: 'video',
    description: 'Understanding the science behind meditation',
    thumbnailUrl: 'https://i.ytimg.com/vi/W7r5kxpgWyk/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=W7r5kxpgWyk',
    category: 'Concept Videos',
    order: 1,
    status: 'published' as const,
  },
  {
    title: 'Breath Mindfulness Meditation',
    type: 'video',
    description: 'Quantum Field of possibilities',
    thumbnailUrl: 'https://i.ytimg.com/vi/n_99IlB3V-Y/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=n_99IlB3V-Y',
    category: 'Guided Meditations',
    order: 2,
    status: 'published' as const,
  },
  {
    title: 'Satya & Ahimsa in Every Word',
    type: 'video',
    description: 'Master Chandra teaches truth and non-violence',
    thumbnailUrl: 'https://i.ytimg.com/vi/DDcYmHt-wwQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=DDcYmHt-wwQ',
    category: 'Teachings',
    order: 3,
    status: 'published' as const,
  },
  {
    title: 'Pyramid Meditation Power',
    type: 'video',
    description: 'Experience the amplified energy of pyramid meditation',
    thumbnailUrl: 'https://i.ytimg.com/vi/6_qefklNw3o/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6_qefklNw3o',
    category: 'Concept Videos',
    order: 4,
    status: 'published' as const,
  },

  // Magazines
  {
    title: 'Meditation Today - January 2025',
    type: 'magazine',
    description: 'Monthly magazine with insights and practices',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    downloadUrl: '/downloads/magazine-jan-2025.pdf',
    category: 'Magazines',
    order: 1,
    status: 'published' as const,
  },
  {
    title: 'Meditation Today - December 2024',
    type: 'magazine',
    description: 'Special edition on New Year meditation retreat experiences',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
    downloadUrl: '/downloads/magazine-dec-2024.pdf',
    category: 'Magazines',
    order: 2,
    status: 'published' as const,
  },

  // Links
  {
    title: 'Pyramid Valley International',
    type: 'link',
    description: 'Learn more about meditation and spiritual science',
    linkUrl: 'https://pyramidvalley.org',
    category: 'Meditation Centers',
    order: 1,
    status: 'published' as const,
  },
  {
    title: 'Dhyanapeetam',
    type: 'link',
    description: 'Official website of Brahmarshi Patriji',
    linkUrl: 'https://pssmovement.org',
    category: 'Organizations',
    order: 2,
    status: 'published' as const,
  },
  {
    title: 'Brahmarshi Patriji YouTube Channel',
    type: 'link',
    description: 'Watch inspiring talks and guided meditations',
    linkUrl: 'https://www.youtube.com/@BrahmarshiPatriji',
    category: 'Videos',
    order: 3,
    status: 'published' as const,
  },
  {
    title: 'Pyramid Spiritual Societies Movement',
    type: 'link',
    description: 'Global movement for meditation and spiritual enlightenment',
    linkUrl: 'https://pssmovement.org',
    category: 'Organizations',
    order: 4,
    status: 'published' as const,
  },
];

async function importResources() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing resources
    await Resource.deleteMany({});
    console.log('Cleared existing resources');

    // Import resources
    const inserted = await Resource.insertMany(resources);
    console.log(`Successfully imported ${inserted.length} resources`);

    console.log('\nResources imported by type:');
    const types = ['book', 'video', 'magazine', 'link'] as const;
    types.forEach((type) => {
      const count = inserted.filter((r) => r.type === type).length;
      console.log(`  - ${type}s: ${count}`);
    });

    await mongoose.disconnect();
    console.log('\nImport completed successfully!');
  } catch (error) {
    console.error('Error importing resources:', error);
    process.exit(1);
  }
}

importResources();
