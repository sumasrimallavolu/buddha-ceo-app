'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Sparkles, CheckCircle, IndianRupee, Lock, X } from 'lucide-react';
import { useState, useCallback, useMemo, memo, useEffect } from 'react';

// ============= TYPES =============
interface DonationTier {
  amount: string;
  label: string;
  impact: string;
  color: string;
}

interface PaymentMethod {
  id: 'upi' | 'card' | 'netbanking';
  label: string;
  icon: string;
}

// ============= CONSTANTS =============
const DONATION_TIERS: DonationTier[] = [
  { amount: '500', label: 'Starter', impact: 'Resources for 5 people', color: 'from-cyan-400 to-blue-500' },
  { amount: '1000', label: 'Supporter', impact: 'Group meditation session', color: 'from-blue-400 to-indigo-500' },
  { amount: '5000', label: 'Champion', impact: 'Full workshop for 25+ people', color: 'from-violet-400 to-purple-500' },
  { amount: '10000', label: 'Visionary', impact: 'Community program for 100+ people', color: 'from-purple-400 to-pink-500' },
  { amount: '25000', label: 'Patron', impact: 'Launch new meditation center', color: 'from-pink-400 to-rose-500' },
] as const;

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
] as const;

const STATS = [
  { value: '50K+', label: 'Lives Impacted' },
  { value: '100+', label: 'Programs' },
  { value: '25+', label: 'Cities' },
] as const;

const IMPACT_METRICS = [
  { icon: '🧘', value: '10,000+', label: 'Meditation Sessions' },
  { icon: '🎯', value: '500+', label: 'Workshops Conducted' },
  { icon: '🏫', value: '50+', label: 'Schools Reached' },
  { icon: '🌍', value: '15+', label: 'Countries' },
];

// ============= MAIN PAGE COMPONENT =============

