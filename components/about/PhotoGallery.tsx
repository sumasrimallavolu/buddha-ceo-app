import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Images } from 'lucide-react';

const galleryPhotos = [
  {
    url: 'https://static.wixstatic.com/media/6add23_05e57531f48246498cb143ac7d687e3c~mv2.jpg/v1/fill/w_679,h_525,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6add23_05e57531f48246498cb143ac7d687e3c~mv2.jpg',
    title: '2nd Global Conference of Meditation Leaders 2025',
    category: 'Conference',
    size: 'large',
  },
  {
    url: 'https://static.wixstatic.com/media/6add23_c6a79b8fb661467e89d4e6cc5f03289e~mv2.png/v1/crop/x_502,y_0,w_795,h_600/fill/w_432,h_326,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/vibe%20bg.png',
    title: 'Vibe - Meditation for Confidence',
    category: 'Youth Program',
    size: 'medium',
  },
  {
    url: 'https://i.ytimg.com/vi/MSUXw7Dxle8/maxresdefault.jpg',
    title: 'Padma Shri D. R. Kaarthikeyan',
    category: 'Distinguished Leaders',
    size: 'medium',
  },
  {
    url: 'https://i.ytimg.com/vi/s4vH34O7rOs/maxresdefault.jpg',
    title: 'Dr. S.V. Balasubramaniam',
    category: 'Business Leaders',
    size: 'medium',
  },
  {
    url: 'https://static.wixstatic.com/media/ea3b9d_9fbb22065652401f96ef1ad93fb50c0a~mv2.jpg/v1/fill/w_229,h_159,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Padma%20Shri%20Dr_%20RV%20Ramani%20Founder%20and%20Man.jpg',
    title: 'Padma Shri Dr. RV Ramani',
    category: 'Healthcare',
    size: 'small',
  },
  {
    url: 'https://i.ytimg.com/vi/_5NTRAnF-Ic/maxresdefault.jpg',
    title: 'Raji Iyengar Success Story',
    category: 'Transformation',
    size: 'small',
  },
  {
    url: 'https://i.ytimg.com/vi/9QSKyMf98uY/maxresdefault.jpg',
    title: 'Indrani Krishna Mohan',
    category: 'Youth Success',
    size: 'small',
  },
  {
    url: 'https://static.wixstatic.com/media/6add23_6a4d91f1fe1746a2a1bd49f48e81571f~mv2.jpg/v1/crop/x_596,y_0,w_3439,h_2595/fill/w_432,h_326,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/breathing-space-calming-image-with-great-blank-copy-space-ai-generated.jpg',
    title: 'Renew - Excellence Program',
    category: 'Advanced Program',
    size: 'medium',
  },
  {
    url: 'https://i.ytimg.com/vi/gDcPRh5Gu4A/maxresdefault.jpg',
    title: 'Master Chandra Teaching',
    category: 'Teachings',
    size: 'small',
  },
  {
    url: 'https://i.ytimg.com/vi/13AItqOsrDM/maxresdefault.jpg',
    title: 'Health Transformation Story',
    category: 'Wellness',
    size: 'small',
  },
];

export function PhotoGallery() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-400 text-sm font-medium mb-4 border border-blue-500/30">
            <Images className="w-4 h-4" />
            <span>Photo Gallery</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Moments of Transformation
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Capturing the journey of meditation, conferences, and success stories from our community
          </p>
        </div>

        {/* Masonry-style Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 auto-rows-[100px]">
          {/* Large featured image - spans 2 columns, 2 rows */}
          <Card className="md:col-span-2 md:row-span-2 group overflow-hidden border-2 border-white/10 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/5 backdrop-blur-md">
            <div className="relative w-full h-full">
              <img
                src={galleryPhotos[0].url}
                alt={galleryPhotos[0].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white border-0 text-xs">
                  {galleryPhotos[0].category}
                </Badge>
                <h3 className="text-lg font-bold drop-shadow-lg">{galleryPhotos[0].title}</h3>
              </div>
            </div>
          </Card>

          {/* Medium images */}
          <Card className="group overflow-hidden border-2 border-white/10 hover:border-violet-500/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/5 backdrop-blur-md">
            <div className="relative w-full h-full">
              <img
                src={galleryPhotos[1].url}
                alt={galleryPhotos[1].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <Badge className="mb-1.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 text-xs">
                  {galleryPhotos[1].category}
                </Badge>
                <h3 className="text-sm font-bold drop-shadow-lg">{galleryPhotos[1].title}</h3>
              </div>
            </div>
          </Card>

          <Card className="group overflow-hidden border-2 border-white/10 hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/5 backdrop-blur-md">
            <div className="relative w-full h-full">
              <img
                src={galleryPhotos[7].url}
                alt={galleryPhotos[7].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <Badge className="mb-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-xs">
                  {galleryPhotos[7].category}
                </Badge>
                <h3 className="text-sm font-bold drop-shadow-lg">{galleryPhotos[7].title}</h3>
              </div>
            </div>
          </Card>

          {/* Small images in various positions */}
          {galleryPhotos.slice(2, 7).map((photo, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-2 border-white/10 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/5 backdrop-blur-md"
            >
              <div className="relative w-full h-full">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <Badge className="mb-1 bg-gradient-to-r from-blue-500 to-violet-500 text-white border-0 text-xs">
                    {photo.category}
                  </Badge>
                  <h3 className="text-xs font-bold drop-shadow-lg line-clamp-2">{photo.title}</h3>
                </div>
              </div>
            </Card>
          ))}

          {/* Additional small images */}
          {galleryPhotos.slice(8).map((photo, index) => (
            <Card
              key={`extra-${index}`}
              className="group overflow-hidden border-2 border-white/10 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/5 backdrop-blur-md"
            >
              <div className="relative w-full h-full">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <Badge className="mb-1 bg-gradient-to-r from-blue-500 to-violet-500 text-white border-0 text-xs">
                    {photo.category}
                  </Badge>
                  <h3 className="text-xs font-bold drop-shadow-lg line-clamp-2">{photo.title}</h3>
                </div>
              </div>
            </Card>
          ))}

          {/* Featured testimonial card */}
          <Card className="md:col-span-2 group overflow-hidden border-2 border-white/10 hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-md">
            <CardContent className="p-8 h-full flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_183,h_48,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png"
                  alt="Buddha-CEO Quantum Foundation"
                  className="h-12 object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Buddha-CEO Quantum Foundation</h3>
                  <p className="text-sm text-emerald-400 font-medium">Empowering Leaders Through Meditation</p>
                </div>
              </div>
              <blockquote className="text-slate-300 italic text-base leading-relaxed border-l-4 border-emerald-400 pl-4">
                "Empowering leaders, professionals, and individuals with transformative meditation wisdom and techniques, fostering personal growth, organizational excellence, and social responsibility."
              </blockquote>
            </CardContent>
          </Card>
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <a
            href="https://www.buddhaceo.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Images className="mr-2 h-5 w-5" />
            View More on Buddha-CEO.org
          </a>
        </div>
      </div>
    </section>
  );
}
