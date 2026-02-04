'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-slate-800">
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1518837695005-630df283a5df?w=1920"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-slate-900/20" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20 mb-6">
              <Mail className="w-4 h-4 text-purple-300" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Contact{' '}
              <span className="text-purple-300 drop-shadow-lg">
                Us
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto border-l-4 border-purple-400/50 pl-6">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-white/50 backdrop-blur-sm hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mr-3 group-hover:scale-110 transition-transform">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-medium">info@meditation.org</p>
                    <p className="text-gray-600 text-sm">support@meditation.org</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-white/50 backdrop-blur-sm hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-3 group-hover:scale-110 transition-transform">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      Phone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-medium">+91 (80) 1234-5678</p>
                    <p className="text-gray-600 text-sm">Mon-Fri 9AM-6PM IST</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-white/50 backdrop-blur-sm hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mr-3 group-hover:scale-110 transition-transform">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      <span className="font-semibold">Meditation Institute</span>
                      <br />
                      123 Spiritual Path
                      <br />
                      Bangalore, Karnataka 560001
                      <br />
                      <span className="text-purple-600 font-medium">India</span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-2 border-purple-200 shadow-xl bg-white/50 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <CardTitle className="flex items-center text-2xl">
                      <Send className="mr-2 h-6 w-6 text-purple-600" />
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {submitted ? (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 p-8 rounded-xl text-center animate-fadeInUp">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <Send className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          Message Sent Successfully! ✨
                        </h3>
                        <p className="text-sm mb-6">
                          Thank you for contacting us. We'll get back to you
                          within 24 hours.
                        </p>
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50 hover:scale-105 transition-all"
                          onClick={() => setSubmitted(false)}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 font-medium">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Your full name"
                              disabled={loading}
                              className="border-2 border-purple-200 focus:border-purple-500 transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="your@email.com"
                              disabled={loading}
                              className="border-2 border-purple-200 focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-gray-700 font-medium">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="How can we help you today?"
                            disabled={loading}
                            className="border-2 border-purple-200 focus:border-purple-500 transition-colors"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-gray-700 font-medium">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Tell us more about your inquiry..."
                            rows={6}
                            disabled={loading}
                            className="border-2 border-purple-200 focus:border-purple-500 transition-colors"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
