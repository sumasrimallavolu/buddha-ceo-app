import mongoose from 'mongoose';
import { config } from 'dotenv';
import Resource from '../lib/models/Resource';

// Load environment variables from .env.local
config({ path: '.env.local' });

const resources = [
  // ===== VIDEOS - Learn About Meditation =====
  {
    title: 'Introduction to Anapanasati Meditation',
    type: 'video',
    description: 'Learn the fundamental technique of breath awareness meditation for inner peace and clarity',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=W7r5kxpgWyk',
    category: 'Techniques',
    order: 1,
    status: 'published' as const,
  },
  {
    title: 'Anger Management Through Breath Mindfulness',
    type: 'video',
    description: 'Transform anger into peace through the power of conscious breathing and mindfulness',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=n_99IlB3V-Y',
    category: 'Concept Videos',
    order: 2,
    status: 'published' as const,
  },
  {
    title: 'Learn REM Sleep Through Breath Mindfulness',
    type: 'video',
    description: 'Enhance your sleep quality and achieve deeper rest through meditation techniques',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511295742362-92c9b5fc53b4?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=DDcYmHt-wwQ',
    category: 'Health & Wellness',
    order: 3,
    status: 'published' as const,
  },
  {
    title: 'How Meditation Leads to Mindfulness',
    type: 'video',
    description: 'Be self-aware, present in the moment, and cultivate more energy through meditation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499209974431-2761b7d0a212?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=6_qefklNw3o',
    category: 'Concept Videos',
    order: 4,
    status: 'published' as const,
  },
  {
    title: 'Radiant Health, Energy and Memory Power',
    type: 'video',
    description: 'Discover how meditation transforms your physical and mental well-being',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=W7r5kxpgWyk',
    category: 'Health & Wellness',
    order: 5,
    status: 'published' as const,
  },
  {
    title: 'Eliminate Addictions and Reduce Food Cravings',
    type: 'video',
    description: 'Break free from addictive patterns through the power of meditation and mindfulness',
    thumbnailUrl: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=n_99IlB3V-Y',
    category: 'Health & Wellness',
    order: 6,
    status: 'published' as const,
  },
  {
    title: 'Quantum Field of Possibilities',
    type: 'video',
    description: 'Explore the connection between breath mindfulness and the quantum field',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=DDcYmHt-wwQ',
    category: 'Concept Videos',
    order: 7,
    status: 'published' as const,
  },

  // ===== GUIDED MEDITATIONS =====
  {
    title: '15 Minutes Meditation Music for Beginners',
    type: 'video',
    description: 'Practice powerful meditation daily with this beginner-friendly guided session',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=W7r5kxpgWyk',
    category: 'Guided Meditations',
    order: 8,
    status: 'published' as const,
  },
  {
    title: '30 Minutes Guided Meditation - Emptiness',
    type: 'video',
    description: 'Experience the profound peace of emptiness with this extended guided meditation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499209974431-2761b7d0a212?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=n_99IlB3V-Y',
    category: 'Guided Meditations',
    order: 9,
    status: 'published' as const,
  },
  {
    title: '40 Minutes Guided Meditation Music - Emptiness',
    type: 'video',
    description: 'Deepen your meditation practice with this extended session on emptiness',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=DDcYmHt-wwQ',
    category: 'Guided Meditations',
    order: 10,
    status: 'published' as const,
  },
  {
    title: '50 Minutes Manifestation Meditation',
    type: 'video',
    description: 'Manifest miracles with this powerful guided meditation accompanied by healing music',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=6_qefklNw3o',
    category: 'Guided Meditations',
    order: 11,
    status: 'published' as const,
  },
  {
    title: '75 Minutes Emptiness Guided Meditation',
    type: 'video',
    description: 'Calming and relaxing music for positive energy and deep meditation experience',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=W7r5kxpgWyk',
    category: 'Guided Meditations',
    order: 12,
    status: 'published' as const,
  },

  // ===== EVENT PLAYLISTS =====
  {
    title: '6 Week Guided Meditation - Olympus',
    type: 'video',
    description: 'Complete program from November/December 2020 for general public',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511295742362-92c9b5fc53b4?w=800&q=80',
    videoUrl: 'https://www.youtube.com/playlist?list=PLoW2MX5mGqOlO5kqW8O7oZ1VyN0L9cqW',
    category: 'Program Playlists',
    order: 13,
    status: 'published' as const,
  },
  {
    title: '6 Week Guided Meditation - Ganga',
    type: 'video',
    description: 'Complete program from February/March 2021 for general public',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499209974431-2761b7d0a212?w=800&q=80',
    videoUrl: 'https://www.youtube.com/playlist?list=PLoW2MX5mGqOm8w7kQ8x1VyN0L9cqW8O7',
    category: 'Program Playlists',
    order: 14,
    status: 'published' as const,
  },
  {
    title: '3 Week Meditation for Graduating Students',
    type: 'video',
    description: 'October/November 2020 program specifically designed for youth and students',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    videoUrl: 'https://www.youtube.com/playlist?list=PLoW2MX5mGqOn8w7kQ8x1VyN0L9cqW8O7',
    category: 'Program Playlists',
    order: 15,
    status: 'published' as const,
  },
  {
    title: '3 Week Meditation for Students - Meru',
    type: 'video',
    description: 'November/December 2020 guided meditation program for graduating students',
    thumbnailUrl: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800&q=80',
    videoUrl: 'https://www.youtube.com/playlist?list=PLoW2MX5mGqOl8w7kQ8x1VyN0L9cqW8O7',
    category: 'Program Playlists',
    order: 16,
    status: 'published' as const,
  },
  {
    title: '3 Week Meditation for Students - Atlas',
    type: 'video',
    description: 'January/February 2021 program for graduating students',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    videoUrl: 'https://www.youtube.com/playlist?list=PLoW2MX5mGqOm8w7kQ8x1VyN0L9cqW8O7',
    category: 'Program Playlists',
    order: 17,
    status: 'published' as const,
  },

  // ===== MAGAZINES =====
  {
    title: 'Buddha-CEO A 2025 Magazine (Latest)',
    type: 'magazine',
    description: 'Latest edition featuring transformative stories and meditation insights',
    thumbnailUrl: 'https://static.wixstatic.com/media/6add23_e805d7baa7fb459a9615442eae4ac7b7~mv2.jpg/v1/fill/w_400,h_495,q_80/6add23_e805d7baa7fb459a9615442eae4ac7b7~mv2.jpg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 1,
    status: 'published' as const,
  },
  {
    title: 'September 2021 Magazine',
    type: 'magazine',
    description: 'Monthly magazine with meditation experiences and insights',
    thumbnailUrl: 'https://static.wixstatic.com/media/ea3b9d_a949cb8c06c14056b860d77427d2fec3~mv2.jpg/v1/fill/w_400,h_481,q_80/ea3b9d_a949cb8c06c14056b860d77427d2fec3~mv2.jpg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 2,
    status: 'published' as const,
  },
  {
    title: 'Q3 2021 Magazine Edition',
    type: 'magazine',
    description: 'Quarterly edition featuring meditation stories and practices',
    thumbnailUrl: 'https://static.wixstatic.com/media/ea3b9d_5361141088944659b64a44124fd24382~mv2.jpeg/v1/fill/w_400,h_481,q_80/ea3b9d_5361141088944659b64a44124fd24382~mv2.jpeg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 3,
    status: 'published' as const,
  },
  {
    title: 'November 2021 Magazine',
    type: 'magazine',
    description: 'Monthly magazine with insights from meditation masters',
    thumbnailUrl: 'https://static.wixstatic.com/media/6add23_325663b01c73453caea4e3a753994e90~mv2.jpg/v1/fill/w_400,h_509,q_80/6add23_325663b01c73453caea4e3a753994e90~mv2.jpg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 4,
    status: 'published' as const,
  },
  {
    title: 'January 2022 Magazine',
    type: 'magazine',
    description: 'New year edition with practices for transformation',
    thumbnailUrl: 'https://static.wixstatic.com/media/ea3b9d_ac486094649b4c00bdd9c47f7369e363~mv2.jpeg/v1/fill/w_400,h_481,q_80/ea3b9d_ac486094649b4c00bdd9c47f7369e363~mv2.jpeg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 5,
    status: 'published' as const,
  },
  {
    title: 'Q1 2022 Magazine Edition',
    type: 'magazine',
    description: 'Quarterly magazine with meditation experiences',
    thumbnailUrl: 'https://static.wixstatic.com/media/ea3b9d_cfd9d9e5473f486eb3152101a98e6e4c~mv2.jpeg/v1/fill/w_400,h_481,q_80/ea3b9d_cfd9d9e5473f486eb3152101a98e6e4c~mv2.jpeg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 6,
    status: 'published' as const,
  },
  {
    title: 'Q2 2022 Magazine',
    type: 'magazine',
    description: 'Quarterly edition featuring mindfulness practices',
    thumbnailUrl: 'https://static.wixstatic.com/media/6add23_3661d77ebb6d4602885b30c0daa8b772~mv2.jpg/v1/fill/w_400,h_495,q_80/6add23_3661d77ebb6d4602885b30c0daa8b772~mv2.jpg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 7,
    status: 'published' as const,
  },
  {
    title: 'Q3 2022 Magazine Edition',
    type: 'magazine',
    description: 'Draft version with latest meditation insights',
    thumbnailUrl: 'https://static.wixstatic.com/media/ea3b9d_84c661cce4fc47b59f03d989f4283f8b~mv2.jpg/v1/fill/w_400,h_481,q_80/ea3b9d_84c661cce4fc47b59f03d989f4283f8b~mv2.jpg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 8,
    status: 'published' as const,
  },
  {
    title: 'Q6 2022 Magazine',
    type: 'magazine',
    description: 'Special edition covering advanced meditation techniques',
    thumbnailUrl: 'https://static.wixstatic.com/media/6add23_fe1286e5d6314502bf2bdf476047480d~mv2.jpg/v1/fill/w_400,h_481,q_80/6add23_fe1286e5d6314502bf2bdf476047480d~mv2.jpg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 9,
    status: 'published' as const,
  },
  {
    title: 'Special Edition Magazine',
    type: 'magazine',
    description: 'Special publication with transformative meditation stories',
    thumbnailUrl: 'https://static.wixstatic.com/media/6add23_75276f7551f144a9a4b4a13a51587b24~mv2.jpg/v1/fill/w_400,h_495,q_80/6add23_75276f7551f144a9a4b4a13a51587b24~mv2.jpg',
    downloadUrl: 'https://www.buddhaceo.org/magazine',
    category: 'Magazines',
    order: 10,
    status: 'published' as const,
  },

  // ===== BOOKS =====
  {
    title: 'Anapanasati: The Path of Breath Awareness',
    type: 'book',
    description: 'A comprehensive guide to mastering breath mindfulness meditation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    downloadUrl: '#',
    category: 'Techniques',
    order: 1,
    status: 'published' as const,
  },
  {
    title: 'Meditation for Beginners',
    type: 'book',
    description: 'Start your meditation journey with this practical and accessible guide',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    downloadUrl: '#',
    category: 'Beginner',
    order: 2,
    status: 'published' as const,
  },
  {
    title: 'Advanced Meditation Practices',
    type: 'book',
    description: 'Deepen your practice with advanced techniques and insights',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    downloadUrl: '#',
    category: 'Advanced',
    order: 3,
    status: 'published' as const,
  },
  {
    title: 'Meditation and the Quantum Field',
    type: 'book',
    description: 'Explore the scientific connection between meditation and quantum physics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
    downloadUrl: '#',
    category: 'Science',
    order: 4,
    status: 'published' as const,
  },

  // ===== LINKS =====
  {
    title: 'Buddha-CEO Quantum Foundation',
    type: 'link',
    description: 'Official website of Buddha-CEO Quantum Foundation',
    linkUrl: 'https://www.buddhaceo.org',
    category: 'Organizations',
    order: 1,
    status: 'published' as const,
  },
  {
    title: 'Pyramid Valley International',
    type: 'link',
    description: 'Learn more about meditation and spiritual science at Pyramid Valley',
    linkUrl: 'https://pyramidvalley.org',
    category: 'Meditation Centers',
    order: 2,
    status: 'published' as const,
  },
  {
    title: 'Dhyanapeetam - Brahmarshi Patriji',
    type: 'link',
    description: 'Official website of Brahmarshi Patriji and the movement',
    linkUrl: 'https://pssmovement.org',
    category: 'Organizations',
    order: 3,
    status: 'published' as const,
  },
  {
    title: 'Brahmarshi Patriji YouTube Channel',
    type: 'link',
    description: 'Watch inspiring talks, guided meditations, and spiritual teachings',
    linkUrl: 'https://www.youtube.com/@BrahmarshiPatriji',
    category: 'Videos',
    order: 4,
    status: 'published' as const,
  },
  {
    title: 'Pyramid Spiritual Societies Movement',
    type: 'link',
    description: 'Global movement for meditation and spiritual enlightenment',
    linkUrl: 'https://pssmovement.org',
    category: 'Organizations',
    order: 5,
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

    // Group by category for videos
    console.log('\nVideos by category:');
    const videos = inserted.filter((r) => r.type === 'video');
    const categories = Array.from(new Set(videos.map((v) => v.category)));
    categories.forEach((cat) => {
      const count = videos.filter((v) => v.category === cat).length;
      console.log(`  - ${cat}: ${count}`);
    });

    await mongoose.disconnect();
    console.log('\nImport completed successfully!');
  } catch (error) {
    console.error('Error importing resources:', error);
    process.exit(1);
  }
}

importResources();
