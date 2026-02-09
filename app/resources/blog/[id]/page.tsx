'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  category: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/resources/public?type=blog&id=${params.id}`);
        const data = await response.json();

        if (response.ok && data.success && data.resources?.blogs?.length > 0) {
          setBlog(data.resources.blogs[0]);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-10 w-32 mb-6" />
              <div className="relative h-[35vh] md:h-[40vh] w-full max-w-3xl mx-auto mb-8">
                <Skeleton className="h-full w-full rounded-2xl" />
              </div>
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-48 mb-8" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Blog Post Not Found</h1>
            <p className="text-slate-400 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
            <Link href="/resources?tab=blogs">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Blogs
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Image */}
        {blog.thumbnailUrl && (
          <div className="relative w-full overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative h-[35vh] md:h-[40vh] w-full max-w-3xl mt-[20] mx-auto">
                <Image
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 768px"
                />
              </div>
            </div>
          </div>
        )}

        {/* Blog Content */}
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              href="/resources?tab=blogs"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-6 md:mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blogs
            </Link>

            {/* Category Badge */}
            <div className="mb-4">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                {blog.category}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8 pb-8 border-b border-white/10">
              {blog.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              )}
            </div>

            {/* Description */}
            {blog.description && (
              <div className="mb-8">
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                  {blog.description}
                </p>
              </div>
            )}

            {/* Blog Content */}
            {blog.content && (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}
          </div>
        </article>

        {/* Share Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Enjoyed this article?</h2>
              <p className="text-slate-400 mb-6">
                Share it with others who might benefit from these insights.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: blog.title,
                        text: blog.description,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Share Article
                </Button>
                <Link href="/resources?tab=blogs">
                  <Button
                    variant="outline"
                    className="border-white/10 text-slate-300 hover:bg-white/5"
                  >
                    Read More Blogs
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
