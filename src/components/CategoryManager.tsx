import React, { useState } from 'react';
import { X, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import {
  ApiCategory,
  CategoryInput,
  createCategory,
  updateCategory,
  deleteCategory,
  getApiCategoryId,
} from '../services/productsService';
import { useAuth } from '../context/AuthContext';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ApiCategory[];
  onChanged: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  isOpen,
  onClose,
  categories,
  onChanged,
}) => {
  const { getToken } = useAuth();
  const token = getToken();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage('');
    setIsActive(true);
    setEditingId(null);
    setError('');
  };

  const startEdit = (cat: ApiCategory) => {
    setEditingId(getApiCategoryId(cat));
    setName(cat.name || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setIsActive(cat.isActive !== false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    const payload: CategoryInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      image: image.trim() || undefined,
      isActive,
    };
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateCategory(editingId, payload, token);
      } else {
        await createCategory(payload, token);
      }
      resetForm();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat: ApiCategory) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await deleteCategory(getApiCategoryId(cat), token);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#171728] text-gray-900 dark:text-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-[#171728] text-white flex items-center justify-between border-b border-white/10 sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
              Product Taxonomy
            </span>
            <h3 className="font-extrabold text-lg sm:text-xl font-display mt-0.5">
              Manage Categories
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
          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Existing categories */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-300 block mb-2 text-xs">
              Existing Categories ({categories.length})
            </label>
            {categories.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No categories yet. Create your first one below.
              </p>
            ) : (
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <div
                    key={getApiCategoryId(cat)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {cat.image && (
                        <img
                          src={cat.image.startsWith('http') ? cat.image : `https://ecommerse.lumina360.tech${cat.image}`}
                          alt=""
                          className="w-7 h-7 rounded object-cover border border-gray-200 dark:border-gray-700"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-xs">{cat.name}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
                          {cat.description || '—'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`mr-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          cat.isActive === false
                            ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                            : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {cat.isActive === false ? 'Off' : 'On'}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="p-1.5 text-[#0E01B5] dark:text-[#8c82ff] hover:bg-[#0E01B5]/10 dark:hover:bg-[#0E01B5]/20 rounded-lg cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 border-t border-gray-100 dark:border-gray-800 pt-5">
            <label className="font-medium text-gray-700 dark:text-gray-300 block text-xs">
              {editingId ? 'Edit Category' : 'Create Category'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name (e.g. Whisky)"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (optional)"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
            />
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL (optional)"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
            />
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-[#0E01B5] focus:ring-[#0E01B5]"
              />
              Active
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#0E01B5] hover:bg-[#09007A] text-white text-xs font-bold cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};