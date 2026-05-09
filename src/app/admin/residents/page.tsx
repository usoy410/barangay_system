'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ResidentTable } from '@/components/residents/ResidentTable';
import { ResidentSearch } from '@/components/residents/ResidentSearch';
import { ResidentForm } from '@/components/residents/ResidentForm';
import { PasswordConfirmModal } from '@/components/admin/PasswordConfirmModal';
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

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  // Fetch residents from Supabase
  const fetchResidents = useCallback(async (currentPage: number, search: string) => {
    setIsLoading(true);
    try {
      const { data, count } = await getResidents({ 
        search, 
        limit: PAGE_SIZE, 
        offset: currentPage * PAGE_SIZE 
      });
      setResidents(data);
      if (count !== null) setTotalCount(count);
    } catch (error) {
      console.error('Failed to load residents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResidents(page, searchTerm);
  }, [fetchResidents, page, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(0);
  };

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
    setPendingAction(() => async () => {
      if (editingResident) {
        await updateResident(editingResident.id, data);
      } else {
        await createResident(data);
      }
      setIsFormOpen(false);
      await fetchResidents(page, searchTerm);
    });
    setIsPasswordModalOpen(true);
  };

  const handleArchive = async (id: string) => {
    setPendingAction(() => async () => {
      await archiveResident(id);
      await fetchResidents(page, searchTerm);
    });
    setIsPasswordModalOpen(true);
  };

  const executePendingAction = async (password: string) => {
    if (pendingAction) {
      await pendingAction();
      setPendingAction(null);
    }
    setIsPasswordModalOpen(false);
  };

  return (
    <React.Fragment>

      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Info className="w-5 h-5 shrink-0" />
          <p>
            Residents archived from this registry can still be accessed in the <strong>Archives</strong> section. 
            All changes are synchronized across the system instantly.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <ResidentSearch onSearch={handleSearch} onAddClick={handleAddClick} />
          
          <ResidentTable 
            residents={residents} 
            isLoading={isLoading} 
            onEdit={handleEditClick}
            onArchive={handleArchive}
          />
          
          {totalCount > PAGE_SIZE && (
            <div className="flex justify-between items-center mt-6 p-4 border-t border-slate-100">
              <span className="text-sm text-slate-500 font-medium">
                Showing {page * PAGE_SIZE + 1} to {Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount} residents
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button 
                  disabled={(page + 1) * PAGE_SIZE >= totalCount}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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

      <PasswordConfirmModal 
        isOpen={isPasswordModalOpen}
        onConfirm={executePendingAction}
        onCancel={() => {
          setIsPasswordModalOpen(false);
          setPendingAction(null);
        }}
      />
      
      <footer className="py-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            &copy; 2026 Konektado. Built for efficient local governance.
          </p>
        </div>
      </footer>
    </React.Fragment>
  );
}
