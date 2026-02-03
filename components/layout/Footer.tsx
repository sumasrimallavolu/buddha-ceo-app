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
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              {/* Logo */}
              <div className="flex items-center justify-center lg:justify-start">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rotate-45 transform"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 bg-teal-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 800 }}>
                  Buddha-CEO
                </span>
                <span className="text-xs text-gray-600 font-light tracking-widest" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                  QUANTUM FOUNDATION
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'var(--font-lora)' }}>
              Empowering leaders, professionals, and seekers with transformative
              meditation wisdom and techniques.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                target="_blank"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                target="_blank"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                target="_blank"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://youtube.com/@BuddhaCEOQuantumFoundation"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                target="_blank"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-purple-600 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-purple-600 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground hover:text-purple-600 text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-purple-600 text-sm">
                  Events & Programs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-purple-600 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold mb-4">Programs</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events?type=beginner_online" className="text-muted-foreground hover:text-purple-600 text-sm">
                  Beginner Online
                </Link>
              </li>
              <li>
                <Link href="/events?type=beginner_physical" className="text-muted-foreground hover:text-purple-600 text-sm">
                  Beginner Physical
                </Link>
              </li>
              <li>
                <Link href="/events?type=advanced_online" className="text-muted-foreground hover:text-purple-600 text-sm">
                  Advanced Online
                </Link>
              </li>
              <li>
                <Link href="/events?type=advanced_physical" className="text-muted-foreground hover:text-purple-600 text-sm">
                  Advanced Physical
                </Link>
              </li>
              <li>
                <Link href="/events?type=conference" className="text-muted-foreground hover:text-purple-600 text-sm">
                  Conferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to receive updates about events and resources.
            </p>
            {subscribed ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
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
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p className="mb-2">© {new Date().getFullYear()} Buddha-CEO Quantum Foundation. All rights reserved.</p>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-lora)' }}>
            Empowering through meditation • Transforming lives • Building conscious communities
          </p>
        </div>
      </div>
    </footer>
  );
}
