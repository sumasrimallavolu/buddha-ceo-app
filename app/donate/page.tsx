'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Sparkles, Users, Gift, Target, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState('');
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const donationOptions = [
    { amount: '500', label: 'Starter', icon: '🌱', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50' },
    { amount: '1000', label: 'Supporter', icon: '🌿', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50' },
    { amount: '5000', label: 'Champion', icon: '🌳', color: 'from-violet-400 to-purple-500', bg: 'bg-violet-50', featured: true },
    { amount: '10000', label: 'Visionary', icon: '🌴', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
  ];

  const impactData = [
    { number: '10+', text: 'Meditation Sessions', icon: '🧘' },
    { number: '5+', text: 'Community Workshops', icon: '🎯' },
    { number: '25+', text: 'Lives Transformed', icon: '✨' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" fill="currentColor" />
                <span className="text-white/80 text-sm">Make a Difference Today</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight">
                Your Generosity
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  Creates Change
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Join thousands of supporters making meditation accessible to all. Every contribution transforms lives.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 pt-8">
                {[
                  { value: '50K+', label: 'Lives Impacted' },
                  { value: '100+', label: 'Programs' },
                  { value: '25+', label: 'Cities' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-full px-12 py-6 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  onClick={() => document.getElementById('donate-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Giving
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Amount Selector */}
        <section id="donate-section" className="relative py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-4">Choose Your Impact</h2>
                <p className="text-slate-400 text-lg">Select an amount or enter your own</p>
              </div>

              {/* Amount Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {donationOptions.map((option, index) => (
                  <button
                    key={option.amount}
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => {
                      setSelectedAmount(option.amount);
                      setCustomAmount('');
                    }}
                    className={`
                      relative p-6 rounded-2xl border-2 transition-all duration-500
                      ${selectedAmount === option.amount
                        ? `border-transparent bg-gradient-to-br ${option.color} shadow-2xl scale-105`
                        : `border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105`
                      }
                      ${option.featured ? 'lg:col-span-2' : ''}
                    `}
                  >
                    {option.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
                        Most Popular
                      </div>
                    )}

                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="text-2xl font-bold text-white mb-1">₹{option.amount}</div>
                    <div className="text-sm text-slate-300">{option.label}</div>

                    {isHovered === index && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-8">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">₹</span>
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount('');
                    }}
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl py-6 text-lg shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] font-semibold"
                disabled={!selectedAmount && !customAmount}
              >
                <Heart className="mr-2 h-5 w-5" fill="currentColor" />
                Donate ₹{selectedAmount || customAmount || '0'} Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Impact Breakdown */}
        <section className="relative py-32 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-4">Where Your Money Goes</h2>
                <p className="text-slate-400 text-lg">Transparent allocation of every donation</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Program Delivery',
                    percentage: '60%',
                    description: 'Direct funding for meditation programs, workshops, and retreats',
                    color: 'from-blue-500 to-cyan-500',
                    icon: '🎯',
                  },
                  {
                    title: 'Community Outreach',
                    percentage: '25%',
                    description: 'Expanding access to underserved communities and schools',
                    color: 'from-violet-500 to-purple-500',
                    icon: '🤝',
                  },
                  {
                    title: 'Operations & Growth',
                    percentage: '15%',
                    description: 'Platform maintenance, content creation, and organizational development',
                    color: 'from-emerald-500 to-teal-500',
                    icon: '📈',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />

                    <div className="relative">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <div className="text-3xl font-bold text-white mb-2">{item.percentage}</div>
                      <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impact Calculator */}
        <section className="relative py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-4">Your Impact Calculator</h2>
                <p className="text-slate-400 text-lg">See the real difference your donation makes</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { amount: '₹1,000', impact: impactData, color: 'from-emerald-400 to-teal-500' },
                  { amount: '₹5,000', impact: impactData.map(d => ({ ...d, number: String(parseInt(d.number) * 5) })), color: 'from-blue-400 to-indigo-500' },
                  { amount: '₹10,000', impact: impactData.map(d => ({ ...d, number: String(parseInt(d.number) * 10) })), color: 'from-violet-400 to-purple-500' },
                ].map((tier, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10"
                  >
                    <div className="text-center mb-6">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
                        {tier.amount}
                      </div>
                      <div className="text-sm text-slate-400">Your Impact</div>
                    </div>

                    <div className="space-y-4">
                      {tier.impact.map((item, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <div className="text-2xl">{item.icon}</div>
                          <div>
                            <div className="text-white font-semibold">{item.number}</div>
                            <div className="text-xs text-slate-400">{item.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial / Trust Section */}
        <section className="relative py-32 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-8 shadow-2xl">
                <Heart className="w-10 h-10 text-white" fill="currentColor" />
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Trusted by Thousands
              </h2>

              <p className="text-xl text-slate-400 leading-relaxed mb-8">
                "Your donation helps us bring meditation and inner peace to people around the world. Join our community of changemakers."
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/20 text-white hover:bg-white/10 rounded-full px-8"
                >
                  Learn About Our Mission
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-emerald-500/20 border border-white/10 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative text-center space-y-8">
                  <Sparkles className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />

                  <h2 className="text-5xl font-bold text-white">
                    Ready to Transform Lives?
                  </h2>

                  <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                    Your generosity creates ripple effects of positive change. Join us in making meditation accessible to all.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-12 py-6 text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 font-semibold"
                      onClick={() => document.getElementById('donate-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <Heart className="mr-2 h-5 w-5" fill="currentColor" />
                      Donate Now
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white/20 text-white hover:bg-white/10 rounded-full px-12 py-6 text-lg backdrop-blur-sm"
                    >
                      Contact Us
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
