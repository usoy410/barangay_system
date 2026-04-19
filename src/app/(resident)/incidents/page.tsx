"use client";

import React, { useState } from 'react';
import { AlertTriangle, Camera, MapPin } from 'lucide-react';
import { reportIncident } from '@/lib/incidents';
import { getClientSession } from '@/lib/auth-demo';

export default function CitizenIncidents() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const session = getClientSession();
      const reporterName = session?.name || 'Anonymous Citizen';

      await reportIncident({
        reporter_name: reporterName,
        title: type.charAt(0).toUpperCase() + type.slice(1) + " Incident",
        description: description,
        location: location
      });

      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form
      setType('');
      setLocation('');
      setDescription('');

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to report incident:', error);
      alert('Failed to send report. Please try again or call emergency services.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-atkinson">
      <header className="bg-red-700 text-white pt-12 pb-8 md:pt-32 md:pb-12 px-6 rounded-b-[2rem] shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 opacity-80" />
          <h1 className="text-3xl font-bold">Report Incident</h1>
        </div>
        <p className="text-red-100 text-lg">Send alerts directly to the Barangay command center.</p>
      </header>

      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-8">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          {submitted ? (
            <div className="bg-green-100 border-2 border-green-500 text-green-900 p-6 rounded-xl text-center font-bold text-lg">
              Report submitted successfully! Authorities have been notified and are reviewing the situation.
            </div>
          ) : (
            <>
              <p className="text-slate-600 mb-6 font-medium text-lg">
                Please provide details about the incident. <strong>In case of extreme emergencies, please call 911 directly.</strong>
              </p>
              
              <form onSubmit={handleReport} className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg">Type of Incident</label>
                  <select 
                    required 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border-2 border-slate-300 p-4 rounded-xl text-lg focus:border-red-500 focus:outline-none bg-white cursor-pointer h-[60px]"
                  >
                    <option value="">Select an option...</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="fire">Fire Incident</option>
                    <option value="crime">Crime / Security Issue</option>
                    <option value="noise">Noise Complaint</option>
                    <option value="infrastructure">Damaged Infrastructure</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-slate-500" /> Location
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border-2 border-slate-300 p-4 rounded-xl text-lg focus:border-red-500 focus:outline-none h-[60px]" 
                    placeholder="Street name, landmark..." 
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg">Description (Optional)</label>
                  <textarea 
                    rows={3} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-slate-300 p-4 rounded-xl text-lg focus:border-red-500 focus:outline-none resize-none" 
                    placeholder="What happened?"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button type="button" className="w-full flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-700 font-bold py-4 rounded-xl text-lg hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]">
                    <Camera className="w-5 h-5" /> Attach Photo
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white font-bold py-5 rounded-xl text-xl hover:bg-red-700 transition-colors mt-4 cursor-pointer disabled:opacity-50 min-h-[44px]"
                >
                  {isSubmitting ? 'Sending Alert...' : 'Submit Report'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
