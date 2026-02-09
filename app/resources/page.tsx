'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Video, FileText, ExternalLink, Download, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface Book {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  category: string;
  order: number;
}

interface VideoResource {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  category: string;
  order: number;
}

interface Magazine {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  category: string;
  order: number;
}

interface ResourceLink {
  _id: string;
  title: string;
  description: string;
  linkUrl?: string;
  category: string;
  order: number;
}

interface Blog {
  _id: string;
  title: string;
  description?: string;
  linkUrl?: string;
  thumbnailUrl?: string;
  category: string;
  order: number;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Testimonial {
  _id: string;
  title: string;
  subtitle?: string;
  quote?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  category: string;
  order: number;
}

interface ResourcesResponse {
  success: boolean;
  resources?: {
    books: Book[];
    videos: VideoResource[];
    magazines: Magazine[];
    links: ResourceLink[];
    blogs: any[];
    testimonials: Testimonial[];
  };
  stats?: {
    books: number;
    videos: number;
    magazines: number;
    links: number;
    blogs: number;
    testimonials: number;
  };
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('books');
  const [data, setData] = useState<ResourcesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/resources/public');
        const result: ResourcesResponse = await response.json();

        if (result.success) {
          setData(result);
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1">
          <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-slate-950">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16">
              <Skeleton className="h-10 w-48 mx-auto mb-6 rounded-full" />
              <Skeleton className="h-16 w-64 mx-auto mb-6" />
              <Skeleton className="h-6 w-96 mx-auto mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mt-12">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Skeleton className="h-12 w-80 mx-auto" />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-32 rounded-lg" />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="border border-white/10 bg-white/5 rounded-2xl overflow-hidden flex flex-col">
                    <Skeleton className="aspect-[8/5] w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const resources = data?.resources;
  const testimonials = resources?.testimonials || [];
  const stats = data?.stats || { books: 0, videos: 0, magazines: 0, links: 0, blogs: 0, testimonials: 0 };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-blue-400 text-sm font-medium border border-white/10 mb-6">
              <Book className="w-4 h-4" />
              <span>Learning Library</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Resources
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Access our collection of books, videos, magazines, and curated
              links to support your meditation journey
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mt-12">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-blue-400">{stats.books}</div>
                <div className="text-slate-400 text-sm mt-1">Books</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-blue-400">{stats.videos}</div>
                <div className="text-slate-400 text-sm mt-1">Videos</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-blue-400">{stats.magazines}</div>
                <div className="text-slate-400 text-sm mt-1">Magazines</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-blue-400">{stats.links}</div>
                <div className="text-slate-400 text-sm mt-1">Links</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-blue-400">{stats.blogs}</div>
                <div className="text-slate-400 text-sm mt-1">Blogs</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-blue-400">{stats.testimonials}</div>
                <div className="text-slate-400 text-sm mt-1">Testimonials</div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16 bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Browse Our Collection
              </span>
            </h2>
            {resources && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex flex-wrap justify-center bg-white/5 p-3 rounded-xl border border-white/10 max-w-4xl mx-auto h-auto gap-2">
                  <TabsTrigger
                    value="books"
                    className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-600/20 hover:text-blue-300 text-slate-400 transition-all duration-300 rounded-lg min-w-[120px] justify-center"
                  >
                    <Book className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Books</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-600/20 hover:text-blue-300 text-slate-400 transition-all duration-300 rounded-lg min-w-[120px] justify-center"
                  >
                    <Video className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Videos</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="magazines"
                    className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-600/20 hover:text-blue-300 text-slate-400 transition-all duration-300 rounded-lg min-w-[120px] justify-center"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Magazines</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="links"
                    className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-600/20 hover:text-blue-300 text-slate-400 transition-all duration-300 rounded-lg min-w-[120px] justify-center"
                  >
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Links</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="blogs"
                    className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-600/20 hover:text-blue-300 text-slate-400 transition-all duration-300 rounded-lg min-w-[120px] justify-center"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Blogs</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="testimonials"
                    className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-600/20 hover:text-blue-300 text-slate-400 transition-all duration-300 rounded-lg min-w-[120px] justify-center"
                  >
                    <Quote className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Testimonials</span>
                  </TabsTrigger>
                </TabsList>

                {/* Books Tab */}
                <TabsContent value="books" className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 sr-only">Books</h3>
                  {resources.books.length === 0 ? (
                    <EmptyState icon={Book} message="No books available" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {resources.books.map((book) => (
                        <Card key={book._id} className="border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden flex flex-col">
                          <CardHeader className="p-4 pb-2">
                            <div className="relative aspect-[8/5] rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 overflow-hidden group flex-shrink-0">
                              {book.thumbnailUrl ? (
                                <Image
                                  src={book.thumbnailUrl}
                                  alt={book.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <Book className="h-16 w-16 text-blue-400" />
                              )}
                            </div>
                            <CardTitle className="text-lg text-white line-clamp-2 leading-tight">{book.title}</CardTitle>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-400/30 w-fit mt-2">
                              {book.category}
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 flex-grow">
                            <p className="text-slate-400 text-sm line-clamp-3">{book.description}</p>
                          </CardContent>
                          {book.downloadUrl && (
                            <CardFooter className="p-4 pt-0">
                              <Button className="w-full bg-white/5 hover:bg-blue-600/20 border border-white/20 text-white hover:border-blue-500/50 transition-all" variant="outline" asChild>
                                <a href={book.downloadUrl} download>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download PDF
                                </a>
                              </Button>
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Videos Tab */}
                <TabsContent value="videos" className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 sr-only">Videos</h3>
                  {resources.videos.length === 0 ? (
                    <EmptyState icon={Video} message="No videos available" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {resources.videos.map((video) => (
                        <Card key={video._id} className="group overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 flex flex-col">
                          <div className="relative aspect-[8/5] bg-gradient-to-br from-blue-500/20 to-blue-600/20 overflow-hidden flex-shrink-0">
                            {video.thumbnailUrl ? (
                              <Image
                                src={video.thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Video className="h-16 w-16 text-blue-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {video.videoUrl && (
                              <a
                                href={video.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50"
                              >
                                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all shadow-xl">
                                  <Video className="w-5 h-5 text-blue-600 ml-0.5" />
                                </div>
                              </a>
                            )}
                            <Badge className="absolute top-3 right-3 bg-blue-600 text-white border-0">
                              {video.category}
                            </Badge>
                          </div>
                          <CardHeader className="pb-4 p-4">
                            <CardTitle className="text-lg group-hover:text-blue-400 transition-colors line-clamp-2 text-white leading-tight">
                              {video.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 flex-grow">
                            <p className="text-slate-400 text-sm line-clamp-2">{video.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Magazines Tab */}
                <TabsContent value="magazines" className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 sr-only">Magazines</h3>
                  {resources.magazines.length === 0 ? (
                    <EmptyState icon={FileText} message="No magazines available" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {resources.magazines.map((magazine) => (
                        <Card key={magazine._id} className="border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden flex flex-col">
                          <CardHeader className="p-4 pb-2">
                            <div className="relative aspect-[8/5] rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 overflow-hidden group flex-shrink-0">
                              {magazine.thumbnailUrl ? (
                                <Image
                                  src={magazine.thumbnailUrl}
                                  alt={magazine.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <FileText className="h-16 w-16 text-blue-400" />
                              )}
                            </div>
                            <CardTitle className="text-lg text-white line-clamp-2 leading-tight">{magazine.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 flex-grow">
                            <p className="text-slate-400 text-sm line-clamp-3">{magazine.description}</p>
                          </CardContent>
                          {magazine.downloadUrl && (
                            <CardFooter className="p-4 pt-0">
                              <Button className="w-full bg-white/5 hover:bg-blue-600/20 border border-white/20 text-white hover:border-blue-500/50 transition-all" variant="outline" asChild>
                                <a href={magazine.downloadUrl} download>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </a>
                              </Button>
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Links Tab */}
                <TabsContent value="links" className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 sr-only">Links</h3>
                  {resources.links.length === 0 ? (
                    <EmptyState icon={ExternalLink} message="No links available" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {resources.links.map((link) => (
                        <Card key={link._id} className="border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden flex flex-col">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 mb-4 flex-shrink-0">
                              <ExternalLink className="h-7 w-7 text-blue-400" />
                            </div>
                            <CardTitle className="text-lg text-white line-clamp-2 leading-tight">{link.title}</CardTitle>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-400/30 w-fit mt-2">
                              {link.category}
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 flex-grow">
                            <p className="text-slate-400 text-sm line-clamp-3">{link.description}</p>
                          </CardContent>
                          {link.linkUrl && (
                            <CardFooter className="p-4 pt-0">
                              <a
                                href={link.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                              >
                                <Button className="w-full bg-white/5 hover:bg-blue-600/20 border border-white/20 text-white hover:border-blue-500/50 transition-all" variant="outline">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Visit Site
                                </Button>
                              </a>
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Blogs Tab */}
                <TabsContent value="blogs" className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 sr-only">Blogs</h3>
                  {resources.blogs.length === 0 ? (
                    <EmptyState icon={FileText} message="No blogs available" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {resources.blogs.map((blog: Blog) => (
                        <Card key={blog._id} className="border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden flex flex-col">
                          {blog.thumbnailUrl ? (
                            <div className="relative aspect-[8/5] rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 overflow-hidden group flex-shrink-0">
                              <Image
                                src={blog.thumbnailUrl}
                                alt={blog.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 mb-4 flex-shrink-0">
                              <FileText className="h-7 w-7 text-blue-400" />
                            </div>
                          )}
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-lg text-white line-clamp-2 leading-tight">{blog.title}</CardTitle>
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-400/30 w-fit mt-2">
                              {blog.category}
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 flex-grow">
                            {blog.description && (
                              <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{blog.description}</p>
                            )}
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Link href={`/resources/blog/${blog._id}`} className="w-full">
                              <Button className="w-full bg-white/5 hover:bg-blue-600/20 border border-white/20 text-white hover:border-blue-500/50 transition-all" variant="outline">
                                Read Blog
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Testimonials Tab */}
                <TabsContent value="testimonials" className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 sr-only">Testimonials</h3>
                  {testimonials.length === 0 ? (
                    <EmptyState icon={Quote} message="No testimonials available" />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {testimonials.map((testimonial) => {
                        // Extract YouTube video ID for thumbnail
                        const getYouTubeThumbnail = (url: string) => {
                          const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                          return match ? `https://i.ytimg.com/vi/${match[1]}/maxresdefault.jpg` : null;
                        };
                        const thumbnail = testimonial.thumbnailUrl || (testimonial.videoUrl ? getYouTubeThumbnail(testimonial.videoUrl) : null);

                        return (
                          <Card key={testimonial._id} className="group overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
                            {/* Video Thumbnail */}
                            <div className="relative aspect-video bg-gradient-to-br from-blue-500/20 to-blue-600/20 overflow-hidden">
                              {thumbnail ? (
                                <Image
                                  src={thumbnail}
                                  alt={testimonial.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Quote className="h-16 w-16 text-blue-400" />
                                </div>
                              )}
                              {/* Play Button Overlay */}
                              {testimonial.videoUrl && (
                                <a
                                  href={testimonial.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50"
                                >
                                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all shadow-xl">
                                    <Video className="w-5 h-5 text-blue-600 ml-0.5" />
                                  </div>
                                </a>
                              )}
                              <Badge className="absolute top-3 right-3 bg-blue-600 text-white border-0">
                                Testimonial
                              </Badge>
                            </div>
                            <CardHeader className="pb-4 p-4">
                              <CardTitle className="text-lg text-white leading-tight">{testimonial.title}</CardTitle>
                              {testimonial.subtitle && (
                                <div className="text-blue-400/90 font-medium text-sm mt-1">{testimonial.subtitle}</div>
                              )}
                            </CardHeader>
                            {testimonial.quote && (
                              <CardContent className="p-4 pt-0">
                                <p className="text-slate-400 text-sm italic border-l-4 border-blue-400/30 pl-3">
                                  "{testimonial.quote}"
                                </p>
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="text-center py-20">
      <Icon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">{message}</h2>
      <p className="text-slate-400">Check back soon for new content!</p>
    </div>
  );
}
