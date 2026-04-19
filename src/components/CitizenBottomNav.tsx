'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, AlertTriangle, User } from 'lucide-react';
import { getClientSession } from '@/lib/auth-demo';

export default function CitizenBottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    setIsLoggedIn(!!session);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:hidden pb-safe">
      <div className="flex justify-around items-center h-20 px-2 max-w-md mx-auto">
        <NavItem 
          href="/" 
          icon={<Home className="w-6 h-6" />} 
          label="Home" 
          active={pathname === '/'} 
        />
        <NavItem 
          href="/services" 
          icon={<FileText className="w-6 h-6" />} 
          label="Services" 
          active={pathname === '/services'} 
        />
        <NavItem 
          href="/incidents" 
          icon={<AlertTriangle className="w-6 h-6" />} 
          label="Report" 
          active={pathname === '/incidents'} 
        />
        <NavItem 
          href={isLoggedIn ? '/account' : '/login'} 
          icon={<User className="w-6 h-6" />} 
          label="Account" 
          active={pathname === '/account' || pathname === '/login'} 
        />
      </div>
    </nav>
  );
}

const NavItem = ({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) => (
  <Link 
    href={href}
    className={`flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] cursor-pointer transition-colors ${
      active ? 'text-sky-700' : 'text-slate-500 hover:text-slate-900'
    }`}
  >
    <div className={`p-1 rounded-full mb-1 transition-all ${active ? 'bg-sky-50' : ''}`}>
      {icon}
    </div>
    <span className={`text-xs font-bold leading-none ${active ? 'text-sky-700' : 'text-slate-500'}`}>
      {label}
    </span>
  </Link>
);
