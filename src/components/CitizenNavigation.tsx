'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, AlertTriangle, User, Landmark } from 'lucide-react';
import { getClientSession } from '@/lib/auth-demo';

export default function CitizenNavigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Theme color mapping for desktop header
  const themeColors: Record<string, string> = {
    '/': 'bg-slate-900',
    '/services': 'bg-sky-700',
    '/incidents': 'bg-red-700',
    '/account': 'bg-slate-900',
  };

  const activeThemeClass = themeColors[pathname] || 'bg-slate-900';

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
      <header className={`hidden md:flex fixed top-0 left-0 right-0 h-20 z-50 items-center px-12 justify-between transition-all duration-300 ${
        isScrolled 
          ? `${activeThemeClass}/95 backdrop-blur-md shadow-lg border-b border-white/10` 
          : 'bg-slate-900/10 backdrop-blur-md'
      }`}>
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-white/10 p-2 rounded-xl text-white group-hover:bg-white/20 transition-colors border border-white/10">
            <Landmark className="w-6 h-6" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">Barangay BIS</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                pathname === link.href 
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:hidden pb-safe shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-20 px-2 max-w-md mx-auto">
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
      </nav>
    </>
  );
}

const MobileNavItem = ({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) => (
  <Link 
    href={href}
    className={`flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] cursor-pointer transition-colors ${
      active ? 'text-sky-700' : 'text-slate-500 hover:text-slate-900'
    }`}
  >
    <div className={`p-2 rounded-2xl mb-1 transition-all ${active ? 'bg-sky-50' : ''}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
    </div>
    <span className={`text-[10px] uppercase font-black tracking-tight ${active ? 'text-sky-700' : 'text-slate-500'}`}>
      {label}
    </span>
  </Link>
);
