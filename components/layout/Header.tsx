'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, User, LogOut } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Project Excellence', href: '/project-excellence' },
    { name: 'Events & Programs', href: '/events' },
    { name: 'Register', href: '/register' },
    { name: 'Teach', href: '/teach' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center">
              {/* Diamond shape */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rotate-45 transform"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-teal-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="font-extrabold text-xl bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 800 }}>
                Buddha-CEO
              </span>
              <span className="text-xs text-gray-600 font-light tracking-widest" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>
                QUANTUM FOUNDATION
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-50 hover:text-purple-700 focus:bg-purple-50 focus:text-purple-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-purple-600"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {session ? (
                    <>
                      <Link href="/admin" className="block mb-4">
                        <Button variant="outline" className="w-full">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
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
