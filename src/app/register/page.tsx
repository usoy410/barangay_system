'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Home, ArrowLeft, Phone, Lock, MapPin, Calendar, Heart, Eye, EyeOff, Users, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { createResident } from '@/lib/residents';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    civilStatus: 'Single' as 'Single' | 'Married' | 'Widowed' | 'Separated',
    mobile: '',
    address: '',
    birthDate: '',
    password: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await createResident({
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName || null,
        birth_date: formData.birthDate,
        gender: formData.gender,
        civil_status: formData.civilStatus,
        address: formData.address,
        mobile_number: formData.mobile,
        password_hash: formData.password,
        role: 'Resident',
        is_archived: false,
        household_id: null
      });

      alert('Registration successful! Please login.');
      router.push('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-atkinson text-slate-900 pb-20">
      {/* Header with Back Button */}
      <div className="p-6 md:p-12 flex items-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          <div className="bg-cyan-700 p-10 text-white relative">
            <Heart className="absolute top-10 right-10 w-20 h-20 text-cyan-600/30 rotate-12" />
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Join the Community</h1>
            <p className="text-cyan-100 font-medium text-lg">Register your resident profile to access digital services.</p>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Profile Details Column */}
              <div className="space-y-6">
                <h3 className="text-slate-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 text-sm">First Name</label>
                    <input 
                      required 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Juan"
                      className="w-full border-2 border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 text-sm">Last Name</label>
                    <input 
                      required 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Dela Cruz"
                      className="w-full border-2 border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-sm">Middle Name (Optional)</label>
                  <input 
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Protacio"
                    className="w-full border-2 border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 text-sm">Birth Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required 
                        type="date" 
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full border-2 border-slate-200 bg-slate-50 pl-10 pr-4 py-3 rounded-xl text-sm text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 text-sm">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required 
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="0912..."
                        className="w-full border-2 border-slate-200 bg-slate-50 pl-10 pr-4 py-3 rounded-xl text-sm text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Permanent Address
                  </label>
                  <textarea 
                    required 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Street No., Village, City"
                    className="w-full border-2 border-slate-200 bg-slate-50 p-4 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all resize-none" 
                  />
                </div>
              </div>

              {/* Demographics & Auth Column */}
              <div className="space-y-8">
                <div className="space-y-5">
                  <h3 className="text-slate-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4" /> Demographics
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div className="relative">
                      <label className="block text-slate-700 font-bold mb-1.5 text-sm">Gender</label>
                      <select 
                        name="gender" 
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border-2 border-slate-200 bg-slate-50 px-4 py-3.5 rounded-xl text-slate-900 font-bold focus:border-cyan-500 focus:bg-white focus:outline-none appearance-none transition-all"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="block text-slate-700 font-bold mb-1.5 text-sm">Civil Status</label>
                      <select 
                        name="civilStatus" 
                        value={formData.civilStatus}
                        onChange={handleChange}
                        className="w-full border-2 border-slate-200 bg-slate-50 px-4 py-3.5 rounded-xl text-slate-900 font-bold focus:border-cyan-500 focus:bg-white focus:outline-none appearance-none transition-all"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="text-slate-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Account Security
                  </h3>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 text-sm text-slate-500">Create Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        className="w-full border-2 border-slate-200 bg-slate-50 pl-10 pr-12 py-3 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-5 h-5 ml-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl text-xl hover:bg-slate-800 transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 active:bg-cyan-900"
                  >
                    {isLoading ? 'Processing...' : (
                      <>
                        <ClipboardList className="w-6 h-6" /> Complete Registration
                      </>
                    )}
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
