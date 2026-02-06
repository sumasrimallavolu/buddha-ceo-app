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
    { name: 'Programs', href: '/events' },
    { name: 'Resources', href: '/resources' },
    { name: 'Donate', href: '/donate' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group mr-12">
            <img
              src="https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_357,h_94,al_c,lg_1,q_85,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png"
              alt="Meditation Institute"
              className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm brightness-0 invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-2">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} passHref legacyBehavior={false}>
                    <NavigationMenuLink className="
                      group inline-flex h-10 w-max items-center justify-center
                      rounded-full bg-white/5 backdrop-blur-md
                      px-5 py-2 text-sm font-medium text-slate-300
                      transition-all duration-300
                      hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500
                      hover:text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105
                      focus:bg-white/10 focus:text-white focus:outline-none
                      border border-white/10 hover:border-blue-400/50
                      disabled:pointer-events-none disabled:opacity-50
                    ">
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {session ? (
              <>
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-2 border-white/20 text-white hover:border-blue-400 hover:bg-blue-500/20 hover:scale-105 transition-all duration-300"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-full hover:bg-white/10 text-slate-300 hover:text-white hover:scale-105 transition-all duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-white/20 text-white hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10 text-slate-300 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-950 border-white/10">
              <SheetHeader>
                <SheetTitle className="text-white">Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="
                      text-lg font-medium transition-all duration-300 text-slate-300
                      hover:text-blue-400 hover:pl-4 hover:bg-white/5
                      py-3 px-4 rounded-xl border border-transparent
                      hover:border-white/10
                    "
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/10">
                  {session ? (
                    <>
                      <Link href="/admin" className="block mb-4">
                        <Button
                          variant="outline"
                          className="w-full rounded-full border-2 border-white/20 text-white hover:border-blue-400 hover:bg-blue-500/20 transition-all duration-300"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-300"
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-2 border-white/20 text-white hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 hover:text-white transition-all duration-300"
                      >
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
