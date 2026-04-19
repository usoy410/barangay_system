import React from 'react';
import { Navbar } from '@/components/Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-source-sans">
      <Navbar />
      {children}
    </div>
  );
}
