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
    color: 'from-blue-500 to-violet-500',
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
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md text-blue-400 text-sm font-medium border border-white/10 mb-6">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Our Excellence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-5 leading-tight">
              A Calm Journey into{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Project Excellence
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto border-l-4 border-blue-500/40 pl-6">
              Showcasing transformative journeys, global conferences, and success stories from our meditation community
            </p>
          </div>
        </section>

        {/* Featured Programs Gallery */}
        <section className="py-24 md:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-blue-400 text-xs font-medium mb-4 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>Programs that radiate peace</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-3 tracking-tight">
                Featured Programs & Events
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                A gentle collage of retreats, youth journeys, and global gatherings
              </p>
            </div>

            {/* Featured Image - Large */}
            <div className="mb-8">
              <Card className="group overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.01]">
                <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden">
                  <img
                    src={excellenceImages[0].url}
                    alt={excellenceImages[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-9 text-white/95">
                    <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 backdrop-blur">
                      {excellenceImages[0].category}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-3 drop-shadow-lg">
                      {excellenceImages[0].title}
                    </h3>
                    <p className="text-white/90 text-base md:text-lg max-w-3xl">
                      {excellenceImages[0].description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Secondary Images - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {excellenceImages.slice(1).map((img, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <Badge className="mb-3 bg-white/10 backdrop-blur-sm text-blue-400 border border-white/20 text-[0.7rem]">
                        {img.category}
                      </Badge>
                      <h3 className="text-base sm:text-lg font-semibold mb-1 text-white drop-shadow">
                        {img.title}
                      </h3>
                      <p className="text-white/85 text-xs sm:text-sm line-clamp-2">
                        {img.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Excellence Highlights */}
        <section className="py-24 md:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-3 tracking-tight">
                Pillars of Excellence
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                What makes our programs truly exceptional
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {highlights.map((item, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl hover:-translate-y-1"
                >
                  <CardContent className="p-6 md:p-8">
                    <div className={`w-14 h-14 md:w-16 md:h-16 mb-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-24 md:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-3 tracking-tight">
                Stories of Transformation
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                Real people, real results, extraordinary transformations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {successStories.map((story, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl hover:-translate-y-1"
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center mb-6">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-white/20 shadow-lg mb-4"
                      />
                      <Badge
                        className={`mb-3 text-xs border-0 ${
                          story.color === 'amber'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-400/30'
                            : story.color === 'pink'
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-400/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                        }`}
                      >
                        {story.achievement}
                      </Badge>
                      <h3 className="text-xl font-semibold text-white">{story.name}</h3>
                      <p
                        className={`text-sm font-medium mb-4 ${
                          story.color === 'amber'
                            ? 'text-amber-400'
                            : story.color === 'pink'
                            ? 'text-pink-400'
                            : 'text-blue-400'
                        }`}
                      >
                        {story.role}
                      </p>
                    </div>
                    <p className="text-slate-400 leading-relaxed italic text-sm text-center line-clamp-4">
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
        <section className="py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Card className="bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 rounded-3xl">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <img
                    src="https://static.wixstatic.com/media/ea3b9d_9fbb22065652401f96ef1ad93fb50c0a~mv2.jpg/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Padma%20Shri%20Dr_%20RV%20Ramani%20Founder%20and%20Man.jpg"
                    alt="Padma Shri Dr. RV Ramani"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-blue-400/30 shadow-xl flex-shrink-0"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <Badge className="mb-4 bg-blue-500/20 text-blue-400 border border-blue-400/30">
                      Featured Endorsement
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                      Padma Shri Dr. RV Ramani
                    </h3>
                    <p className="text-blue-400 font-medium mb-4">
                      Founder and Managing Trustee, Sankara Eye Foundation
                    </p>
                    <blockquote className="text-slate-400 italic text-lg md:text-xl leading-relaxed border-l-4 border-blue-500/40 pl-4 md:pl-6">
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
