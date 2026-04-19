'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Users, FileText, AlertTriangle, Menu, X, LogOut } from 'lucide-react';
import { clearDemoSession } from '@/lib/auth-demo';
import { useRouter, usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = () => {
    clearDemoSession();
    router.push('/login');
  };

  const navLinks = [
    { href: '/admin', icon: <Home className="w-4 h-4" />, label: 'Dashboard' },
    { href: '/admin/residents', icon: <Users className="w-4 h-4" />, label: 'Residents' },
    { href: '/admin/services', icon: <FileText className="w-4 h-4" />, label: 'Services' },
    { href: '/admin/incidents', icon: <AlertTriangle className="w-4 h-4" />, label: 'Incidents' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-cyan-700 transition-colors shadow-sm">
                B
              </div>
              <span className="font-lexend font-bold text-slate-900 tracking-tight">BIS Admin</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.href} 
                  href={link.href} 
                  icon={link.icon} 
                  label={link.label} 
                  active={pathname === link.href} 
                />
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl md:hidden transition-colors"
            >
              <Menu className={`w-6 h-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`} />
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setIsMenuOpen(false)} 
          />
          
          {/* Menu Content */}
          <div className="absolute top-20 left-4 right-4 bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Menu Navigation</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-5 rounded-2xl text-lg font-bold transition-all ${
                    pathname === link.href 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200 scale-[1.02]' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${pathname === link.href ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                    {link.icon}
                  </div>
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-slate-100 my-6" />
              
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl text-lg font-black text-red-500 bg-red-50 hover:bg-red-100 transition-all active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                Sign Out of Admin
              </button>
            </div>
          </div>
        </div>
      )}
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
