'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BookOpen,
  MessageSquare,
  Mail,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['admin', 'content_manager', 'content_reviewer'] },
  { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
  { name: 'Content', href: '/admin/content', icon: FileText, roles: ['admin', 'content_manager', 'content_reviewer'] },
  { name: 'Events', href: '/admin/events', icon: Calendar, roles: ['admin', 'content_manager', 'content_reviewer'] },
  { name: 'Resources', href: '/admin/resources', icon: BookOpen, roles: ['admin', 'content_manager', 'content_reviewer'] },
  { name: 'Messages', href: '/admin/contact-messages', icon: MessageSquare, roles: ['admin', 'content_manager', 'content_reviewer'] },
  { name: 'Subscribers', href: '/admin/subscribers', icon: Mail, roles: ['admin', 'content_manager', 'content_reviewer'] },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(session.user.role)
  );

  const NavLinks = () => (
    <>
      <div className="px-3 py-4">
        <div className="flex items-center space-x-2 px-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
            <span className="text-sm font-bold text-white">MI</span>
          </div>
          <span className="font-bold">Admin Panel</span>
        </div>

        <div className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t p-3">
        <div className="flex items-center space-x-3 px-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <span className="text-sm font-semibold text-amber-700">
              {session.user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session.user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{session.user.role.replace('_', ' ')}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white px-6 pb-4 shadow-sm">
          <NavLinks />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 z-50 w-full bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
              <span className="text-sm font-bold text-white">MI</span>
            </div>
            <span className="font-bold">Admin</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <NavLinks />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {/* Mobile Spacer */}
          <div className="lg:hidden h-14" />
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
