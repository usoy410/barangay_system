import React, { useState } from 'react';
import { Lock, X, ArrowRight } from 'lucide-react';
import { verifyAdminPassword } from '@/app/actions/auth';
import { getClientSession } from '@/lib/auth-demo';

interface PasswordConfirmModalProps {
  isOpen: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export const PasswordConfirmModal: React.FC<PasswordConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Admin Action Required',
  description = 'Please enter your admin password to confirm this action.'
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Fetch current session to get the admin's mobile number
    const session = getClientSession();
    if (!session || !session.mobile) {
      setError('You are not logged in.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Verify against actual database
      await verifyAdminPassword(session.mobile, password);
      
      // Pass the password back to the parent to execute the protected action
      await onConfirm(password);
      setPassword('');
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || 'Invalid admin password');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{title}</h2>
          <p className="text-sm text-slate-500 font-medium mb-6">{description}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all font-medium"
              />
              {error && <p className="text-red-500 text-xs font-bold mt-2">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
