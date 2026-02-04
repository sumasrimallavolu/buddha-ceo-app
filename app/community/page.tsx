'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, MessageCircle, Calendar, Heart, Share2, Send, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Software Engineer',
    image: 'https://i.ytimg.com/vi/9QSKyMf98uY/default.jpg',
    content: 'The meditation program transformed my life. I feel more focused, calm, and productive at work. The community support has been incredible!',
    rating: 5,
    date: '2 days ago',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    role: 'Business Owner',
    image: 'https://i.ytimg.com/vi/s4vH34O7rOs/default.jpg',
    content: 'Being part of this community has helped me grow not just personally but also professionally. The wisdom shared here is priceless.',
    rating: 5,
    date: '1 week ago',
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    role: 'Student',
    image: 'https://i.ytimg.com/vi/MSUXw7Dxle8/default.jpg',
    content: 'I scored 10/10 in my board exams after joining the 40-day meditation program. The techniques are simple yet powerful!',
    rating: 5,
    date: '2 weeks ago',
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Full Moon Meditation',
    date: 'Feb 24, 2025',
    time: '6:00 PM IST',
    attendees: 234,
    type: 'online',
  },
  {
    id: 2,
    title: 'Sunday Group Meditation',
    date: 'Every Sunday',
    time: '7:00 AM IST',
    attendees: 156,
    type: 'online',
  },
  {
    id: 3,
    title: 'Community Meet - Bangalore',
    date: 'Mar 1, 2025',
    time: '10:00 AM IST',
    attendees: 45,
    type: 'offline',
  },
];

const forumPosts = [
  {
    id: 1,
    title: 'How to maintain consistency in daily practice?',
    author: 'MeditationBeginner',
    replies: 24,
    views: 456,
    category: 'Practice Tips',
  },
  {
    id: 2,
    title: 'My experience with the 40-day program - Life changing!',
    author: 'NewPractitioner',
    replies: 18,
    views: 789,
    category: 'Success Stories',
  },
  {
    id: 3,
    title: 'Best time for meditation - Morning vs Evening',
    author: 'CuriousMind',
    replies: 31,
    views: 623,
    category: 'Discussion',
  },
];

export default function CommunityPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-slate-800">
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-sitting-on-the-grass-4382-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-slate-900/20" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20 mb-6">
              <Users className="w-4 h-4 text-purple-900" />
              <span>Join Our Family</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Our{' '}
              <span className="text-purple-900 drop-shadow-lg">
                Community
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto border-l-4 border-indigo-400/50 pl-6">
              Connect with fellow meditators, share experiences, and grow together on this transformative journey
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-3xl font-bold text-indigo-300">
                  50,000+
                </div>
                <div className="text-white/80 text-sm mt-1">Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-3xl font-bold text-purple-300">
                  500+
                </div>
                <div className="text-white/80 text-sm mt-1">Events</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-3xl font-bold text-pink-300">
                  25+
                </div>
                <div className="text-white/80 text-sm mt-1">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-indigo-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-indigo-600 mb-4">
                Community Stories
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from our members about their transformational journeys
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="group hover:shadow-2xl transition-all duration-500 border-2 border-indigo-100 hover:border-indigo-300 bg-white/50 backdrop-blur-sm hover:scale-105"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="relative inline-block mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-indigo-200 group-hover:ring-indigo-400 transition-all"
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">
                        {testimonial.role}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{testimonial.name}</CardTitle>
                    <div className="flex justify-center gap-0.5 mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      "{testimonial.content}"
                    </p>
                    <p className="text-xs text-gray-500 text-center">{testimonial.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-600 mb-4">
                Upcoming Community Events
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join us for group meditations and community gatherings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="group hover:shadow-2xl transition-all duration-500 border-2 border-purple-100 hover:border-purple-300 bg-white/50 backdrop-blur-sm hover:scale-105"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Badge
                        className={
                          event.type === 'online'
                            ? 'bg-blue-500 text-white border-0'
                            : 'bg-purple-500 text-white border-0'
                        }
                      >
                        {event.type === 'online' ? '🌐 Online' : '📍 Offline'}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-purple-600 transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <MessageCircle className="mr-2 h-4 w-4 text-purple-600" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <Users className="mr-2 h-4 w-4 text-purple-600" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      <Heart className="mr-2 h-4 w-4" />
                      Join Event
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Forum */}
        <section className="py-20 bg-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-indigo-600 mb-4">
                Community Discussions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join the conversation, ask questions, and share your experiences
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {forumPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-white/50 backdrop-blur-sm cursor-pointer hover:scale-[1.02]"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge className="mb-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                          {post.category}
                        </Badge>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600">by {post.author}</p>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.replies}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                View All Discussions
              </Button>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
