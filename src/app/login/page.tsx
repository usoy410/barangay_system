'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { setDemoSession, UserRole } from '@/lib/auth-demo';

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password is required to proceed.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulating login logic
    setTimeout(() => {
      setIsLoading(false);
      
      let assignedRole: UserRole = 'resident';
      let redirectPath = '/';

      // 1. Admin/Developer Check (Dedicated Mobile Number)
      if (mobile === '09105651553' && password === 'dev123') {
        assignedRole = 'developer';
        redirectPath = '/admin';
      } 
      // 2. Official Check (Example range or specific check)
      else if (mobile.startsWith('0900')) {
        assignedRole = 'official';
        redirectPath = '/admin';
      }
      // 3. Resident
      else {
        assignedRole = 'resident';
        redirectPath = '/';
      }

      setDemoSession({
        role: assignedRole,
        mobile: mobile,
        name: mobile.slice(-4) // Use last 4 digits as a nickname
      });

      router.push(redirectPath);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-atkinson px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-900 p-10 text-white text-center">
          <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-900/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">BIS Portal</h1>
          <p className="text-slate-400 mt-2 font-medium">Digital Barangay Governance</p>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-lg">Mobile Number</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required 
                  type="text" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border-2 border-slate-200 bg-slate-50 pl-12 pr-4 py-4 rounded-xl text-lg text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                  placeholder="Enter your 11-digit mobile" 
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2 text-lg">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-slate-200 bg-slate-50 pl-12 pr-12 py-4 rounded-xl text-lg text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl text-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link href="/register" className="text-cyan-700 font-bold hover:underline">
                Join Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
