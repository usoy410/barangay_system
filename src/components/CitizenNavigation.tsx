'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Home, FileText, AlertTriangle, User } from 'lucide-react';
import { getClientSession } from '@/lib/auth-demo';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CitizenNavigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Theme color mapping for desktop header - unified to match BotHeader
  const activeThemeClass = 'bg-slate-900';

  useEffect(() => {
    const session = getClientSession();
    setIsLoggedIn(!!session);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { href: '/services', label: 'Services', icon: <FileText className="w-5 h-5" /> },
    { href: '/incidents', label: 'Report', icon: <AlertTriangle className="w-5 h-5" /> },
    {
      href: isLoggedIn ? '/account' : '/login',
      label: isLoggedIn ? 'Account' : 'Log In',
      icon: <User className="w-5 h-5" />
    },
  ];

  return (
    <>
      {/* Desktop Header (Hidden on Mobile) */}
      <header className={`hidden md:flex fixed top-0 left-0 right-0 h-20 z-50 items-center px-12 justify-between transition-all duration-200 ease-out ${isScrolled
        ? `${activeThemeClass} shadow-lg border-b border-white/10`
        : 'bg-transparent'
        }`}>
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative h-10 w-44 transition-all duration-300">
            <Image
              src="/images/Konektado_logo.png"
              alt="Konektado"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all duration-200 ease-out active:scale-[0.97] cursor-pointer ${pathname === link.href
                ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20'
                : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile Bottom Nav (Hidden on Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-50 md:hidden shadow-[0_-8px_20px_-6px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-stretch h-20 px-2 max-w-md mx-auto relative">
          {navLinks.map((link) => (
            <MobileNavItem
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              active={pathname === link.href || (link.href === '/account' && pathname === '/account')}
            />
          ))}
        </div>
        {/* Safe Area Inset Spacer */}
        <div className="h-[env(safe-area-inset-bottom)] bg-white/90" />
      </nav>
    </>
  );
}

const MobileNavItem = ({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) => (
  <Link
    href={href}
    className={`flex flex-col items-center justify-center w-full min-w-[44px] cursor-pointer transition-all duration-200 ease-out active:scale-[0.97] relative ${active ? 'text-sky-700' : 'text-slate-400 hover:text-slate-600'
      }`}
  >
    {active && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-sky-600 rounded-b-full shadow-[0_1px_4px_rgba(3,105,161,0.4)]" />
    )}
    <div className={`p-2 rounded-xl mb-0.5 transition-all duration-200 ease-out ${active ? 'bg-sky-50 scale-110' : 'group-hover:scale-105'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: cn('w-6 h-6 transition-all', active ? 'stroke-[2.5px]' : 'stroke-[2px]')
      })}
    </div>
    <span className={`text-[10px] uppercase font-bold tracking-wider transition-all ${active ? 'text-sky-700' : 'text-slate-400'}`}>
      {label}
    </span>
  </Link>
);
