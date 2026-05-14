"use client";

import React, { useState, useRef } from 'react';
import { AlertTriangle, Camera, MapPin, X, ImageIcon } from 'lucide-react';
import { reportIncident } from '@/lib/incidents';
import { getClientSession } from '@/lib/auth-demo';
import { uploadIncidentPhoto } from '@/lib/storage';
import { SuccessVideoModal } from '@/components/ui/SuccessVideoModal';
import { BotHeader } from '@/components/ui/BotHeader';

export default function CitizenIncidents() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const session = getClientSession();
      if (!session) {
        throw new Error('Not logged in');
      }

      const { getResidentByMobile } = await import('@/lib/residents');
      const profile = await getResidentByMobile(session.mobile);
      
      const reporterName = profile ? `${profile.first_name} ${profile.last_name}` : (session?.name || 'Anonymous Citizen');
      const residentId = profile?.id;

      let imageUrl = '';
      if (selectedFile) {
        imageUrl = await uploadIncidentPhoto(selectedFile);
      }

      await reportIncident({
        resident_id: residentId,
        reporter_name: reporterName,
        title: type.charAt(0).toUpperCase() + type.slice(1) + " Incident",
        description: description,
        location: location,
        image_url: imageUrl
      });

      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form
      setType('');
      setLocation('');
      setDescription('');
      removeFile();
    } catch (error) {
      console.error('Failed to report incident:', error);
      alert('Failed to send report. Please try again or call emergency services.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-atkinson">
      <BotHeader 
        title="May Ire-report Ka Ba?"
        message="Nandito ako para tulungan kang magpadala ng alerto sa command center."
        animationType="standby"
      />

      <main className="grow max-w-3xl w-full mx-auto px-6 py-8">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <SuccessVideoModal 
            isOpen={submitted} 
            onClose={() => setSubmitted(false)}
            title="Report Submitted!"
            message="Matagumpay na naipadala ang iyong ulat. Naabisuhan na ang mga awtoridad at sinusuri na ang sitwasyon."
          />
          
          <>
              <p className="text-slate-600 mb-6 font-medium text-lg">
                Mangyaring ibigay ang mga detalye tungkol sa insidente. <strong>Sa matitinding emergency, mangyaring tumawag nang direkta sa 911.</strong>
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
                  <label className="flex items-center gap-2 text-slate-700 font-bold mb-2 text-lg">
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
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                  />
                  
                  {!previewUrl ? (
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 text-slate-500 font-bold py-8 rounded-xl text-lg hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer bg-slate-50"
                    >
                      <Camera className="w-6 h-6" /> 
                      <div className="text-left">
                        <p>Maglakip ng Litrato</p>
                        <p className="text-xs font-medium opacity-60">Tulungan kaming mas maintindihan ang sitwasyon</p>
                      </div>
                    </button>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border-2 border-slate-200">
                      <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                      <button 
                        type="button" 
                        onClick={removeFile}
                        className="absolute top-4 right-4 bg-slate-900/80 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/60 backdrop-blur-sm text-white p-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-xs font-bold truncate">{selectedFile?.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white font-black py-5 rounded-2xl text-xl hover:bg-red-700 transition-all mt-4 cursor-pointer disabled:opacity-50 shadow-xl shadow-red-900/10 active:scale-[0.98] min-h-[44px]"
                >
                  {isSubmitting ? 'Sending Alert...' : 'Submit Report'}
                </button>
              </form>
            </>
        </div>
      </main>
    </div>
  );
}
