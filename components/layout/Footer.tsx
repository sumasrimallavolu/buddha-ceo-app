'use client';

import Link from 'next/link';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Leaf,
    Heart,
    Smartphone
} from 'lucide-react';

export function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e : React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
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
         {
            icon: Instagram,
            href: 'https://www.instagram.com/buddhaceo',
            label: 'Instagram'
        },  {
            icon: Youtube,
            href: 'https://www.youtube.com/@BuddhaCEO',
            label: 'YouTube'
        },
    ];

    const quickLinks = [
        {
            name: 'Home',
            href: '/'
        }, {
            name: 'About Us',
            href: '/about'
        }, {
            name: 'Resources',
            href: '/resources'
        }, {
            name: 'Events & Programs',
            href: '/events'
        },
    ];

    const programLinks = [
        {
            name: 'Beginner Online',
            href: '/events?type=beginner_online'
        },
        {
            name: 'Beginner Physical',
            href: '/events?type=beginner_physical'
        },
        {
            name: 'Advanced Online',
            href: '/events?type=advanced_online'
        },
        {
            name: 'Advanced Physical',
            href: '/events?type=advanced_physical'
        }, {
            name: 'Conferences',
            href: '/events?type=conference'
        },
    ];

    const appLinks = [
        {
            name: 'Download on App Store',
            href: 'https://apps.apple.com/in/app/buddha-ceo/id6472446813',
            icon: (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
            )
        },
        {
            name: 'Get it on Google Play',
            href: 'https://play.google.com/store/apps/details?id=com.besupermind.buddhaceo&pli=1',
            icon: (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91,3.34,2.39,3.84,2.15L13.69,12L3.84,21.85C3.34,21.6,3,21.09,3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08,20.75,11.5,20.75,12C20.75,12.5,20.5,12.92,20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
            )
        }
    ];

    return (
        <footer className="border-t border-white/10 bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* About */}
                    <div className="space-y-6">
                        <div className="flex justify-center bg-white p-3 rounded-xl">
                            <Link href="/" className="flex items-center group ">
                                <img src="https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_357,h_94,al_c,lg_1,q_85,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png" alt="Meditation Institute" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"/>
                            </Link>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Empowering leaders, professionals, and seekers with transformative
                                          meditation wisdom and techniques for inner peace and radiant health.
                        </p>
                        <div className="flex space-x-3">
                            {
                            socialLinks.map((social) => (
                                <Link key={
                                        social.label
                                    }
                                    href={
                                        social.href
                                    }
                                    className="
                                                            w-10 h-10 rounded-full bg-white/5
                                                            flex items-center justify-center
                                                            text-slate-400 hover:text-white
                                                            hover:bg-gradient-to-br hover:from-blue-500 hover:to-violet-500
                                                            transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25
                                                            border border-white/10
                                                          "
                                    target="_blank"
                                    aria-label={
                                        social.label
                                }>
                                    <social.icon className="h-5 w-5"/>
                                </Link>
                            ))
                        } </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold mb-6 text-white flex items-center text-lg">
                            <Leaf className="mr-2 h-5 w-5 text-emerald-400"/>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {
                            quickLinks.map((link) => (
                                <li key={
                                    link.name
                                }>
                                    <Link href={
                                            link.href
                                        }
                                        className="
                                                                  text-slate-400 hover:text-blue-400 text-sm
                                                                  transition-all duration-300
                                                                  hover:pl-2 hover:translate-x-1
                                                                  inline-block
                                                                ">
                                        {
                                        link.name
                                    } </Link>
                                </li>
                            ))
                        } </ul>
                    </div>

                    {/* Programs */}
                    <div>
                        <h3 className="font-bold mb-6 text-white text-lg">Programs</h3>
                        <ul className="space-y-3">
                            {
                            programLinks.map((link) => (
                                <li key={
                                    link.name
                                }>
                                    <Link href={
                                            link.href
                                        }
                                        className="
                                                                  text-slate-400 hover:text-emerald-400 text-sm
                                                                  transition-all duration-300
                                                                  hover:pl-2 hover:translate-x-1
                                                                  inline-block
                                                                ">
                                        {
                                        link.name
                                    } </Link>
                                </li>
                            ))
                        } </ul>
                    </div>

                    {/* Mobile App */}
                    <div>
                        <h3 className="font-bold mb-6 flex items-center text-white text-lg">
                            <Smartphone className="mr-2 h-5 w-5 text-blue-400"/>
                            Mobile App
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Download our app for meditation on the go.
                        </p>
                        <div className="space-y-3">
                            {
                            appLinks.map((app) => (
                                <Link
                                    key={app.name}
                                    href={app.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                      flex items-center gap-3 px-4 py-3
                                      bg-white/5 backdrop-blur-sm
                                      border border-white/10
                                      rounded-xl
                                      hover:bg-white/10 hover:border-white/20
                                      transition-all duration-300
                                      group
                                    "
                                >
                                    <div className="text-slate-300 group-hover:text-white">
                                        {app.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500">{app.name.split(' ')[0]} {app.name.split(' ')[1]}</div>
                                        <div className="text-sm font-semibold text-white">{app.name.split(' ').slice(2).join(' ')}</div>
                                    </div>
                                </Link>
                            ))
                            }
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold mb-6 flex items-center text-white text-lg">
                            <Mail className="mr-2 h-5 w-5 text-violet-400"/>
                            Newsletter
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Subscribe to receive updates about events and resources.
                        </p>
                        {
                        subscribed ? (
                            <div className="
                                                    bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl text-sm
                                                    border-2 border-emerald-500/30 shadow-md
                                                    animate-slide-up
                                                  ">
                                <div className="flex items-center">
                                    <Heart className="h-5 w-5 mr-2 text-emerald-400 animate-pulse"/>
                                    Successfully subscribed!
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe}
                                className="space-y-3">
                                <Input type="email" placeholder="Your email"
                                    value={email}
                                    onChange={
                                        (e) => setEmail(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                    className="
                                                            bg-white/5 backdrop-blur-sm border-2 border-white/10
                                                            focus:border-blue-400 focus:ring-blue-400/20
                                                            rounded-xl transition-all duration-300 text-white placeholder:text-slate-500
                                                          "/>
                                <Button type="submit" className="
                                                            w-full bg-gradient-to-r from-blue-500 to-violet-500
                                                            hover:from-blue-600 hover:to-violet-600
                                                            text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25
                                                            hover:scale-105 transition-all duration-300 rounded-full
                                                          "
                                    disabled={loading}>
                                    {
                                    loading ? 'Subscribing...' : 'Subscribe'
                                } </Button>
                            </form>
                        )
                    } </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-slate-400">
                            © {
                            new Date().getFullYear()
                        }
                            Meditation Institute. All rights reserved.
                        </p>
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                            Made with
                            <Heart className="h-3 w-3 text-blue-400 animate-pulse"/>
                            for conscious communities
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
