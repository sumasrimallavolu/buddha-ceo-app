'use client';

import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import Image from 'next/image';
import {
    LayoutDashboard,
    FileText,
    Calendar,
    BookOpen,
    MessageSquare,
    LogOut,
    Menu,
    X,
    User2,
    Users
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import {signOut} from 'next-auth/react';
import {useState} from 'react';


const navigation = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        roles: ['admin', 'content_manager', "content_reviewer"]
    },
    {
        name: "Users",
        href: "/admin/users",
        icon: Users,
        roles: ["admin"]
    },
    {
        name: 'Content',
        href: '/admin/content',
        icon: FileText,
        roles: ['admin', 'content_manager', 'content_reviewer']
    },
    {
        name: 'Events',
        href: '/admin/events',
        icon: Calendar,
        roles: ['admin', 'content_manager', "content_reviewer"]
    },
    {
        name: 'Volunteer Opps',
        href: '/admin/volunteer-opportunities',
        icon: Users,
        roles: ['admin', 'content_manager']
    }, {
        name: 'Event Feedback',
        href: '/admin/event-feedback',
        icon: MessageSquare,
        roles: ['admin', 'content_manager', 'content_reviewer']
    }, {
        name: 'Resources',
        href: '/admin/resources',
        icon: BookOpen,
        roles: ['admin', 'content_manager', "content_reviewer"]
    }, {
        name: "people",
        href: "/admin/people",
        icon: User2,
        roles: ["admin"]
    }
];

export default function AdminLayout({children} : {
    children : React.ReactNode;
}) {
    const {data: session, status} = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"/>
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const filteredNavigation = navigation.filter((item) => item.roles.includes(session.user.role));

    const NavLink = ({item} : {
        item: typeof navigation[0]
    }) => {
        const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);

        const Icon = item.icon;

        return (
            <Link href={
                    item.href
                }
                onClick={
                    () => setMobileMenuOpen(false)
                }
                className={
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`
            }>
                <Icon className="h-5 w-5 flex-shrink-0"/>
                <span>{
                    item.name
                }</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col border-r border-white/10 bg-slate-950/50 backdrop-blur-xl">
                    {/* Logo */}
                    <div className="flex h-20 items-center justify-center bg-white p-3 rounded-lg px-6 border-b border-white/10">
                        <Link href="/" className="flex items-center group ">
                            <img src="https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_357,h_94,al_c,lg_1,q_85,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png" alt="Meditation Institute" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"/>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-1 flex-col gap-2 px-4 py-6 overflow-y-auto">
                        <div className="space-y-1">
                            {
                            filteredNavigation.map((item) => (
                                <NavLink key={
                                        item.name
                                    }
                                    item={item}/>
                            ))
                        } </div>
                    </div>

                    {/* User Profile & Logout */}
                    <div className="border-t border-white/10 p-4">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30">
                                <span className="text-sm font-semibold text-blue-400">
                                    {
                                    session.user.name ?. charAt(0).toUpperCase()
                                } </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {
                                    session.user.name
                                }</p>
                                <p className="text-xs text-slate-500 capitalize">
                                    {
                                    session.user.role.replace('_', ' ')
                                } </p>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 gap-3"
                            onClick={
                                () => signOut({callbackUrl: '/'})
                        }>
                            <LogOut className="h-4 w-4"/>
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500">
                            <span className="text-sm font-bold text-white">MI</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-sm">Admin</h1>
                            <p className="text-[10px] text-slate-500">Management Portal</p>
                        </div>
                    </div>

                    <Sheet open={mobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                {
                                mobileMenuOpen ? (
                                    <X className="h-6 w-6"/>
                                ) : (
                                    <Menu className="h-6 w-6"/>
                                )
                            } </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 bg-slate-950 border-white/10 p-0">
                            <div className="flex flex-col h-full">
                                {/* Mobile Logo */}
                                <div className="flex items-center gap-3 p-6 border-b border-white/10">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500">
                                        <span className="text-lg font-bold text-white">MI</span>
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-white">Admin Panel</h1>
                                        <p className="text-xs text-slate-500">Management Portal</p>
                                    </div>
                                </div>

                                {/* Mobile Navigation */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-1">
                                        {
                                        filteredNavigation.map((item) => (
                                            <NavLink key={
                                                    item.name
                                                }
                                                item={item}/>
                                        ))
                                    } </div>
                                </div>

                                {/* Mobile User Profile */}
                                <div className="border-t border-white/10 p-4">
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                                            <span className="text-sm font-semibold text-blue-400">
                                                {
                                                session.user.name ?. charAt(0).toUpperCase()
                                            } </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {
                                                session.user.name
                                            }</p>
                                            <p className="text-xs text-slate-500 capitalize">
                                                {
                                                session.user.role.replace('_', ' ')
                                            } </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 gap-3"
                                        onClick={
                                            () => signOut({callbackUrl: '/'})
                                    }>
                                        <LogOut className="h-4 w-4"/>
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-72">
                <main className="min-h-screen">
                    {/* Mobile Spacer */}
                    <div className="lg:hidden h-14"/>
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
                        {children} </div>
                </main>
            </div>
        </div>
    );
}
