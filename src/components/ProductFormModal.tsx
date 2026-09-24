import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Package, Star } from 'lucide-react';
import { ApiCategory, ApiProduct, ProductInput, ProductVariantInput, getApiCategoryId } from '../services/productsService';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ApiCategory[];
  product: ApiProduct | null; // null = create, object = edit
  onSubmit: (payload: ProductInput) => Promise<void>;
  isSubmitting?: boolean;
}

const EMPTY_VARIANT: ProductVariantInput = {
  name: '',
  sku: '',
  price: 0,
  stockQuantity: 0,
  attributes: {},
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  categories,
  product,
  onSubmit,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariantInput[]>([]);
  const [specsKey, setSpecsKey] = useState('');
  const [specsValue, setSpecsValue] = useState('');
  const [specifications, setSpecifications] = useState<Record<string, string>>({});
  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(String(product.price ?? ''));
      setBrand(product.brand || '');
      setSelectedCategories([...(product.categories ?? [])].map(String));
      setImages([...(product.images ?? [])]);
      setVariants((product.variants ?? []).map((v) => ({
        name: v.name || '',
        sku: v.sku || '',
        price: v.price ?? 0,
        stockQuantity: v.stockQuantity ?? 0,
        attributes: v.attributes ?? {},
      })));
      setSpecifications(
        Object.fromEntries(
          Object.entries(product.specifications ?? {}).map(([k, v]) => [k, String(v)])
        )
      );
      setIsActive(product.isActive !== false);
      setFeatured(Boolean(product.featured));
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setBrand('');
      setSelectedCategories([]);
      setImages([]);
      setVariants([]);
      setSpecsKey('');
      setSpecsValue('');
      setSpecifications({});
      setIsActive(true);
      setFeatured(false);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleImageChange = (index: number, value: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)));
  };

  const addImage = () => setImages((prev) => [...prev, '']);
  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const updateVariant = (index: number, patch: Partial<ProductVariantInput>) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };

  const addVariant = () => setVariants((prev) => [...prev, { ...EMPTY_VARIANT }]);
  const removeVariant = (index: number) => setVariants((prev) => prev.filter((_, i) => i !== index));

  const addSpecification = () => {
    if (!specsKey.trim()) return;
    setSpecifications((prev) => ({ ...prev, [specsKey.trim()]: specsValue.trim() }));
    setSpecsKey('');
    setSpecsValue('');
  };

  const removeSpecification = (key: string) => {
    setSpecifications((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numericPrice = Number(price);
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!brand.trim()) {
      setError('Brand is required.');
      return;
    }
    if (!price || isNaN(numericPrice) || numericPrice < 0) {
      setError('A valid price is required.');
      return;
    }

    const payload: ProductInput = {
      name: name.trim(),
      description: description.trim() || name.trim(),
      price: numericPrice,
      categories: selectedCategories,
      brand: brand.trim(),
      images: images.filter((img) => img.trim().length > 0),
      variants: variants
        .filter((v) => v.name.trim() || v.sku.trim())
        .map((v) => ({
          name: v.name.trim() || v.sku.trim(),
          sku: v.sku.trim() || `${brand.trim().toUpperCase()}-${Date.now()}`,
          price: Number(v.price) || 0,
          stockQuantity: Number(v.stockQuantity) || 0,
          attributes: v.attributes && Object.keys(v.attributes).length > 0 ? v.attributes : undefined,
        })),
      isActive,
      featured,
      specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="product-form-modal"
        className="bg-white dark:bg-[#171728] text-gray-900 dark:text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 bg-[#171728] text-white flex items-center justify-between border-b border-white/10 sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
              Product Management
            </span>
            <h3 className="font-extrabold text-lg sm:text-xl font-display mt-0.5">
              {product ? `Edit: ${product.name}` : 'Create New Product'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Core fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1 text-xs">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Johnnie Walker Black Label 1L"
                className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1 text-xs">Brand *</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Johnnie Walker"
                className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1 text-xs">Price (KES) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 2100"
                min="0"
                step="0.01"
                className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1 text-xs">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Short commercial description of the product"
                className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0E01B5] focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1.5 text-xs">
              Categories / Departments
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.length === 0 && (
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  No categories available. Create categories first.
                </span>
              )}
              {categories.map((cat) => {
                const catId = getApiCategoryId(cat);
                const isSelected = selectedCategories.includes(catId);
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => toggleCategory(catId)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E01B5] text-white border-[#0E01B5]'
                        : 'bg-white dark:bg-[#1b1b2d] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-[#0E01B5]/40'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1.5 text-xs flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> Images (URLs)
            </label>
            <div className="space-y-2">
              {images.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://.../image.jpg"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImage}
                className="flex items-center gap-1 text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Image URL
              </button>
            </div>
          </div>

          {/* Variants */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1.5 text-xs flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Variants / SKUs (stock)
            </label>
            {variants.length > 0 && (
              <div className="space-y-2 mb-2">
                {variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, { name: e.target.value })}
                      placeholder="Variant name"
                      className="col-span-2 sm:col-span-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, { sku: e.target.value })}
                      placeholder="SKU"
                      className="col-span-2 sm:col-span-2 p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                    />
                    <input
                      type="number"
                      value={variant.price ?? ''}
                      onChange={(e) => updateVariant(index, { price: Number(e.target.value) })}
                      placeholder="Price"
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={variant.stockQuantity ?? ''}
                        onChange={(e) => updateVariant(index, { stockQuantity: Number(e.target.value) })}
                        placeholder="Stock"
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1 text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Variant
            </button>
          </div>

          {/* Specifications */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1.5 text-xs">
              Specifications (e.g. origin, abv, volumeMl)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={specsKey}
                onChange={(e) => setSpecsKey(e.target.value)}
                placeholder="Key (e.g. origin)"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={specsValue}
                onChange={(e) => setSpecsValue(e.target.value)}
                placeholder="Value (e.g. Scotland)"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="p-2 bg-[#0E01B5] hover:bg-[#09007A] text-white rounded-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {Object.keys(specifications).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(specifications).map(([key, value]) => (
                  <span
                    key={key}
                    className="flex items-center gap-1 bg-[#F5F5DC]/40 dark:bg-[#23233a] border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-lg text-[11px] font-medium"
                  >
                    <b>{key}:</b> {value}
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-red-500 hover:text-red-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-[#0E01B5] focus:ring-[#0E01B5]"
              />
              Active (visible in catalog)
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-[#0E01B5] focus:ring-[#0E01B5]"
              />
              <Star className="w-3.5 h-3.5 text-[#FFD700]" /> Featured
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#0E01B5] hover:bg-[#09007A] text-white font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#25253d] text-gray-800 dark:text-gray-200 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};