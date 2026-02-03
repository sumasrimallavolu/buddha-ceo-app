'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Trophy, Target, Zap, Users, Award } from 'lucide-react';

const excellenceImages = [
  {
    url: 'https://static.wixstatic.com/media/6add23_05e57531f48246498cb143ac7d687e3c~mv2.jpg/v1/fill/w_800,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/6add23_05e57531f48246498cb143ac7d687e3c~mv2.jpg',
    title: '2nd Global Conference of Meditation Leaders 2025',
    category: 'Conference',
    description: 'Global Conference of Meditation Leaders 2025 brought together renowned teachers from around the world',
    size: 'large',
  },
  {
    url: 'https://static.wixstatic.com/media/6add23_c6a79b8fb661467e89d4e6cc5f03289e~mv2.png/v1/crop/x_502,y_0,w_795,h_600/fill/w_600,h_450,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/vibe%20bg.png',
    title: 'Vibe - Meditation for Confidence',
    category: 'Youth Program',
    description: '40-Day Online Program for Youth & Students building confidence and clarity',
    size: 'medium',
  },
  {
    url: 'https://static.wixstatic.com/media/6add23_6a4d91f1fe1746a2a1bd49f48e81571f~mv2.jpg/v1/crop/x_596,y_0,w_3439,h_2595/fill/w_600,h_450,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/breathing-space-calming-image-with-great-blank-copy-space-ai-generated.jpg',
    title: 'Renew - Excellence through Meditation',
    category: 'Advanced Program',
    description: '40-Day Online Scientific Meditation Program for Leaders, Professionals & Entrepreneurs',
    size: 'medium',
  },
  {
    url: 'https://static.wixstatic.com/media/11062b_7124ff06fc56498d96722413f5f4846ff000.jpg/v1/fill/w_600,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_7124ff06fc56498d96722413f5f4846ff000.jpg',
    title: 'Corporate Meditation Programs',
    category: 'Corporate',
    description: 'Empowering leaders and organizations with meditation wisdom',
    size: 'medium',
  },
];

const highlights = [
  {
    icon: Trophy,
    title: 'Global Conference Success',
    description: '2nd Global Conference of Meditation Leaders 2025 brought together renowned teachers from around the world',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Target,
    title: 'Youth Transformation',
    description: 'Vibe program empowers students with confidence, clarity, and manifestation techniques',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Zap,
    title: 'Leadership Excellence',
    description: 'Corporate leaders achieving breakthrough results through meditation practices',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Users,
    title: '50,000+ Lives Transformed',
    description: 'Programs impacting individuals across 25+ countries globally',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Award,
    title: 'Distinguished Recognition',
    description: 'Padma Shri awardees and industry leaders endorsing our programs',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Sparkles,
    title: 'Scientific Approach',
    description: 'Ancient wisdom combined with modern scientific understanding',
    color: 'from-violet-500 to-purple-500',
  },
];

const successStories = [
  {
    name: 'Padma Shri Dr. RV Ramani',
    role: 'Founder and Managing Trustee, Sankara Eye Foundation',
    image: 'https://static.wixstatic.com/media/ea3b9d_9fbb22065652401f96ef1ad93fb50c0a~mv2.jpg/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Padma%20Shri%20Dr_%20RV%20Ramani%20Founder%20and%20Man.jpg',
    quote: 'We are that infinite energy with unlimited capability. The entire world is one big family. Meditation helps us to realize these concepts and live them. The 40-day meditation program is really transformative.',
    achievement: 'Padma Shri Awardee',
    color: 'amber',
  },
  {
    name: 'Indrani Krishna Mohan',
    role: 'Student',
    image: 'https://i.ytimg.com/vi/9QSKyMf98uY/maxresdefault.jpg',
    quote: 'Achieved perfect scores through meditation! The program transformed my focus and clarity. I was able to study more effectively and perform exceptionally well in my exams.',
    achievement: 'Scored 10/10 in Board Exams',
    color: 'pink',
  },
  {
    name: 'Raji Iyengar',
    role: 'Senior Leader',
    image: 'https://i.ytimg.com/vi/_5NTRAnF-Ic/maxresdefault.jpg',
    quote: 'From vertigo to victory through meditation! Completely healed in 40 days. The symptoms that plagued me for years disappeared through consistent practice.',
    achievement: 'Healed from Vertigo',
    color: 'blue',
  },
];

