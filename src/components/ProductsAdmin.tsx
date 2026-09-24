import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Star,
  StarOff,
  Package,
  Image as ImageIcon,
  Layers,
  AlertTriangle,
  UserCircle2,
} from 'lucide-react';
import {
  ApiCategory,
  ApiProduct,
  ProductInput,
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
  getApiId,
  getApiCategoryId,
} from '../services/productsService';
import { useAuth } from '../context/AuthContext';
import { ProductFormModal } from './ProductFormModal';
import { CategoryManager } from './CategoryManager';
import { CustomerManager } from './CustomerManager';

interface ProductsAdminProps {
  onCatalogChanged?: () => void;
}

export const ProductsAdmin: React.FC<ProductsAdminProps> = ({ onCatalogChanged }) => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ApiProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showCustomerManager, setShowCustomerManager] = useState(false);

  const token = getToken();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categoryNameById = useCallback(
    (id: string) => {
      const cat = categories.find((c) => getApiCategoryId(c) === id);
      return cat?.name || id;
    },
    [categories]
  );

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (p.name || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q);
    if (!matchesSearch) return false;

    if (categoryFilter && !(p.categories ?? []).includes(categoryFilter)) return false;

    if (activeFilter === 'active' && p.isActive === false) return false;
    if (activeFilter === 'inactive' && p.isActive !== false) return false;

    return true;
  });

  const handleCreate = async (payload: ProductInput) => {
    setIsSubmitting(true);
    try {
      await createProduct(payload, token);
      setFormOpen(false);
      setEditingProduct(null);
      await loadData();
      onCatalogChanged?.();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload: ProductInput) => {
    if (!editingProduct) return;
    const id = getApiId(editingProduct);
    setIsSubmitting(true);
    try {
      await updateProduct(id, payload, token);
      setFormOpen(false);
      setEditingProduct(null);
      await loadData();
      onCatalogChanged?.();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (product: ApiProduct) => {
    const id = getApiId(product);
    try {
      await toggleProductFeatured(id, token);
      await loadData();
      onCatalogChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle featured.');
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(getApiId(confirmDelete), token);
      setConfirmDelete(null);
      await loadData();
      onCatalogChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3.5">
        <div>
          <div className="text-[11px] sm:text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] uppercase tracking-wider mb-0.5">
            E-Commerce Administration
          </div>
          <h2 className="hero-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#171728] dark:text-white font-display">
            Product Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
            Create, edit, and manage the live product catalog consumed by the site.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowCustomerManager(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#25253d] cursor-pointer transition-colors"
          >
            <UserCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Manage Customers
          </button>
          <button
            type="button"
            onClick={() => setShowCategoryManager(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#25253d] cursor-pointer transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff]" />
            Manage Categories
          </button>
          <button
            type="button"
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#25253d] cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0E01B5] hover:bg-[#09007A] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Product
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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, brand, description..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs text-gray-800 dark:text-gray-200"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={getApiCategoryId(cat)} value={getApiCategoryId(cat)}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs text-gray-800 dark:text-gray-200"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold sm:ml-auto">
          {filteredProducts.length} of {products.length} products
        </span>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-500 dark:text-gray-400">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#171728] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 space-y-3">
          <Package className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">No products found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Create your first product to start selling through the catalog.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
            className="bg-[#0E01B5] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#09007A] transition-colors cursor-pointer"
          >
            Create Product
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#171728] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F5DC]/40 dark:bg-[#23233a] text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                  <th className="px-3 py-2.5 font-bold">Product</th>
                  <th className="px-3 py-2.5 font-bold">Brand</th>
                  <th className="px-3 py-2.5 font-bold">Price (KES)</th>
                  <th className="px-3 py-2.5 font-bold">Categories</th>
                  <th className="px-3 py-2.5 font-bold">Stock</th>
                  <th className="px-3 py-2.5 font-bold text-center">Active</th>
                  <th className="px-3 py-2.5 font-bold text-center">Featured</th>
                  <th className="px-3 py-2.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const id = getApiId(product);
                  const stock = product.variants?.reduce(
                    (sum, v) => sum + (Number(v.stockQuantity) || 0),
                    0
                  );
                  return (
                    <tr
                      key={id}
                      className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1f1f33] transition-colors"
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          {product.images?.[0] ? (
                            <img
                              src={
                                product.images[0].startsWith('http')
                                  ? product.images[0]
                                  : `https://ecommerse.lumina360.tech${product.images[0]}`
                              }
                              alt=""
                              className="w-9 h-9 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-[#F5F5DC]/40 dark:bg-[#23233a] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white line-clamp-1 max-w-[220px]">
                              {product.name}
                            </div>
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono truncate max-w-[220px]">
                              {id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium">
                        {product.brand || '—'}
                      </td>
                      <td className="px-3 py-2.5 font-bold text-gray-900 dark:text-white">
                        {Number(product.price ?? 0).toLocaleString('en-KE')}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(product.categories ?? []).length === 0 && (
                            <span className="text-gray-400 dark:text-gray-500 text-[10px]">None</span>
                          )}
                          {(product.categories ?? []).slice(0, 3).map((catId) => (
                            <span
                              key={catId}
                              className="bg-[#0E01B5]/10 dark:bg-[#0E01B5]/25 text-[#0E01B5] dark:text-[#8c82ff] px-1.5 py-0.5 rounded text-[10px] font-bold"
                            >
                              {categoryNameById(catId)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`font-bold ${(stock ?? 0) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}
                        >
                          {stock ?? 0}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            product.isActive === false
                              ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {product.isActive === false ? 'Off' : 'On'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(product)}
                          title="Toggle featured"
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            product.featured
                              ? 'text-[#FFD700] bg-amber-50 dark:bg-amber-950/30'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25253d]'
                          }`}
                        >
                          {product.featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setFormOpen(true);
                            }}
                            className="p-1.5 text-[#0E01B5] dark:text-[#8c82ff] hover:bg-[#0E01B5]/10 dark:hover:bg-[#0E01B5]/20 rounded-lg cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(product)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        categories={categories}
        product={editingProduct}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />

      {/* Category Manager */}
      <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onChanged={() => {
          fetchCategories().then(setCategories).catch(() => {});
          onCatalogChanged?.();
        }}
      />

      {/* Customer Manager */}
      <CustomerManager
        isOpen={showCustomerManager}
        onClose={() => setShowCustomerManager(false)}
      />

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#171728] text-gray-900 dark:text-white rounded-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-center font-display">Delete Product?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1.5">
              "{confirmDelete.name}" will be permanently removed from the live catalog. This cannot be undone.
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
    </section>
  );
};