'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';

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

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              {/* Logo */}
              <Link href="/" className="flex items-center justify-center lg:justify-start">
                <img
                  src="https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_357,h_94,al_c,lg_1,q_85,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png"
                  alt="Meditation Institute"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--font-lora)' }}>
              Empowering leaders, professionals, and seekers with transformative
              meditation wisdom and techniques.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-slate-500 hover:text-slate-700 transition-colors"
                target="_blank"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-slate-500 hover:text-slate-700 transition-colors"
                target="_blank"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-slate-500 hover:text-slate-700 transition-colors"
                target="_blank"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://youtube.com/@BuddhaCEOQuantumFoundation"
                className="text-slate-500 hover:text-slate-700 transition-colors"
                target="_blank"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-slate-700">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Events & Programs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold mb-4 text-slate-700">Programs</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events?type=beginner_online" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Beginner Online
                </Link>
              </li>
              <li>
                <Link href="/events?type=beginner_physical" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Beginner Physical
                </Link>
              </li>
              <li>
                <Link href="/events?type=advanced_online" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Advanced Online
                </Link>
              </li>
              <li>
                <Link href="/events?type=advanced_physical" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Advanced Physical
                </Link>
              </li>
              <li>
                <Link href="/events?type=conference" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                  Conferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center text-slate-700">
              <Mail className="mr-2 h-4 w-4" />
              Newsletter
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Subscribe to receive updates about events and resources.
            </p>
            {subscribed ? (
              <div className="bg-slate-100 text-slate-700 p-3 rounded-md text-sm border border-slate-200">
                ✓ Successfully subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="border-slate-300"
                />
                <Button
                  type="submit"
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white"
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-600">
          <p className="mb-2">© {new Date().getFullYear()} Meditation Institute. All rights reserved.</p>
          <p className="text-xs text-slate-500" style={{ fontFamily: 'var(--font-lora)' }}>
            Empowering through meditation • Transforming lives • Building conscious communities
          </p>
        </div>
      </div>
    </footer>
  );
}
