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
                          : 'bg-white/10 text-black-500 border-2 border-black/20 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/25 hover:border-blue-500/50'
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
                <Link href="/profile" className="flex items-center space-x-2 group">
                  <Avatar className="h-10 w-10 border-2 border-black/20 group-hover:border-blue-500 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-semibold text-sm">
                      {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-black group-hover:text-blue-500 transition-colors duration-300">
                    {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-full hover:bg-black/10 muted text-black hover:text-foreground hover:scale-105 transition-all duration-300"
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
                    className="rounded-full hover:bg-white/10 text-slate-900 hover:text-white hover:scale-105  hover:bg-blue-500 transition-all duration-300"
                  >
                    Sign Up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-2 text-black border-white/20  hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
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
                className="rounded-full hover:bg-white/10 text-slate-300 hover:text-white hover:scale-110 transition-all duration-300"
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
                        hover:pl-4
                        py-3 px-4 rounded-xl border
                        ${isActive
                          ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30'
                          : 'text-muted-foreground hover:text-primary hover:bg-muted border-transparent hover:border-border'
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
                        className="w-full rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300"
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                      <Link href="/profile" className="block mb-4">
                        <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/20 transition-all duration-300">
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
                          className="w-full rounded-full border-2 border-white/20 text-white hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 hover:text-white transition-all duration-300"
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
