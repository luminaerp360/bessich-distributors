import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Plus,
  UserPlus,
  RefreshCw,
  Search,
  Trash2,
  UserCircle2,
  CheckCircle2,
} from 'lucide-react';
import {
  adminCreateCustomer,
  adminListCustomers,
  adminDeleteCustomer,
  CustomerRecord,
  CustomerInput,
} from '../services/authService';
import { useAuth } from '../context/AuthContext';

interface CustomerManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHOLESALE_NOTE = 'Registered customers automatically receive wholesale trade pricing.';

export const CustomerManager: React.FC<CustomerManagerProps> = ({ isOpen, onClose }) => {
  const { getToken } = useAuth();
  const token = getToken();

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Create form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCustomer, setCreatedCustomer] = useState<CustomerRecord | null>(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminListCustomers(token, { limit: 200 });
      setCustomers(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen) {
      loadCustomers();
      resetForm();
    }
  }, [isOpen, loadCustomers]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setCreatedCustomer(null);
    setError('');
  };

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (c.email || '').toLowerCase().includes(q) ||
      (c.firstName || '').toLowerCase().includes(q) ||
      (c.lastName || '').toLowerCase().includes(q) ||
      (c.fullName || '').toLowerCase().includes(q) ||
      (c.phoneNumber || '').toLowerCase().includes(q)
    );
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      setError('First name, last name, and email are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: CustomerInput = {
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        role: 'customer',
      };
      const created = await adminCreateCustomer(payload, token);
      setCreatedCustomer(created);
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (customer: CustomerRecord) => {
    const id = String(customer._id ?? customer.id ?? '');
    if (!id) return;
    if (!window.confirm(`Delete customer account "${customer.fullName || customer.email}"?`)) return;
    try {
      await adminDeleteCustomer(id, token);
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#171728] text-gray-900 dark:text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-[#171728] text-white flex items-center justify-between border-b border-white/10 sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
              Physical Counter Sign-Up
            </span>
            <h3 className="font-extrabold text-lg sm:text-xl font-display mt-0.5">
              Manage Customer Accounts
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Pricing note */}
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{WHOLESALE_NOTE}</span>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Create form */}
          <form onSubmit={handleCreate} className="space-y-3.5">
            <label className="font-medium text-gray-700 dark:text-gray-300 block text-xs">
              Create Customer Account (ask the customer if they need one)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
              />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone (e.g. +254712345678)"
                className="p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
              />
            </div>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Temporary password (min. 8 characters) — give this to the customer"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[#0E01B5] hover:bg-[#09007A] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Create Customer Account
                </>
              )}
            </button>
          </form>

          {/* Created confirmation */}
          {createdCustomer && (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Account Created Successfully
              </div>
              <div className="text-emerald-800 dark:text-emerald-300 font-mono">
                {createdCustomer.fullName || `${createdCustomer.firstName} ${createdCustomer.lastName}`} •{' '}
                {createdCustomer.email}
              </div>
              <div className="text-emerald-800 dark:text-emerald-300">
                Share the email and temporary password with the customer. They can sign in to unlock wholesale pricing.
              </div>
            </div>
          )}

          {/* Customer list */}
          <div className="space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-700 dark:text-gray-300 block text-xs flex-1">
                Registered Customers ({customers.length})
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-7 pr-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs text-gray-900 dark:text-white w-40"
                />
              </div>
              <button
                type="button"
                onClick={loadCustomers}
                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-[#0E01B5] dark:hover:text-[#8c82ff] cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                <RefreshCw className="w-4 h-4 animate-spin inline mr-1.5" />
                Loading customers...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">
                No customers found.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {filteredCustomers.map((customer) => {
                  const id = String(customer._id ?? customer.id ?? '');
                  return (
                    <div
                      key={id || customer.email}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserCircle2 className="w-6 h-6 text-[#0E01B5] dark:text-[#8c82ff] shrink-0" />
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 dark:text-white text-xs truncate">
                            {customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email}
                          </div>
                          <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                            {customer.email}
                            {customer.phoneNumber ? ` • ${customer.phoneNumber}` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          {customer.role || 'customer'} • Wholesale
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(customer)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                          title="Soft delete account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};