import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Search,
  Trash2,
  UserCircle2,
  Users,
  Package,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import {
  adminListCustomers,
  adminDeleteCustomer,
  CustomerRecord,
} from '../services/authService';
import { fetchMyOrders, ApiOrder } from '../services/ordersService';
import { useAuth } from '../context/AuthContext';
import { formatKes } from '../utils/formatters';

interface UserStats {
  orderCount: number;
  totalSpentKes: number;
  deliveredCount: number;
}

export const UsersAdmin: React.FC = () => {
  const { getToken, user: currentUser } = useAuth();
  const token = getToken();

  const [users, setUsers] = useState<CustomerRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer' | 'staff'>('all');
  const [statsByUser, setStatsByUser] = useState<Record<string, UserStats>>({});
  const [confirmDelete, setConfirmDelete] = useState<CustomerRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, orders] = await Promise.all([
        adminListCustomers(token, { limit: 500 }),
        fetchMyOrders(token).catch(() => [] as ApiOrder[]),
      ]);

      const list = usersRes.data ?? [];
      setUsers(list);
      setTotal(usersRes.total ?? list.length);

      // Aggregate order statistics per user (the backend returns tenant-wide orders).
      const stats: Record<string, UserStats> = {};
      for (const order of orders) {
        const uid = String(order.userId ?? '');
        const entry = stats[uid] ?? { orderCount: 0, totalSpentKes: 0, deliveredCount: 0 };
        entry.orderCount += 1;
        entry.totalSpentKes += Number(order.totalAmount) || 0;
        if ((order.status || '').toLowerCase() === 'delivered') entry.deliveredCount += 1;
        stats[uid] = entry;
      }
      setStatsByUser(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const userId = (u: CustomerRecord): string => String(u._id ?? u.id ?? '');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.email || '').toLowerCase().includes(q) ||
      (u.firstName || '').toLowerCase().includes(q) ||
      (u.lastName || '').toLowerCase().includes(q) ||
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.phoneNumber || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await adminDeleteCustomer(userId(confirmDelete), token);
      setConfirmDelete(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalSpentAll = Object.values(statsByUser).reduce((sum, s) => sum + s.totalSpentKes, 0);
  const totalOrdersAll = Object.values(statsByUser).reduce((sum, s) => sum + s.orderCount, 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3.5">
        <div>
          <div className="text-[11px] sm:text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] uppercase tracking-wider mb-0.5">
            Account Management
          </div>
          <h2 className="hero-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#171728] dark:text-white font-display">
            Users &amp; Customers
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
            Track registered accounts, purchasing activity, and order history across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadUsers}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#25253d] cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            <Users className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff]" />
            Registered Users
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{total}</div>
        </div>
        <div className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Orders Placed
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalOrdersAll}</div>
        </div>
        <div className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            <Wallet className="w-3.5 h-3.5 text-[#F2693F]" />
            Total Revenue
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatKes(totalSpentAll)}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'customer' | 'staff')}
            className="px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs text-gray-800 dark:text-gray-200"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold sm:ml-auto">
          Showing {filteredUsers.length} of {users.length} users
        </span>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-500 dark:text-gray-400">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Loading users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#171728] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 space-y-3">
          <UserCircle2 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">No users found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Try adjusting your search or role filter.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#171728] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F5DC]/40 dark:bg-[#23233a] text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                  <th className="px-3 py-2.5 font-bold">User</th>
                  <th className="px-3 py-2.5 font-bold">Role</th>
                  <th className="px-3 py-2.5 font-bold">Status</th>
                  <th className="px-3 py-2.5 font-bold text-center">Orders</th>
                  <th className="px-3 py-2.5 font-bold text-right">Total Spent</th>
                  <th className="px-3 py-2.5 font-bold">Joined</th>
                  <th className="px-3 py-2.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const id = userId(user);
                  const stats = statsByUser[id] ?? { orderCount: 0, totalSpentKes: 0, deliveredCount: 0 };
                  const isSelf = currentUser && (currentUser._id ?? currentUser.id) === id;
                  return (
                    <tr
                      key={id || user.email}
                      className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1f1f33] transition-colors"
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#0E01B5]/10 dark:bg-[#0E01B5]/25 flex items-center justify-center shrink-0">
                            <UserCircle2 className="w-5 h-5 text-[#0E01B5] dark:text-[#8c82ff]" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                              {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                              {isSelf && (
                                <span className="ml-1.5 bg-[#0E01B5] text-white text-[9px] px-1 py-0.5 rounded font-bold align-middle">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[220px]">
                              {user.email}
                              {user.phoneNumber ? ` • ${user.phoneNumber}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            user.role === 'admin'
                              ? 'bg-[#0E01B5]/10 dark:bg-[#0E01B5]/25 text-[#0E01B5] dark:text-[#8c82ff]'
                              : user.role === 'staff'
                              ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
                              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {user.role || 'customer'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.isActive === false
                              ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {user.isActive === false ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="font-bold text-gray-900 dark:text-white">{stats.orderCount}</span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 block">
                          {stats.deliveredCount} delivered
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-gray-900 dark:text-white">
                        {formatKes(stats.totalSpentKes)}
                      </td>
                      <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 text-[10px]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-KE', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end">
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(user)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                              title="Soft delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#171728] text-gray-900 dark:text-white rounded-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-center font-display">Delete User?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1.5">
              "{confirmDelete.fullName || confirmDelete.email}" will be marked as deleted. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#25253d] text-gray-800 dark:text-gray-200 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer disabled:opacity-75"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassurance */}
      <div className="flex flex-col sm:flex-row items-start gap-3 p-4 rounded-xl bg-[#F5F5DC]/40 dark:bg-[#23233a] border border-[#F5F5DC] dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
        <ShieldCheck className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Only signed-in administrators can view registered users. Order statistics are aggregated from the
          platform's order records and refresh when you hit Refresh.
        </p>
      </div>
    </section>
  );
};