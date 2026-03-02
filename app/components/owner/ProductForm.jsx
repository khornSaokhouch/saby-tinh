'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Box , UploadCloud, Image as ImageIcon, Trash2, Plus, 
  AlertCircle, ArrowLeft, Loader2, Package, Tag, 
  Layers, Info, Settings, ShoppingBag, DollarSign,
  Palette, Ruler, Warehouse, AppWindow, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useBrandStore } from '@/stores/useBrandStore';
import { useTypeStore } from '@/stores/useTypeStore';
import { useStore } from '@/stores/useStore';
import { useColorStore } from '@/stores/useColorStore';
import { useSizeStore } from '@/stores/useSizeStore';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'react-hot-toast';

export default function ProductForm({ initialData = null, mode = 'create' }) {
  const router = useRouter();
  const { createProduct, updateProduct, error: storeError } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { brands, fetchBrands } = useBrandStore();
  const { types, fetchTypes } = useTypeStore();
  const { stores, fetchStores } = useStore();
  const { colors, fetchColors } = useColorStore();
  const { sizes, fetchSizes } = useSizeStore();
  const { user, fetchUser } = useUserStore();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    store_id: '',
    category_id: '',
    brand_id: '',
    type_id: '',
    status: true,
    sku: '',
    quantity: '',
    color_id: '',
    size_id: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const fileInputRef = useRef(null);
  
  const displayError = storeError || localError;

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchTypes();
    fetchStores();
    fetchColors();
    fetchSizes();
    if (!user) fetchUser();
  }, [fetchCategories, fetchBrands, fetchTypes, fetchStores, fetchColors, fetchSizes, fetchUser, user]);

  const filteredStores = useMemo(() => 
    stores.filter(s => user?.id && String(s.user_id) === String(user.id)),
    [stores, user?.id]
  );

  const filteredTypes = useMemo(() => 
    types.filter(t => formData.category_id && String(t.category_id) === String(formData.category_id)),
    [types, formData.category_id]
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        store_id: initialData.store_id || '',
        category_id: initialData.category_id || '',
        brand_id: initialData.brand_id || '',
        type_id: initialData.type_id || '',
        status: initialData.status ?? true,
        sku: initialData.items?.[0]?.sku || '',
        quantity: initialData.items?.[0]?.quantity_in_stock || '',
        color_id: initialData.items?.[0]?.variants?.[0]?.color_id || '',
        size_id: initialData.items?.[0]?.variants?.[0]?.size_id || '',
      });
      if (initialData.images) {
        setPreviews(initialData.images.map(img => img.image));
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.category_id && !initialData) {
       const isValidType = filteredTypes.some(t => String(t.id) === String(formData.type_id));
       if (!isValidType && formData.type_id !== '') {
         setFormData(prev => ({ ...prev, type_id: '' }));
       }
    }
  }, [formData.category_id, filteredTypes, initialData, formData.type_id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== (index - (initialData?.images?.length || 0))));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);
    const data = { ...formData, images: imageFiles };
    try {
      if (mode === 'edit' && initialData) {
        await updateProduct(initialData.id, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      router.push('/owner/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-[24px] transition-all shadow-sm"
          >
            <ArrowLeft size={22} />
          </motion.button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1 block">Product Setup</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
              {mode === 'edit' ? 'Edit Listing' : 'New Listing'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center bg-slate-100/50 p-2 rounded-[24px] border border-slate-200/50">
          <label className="flex items-center gap-3 cursor-pointer px-4">
            <div className="relative">
              <input type="checkbox" name="status" checked={formData.status} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6"></div>
            </div>
            <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${formData.status ? 'text-emerald-600' : 'text-slate-400'}`}>
              {formData.status ? 'Live Catalog' : 'Draft Mode'}
            </span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Media & Meta */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-6 ml-1">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gallery Assets</span>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                whileHover={{ y: -4 }}
                className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] overflow-hidden flex items-center justify-center relative group cursor-pointer" 
                onClick={() => fileInputRef.current.click()}
              >
                {previews[0] ? (
                  <img src={previews[0]} className="w-full h-full object-cover" alt="Main" />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-slate-100 mx-auto mb-4">
                        <UploadCloud className="text-indigo-400" size={32} />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Upload Key Visual</p>
                    <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase">PNG, JPG, WEBP (Max 5MB)</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <div className="bg-white px-5 py-2.5 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-2xl">Replace Hero Image</div>
                </div>
              </motion.div>

              <div className="grid grid-cols-3 gap-3">
                <AnimatePresence>
                    {previews.slice(1).map((src, idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative group"
                    >
                        <img src={src} className="w-full h-full object-cover" alt="Gallery" />
                        <button 
                            type="button" 
                            onClick={() => removePreview(idx + 1)}
                            className="absolute inset-0 bg-rose-600/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"
                        >
                            <Trash2 size={16} />
                        </button>
                    </motion.div>
                    ))}
                </AnimatePresence>
                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-white flex flex-col items-center justify-center text-indigo-400 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all gap-1"
                >
                  <Plus size={20} />
                  <span className="text-[8px] font-black uppercase tracking-tight">Add More</span>
                </motion.button>
              </div>
            </div>
            <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
          </section>

          <section className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Info size={16} className="text-indigo-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Quick Tip</span>
                </div>
                <p className="text-sm font-bold leading-relaxed">
                    Set your initial stock carefully to avoid overselling. You can update this later.
                </p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500 rounded-full group-hover:scale-125 transition-all duration-700 opacity-50" />
          </section>
        </div>

        {/* Right: Core Attributes */}
        <div className="lg:col-span-8 space-y-8">
          {displayError && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-rose-50 border border-rose-100 rounded-[32px] flex items-center gap-4 text-rose-600 text-sm font-bold shadow-sm"
            >
              <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 shrink-0">
                <AlertCircle size={20} className="text-white" />
              </div>
              <p>{displayError}</p>
            </motion.div>
          )}

          <div className="bg-white border border-slate-100 rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-12">
            
            {/* --- CORE DETAILS --- */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Package size={20} strokeWidth={2.5} /></div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Basic Info</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-3">
                    <InputField label="Product Name" name="name" value={formData.name} icon={Tag} onChange={handleInputChange} placeholder="Enter product name..." required />
                  </div>
                  <div className="md:col-span-1">
                    <InputField label="Price ($)" name="price" icon={DollarSign} type="number" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SelectField label="Store" name="store_id" icon={Warehouse} value={formData.store_id} onChange={handleInputChange} options={filteredStores.map(s => ({ value: s.id, label: s.name }))} required />
                  <SelectField label="Category" name="category_id" icon={Layers} value={formData.category_id} onChange={handleInputChange} options={categories.map(c => ({ value: c.id, label: c.name }))} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SelectField label="Brand" name="brand_id" icon={ShoppingBag} value={formData.brand_id} onChange={handleInputChange} options={brands.map(b => ({ value: b.id, label: b.name }))} required />
                  <SelectField label="Product Type" name="type_id" icon={AppWindow} value={formData.type_id} onChange={handleInputChange} options={filteredTypes.map(t => ({ value: t.id, label: t.name }))} required />
                </div>
            </div>

            {/* --- INVENTORY MATRIX --- */}
            <div className="space-y-8 pt-8">
                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Settings size={20} strokeWidth={2.5} /></div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Stock & Quantity</h3>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="SKU Code" name="sku" value={formData.sku} icon={CheckCircle2} onChange={handleInputChange} placeholder="Enter SKU..." required />
                  <InputField label="Stock Quantity" name="quantity" type="number" value={formData.quantity} icon={Box} onChange={handleInputChange} placeholder="0" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SelectField label="Visual Variant (Color)" name="color_id" icon={Palette} value={formData.color_id} onChange={handleInputChange} options={colors.map(c => ({ value: c.id, label: c.name }))} />
                  <SelectField label="Standard Sizing" name="size_id" icon={Ruler} value={formData.size_id} onChange={handleInputChange} options={sizes.map(s => ({ value: s.id, label: s.name }))} />
                </div>
            </div>

            {/* --- SPECIFICATIONS --- */}
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Info size={20} strokeWidth={2.5} /></div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Full Narrative</h3>
              </div>
              <textarea 
                name="description" value={formData.description} onChange={handleInputChange} rows={8}
                className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-medium focus:bg-white focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none resize-none placeholder:text-slate-300 leading-relaxed"
                placeholder="Enter product description and specifications..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 pb-10">
            <button 
              type="button" onClick={() => router.back()}
              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors py-4 px-8"
            >
              Cancel
            </button>
            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={isSubmitting}
              className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-[28px] text-[10px] font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                mode === 'edit' ? 'Update Product' : 'Create Product'
              )}
            </motion.button>
          </div>
        </div>

      </form>
    </div>
  );
}

function InputField({ label, name, type = "text", value, onChange, placeholder, required = false, icon: Icon }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 ml-1">
        <Icon size={12} className="text-slate-400" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      </div>
      <input 
        required={required} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-[22px] text-sm font-bold text-slate-900 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-100 transition-all outline-none placeholder:text-slate-300"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false, icon: Icon }) {
  return (
    <div className="space-y-3 relative">
      <div className="flex items-center gap-2 ml-1">
        <Icon size={12} className="text-slate-400" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      </div>
      <div className="relative group">
        <select 
          required={required} name={name} value={value} onChange={onChange}
          className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-[22px] text-sm font-bold text-slate-900 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-100 transition-all outline-none appearance-none cursor-pointer"
        >
          <option value="">Select</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
          <ArrowLeft className="-rotate-90" size={14} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
