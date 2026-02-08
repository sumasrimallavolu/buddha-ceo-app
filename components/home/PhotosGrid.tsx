'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Eye, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Photo {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  likes: number;
  views: number;
}

interface PhotosResponse {
  success: boolean;
  photos?: Photo[];
  total?: number;
  hasMore?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export function PhotosGrid() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);

      const limit = 6;
      const response = await fetch(`/api/photos?limit=${limit}&skip=0`);
      const data: PhotosResponse = await response.json();

      if (data.success && data.photos) {
        setPhotos(data.photos);
        setHasMore(data.hasMore || false);
        setTotalCount(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-400">Loading photos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return (
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-sm font-semibold mb-4">
              ✨ Visual Journey
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Moments of Transformation
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              No photos available yet. Check back soon for updates!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-sm font-semibold mb-4">
            ✨ Visual Journey
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Moments of Transformation
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Witness the beautiful journey of thousands of souls finding inner peace
          </p>
        </motion.div>

        {/* Photos Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6 mb-12"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              variants={itemVariants}
              onHoverStart={() => setHoveredId(photo._id)}
              onHoverEnd={() => setHoveredId(null)}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-slate-900"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  width={600}
                  height={800}
                  className={`w-full object-cover transition-transform duration-700 ${
                    hoveredId === photo._id ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-slate-800/90 backdrop-blur-sm text-slate-200 text-xs font-semibold">
                    {photo.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-bold text-xl mb-3">{photo.title}</h3>
                  {/* <div className="flex items-center gap-4 text-slate-300 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span>{photo.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span>{photo.views || 0}</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* See More Button - Link to Photos Page */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/photos"
              className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 inline-flex items-center gap-2"
            >
              See All Photos
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-slate-500 mt-4 text-sm">
              Showing {photos.length} of {totalCount} photos
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
