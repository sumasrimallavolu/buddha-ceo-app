'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Gift, Sparkles, Check } from 'lucide-react';

export default function DonatePage() {
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
              poster="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-growing-plant-23779-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-slate-900/20" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20 mb-6">
              <Heart className="w-4 h-4 text-pink-300" />
              <span>Support Our Mission</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Donate &{' '}
              <span className="text-pink-300 drop-shadow-lg">
                Transform Lives
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto border-l-4 border-pink-400/50 pl-6">
              Your generous contribution helps us bring meditation and inner peace to thousands of people around the world
            </p>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-600 mb-4">
                Your Impact
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Every donation makes a real difference in spreading meditation and wellness globally
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-white/50 backdrop-blur-sm hover:scale-105">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-xl">₹1,000</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Provides meditation training to 10 students from underserved communities</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300 bg-white/50 backdrop-blur-sm hover:scale-105">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-xl">₹5,000</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Sponsors a complete 40-day meditation program for 25 participants</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-white/50 backdrop-blur-sm hover:scale-105">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-xl">₹25,000+</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Enables us to conduct corporate wellness programs reaching 100+ professionals</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Donation Options */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-600 mb-4">
                Choose Your Contribution
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select a donation amount that feels right for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { amount: '₹500', label: 'Supporter', popular: false },
                { amount: '₹1,000', label: 'Friend', popular: false },
                { amount: '₹5,000', label: 'Patron', popular: true },
                { amount: '₹10,000', label: 'Benefactor', popular: false },
              ].map((option) => (
                <Card
                  key={option.amount}
                  className={`relative group hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                    option.popular
                      ? 'border-2 border-purple-400 bg-purple-50 scale-105'
                      : 'border-2 border-purple-100 hover:border-purple-300 bg-white/50 backdrop-blur-sm hover:scale-105'
                  }`}
                >
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-3xl font-bold text-purple-600">
                      {option.amount}
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium">{option.label}</p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className={`w-full ${
                        option.popular
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      } transition-all hover:scale-105`}
                    >
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How Your Donation Helps */}
        {/* <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                How Your Donation Helps
              </h2>
              <p className="text-purple-100 max-w-2xl mx-auto">
                We ensure every rupee is utilized effectively to maximize our impact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                'Free meditation programs for underserved communities',
                'Training and certifying new meditation teachers',
                'Creating educational content in multiple languages',
                'Organizing public meditation events and retreats',
                'Supporting research on meditation benefits',
                'Maintaining meditation centers and facilities',
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mt-1">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-white text-lg leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Card className="inline-block bg-white/10 backdrop-blur-md border border-white/20">
                <CardContent className="p-8">
                  <p className="text-white text-lg mb-4">
                    For direct bank transfer or other donation methods:
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-white/20"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Contact Us for Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}

        {/* Tax Benefits */}
        {/* <section className="py-16 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  80G Tax Benefits Available
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  All donations to Buddha-CEO Quantum Foundation are eligible for tax deduction under Section 80G of the Income Tax Act. You will receive a tax exemption certificate for your donation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  );
}
