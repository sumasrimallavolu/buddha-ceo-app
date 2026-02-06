import mongoose from 'mongoose';
import AboutPage from '../lib/models/AboutPage';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const buddhaCEOData = {
  whoWeAre: {
    title: 'Who We Are',
    description:
      'Buddha CEO is a global non-profit dedicated to building spiritual governance and leadership, and advancing personal transformation through breath-mindfulness meditation and scientific wisdom. It is a key initiative of the Pyramid Spiritual Societies Movement (PSSM), founded to bring meditation into everyone\'s life.\n\nWe aim to empower individuals and organizations to lead with awareness, compassion, and clarity, blending ancient wisdom with modern science to enable both inner transformation and external success.',
  },

  visionMission: {
    vision:
      'To build a world full of leaders who are meditative, compassionate and purpose driven for a harmonious and fulfilling life for everyone on the Planet Earth.',
    mission:
      'To empower business and organizations leaders, entrepreneurs, aspiring leaders (including students) with scientific meditation wisdom. To inspire them to develop a corporate socio-spiritual responsibility (CSSR) for greater community harmony and prosperity.',
  },

  inspiration: {
    name: 'Brahmarshi Patriji',
    title: 'Founder, Pyramid Spiritual Societies Movement',
    description:
      'Brahmarshi Subhash Patriji was an Agronomist by profession. He became Enlightened in the year of 1979 after some serious experiments with "Anapanasati Meditation". Since then his intention is to awaken and enlighten every individual. The Pyramid Spiritual Societies Movement started in the year of 1990 with the main motto of spreading Meditation, Pyramid Power, and Vegetarianism to every human being on this planet. He has been conferred with many awards including "Good Karma Award", "Lifetime Achievement Award", and "Dhyan Visharad Award".',
    imageUrl: 'https://static.wixstatic.com/media/ea3b9d_dbb411737d78447c95d919718f657683~mv2.png/v1/fill/w_219,h_217,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Brahmarshi%20Patriji%20Founder%20PSSM.png',
    order: 1,
  },

  globalReach: {
    title: 'Our Global Reach',
    description:
      'Buddha CEO operates across several countries, particularly in USA, Canada, UAE, UK, India and SE Asian countries.',
    countries: ['USA', 'Canada', 'UAE', 'UK', 'India', 'SE Asian Countries'],
    registration: {
      india:
        'India: "Buddha-CEO Quantum Foundation", a non-profit public spiritual trust registered in Karnataka, India in the year 2020, with Section 12a approval, and section 80G tax exemption approval for donations in India. It is also a registered CSR beneficiary entity.',
      usa:
        'USA: "Buddha CEO Quantum foundation USA," a 501c3 non-profit organization was registered in Wisconsin, USA in the year 2023. Website: www.us.buddhaceo.org',
    },
  },

  teamMembers: [
    {
      name: 'Chandra Pulamarasetti',
      title: 'Successful Entrepreneur, Former VP, IBM Corporation',
      role: 'founder' as const,
      description:
        'Shri Chandra Pulamarasetti, Chief Meditation mentor and the founder of Buddha-CEO Quantum Foundation, is a successful entrepreneur, former Vice President at IBM Corporation, transformational meditation coach, and board member & advisor of a few non-profit organizations including Pyramid Valley International, Bangalore.\n\nMaster Chandra attributes his success including the acquisition of his software company, to the powerful techniques based on meditation and manifestation. Inspired and deeply transformed by the teachings of Brahmarshi Patriji, he has studied several masters from East and West and has been practicing meditation for over 24 years.',
      imageUrl: 'https://static.wixstatic.com/media/6add23_b941a90d6153490987831756c46b4c94~mv2.png/v1/crop/x_757,y_1013,w_1086,h_1166/fill/w_230,h_247,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/chandra%20c.png',
      order: 1,
    },
    {
      name: 'Laurence Guihard-Joly',
      title: 'Former Senior General Manager, IBM Corporation',
      role: 'co_founder' as const,
      description:
        'Laurence is an experienced Senior General Manager who successfully managed multiples large global organizations in the Information Technology sector. She lived in France, Singapore and the United States. Based in New York until recently, Laurence was General Manager at IBM Services, as well as Corporate Sponsor of Mindfulness@IBM. After introducing and teaching meditation to thousands of leaders and professionals, she decided to settle in France and devote her time to teaching Meditation and Mindfulness.',
      imageUrl: 'https://static.wixstatic.com/media/ea3b9d_e94e82ace346457083f8c2d3de1be0a1~mv2.png/v1/fill/w_217,h_217,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Laurence.png',
      order: 2,
    },
    {
      name: 'Vani Dadi',
      title: 'Founder Director, SoulTrends Meditation Studio',
      role: 'co_founder' as const,
      description:
        'Vani Pulamarasetti, Co founder of Buddha -CEO quantum foundation is a meditation counsellor and senior pyramid master for 20+ years and is finding happiness in daily interactions with hundreds of meditators worldwide. Inspired by Brahmarshi Patriji, she is contributing to several PSSM projects including Pyramid Valley International, SoulTrends Meditation Studio, Chandrasekhara Maha swamy meditation center and many more.',
      imageUrl: 'https://static.wixstatic.com/media/6add23_25cde24ece8a4b46bd5fb41d44c6bb12~mv2.jpeg/v1/crop/x_298,y_0,w_665,h_688/fill/w_210,h_217,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202024-11-22%20at%2012_43_35%20AM.jpeg',
      order: 3,
    },
    {
      name: 'Padma Shri D. R. Kaarthikeyan',
      title: 'Former Director-CBI, NHRC, CRPF',
      role: 'mentor' as const,
      description:
        'Padma Shri D.R. Kaarthikeyan is an Indian Police Service officer from Tamil Nadu, and a former Director of the Central Bureau of Investigation, former director of CRPF, and Director-General, National Human Rights Commission. He was awarded the Padma Shri in 2010 for his contribution to the field of Indian Civil Service. He is closely associated with many spiritual organizations and the masters worldwide and is fondly called as Spiritual Ambassador to the world.',
      imageUrl: 'https://static.wixstatic.com/media/ea3b9d_ebec97cf63cc404186df060246a1261b~mv2.jpg/v1/fill/w_174,h_182,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Padma%20Shri%20D_%20R_%20Kaarthikeyan%20Former%20Dir.jpg',
      order: 4,
    },
    {
      name: 'Padma Shri Dr. RV Ramani',
      title: 'Founder and Managing Trustee, Sankara Eye Foundation',
      role: 'mentor' as const,
      description:
        'Dr. R.V. Ramani, Founder and Managing Trustee of Sankara Eye Foundation, India has been awarded the prestigious "Padma Shri" award from the government of India in recognition of his work in the field of medical service. Through his Trust, he along with his wife Dr. Radha, established a network of 11 Super Specialty Eye Hospitals across 7 states in India.',
      imageUrl: 'https://static.wixstatic.com/media/ea3b9d_1b45f1fa29614e3a88e510f3ec74ed54~mv2.jpg/v1/fill/w_169,h_169,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Padma%2520Shri%2520Dr_%2520RV%2520Ramani%2520Found.jpg',
      order: 5,
    },
    {
      name: 'Dr. S. V. Balasubramaniam',
      title: 'Founder & Chairman, Bannari Amman Group',
      role: 'mentor' as const,
      description:
        'Dr. S. V. Balasubramaniam (SVB) is the Founder & Exec. Chairman at Bannari Amman Group of Companies. His thorough knowledge in varied fields and hard work for over four decades have propelled the group to a pivotal position. Dr. SVB is highly regarded in the business circles and devotes much time and resources in social and spiritual service activities.',
      imageUrl: 'https://static.wixstatic.com/media/ea3b9d_68272b47a837442893b35c83418aed30~mv2.jpg/v1/fill/w_165,h_171,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dr_%20S%20V%20Balasubramaniam%20Founder%20%26%20Chairm.jpg',
      order: 6,
    },
    {
      name: 'Dr. Newton Kondaveti',
      title: 'Founder, Quantum Life University',
      role: 'mentor' as const,
      description:
        'Brahmarshi Chakravarti Dr. Newton Kondaveti, MBBS, MD is a medical doctor who realized that everyone has an \'Inner Doctor\', and therefore chose to become a Soul Doctor instead of practicing conventional medicine. Dr. Newton and his wife Dr. Lakshmi are world renowned practitioners and teachers of Meditation and Spiritual Science, pioneers in Past Life Regression.',
      imageUrl: 'https://static.wixstatic.com/media/49b4b6_1d544ce053bb4cb6ae79f680cb7b41c1~mv2.jpg/v1/crop/x_88,y_64,w_264,h_270/fill/w_170,h_174,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Newton-Lakshmi%20Kondaveti.jpg',
      order: 7,
    },
    {
      name: 'Rakesh Jalumane',
      title: 'Trustee & Treasurer, Buddha-CEO Quantum Foundation',
      role: 'trustee' as const,
      description:
        'Rakesh an Entrepreneur, Meditation Coach and former Delivery Director at Cognizant. He has over 25 years of experience in the IT industry covering both technology and leadership roles. Rakesh is currently a Co-Founder and CTO of a Software Technology company called Quantum Coherence Technologies.',
      imageUrl: 'https://static.wixstatic.com/media/49b4b6_87e5169c1eed4d11829b4f4849aa23cd~mv2.webp/v1/fill/w_212,h_212,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Rakesh.webp',
      order: 8,
    },
  ],

  coreValues: [
    {
      category: 'personal' as const,
      title: 'Meditation is our Innate Strength',
      description: 'Daily meditation practice forms the foundation of our approach to leadership and life.',
      order: 1,
    },
    {
      category: 'personal' as const,
      title: 'Compassion is our Inner Nature',
      description: 'Leading with empathy and understanding in all our interactions.',
      order: 2,
    },
    {
      category: 'personal' as const,
      title: 'Simplicity is our Vital Culture',
      description: 'Embracing simplicity in thoughts, words, and actions.',
      order: 3,
    },
    {
      category: 'personal' as const,
      title: 'Equanimity is our Indispensable Character',
      description: 'Maintaining mental balance in all situations.',
      order: 4,
    },
    {
      category: 'personal' as const,
      title: 'Positive Energy is our Obvious Standard',
      description: 'Radiating positivity and enthusiasm in everything we do.',
      order: 5,
    },
    {
      category: 'motto' as const,
      title: 'Thoughts Create Reality',
      description: 'Understanding that our thoughts shape our experiences and outcomes.',
      order: 6,
    },
    {
      category: 'motto' as const,
      title: 'Growth Mindset',
      description: 'Continuously learning, evolving, and embracing challenges.',
      order: 7,
    },
    {
      category: 'motto' as const,
      title: 'Creativity is our True Joy',
      description: 'Innovating and expressing ourselves authentically.',
      order: 8,
    },
    {
      category: 'motto' as const,
      title: 'Inclusion is our Core Responsibility',
      description: 'Ensuring everyone feels valued and included.',
      order: 9,
    },
    {
      category: 'business' as const,
      title: 'Purpose Driven Business',
      description: 'Building businesses with a higher purpose beyond profit.',
      order: 10,
    },
    {
      category: 'business' as const,
      title: 'Community Enablement',
      description: 'Empowering communities and creating positive social impact.',
      order: 11,
    },
    {
      category: 'business' as const,
      title: 'Vibrant Workplace',
      description: 'Creating inspiring and supportive work environments.',
      order: 12,
    },
    {
      category: 'business' as const,
      title: 'Competition for Excellence',
      description: 'Using competition as a path to continuous improvement.',
      order: 13,
    },
    {
      category: 'business' as const,
      title: 'Gratitude is Celebration',
      description: 'Celebrating abundance and expressing gratitude.',
      order: 14,
    },
  ],

  services: [
    {
      title: 'Teach Meditation',
      description:
        'We develop and conduct various foundational and advanced programs on meditation, mindfulness and spiritual science for Corporates, Governmental Organizations, Institutes and other organizations. We offer free meditation programs to Youth, and to General Public, Families and Senior citizens.',
      imageUrl: 'https://static.wixstatic.com/media/ea3b9d_3bb61069808d46e8a256b961a59e4af1~mv2.jpg/v1/fill/w_299,h_212,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/road-sign-798175_1920.jpg',
      order: 1,
    },
    {
      title: 'Provide Publications',
      description:
        'We publish spiritual and mindfulness meditation content to raise awareness, expand the teaching and support the growth of individuals. Distribute in the form of online videos, e-Newsletters, books, brochures etc. to thousands of leaders.',
      imageUrl: 'https://static.wixstatic.com/media/ea3b9d_9e359fdbb85343ba9417b0bd0ce2fa88~mv2.jpg/v1/fill/w_298,h_212,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/sincerely-media-_-hjiem5TqI-unsplash.jpg',
      order: 2,
    },
    {
      title: 'Active Communities',
      description:
        'We form "Buddha-CEO Leader" communities across various cities to exchange about meditation and their experiences, inspire their teams and encourage them to serve.',
      imageUrl: 'https://static.wixstatic.com/media/ea3b9d_c5280956ff48404480ae051468114874~mv2.jpg/v1/fill/w_297,h_212,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/chang-duong-Sj0iMtq_Z4w-unsplash.jpg',
      order: 3,
    },
    {
      title: 'Training Centers',
      description:
        'We establish multiple physical and virtual "Buddha-CEO Training Centers" across major cities and towns to carry out the Foundation activities and meditation programs across India and other countries abroad.',
      imageUrl: 'https://static.wixstatic.com/media/ea3b9d_4c64e285bee444159883f30eb898c931~mv2.jpg/v1/crop/x_0,y_649,w_1280,h_917/fill/w_299,h_210,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/woman-481769_1920.jpg',
      order: 4,
    },
    {
      title: 'Voluntary Service',
      description:
        'We organize community meditation service events led by the "Buddha-CEO" leaders in their areas. We support education institutions that propose meditation-based transformation to students even from their young age.',
      imageUrl: 'https://static.wixstatic.com/media/ea3b9d_369495e93ad04639914c2a2e012fc6d7~mv2.jpg/v1/fill/w_299,h_210,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/team-4529717_1920.jpg',
      order: 5,
    },
  ],

  partners: [
    {
      name: 'Pyramid Valley International',
      logoUrl: 'https://static.wixstatic.com/media/6add23_da91ad0f3652447d918f68da628b07c0~mv2.png/v1/fill/w_227,h_138,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/PVI%20PRIMARY%20LOGO%20(1).png',
      website: 'https://pyramidvalley.org',
      order: 1,
    },
    {
      name: 'BeSuperMind',
      logoUrl: 'https://static.wixstatic.com/media/6add23_a945394d67ae41e8911577f185408bd8~mv2.png/v1/fill/w_202,h_51,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/BSM%20BT%20(1).png',
      order: 2,
    },
    {
      name: 'Svyasa',
      logoUrl: 'https://static.wixstatic.com/media/6add23_8401144f4d334c159999c8bbc25c7419~mv2.png/v1/fill/w_175,h_138,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/svyasa%20logo%20small.png',
      order: 3,
    },
    {
      name: 'PMC Hindi',
      logoUrl: 'https://static.wixstatic.com/media/6add23_db0357048db14db79642cf9636c31d54~mv2.png/v1/fill/w_122,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/PMC-%20Hindi.png',
      order: 4,
    },
    {
      name: 'Quantum Life University',
      logoUrl: 'https://static.wixstatic.com/media/ea3b9d_6b0fe65d61db473da91573e587905e18~mv2.png/v1/fill/w_168,h_126,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7.png',
      order: 5,
    },
    {
      name: 'PMC Telugu',
      logoUrl: 'https://static.wixstatic.com/media/6add23_6afbc3e7685d4148a11f66eb6f7cd0c0~mv2.jpg/v1/crop/x_0,y_0,w_1500,h_1313/fill/w_168,h_147,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/PMC%20telugu.jpg',
      order: 6,
    },
    {
      name: 'PSSM Movement',
      logoUrl: 'https://static.wixstatic.com/media/6add23_a763b2391f1c4e9a9d2aa52ede00b708~mv2.png/v1/crop/x_447,y_520,w_1105,h_895/fill/w_168,h_136,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/PMF.png',
      order: 7,
    },
    {
      name: 'Spiritual Tablets',
      logoUrl: 'https://static.wixstatic.com/media/6add23_e45a855bcce94931bc1c86555d12d927~mv2.png/v1/fill/w_190,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Spiritual%20Tablets%20Logo%20Redesign.png',
      order: 8,
    },
  ],
};

async function importAboutData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing data
    console.log('Deleting existing About page data...');
    await AboutPage.deleteMany({});

    // Insert new data
    console.log('Inserting BuddhaCEO about data...');
    await AboutPage.create(buddhaCEOData);

    console.log('✅ About page data imported successfully!');
    console.log('\nData imported includes:');
    console.log('- Who We Are section');
    console.log('- Vision & Mission');
    console.log('- 8 Team members (founders, mentors, trustees)');
    console.log('- 14 Core values');
    console.log('- 5 Services');
    console.log('- 8 Partner organizations');
    console.log('- Inspiration (Brahmarshi Patriji)');
    console.log('- Global reach information');

    process.exit(0);
  } catch (error) {
    console.error('Error importing about data:', error);
    process.exit(1);
  }
}

importAboutData();
