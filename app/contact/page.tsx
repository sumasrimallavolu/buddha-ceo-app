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
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-blue-400 text-sm font-medium border border-white/10 mb-6">
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Contact{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Us
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto border-l-4 border-blue-500/40 pl-6">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-sm hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 mr-3 group-hover:scale-110 transition-transform">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 font-medium">info@meditation.org</p>
                    <p className="text-slate-400 text-sm">support@meditation.org</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-sm hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <div className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mr-3 group-hover:scale-110 transition-transform">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      Phone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 font-medium">+91 (80) 1234-5678</p>
                    <p className="text-slate-400 text-sm">Mon-Fri 9AM-6PM IST</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-sm hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <div className="p-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mr-3 group-hover:scale-110 transition-transform">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">
                      <span className="font-semibold text-white">Meditation Institute</span>
                      <br />
                      123 Spiritual Path
                      <br />
                      Bangalore, Karnataka 560001
                      <br />
                      <span className="text-blue-400 font-medium">India</span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border border-white/10 shadow-xl bg-white/5 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-500/10 to-violet-500/10">
                    <CardTitle className="flex items-center text-2xl text-white">
                      <Send className="mr-2 h-6 w-6 text-blue-400" />
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {submitted ? (
                      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 text-emerald-400 p-8 rounded-xl text-center animate-slide-up">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                          <Send className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">
                          Message Sent Successfully! ✨
                        </h3>
                        <p className="text-sm mb-6 text-slate-400">
                          Thank you for contacting us. We'll get back to you
                          within 24 hours.
                        </p>
                        <Button
                          variant="outline"
                          className="border-emerald-400 text-emerald-400 hover:bg-emerald-500/10 hover:scale-105 transition-all"
                          onClick={() => setSubmitted(false)}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-300 font-medium">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Your full name"
                              disabled={loading}
                              className="bg-white/5 border-2 border-white/10 focus:border-blue-400 text-white placeholder:text-slate-500 transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300 font-medium">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="your@email.com"
                              disabled={loading}
                              className="bg-white/5 border-2 border-white/10 focus:border-blue-400 text-white placeholder:text-slate-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-slate-300 font-medium">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="How can we help you today?"
                            disabled={loading}
                            className="bg-white/5 border-2 border-white/10 focus:border-blue-400 text-white placeholder:text-slate-500 transition-colors"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-slate-300 font-medium">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Tell us more about your inquiry..."
                            rows={6}
                            disabled={loading}
                            className="bg-white/5 border-2 border-white/10 focus:border-blue-400 text-white placeholder:text-slate-500 transition-colors"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:scale-[1.02]"
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
