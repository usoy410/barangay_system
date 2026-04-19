'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Users, FileText, AlertTriangle, Menu } from 'lucide-react';
import { clearDemoSession } from '@/lib/auth-demo';
import { useRouter, usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    clearDemoSession();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-cyan-700 transition-colors">
                B
              </div>
              <span className="font-lexend font-bold text-slate-900 tracking-tight">BIS Admin</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/admin" icon={<Home className="w-4 h-4" />} label="Dashboard" active={pathname === '/admin'} />
              <NavLink href="/admin/residents" icon={<Users className="w-4 h-4" />} label="Residents" active={pathname === '/admin/residents'} />
              <NavLink href="/admin/services" icon={<FileText className="w-4 h-4" />} label="Services" active={pathname === '/admin/services'} />
              <NavLink href="/admin/incidents" icon={<AlertTriangle className="w-4 h-4" />} label="Incidents" active={pathname === '/admin/incidents'} />
            </div>
          </div>

          <div className="flex items-center">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:block w-px h-6 bg-slate-200 mx-4" />
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSignOut}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Sign Out
              </button>
              <div className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) => (
  <Link 
    href={href}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active 
        ? 'text-cyan-700 bg-cyan-50' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);
