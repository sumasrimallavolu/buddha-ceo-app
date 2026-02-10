'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Programs', href: '/events' },
    { name: 'Resources', href: '/resources' },
    { name: 'Donate', href: '/donate' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/20 bg-white backdrop-blur-xl shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group mr-12">
            <img
              src="https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_357,h_94,al_c,lg_1,q_85,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png"
              alt="Meditation Institute"
              className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
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
                        group inline-flex h-10 w-max items-center justify-center
                        rounded-full backdrop-blur-md
                        px-5 py-2 text-sm font-medium
                        transition-all duration-300
                        hover:scale-105
                        focus:outline-none
                        disabled:pointer-events-none disabled:opacity-50
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25 border border-blue-500/50'
                          : 'bg-white/10 text-black border-2 border-black/20 hover:bg-slate-200 hover:border-slate-300 hover:text-slate-900'
                        }
                      `}>
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {session ? (
              <>
                <Link href="/profile" className="flex items-center space-x-2 group hover:scale-105 transition-all duration-300">
                  <Avatar className="h-10 w-10 border-2 border-black/20 group-hover:border-slate-300 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-semibold text-sm">
                      {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-black group-hover:text-slate-700 transition-colors duration-300">
                    {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-full border-2 border-transparent hover:bg-slate-200 hover:text-slate-700 hover:scale-105 transition-all duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full border-2 border-black/20 text-slate-900 hover:bg-slate-200 hover:border-slate-300 hover:text-slate-900 hover:scale-105 transition-all duration-300"
                  >
                    Sign Up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-2 border-black/20 text-black hover:bg-slate-200 hover:border-slate-300 hover:text-slate-900 hover:scale-105 transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border-2 border-black/20 hover:bg-slate-200 hover:text-slate-700 hover:scale-110 transition-all duration-300"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-border">
              <SheetHeader>
                <SheetTitle className="text-foreground">Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        text-lg font-medium transition-all duration-300
                        hover:pl-4 hover:scale-105
                        py-3 px-4 rounded-xl border-2
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25 border-blue-500/50'
                          : 'text-muted-foreground border-transparent hover:border-slate-300 hover:bg-slate-200 hover:text-slate-700'
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-4 border-t border-border">
                  {session ? (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full rounded-xl border-2 border-transparent hover:bg-slate-200 hover:text-slate-700 transition-all duration-300"
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                      <Link href="/profile" className="block mb-4">
                        <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-slate-300 hover:bg-slate-200 hover:scale-105 transition-all duration-300">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-semibold">
                              {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground">View Profile</p>
                          </div>
                        </div>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="w-full rounded-full border-2 border-black/20 text-black hover:bg-slate-200 hover:border-slate-300 hover:text-slate-900 hover:scale-105 transition-all duration-300"
                        >
                          Login
                        </Button>
                      </Link>
                    </>
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
