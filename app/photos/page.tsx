'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Eye, Loader2, Grid3x3, Filter } from 'lucide-react';
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
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4
    }
  }
};

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPhotos(1, true);
  }, [selectedCategory]);

  const fetchPhotos = async (pageNum: number = 1, isNew: boolean = false) => {
    try {
      if (isNew) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const limit = 20;
      const skip = (pageNum - 1) * limit;

      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const response = await fetch(`/api/photos?limit=${limit}&skip=${skip}${categoryParam}`);
      const data: PhotosResponse = await response.json();

      if (data.success && data.photos) {
        if (isNew || pageNum === 1) {
          setPhotos(data.photos);
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.photos.map(p => p.category)));
          setCategories(['all', ...uniqueCategories]);
        } else {
          setPhotos(prev => [...prev, ...(data.photos || [])]);
        }
        setHasMore(data.hasMore || false);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(nextPage, false);
  };

  const handleLike = (photoId: string) => {
    // TODO: Implement like functionality
    console.log('Like photo:', photoId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
          <p className="text-slate-400 text-lg">Loading beautiful moments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <Grid3x3 className="w-8 h-8 text-blue-500" />
                Photo Gallery
              </h1>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {category === 'all' ? 'All Photos' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <Grid3x3 className="w-12 h-12 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Photos Found</h2>
            <p className="text-slate-400">
              {selectedCategory !== 'all'
                ? `No photos in the "${selectedCategory}" category yet.`
                : 'No photos available yet. Check back soon!'}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Pinterest-Style Masonry Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
            >
              {photos.map((photo) => (
                <motion.div
                  key={photo._id}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredId(photo._id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-slate-900 shadow-xl hover:shadow-2xl transition-shadow duration-300"
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

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category Badge - Always Visible */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg">
                        {photo.category}
                      </span>
                    </div>

                    {/* Content Overlay on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{photo.description}</p>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(photo._id);
                            }}
                            className="flex items-center gap-1.5 text-slate-300 hover:text-red-400 transition-colors"
                          >
                            <Heart className="w-4 h-4" fill="currentColor" />
                            <span className="text-sm">{photo.likes || 0}</span>
                          </button>
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{photo.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading More Photos...
                    </>
                  ) : (
                    <>
                      Load More
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Photo Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8 text-slate-500 text-sm"
            >
              Showing {photos.length} photos
              {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
            </motion.div>
          </>
        )}
      </div>

      {/* Floating Back Button (Mobile) */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 left-6 z-50 md:hidden"
      >
        <Link
          href="/"
          className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}
