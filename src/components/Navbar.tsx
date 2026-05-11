'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Users, FileText, AlertTriangle, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { clearDemoSession } from '@/lib/auth-demo';
import { useRouter, usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    clearDemoSession();
    router.push('/login');
  };

  const navLinks = [
    { href: '/admin', icon: <Home className="w-4 h-4" />, label: 'Dashboard' },
    { href: '/admin/residents', icon: <Users className="w-4 h-4" />, label: 'Residents' },
    { href: '/admin/services', icon: <FileText className="w-4 h-4" />, label: 'Services' },
    { href: '/admin/incidents', icon: <AlertTriangle className="w-4 h-4" />, label: 'Incidents' },
    { href: '/admin/announcements', icon: <Home className="w-4 h-4" />, label: 'Announcements' },
  ];

  return (
    <nav className="bg-slate-900 sticky top-0 z-50 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-44 transition-all duration-300">
                  <Image 
                    src="/images/Konektado_logo.png" 
                    alt="Konektado" 
                    fill 
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
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
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl md:hidden transition-colors duration-200 ease-out"
            >
              <Menu className={`w-6 h-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`} />
            </button>
            
            <div className="hidden md:block w-px h-6 bg-white/10 mx-4" />
            
            <div className="flex items-center gap-3 relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`flex items-center gap-2 p-1 rounded-full border transition-all duration-200 ease-out active:scale-95 ${
                  isUserDropdownOpen 
                    ? 'bg-white/15 border-white/40 ring-4 ring-white/5' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-inner">
                  <Users className="w-5 h-5" />
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="p-4 border-b border-white/5">
                    <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Administrator</p>
                    <p className="text-sm font-bold text-white truncate">Barangay Admin</p>
                  </div>

                  <div className="p-2 bg-white/5">
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden animate-in fade-in duration-200">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setIsMenuOpen(false)} 
          />
          
          {/* Menu Content */}
          <div className="absolute top-20 left-4 right-4 bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300 ease-out fill-mode-forwards">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Menu Navigation</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors duration-200 ease-out"
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
                  className={`flex items-center gap-4 p-5 rounded-2xl text-lg font-bold transition-all duration-150 ease-out active:scale-[0.97] ${
                    pathname === link.href 
                      ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/20' 
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${pathname === link.href ? 'bg-white/10' : 'bg-white/5 shadow-sm'}`}>
                    {link.icon}
                  </div>
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-white/10 my-6" />
              
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl text-lg font-black text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-transform duration-150 ease-out active:scale-[0.97]"
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
    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all duration-200 ease-out active:scale-[0.97] cursor-pointer ${
      active 
        ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20' 
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);
