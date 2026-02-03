'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Video, FileText, ExternalLink, Download, PenTool } from 'lucide-react';

// Sample data - will be replaced with API calls
const books = [
  {
    id: 1,
    title: 'Introduction to Meditation',
    description: 'A comprehensive guide to starting your meditation journey',
    thumbnail: '/images/resources/intro-book.jpg',
    downloadUrl: '/downloads/intro-meditation.pdf',
    category: 'Beginner',
  },
  {
    id: 2,
    title: 'Advanced Meditation Techniques',
    description: 'Deepen your practice with advanced methods',
    thumbnail: '/images/resources/advanced-book.jpg',
    downloadUrl: '/downloads/advanced-meditation.pdf',
    category: 'Advanced',
  },
];

const videos = [
  {
    id: 1,
    title: 'Why Meditation Feels Good',
    description: 'Understanding the science behind meditation',
    thumbnail: 'https://i.ytimg.com/vi/W7r5kxpgWyk/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=W7r5kxpgWyk',
    category: 'Concept Videos',
  },
  {
    id: 2,
    title: 'Breath Mindfulness Meditation',
    description: 'Quantum Field of possibilities',
    thumbnail: 'https://i.ytimg.com/vi/n_99IlB3V-Y/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=n_99IlB3V-Y',
    category: 'Guided Meditations',
  },
  {
    id: 3,
    title: 'Satya & Ahimsa in Every Word',
    description: 'Master Chandra teaches truth and non-violence',
    thumbnail: 'https://i.ytimg.com/vi/DDcYmHt-wwQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=DDcYmHt-wwQ',
    category: 'Teachings',
  },
];

const magazines = [
  {
    id: 1,
    title: 'Meditation Today - January 2025',
    description: 'Monthly magazine with insights and practices',
    thumbnail: '/images/resources/magazine-jan.jpg',
    downloadUrl: '/downloads/magazine-jan.pdf',
    category: 'Magazines',
  },
];

const links = [
  {
    id: 1,
    title: 'Pyramid Valley International',
    description: 'Learn more about meditation and spiritual science',
    url: 'https://pyramidvalley.org',
    category: 'Meditation Centers',
  },
  {
    id: 2,
    title: 'Dhyanapeetam',
    description: 'Official website of Brahmarshi Patriji',
    url: 'https://pssmovement.org',
    category: 'Organizations',
  },
];

const blogs = [
  {
    id: 1,
    title: 'The Science Behind Meditation',
    description: 'Explore how meditation transforms your brain and improves mental health',
    author: 'Dr. Chandra Pulamarasetti',
    date: '2025-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    category: 'Science',
    readTime: '5 min read',
    excerpt: 'Recent scientific studies have shown that regular meditation practice can actually reshape the brain, improving focus, reducing stress, and enhancing overall cognitive function.',
  },
  {
    id: 2,
    title: 'Beginning Your Meditation Journey',
    description: 'A step-by-step guide for beginners starting their practice',
    author: 'Meditation Institute',
    date: '2025-01-10',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    category: 'Beginner\'s Guide',
    readTime: '7 min read',
    excerpt: 'Starting a meditation practice can feel overwhelming, but with the right approach, anyone can experience the benefits of this ancient technique.',
  },
  {
    id: 3,
    title: 'Meditation for Corporate Professionals',
    description: 'How mindfulness can transform your work life and productivity',
    author: 'Dr. Chandra Pulamarasetti',
    date: '2025-01-05',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    category: 'Workplace',
    readTime: '6 min read',
    excerpt: 'In today\'s fast-paced corporate world, meditation offers a powerful tool for maintaining mental clarity, reducing burnout, and enhancing decision-making abilities.',
  },
  {
    id: 4,
    title: 'The Power of Anapanasati',
    description: 'Understanding breath mindfulness meditation technique',
    author: 'Meditation Institute',
    date: '2024-12-28',
    thumbnail: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800',
    category: 'Techniques',
    readTime: '8 min read',
    excerpt: 'Anapanasati, or mindfulness of breathing, is one of the most fundamental and powerful meditation techniques taught by the Buddha.',
  },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-purple-600 to-blue-600 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Resources
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Access our collection of books, videos, magazines, and curated
              links to support your meditation journey
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                <TabsTrigger value="books" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Books
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="magazines" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Magazines
                </TabsTrigger>
                <TabsTrigger value="blogs" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  Blogs
                </TabsTrigger>
                <TabsTrigger value="links" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Links
                </TabsTrigger>
              </TabsList>

              <TabsContent value="books" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <Card key={book.id} className="hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
                          <Book className="h-24 w-24 text-purple-600" />
                        </div>
                        <CardTitle className="text-xl">{book.title}</CardTitle>
                        <Badge variant="secondary">{book.category}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{book.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id} className="hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="relative aspect-video bg-gray-100">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 hover:bg-white transition-colors">
                            <Video className="w-6 h-6 text-purple-600 ml-1" />
                          </div>
                        </a>
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {video.category}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          {video.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="magazines" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {magazines.map((magazine) => (
                    <Card key={magazine.id} className="hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                          <FileText className="h-24 w-24 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl">{magazine.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{magazine.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="blogs" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.map((blog) => (
                    <Card key={blog.id} className="hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-3 left-3" variant="secondary">
                          {blog.category}
                        </Badge>
                      </div>
                      <CardHeader className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span>{blog.author}</span>
                          <span>•</span>
                          <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>{blog.readTime}</span>
                        </div>
                        <CardTitle className="text-xl hover:text-purple-600 transition-colors cursor-pointer">
                          {blog.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          <PenTool className="mr-2 h-4 w-4" />
                          Read More
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="links" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {links.map((link) => (
                    <Card key={link.id} className="hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100 mb-4">
                          <ExternalLink className="h-8 w-8 text-purple-600" />
                        </div>
                        <CardTitle className="text-xl">{link.title}</CardTitle>
                        <Badge variant="secondary">{link.category}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{link.description}</p>
                      </CardContent>
                      <CardFooter>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button className="w-full" variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Site
                          </Button>
                        </a>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