function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentSidebar, setShowPaymentSidebar] = useState(false);

  // Memoize the display amount
  const displayAmount = useMemo(() => {
    return selectedAmount || customAmount || '0';
  }, [selectedAmount, customAmount]);

  // Handle donation tier selection
  const handleTierSelect = useCallback((amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setShowPaymentSidebar(true);
  }, []);

  // Handle custom amount change
  const handleCustomAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('');
    if (e.target.value) {
      setShowPaymentSidebar(true);
    }
  }, []);

  // Handle payment method selection
  const handlePaymentMethodSelect = useCallback((method: 'upi' | 'card' | 'netbanking') => {
    setPaymentMethod(method);
  }, []);

  // Handle donate button click
  const handleDonate = useCallback(async () => {
    const amount = selectedAmount || customAmount;
    if (!amount) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert(`Thank you for your donation of ₹${amount}!`);
    setShowPaymentSidebar(false);
    setSelectedAmount('');
    setCustomAmount('');
  }, [selectedAmount, customAmount]);

  // Close sidebar handler
  const closeSidebar = useCallback(() => {
    setShowPaymentSidebar(false);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (showPaymentSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPaymentSidebar]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>

      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Hero Section - Creative Layout */}
        <section className="relative min-h-[70vh] flex items-center justify-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Floating Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4 animate-[float_4s_ease-in-out_infinite]">
                <Heart className="w-4 h-4 animate-pulse" fill="currentColor" />
                <span>Support Our Mission</span>
              </div>

              {/* Main Heading - Creative Typography */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight animate-[fadeInUp_0.8s_ease-out]">
                Donate to Make a
                <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Difference
                </span>
              </h1>

              <p className="text-xl text-slate-400 mb-6 leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s]">
                Your donation helps us bring meditation and mindfulness to people around the world.
                <br />
                <span className="text-slate-500">Join thousands of supporters transforming lives.</span>
              </p>

              {/* Stats - Creative Display */}
              <div className="flex flex-wrap justify-center gap-12 mb-8 animate-[fadeInUp_0.8s_ease-out_0.4s]">
                {STATS.map((stat, index) => (
                  <div key={stat.label} className="text-center group">
                    <div className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-slate-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Button - Gradient */}
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-full px-12 py-6 text-lg font-semibold shadow-2xl shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40 animate-[fadeInUp_0.8s_ease-out_0.6s]"
                onClick={() => document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Donate Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Donation Amounts - Horizontal Flow */}
        <section id="donation-section" className="relative py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Choose Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Donation Amount</span>
              </h2>
              <p className="text-slate-400 text-lg">Select an amount that feels right for you</p>
            </div>

            {/* Creative Amount Display - No Cards */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {DONATION_TIERS.map((tier, index) => (
                <button
                  key={tier.amount}
                  onClick={() => handleTierSelect(tier.amount)}
                  className={`group relative px-8 py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    selectedAmount === tier.amount
                      ? 'bg-gradient-to-br ' + tier.color + ' shadow-2xl scale-105'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  {selectedAmount === tier.amount && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur-xl animate-pulse" />
                  )}
                  <div className="relative">
                    <div className="text-4xl font-bold text-white mb-1">₹{tier.amount}</div>
                    <div className={`text-sm font-medium mb-1 ${selectedAmount === tier.amount ? 'text-white/90' : 'text-slate-400'}`}>
                      {tier.label}
                    </div>
                    <div className={`text-xs ${selectedAmount === tier.amount ? 'text-white/70' : 'text-slate-500'}`}>
                      {tier.impact}
                    </div>
                    {selectedAmount === tier.amount && (
                      <CheckCircle className="w-6 h-6 text-white mt-2 mx-auto animate-[scaleIn_0.3s_ease-out]" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Amount - Floating Input */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2 flex items-center">
                  <IndianRupee className="w-5 h-5 text-slate-400 ml-4" />
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="flex-1 bg-transparent border-none text-white text-lg placeholder-slate-500 focus:outline-none px-4 py-3"
                  />
                  {customAmount && (
                    <Button
                      onClick={() => setShowPaymentSidebar(true)}
                      className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl px-6 mr-2"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Metrics - Icon Grid */}
        <section className="relative py-20 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Your Donation <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Impact</span>
              </h2>
              <p className="text-slate-400 text-lg">See the difference your donation makes</p>
            </div>

            {/* Metrics Grid - No Boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {IMPACT_METRICS.map((metric, index) => (
                <div
                  key={index}
                  className="text-center group cursor-pointer animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {metric.icon}
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {metric.value}
                  </div>
                  <div className="text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fund Breakdown - Creative Visualization */}
        <section className="relative py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                How Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Donation</span> Helps
              </h2>
              <p className="text-slate-400 text-lg">Every rupee makes a difference</p>
            </div>

            {/* Creative Progress Display - No Cards */}
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                { title: 'Program Delivery', percentage: 60, color: 'from-blue-400 to-cyan-400', description: 'Meditation programs, workshops & retreats' },
                { title: 'Community Outreach', percentage: 25, color: 'from-violet-400 to-purple-400', description: 'Schools, rural areas & scholarships' },
                { title: 'Operations & Growth', percentage: 15, color: 'from-pink-400 to-rose-400', description: 'Platform, content & development' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.description}</p>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {item.percentage}%
                    </div>
                  </div>
                  {/* Progress Bar - Creative */}
                  <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 group-hover:opacity-80`}
                      style={{ width: `${item.percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section - Minimal */}
        <section className="relative py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">Secure & Transparent</span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                Your donation is secure and every rupee is accounted for. We publish annual reports detailing how funds are utilized.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA - Gradient Wave */}
        <section className="relative py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative text-center p-16 rounded-3xl bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-purple-500/20 overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              <div className="relative">
                <Heart className="w-16 h-16 text-blue-400 mx-auto mb-6 fill-blue-400 animate-pulse" />
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  Ready to Make a Difference?
                </h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                  Your generosity creates ripple effects of positive change.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-full px-12 py-6 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-105"
                  onClick={() => document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Payment Sidebar - Slides in from right */}
      {showPaymentSidebar && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-[fadeIn_0.3s_ease-out]"
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-slate-950 border-l border-white/10 z-50 shadow-2xl animate-[slideInRight_0.3s_ease-out] overflow-y-auto">
            <div className="sticky top-0 bg-slate-950/95 backdrop-blur-sm border-b border-white/10 p-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Complete Your Donation</h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Selected Amount Display - Gradient */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-center">
                <div className="text-sm text-slate-400 mb-2">Donation Amount</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent animate-[scaleIn_0.3s_ease-out]">
                  ₹{displayAmount}
                </div>
              </div>

              {/* Payment Methods - Buttons */}
              <div>
                <label className="text-sm font-medium text-white mb-3 block">Payment Method</label>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-3 transform hover:scale-[1.02] ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                          : 'border-white/10 bg-white/5 hover:border-blue-500/30'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-white">{method.label}</span>
                      {paymentMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-blue-400 ml-auto animate-[scaleIn_0.2s_ease-out]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Change Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Tax Benefit - Minimal */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">80G Tax Benefit</p>
                  <p className="text-xs text-slate-400">All donations are tax-exempt</p>
                </div>
              </div>

              {/* Donate Button */}
              <Button
                size="lg"
                onClick={handleDonate}
                disabled={!displayAmount || displayAmount === '0' || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl py-5 text-base font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Donate ₹{displayAmount}
                  </>
                )}
              </Button>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="w-4 h-4" />
                <span>Secured by Razorpay</span>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

export default DonatePage;
