# UI Component Examples & Code Snippets

**Companion to:** UI_UX_DESIGN_GUIDE.md
**Purpose:** Ready-to-use component code for implementing the design system

---

## Table of Contents
1. [Hero Components](#hero-components)
2. [Navigation Components](#navigation-components)
3. [Card Components](#card-components)
4. [Button Components](#button-components)
5. [Animation Utilities](#animation-utilities)
6. [Color Utilities](#color-utilities)
7. [Typography Components](#typography-components)
8. [Layout Components](#layout-components)

---

## Hero Components

### Enhanced Hero Section with Glassmorphism

```tsx
// app/components/home/EnhancedHeroSection.tsx

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Calendar, Users, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

export function EnhancedHeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Ambient Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/5 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      {/* Video Background with Soft Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          poster="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-purple-50/40 to-blue-50/50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-8 text-gray-800" style={{ opacity: 1 - scrollY / 500 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md text-purple-700 text-sm font-medium border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Transform Your Life Through Meditation</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Discover Inner Peace &{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent font-bold">
                  Radiant Health
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                  <path
                    d="M0 4 Q50 0 100 4 T200 4"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    className="opacity-60"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl leading-relaxed border-l-4 border-purple-400/60 pl-6">
              Join our scientifically designed meditation programs. Experience
              transformation through ancient wisdom combined with modern understanding.
              Perfect for leaders, professionals, and seekers on the path of self-discovery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/events" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-purple-900 hover:bg-purple-800 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-full"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-purple-400 text-purple-700 hover:bg-purple-100 transition-all duration-300 text-lg px-8 py-6 rounded-full hover:scale-105 bg-white/60 backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pt-6">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://i.ytimg.com/vi/${['MSUXw7Dxle8', 's4vH34O7rOs', '9QSKyMf98uY'][i - 1]}/default.jpg`}
                    alt="Student"
                    className="w-14 h-14 rounded-full border-3 border-white/80 object-cover hover:scale-110 hover:z-10 transition-all duration-300 shadow-lg cursor-pointer"
                  />
                ))}
                <div className="w-14 h-14 rounded-full border-3 border-white/80 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  +50K
                </div>
              </div>
              <div className="text-sm text-gray-700 text-center sm:text-left">
                <span className="font-bold text-2xl text-purple-600">
                  50,000+
                </span>{' '}
                lives transformed
              </div>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-purple-200/50">
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  40+
                </div>
                <div className="text-sm md:text-base text-gray-600 mt-2 font-medium">Programs</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  100K+
                </div>
                <div className="text-sm md:text-base text-gray-600 mt-2 font-medium">Students</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  15+
                </div>
                <div className="text-sm md:text-base text-gray-600 mt-2 font-medium">Years</div>
              </div>
            </div>
          </div>

          {/* Right Side - Enrollment Card */}
          <div className="relative order-first lg:order-last">
            <div className="aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-xl rounded-3xl p-1.5 bg-gradient-to-br from-purple-200/50 to-blue-200/50 backdrop-blur-xl shadow-2xl border border-white/60 hover:scale-105 transition-transform duration-700" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
              <div className="w-full h-full rounded-3xl overflow-hidden relative bg-gradient-to-br from-purple-100 to-blue-100">
                <img
                  src="https://images.unsplash.com/photo-1523419409543-3e4f83b9b9f4?w=1200&q=80"
                  alt="Meditation by the ocean"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-purple-300/60 mix-blend-multiply" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-gray-800">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-xs font-bold mb-4 shadow-lg text-white">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    NOW ENROLLING
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">
                    Vibe - Meditation for Confidence
                  </h3>
                  <p className="text-white mb-4 text-lg max-w-md drop-shadow">
                    40-Day Online Program for Youth & Students
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-6">
                    <span className="bg-white/90 px-3 py-1.5 rounded-full border border-purple-200 backdrop-blur-sm">
                      📅 Feb 15 - Mar 28, 2025
                    </span>
                    <span className="bg-white/90 px-3 py-1.5 rounded-full border border-purple-200 backdrop-blur-sm">
                      ⏰ 7-8 AM IST
                    </span>
                  </div>
                  <Link href="/events" className="block">
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white w-full shadow-xl hover:scale-105 transition-all duration-300 text-lg py-6 rounded-full"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Register Now - FREE
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex items-start justify-center p-2 bg-white/40 backdrop-blur-sm">
          <div className="w-1 h-3 bg-purple-500/70 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
```

---

## Navigation Components

### Glassmorphism Navigation Bar

```tsx
// components/layout/EnhancedHeader.tsx

'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function EnhancedHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Project Excellence', href: '/project-excellence' },
    { name: 'Events & Programs', href: '/events' },
    { name: 'Register', href: '/register' },
    { name: 'Resources', href: '/resources' },
    { name: 'Donate', href: '/donate' },
    { name: 'Community', href: '/community' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-200/40 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
      <nav className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
            <img
              src="https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_357,h_94,al_c,lg_1,q_85,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png"
              alt="Meditation Institute"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} passHref legacyBehavior={false}>
                      <NavigationMenuLink className={`
                        relative
                        px-5 py-2.5
                        rounded-full
                        text-sm font-medium
                        transition-all duration-300
                        group
                        ${isActive
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-gray-700 hover:text-purple-700 hover:bg-purple-100/50'
                        }
                      `}>
                        {item.name}
                        <span className={`
                          absolute bottom-1 left-1/2
                          -translate-x-1/2
                          w-0 h-0.5
                          bg-purple-600
                          group-hover:w-1/2
                          transition-all duration-300
                          ${isActive ? 'w-1/2' : ''}
                        `} />
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="rounded-full border-purple-300 hover:bg-purple-100 transition-all duration-300"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hover:bg-purple-100 rounded-full transition-colors duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="rounded-full bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-300">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-100 transition-colors duration-300">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[400px] bg-white/95 backdrop-blur-xl border-l border-purple-200/50"
            >
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        text-lg font-medium transition-all duration-300 py-2 px-4 rounded-full
                        ${isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-6 border-t">
                  {session ? (
                    <>
                      <Link href="/admin" className="block mb-4">
                        <Button variant="outline" className="w-full rounded-full">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full rounded-full hover:bg-purple-50"
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-full bg-purple-600 hover:bg-purple-700">
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
```

---

## Card Components

### Enhanced Event Card

```tsx
// components/events/EnhancedEventCard.tsx

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description: string;
    type: string;
    startDate: string;
    endDate: string;
    timings: string;
    maxParticipants?: number;
    currentRegistrations: number;
    status: string;
  };
  onRegister: (event: any) => void;
  index: number;
}

export function EnhancedEventCard({ event, onRegister, index }: EventCardProps) {
  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      beginner_online: 'Beginner Online',
      beginner_physical: 'Beginner Physical',
      advanced_online: 'Advanced Online',
      advanced_physical: 'Advanced Physical',
      conference: 'Conference',
    };
    return labels[type] || type;
  };

  const getEventTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      beginner_online: '🌱',
      beginner_physical: '🏛️',
      advanced_online: '🚀',
      advanced_physical: '⭐',
      conference: '🎯',
    };
    return icons[type] || '🧘';
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const availableSlots = event.maxParticipants
    ? event.maxParticipants - event.currentRegistrations
    : null;
  const isFullyBooked = availableSlots === 0;

  return (
    <Card
      className="
        group
        overflow-hidden
        transition-all duration-500
        flex flex-col
        border-2 border-purple-100/50
        hover:border-purple-300
        hover:shadow-2xl
        hover:scale-105
        bg-white/60 backdrop-blur-sm
        rounded-2xl
      "
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
    >
      {/* Image/Icon Section */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
          {getEventTypeIcon(event.type)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <Badge className="absolute top-4 right-4 bg-purple-600 text-white border-0 shadow-lg px-4 py-1.5">
          {getEventTypeLabel(event.type)}
        </Badge>

        {event.status === 'ongoing' && (
          <Badge className="absolute top-4 left-4 bg-green-500 text-white border-0 shadow-lg animate-pulse px-4 py-1.5">
            Ongoing
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardHeader className="flex-1 pb-4 px-6 pt-6">
        <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center text-gray-700">
            <Calendar className="mr-2.5 h-4 w-4 text-purple-600" />
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </div>
          <div className="text-gray-700 pl-6.5">{event.timings}</div>
          <div className="flex items-center pt-1">
            <Users className="mr-2.5 h-4 w-4 text-blue-600" />
            {event.maxParticipants ? (
              <span
                className={`
                  font-semibold
                  ${isFullyBooked
                    ? 'text-red-600'
                    : availableSlots !== null && availableSlots < 20
                    ? 'text-orange-600'
                    : 'text-green-600'
                  }
                `}
              >
                {event.currentRegistrations} / {event.maxParticipants} registered
                {availableSlots !== null && (
                  <span className="ml-1 text-gray-600 font-normal">
                    ({availableSlots} slots left)
                  </span>
                )}
              </span>
            ) : (
              <span className="text-green-600 font-semibold">{event.currentRegistrations} registered</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4 px-6">
        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
          {event.description}
        </p>
      </CardContent>

      <CardFooter className="pt-4 border-t border-purple-100/50 px-6 pb-6">
        {event.status === 'completed' ? (
          <Button variant="outline" className="w-full rounded-full" disabled>
            ✨ Completed
          </Button>
        ) : event.status === 'cancelled' ? (
          <Button variant="outline" className="w-full rounded-full" disabled>
            Cancelled
          </Button>
        ) : isFullyBooked ? (
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 rounded-full"
            disabled
          >
            🔥 Fully Booked
          </Button>
        ) : (
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl rounded-full hover:scale-105 transition-all duration-300"
            onClick={() => onRegister(event)}
          >
            ✨ Register Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
```

---

## Button Components

### Enhanced Button with Variants

```tsx
// components/ui/enhanced-button.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-md hover:shadow-lg hover:scale-105",
        outline:
          "border-2 bg-white/60 backdrop-blur-sm shadow-sm hover:bg-purple-100 hover:border-purple-300 hover:scale-105",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost:
          "hover:bg-purple-100 hover:text-purple-700 hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl hover:scale-105",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

---

## Animation Utilities

### Custom Animation Classes

```css
/* Add to app/globals.css */

/* Fade In Up */
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

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

/* Float Animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Float Delayed */
@keyframes floatDelayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animate-float-delayed {
  animation: floatDelayed 5s ease-in-out infinite;
  animation-delay: 1s;
}

/* Pulse Soft */
@keyframes pulseSoft {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.animate-pulse-soft {
  animation: pulseSoft 4s ease-in-out infinite;
}

/* Slide In Left */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideInLeft {
  animation: slideInLeft 0.5s ease-out;
}

/* Slide In Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}

/* Scale In */
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

.animate-scaleIn {
  animation: scaleIn 0.4s ease-out;
}

/* Shimmer Effect */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  animation: shimmer 3s infinite;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  background-size: 1000px 100%;
}
```

### Scroll Reveal Hook

```tsx
// hooks/useScrollReveal.ts

'use client';

import { useEffect, useState, RefObject } from 'react';

export function useScrollReveal(
  ref: RefObject<HTMLElement>,
  threshold = 0.1
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return isVisible;
}

// Usage:
// const sectionRef = useRef<HTMLElement>(null);
// const isVisible = useScrollReveal(sectionRef);
//
// <section
//   ref={sectionRef}
//   className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
// >
//   {/* Content */}
// </section>
```

---

## Color Utilities

### Gradient Presets

```tsx
// lib/gradients.ts

export const gradients = {
  // Purple to Pink
  purplePink: 'bg-gradient-to-r from-purple-600 to-pink-600',
  purplePinkHover: 'hover:from-purple-700 hover:to-pink-700',
  purplePinkText: 'bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent',

  // Blue to Purple
  bluePurple: 'bg-gradient-to-r from-blue-600 to-purple-600',
  bluePurpleHover: 'hover:from-blue-700 hover:to-purple-700',

  // Soft Backgrounds
  softPurple: 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50',
  softBlue: 'bg-gradient-to-br from-blue-50 to-cyan-50',
  softPink: 'bg-gradient-to-br from-pink-50 to-rose-50',

  // Glassmorphism
  glass: 'bg-white/60 backdrop-blur-xl border border-purple-200/50',
  glassDark: 'bg-black/40 backdrop-blur-xl border border-white/10',
};

// Usage:
// <div className={gradients.softPurple}>
//   <h1 className={gradients.purplePinkText}>Gradient Text</h1>
//   <button className={`${gradients.purplePink} ${gradients.purplePinkHover}`}>
//     Button
//   </button>
// </div>
```

### Color Theme Extensions

```tsx
// tailwind.config.ts (or app/globals.css)

export const customColors = {
  // Primary Purples
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Accent Blues
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Accent Pinks
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
};
```

---

## Typography Components

### Heading Components

```tsx
// components/ui/heading.tsx

import { cn } from "@/lib/utils";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Heading({ level, children, className, gradient = false }: HeadingProps) {
  const baseClasses = "font-bold tracking-tight";
  const gradientClasses = gradient
    ? "bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent"
    : "text-gray-800";

  const sizeClasses = {
    1: "text-5xl md:text-6xl lg:text-7xl leading-tight",
    2: "text-4xl md:text-5xl lg:text-6xl leading-tight",
    3: "text-3xl md:text-4xl leading-tight",
    4: "text-2xl md:text-3xl leading-snug",
    5: "text-xl md:text-2xl leading-snug",
    6: "text-lg md:text-xl leading-snug",
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={cn(baseClasses, sizeClasses[level], gradientClasses, className)}>
      {children}
    </Tag>
  );
}

// Usage:
// <Heading level={1} gradient>
//   Discover Inner Peace
// </Heading>
// <Heading level={2} className="mb-6">
//   Transform Your Life
// </Heading>
```

### Text Components

```tsx
// components/ui/text.tsx

import { cn } from "@/lib/utils";

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export function Text({ children, size = 'base', weight = 'normal', className }: TextProps) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <p className={cn(sizeClasses[size], weightClasses[weight], 'leading-relaxed text-gray-700', className)}>
      {children}
    </p>
  );
}

// Usage:
// <Text size="lg" weight="medium">
//   This is a medium-weight large text
// </Text>
```

---

## Layout Components

### Container Component

```tsx
// components/layout/container.tsx

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-8xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  );
}

// Usage:
// <Container size="lg">
//   <section>Content</section>
// </Container>
```

### Section Component

```tsx
// components/layout/section.tsx

import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'gray' | 'purple' | 'gradient';
}

export function Section({ children, className, spacing = 'lg', background = 'white' }: SectionProps) {
  const spacingClasses = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-20',
    lg: 'py-20 md:py-28 lg:py-32',
    xl: 'py-24 md:py-32 lg:py-40',
  };

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    purple: 'bg-purple-50',
    gradient: 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50',
  };

  return (
    <section className={cn(spacingClasses[spacing], backgroundClasses[background], className)}>
      {children}
    </section>
  );
}

// Usage:
// <Section spacing="xl" background="gradient">
//   <Container>
//     <h2>Section Title</h2>
//     <p>Section content</p>
//   </Container>
// </Section>
```

### Grid Component

```tsx
// components/layout/grid.tsx

import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export function Grid({ children, className, cols = 3, gap = 'md' }: GridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-4 md:gap-6',
    md: 'gap-6 md:gap-8',
    lg: 'gap-8 md:gap-10',
  };

  return (
    <div className={cn('grid', colsClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// Usage:
// <Grid cols={3} gap="md">
//   {items.map(item => (
//     <Card key={item.id}>{item.content}</Card>
//   ))}
// </Grid>
```

---

## Responsive Spacer Component

```tsx
// components/layout/spacer.tsx

import { cn } from "@/lib/utils";

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

export function Spacer({ size = 'md', className }: SpacerProps) {
  const sizeClasses = {
    xs: 'h-4',
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20',
    '2xl': 'h-24',
    '3xl': 'h-32',
  };

  return <div className={cn(sizeClasses[size], className)} />;
}

// Usage:
// <Spacer size="lg" />
```

---

## Loading States

### Skeleton Loader

```tsx
// components/ui/skeleton.tsx

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-purple-100", className)}
      {...props}
    />
  );
}

// Usage:
// <div className="space-y-4">
//   <Skeleton className="h-12 w-3/4" />
//   <Skeleton className="h-4 w-full" />
//   <Skeleton className="h-4 w-5/6" />
// </div>
```

### Spinner Loader

```tsx
// components/ui/spinner.tsx

import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <Loader2 className={cn('animate-spin text-purple-600', sizeClasses[size], className)} />
  );
}

// Usage:
// <Spinner size="lg" />
```

---

## Usage Examples

### Complete Page Example

```tsx
// app/example/page.tsx

import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Grid } from '@/components/layout/grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ExamplePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="xl" background="gradient">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <Heading level={1} gradient className="mb-6">
              Transform Your Life
            </Heading>
            <Text size="lg" className="mb-8">
              Discover inner peace through our scientifically designed meditation programs
            </Text>
            <Button size="xl">
              Get Started Free
            </Button>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section spacing="lg" background="white">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Why Choose Us
            </Heading>
            <Text size="lg" className="max-w-2xl mx-auto">
              Our programs combine ancient wisdom with modern science
            </Text>
          </div>

          <Grid cols={3} gap="md">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <Heading level={3}>Feature {item}</Heading>
                </CardHeader>
                <CardContent>
                  <Text>Description of the feature and its benefits.</Text>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
```

---

## Best Practices

### When to Use These Components

1. **Hero Components**: Use on main pages and landing pages
2. **Navigation**: Use the enhanced header across all pages
3. **Cards**: Use for events, testimonials, resources, team members
4. **Buttons**: Use consistent button styles throughout
5. **Animations**: Add subtle animations to enhance UX without overwhelming

### Performance Considerations

- Use CSS animations instead of JavaScript when possible
- Lazy load images and videos
- Use `will-change` sparingly for animations
- Test animations on lower-end devices
- Consider `prefers-reduced-motion` for accessibility

### Accessibility

- Ensure color contrast ratios meet WCAG AA standards
- Add `aria-label` to interactive elements
- Support keyboard navigation
- Test with screen readers
- Provide focus indicators

---

**Last Updated:** February 4, 2025
**Related:** UI_UX_DESIGN_GUIDE.md