export default function ProjectExcellencePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-800 via-purple-800/30 to-pink-800/20">
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-business-people-working-together-in-a-modern-office-4223-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-purple-900/15 to-pink-900/20" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20 mb-6">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>Our Excellence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Project{' '}
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent animate-gradient drop-shadow-lg">
                Excellence
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto border-l-4 border-purple-400/50 pl-6">
              Showcasing transformative journeys, global conferences, and success stories from our meditation community
            </p>
          </div>
        </section>

        {/* Featured Programs Gallery */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Featured Programs & Events
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Highlights from our transformative programs and global events
              </p>
            </div>

            {/* Featured Image - Large */}
            <div className="mb-8">
              <Card className="group overflow-hidden border-2 border-purple-200 hover:border-purple-400 hover:shadow-3xl transition-all duration-500 bg-white/70 backdrop-blur-sm">
                <div className="relative aspect-[16/9] md:aspect-[21/9]">
                  <img
                    src={excellenceImages[0].url}
                    alt={excellenceImages[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      {excellenceImages[0].category}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-lg">{excellenceImages[0].title}</h3>
                    <p className="text-white/90 text-base md:text-lg max-w-3xl">{excellenceImages[0].description}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Secondary Images - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {excellenceImages.slice(1).map((img, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-500 bg-white/70 backdrop-blur-sm hover:scale-[1.02]"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-purple-700 border-purple-200 text-xs">
                      {img.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-600 transition-colors">{img.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{img.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Excellence Highlights */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-purple-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Pillars of Excellence
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                What makes our programs truly exceptional
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {highlights.map((item, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-2 border-purple-100 hover:border-purple-300 bg-white/70 backdrop-blur-sm hover:scale-105"
                >
                  <CardContent className="p-6 md:p-8">
                    <div className={`w-14 h-14 md:w-16 md:h-16 mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { value: '50,000+', label: 'Lives Transformed', color: 'from-purple-300 to-pink-300' },
                { value: '500+', label: 'Programs Conducted', color: 'from-pink-300 to-rose-300' },
                { value: '2', label: 'Global Conferences', color: 'from-amber-300 to-orange-300' },
                { value: '25+', label: 'Countries Reached', color: 'from-cyan-300 to-blue-300' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                >
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-white/80 font-medium text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Stories of Transformation
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real people, real results, extraordinary transformations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {successStories.map((story, index) => (
                <Card
                  key={index}
                  className={`group hover:shadow-2xl transition-all duration-500 border-2 bg-gradient-to-br backdrop-blur-sm hover:scale-[1.02] ${
                    story.color === 'amber'
                      ? 'border-amber-100 hover:border-amber-300 from-amber-50 to-orange-50'
                      : story.color === 'pink'
                      ? 'border-pink-100 hover:border-pink-300 from-pink-50 to-rose-50'
                      : 'border-blue-100 hover:border-blue-300 from-blue-50 to-cyan-50'
                  }`}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center mb-6">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg mb-4"
                      />
                      <Badge className={`mb-3 text-xs ${
                        story.color === 'amber'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : story.color === 'pink'
                          ? 'bg-pink-100 text-pink-700 border-pink-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {story.achievement}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                      <p className={`text-sm font-medium mb-4 ${
                        story.color === 'amber'
                          ? 'text-amber-700'
                          : story.color === 'pink'
                          ? 'text-pink-700'
                          : 'text-blue-700'
                      }`}>
                        {story.role}
                      </p>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic text-sm text-center line-clamp-4">
                      "{story.quote}"
                    </p>
                    <div className="flex justify-center gap-0.5 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">⭐</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Quote */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <img
                    src="https://static.wixstatic.com/media/ea3b9d_9fbb22065652401f96ef1ad93fb50c0a~mv2.jpg/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Padma%20Shri%20Dr_%20RV%20Ramani%20Founder%20and%20Man.jpg"
                    alt="Padma Shri Dr. RV Ramani"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-amber-300 shadow-xl flex-shrink-0"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
                      Featured Endorsement
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      Padma Shri Dr. RV Ramani
                    </h3>
                    <p className="text-amber-700 font-medium mb-4">
                      Founder and Managing Trustee, Sankara Eye Foundation
                    </p>
                    <blockquote className="text-gray-700 italic text-lg md:text-xl leading-relaxed border-l-4 border-amber-400 pl-4 md:pl-6">
                      "We are that infinite energy with unlimited capability. The entire world is one big family. Meditation helps us to realize these concepts and live them. The 40-day meditation program is really transformative."
                    </blockquote>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
