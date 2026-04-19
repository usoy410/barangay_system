'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Home, ArrowLeft, Phone, Lock, MapPin, Calendar, Heart, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: '',
    birthDate: '',
    password: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating registration logic
    setTimeout(() => {
      setIsLoading(false);
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-atkinson">
      {/* Header with Back Button */}
      <div className="p-6 md:p-12 flex items-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center px-6 pb-24">
        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          <div className="bg-cyan-700 p-10 text-white relative">
            <Heart className="absolute top-10 right-10 w-20 h-20 text-cyan-600/30 rotate-12" />
            <h1 className="text-3xl font-bold tracking-tight mb-2">Join the Community</h1>
            <p className="text-cyan-100 font-medium text-lg">Register your household profile to access digital services.</p>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required 
                      type="text" 
                      className="w-full border-2 border-slate-200 bg-slate-50 pl-12 pr-4 py-4 rounded-xl text-lg text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                      placeholder="Juan Dela Cruz" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg">Birth Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required 
                      type="date" 
                      className="w-full border-2 border-slate-200 bg-slate-50 pl-12 pr-4 py-4 rounded-xl text-lg text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all cursor-pointer" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg">Permanent Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea 
                      required 
                      rows={2}
                      className="w-full border-2 border-slate-200 bg-slate-50 pl-12 pr-4 py-4 rounded-xl text-lg text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all resize-none" 
                      placeholder="Street, Barangay, City" 
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required 
                      type="text" 
                      className="w-full border-2 border-slate-200 bg-slate-50 pl-12 pr-4 py-4 rounded-xl text-lg text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                      placeholder="Enter 11-digit mobile" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required 
                      type={showPassword ? 'text' : 'password'} 
                      className="w-full border-2 border-slate-200 bg-slate-50 pl-12 pr-12 py-4 rounded-xl text-lg text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                      placeholder="Min. 8 characters" 
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

                <div className="pt-8">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl text-xl hover:bg-slate-800 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
