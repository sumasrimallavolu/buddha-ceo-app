'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Leaf, Heart } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/@BuddhaCEOQuantumFoundation', label: 'YouTube' },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Resources', href: '/resources' },
    { name: 'Events & Programs', href: '/events' },
  ];

  const programLinks = [
    { name: 'Beginner Online', href: '/events?type=beginner_online' },
    { name: 'Beginner Physical', href: '/events?type=beginner_physical' },
    { name: 'Advanced Online', href: '/events?type=advanced_online' },
    { name: 'Advanced Physical', href: '/events?type=advanced_physical' },
    { name: 'Conferences', href: '/events?type=conference' },
  ];

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
            <img
              src="https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_357,h_94,al_c,lg_1,q_85,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png"
              alt="Meditation Institute"
              className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm brightness-0 invert"
            />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering leaders, professionals, and seekers with transformative
              meditation wisdom and techniques for inner peace and radiant health.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="
                    w-10 h-10 rounded-full bg-white/5
                    flex items-center justify-center
                    text-slate-400 hover:text-white
                    hover:bg-gradient-to-br hover:from-blue-500 hover:to-violet-500
                    transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25
                    border border-white/10
                  "
                  target="_blank"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-6 text-white flex items-center text-lg">
              <Leaf className="mr-2 h-5 w-5 text-emerald-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="
                      text-slate-400 hover:text-blue-400 text-sm
                      transition-all duration-300
                      hover:pl-2 hover:translate-x-1
                      inline-block
                    "
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-bold mb-6 text-white text-lg">Programs</h3>
            <ul className="space-y-3">
              {programLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="
                      text-slate-400 hover:text-emerald-400 text-sm
                      transition-all duration-300
                      hover:pl-2 hover:translate-x-1
                      inline-block
                    "
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-6 flex items-center text-white text-lg">
              <Mail className="mr-2 h-5 w-5 text-violet-400" />
              Newsletter
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to receive updates about events and resources.
            </p>
            {subscribed ? (
              <div className="
                bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl text-sm
                border-2 border-emerald-500/30 shadow-md
                animate-slide-up
              ">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-emerald-400 animate-pulse" />
                  Successfully subscribed!
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="
                    bg-white/5 backdrop-blur-sm border-2 border-white/10
                    focus:border-blue-400 focus:ring-blue-400/20
                    rounded-xl transition-all duration-300 text-white placeholder:text-slate-500
                  "
                />
                <Button
                  type="submit"
                  className="
                    w-full bg-gradient-to-r from-blue-500 to-violet-500
                    hover:from-blue-600 hover:to-violet-600
                    text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25
                    hover:scale-105 transition-all duration-300 rounded-full
                  "
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Meditation Institute. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
              Made with <Heart className="h-3 w-3 text-blue-400 animate-pulse" /> for conscious communities
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
