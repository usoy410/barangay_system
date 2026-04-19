'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ResidentTable } from '@/components/residents/ResidentTable';
import { ResidentSearch } from '@/components/residents/ResidentSearch';
import { ResidentForm } from '@/components/residents/ResidentForm';
import { getResidents, createResident, updateResident, archiveResident } from '@/lib/residents';
import type { Resident } from '@/types/database';
import { Users, Info } from 'lucide-react';

/**
 * Main page for the Resident Registry module.
 * Manages the state for resident data, search filtering, and the create/edit modal.
 */
export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

  // Fetch residents from Supabase
  const fetchResidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await getResidents({ search: searchTerm });
      setResidents(data);
    } catch (error) {
      console.error('Failed to load residents');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  // Handlers
  const handleAddClick = () => {
    setEditingResident(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (resident: Resident) => {
    setEditingResident(resident);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingResident) {
      await updateResident(editingResident.id, data);
    } else {
      await createResident(data);
    }
    await fetchResidents();
  };

  const handleArchive = async (id: string) => {
    if (confirm('Are you sure you want to archive this resident record?')) {
      await archiveResident(id);
      await fetchResidents();
    }
  };

  return (
    <React.Fragment>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-100 text-cyan-700 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-lexend font-bold text-slate-900">Resident Registry</h1>
          </div>
          <p className="text-slate-600 max-w-2xl">
            Manage your community members, update profiles, and track population demographics in real-time.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 mb-8 flex gap-3 text-cyan-800 text-sm">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p>
            Residents archived from this registry can still be accessed in the <strong>Archives</strong> section. 
            All changes are synchronized across the system instantly.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <ResidentSearch onSearch={setSearchTerm} onAddClick={handleAddClick} />
          
          <ResidentTable 
            residents={residents} 
            isLoading={isLoading} 
            onEdit={handleEditClick}
            onArchive={handleArchive}
          />
        </div>
      </main>

      {/* Modals */}
      {isFormOpen && (
        <ResidentForm 
          title={editingResident ? 'Edit Resident Details' : 'Enroll New Resident'}
          initialData={editingResident || {}}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
      
      <footer className="py-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            &copy; 2026 Barangay Information System. Built for efficient local governance.
          </p>
        </div>
      </footer>
    </React.Fragment>
  );
}
