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
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="p-2 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
          </motion.button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Product Setup</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
              {mode === 'edit' ? 'Edit Product' : 'New Product'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
          <label className="flex items-center gap-3 cursor-pointer px-4">
            <div className="relative">
              <input type="checkbox" name="status" checked={formData.status} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-5"></div>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${formData.status ? 'text-emerald-600' : 'text-slate-400'}`}>
              {formData.status ? 'Live Catalog' : 'Draft Mode'}
            </span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Media & Meta */}
        <div className="lg:col-span-4 space-y-4">
          <section className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4 ml-1">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Images</span>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                whileHover={{ y: -2 }}
                className="aspect-[4/3] bg-slate-50 border border-dashed border-slate-200 rounded-[16px] overflow-hidden flex items-center justify-center relative group cursor-pointer" 
                onClick={() => fileInputRef.current.click()}
              >
                {previews[0] ? (
                  <img src={previews[0]} className="w-full h-full object-cover" alt="Main" />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm shadow-slate-100 mx-auto mb-2">
                        <UploadCloud className="text-indigo-400" size={20} />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Upload Main Photo</p>
                    <p className="text-[8px] font-bold text-slate-300 mt-1 uppercase">PNG, JPG, WEBP · Max 5MB</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <div className="bg-white px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-900 uppercase tracking-widest shadow-lg">Change Photo</div>
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

          <section className="bg-indigo-500 rounded-[16px] p-4 text-white relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-2">
                    <Info size={12} className="text-indigo-200" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-100">Quick Tip</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-indigo-50">
                    Set your initial stock carefully to avoid overselling. You can update stock anytime later.
                </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-400 rounded-full group-hover:scale-125 transition-all duration-700 opacity-40" />
          </section>
        </div>

        {/* Right: Core Attributes */}
        <div className="lg:col-span-8 space-y-4">
          {displayError && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-[12px] font-bold"
            >
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center shrink-0">
                <AlertCircle size={14} className="text-white" />
              </div>
              <p>{displayError}</p>
            </motion.div>
          )}

          <section className="bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm space-y-6">
            
            {/* --- CORE DETAILS --- */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Package size={14} strokeWidth={2.5} /></div>
                    <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Identity & Pricing</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <InputField label="Product Name" name="name" value={formData.name} icon={Tag} onChange={handleInputChange} placeholder="e.g. Running Shoes Pro Max" required />
                  </div>
                  <div className="md:col-span-1">
                    <InputField label="Price (USD)" name="price" icon={DollarSign} type="number" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField label="Store" name="store_id" icon={Warehouse} value={formData.store_id} onChange={handleInputChange} options={filteredStores.map(s => ({ value: s.id, label: s.name }))} required />
                  <SelectField label="Category" name="category_id" icon={Layers} value={formData.category_id} onChange={handleInputChange} options={categories.map(c => ({ value: c.id, label: c.name }))} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField label="Brand" name="brand_id" icon={ShoppingBag} value={formData.brand_id} onChange={handleInputChange} options={brands.map(b => ({ value: b.id, label: b.name }))} required />
                  <SelectField label="Product Type" name="type_id" icon={AppWindow} value={formData.type_id} onChange={handleInputChange} options={filteredTypes.map(t => ({ value: t.id, label: t.name }))} required />
                </div>
            </div>

            {/* --- INVENTORY --- */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Settings size={14} strokeWidth={2.5} /></div>
                    <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Inventory Control</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="SKU / Barcode" name="sku" value={formData.sku} icon={CheckCircle2} onChange={handleInputChange} placeholder="e.g. PRD-001" required />
                  <InputField label="Stock Quantity" name="quantity" type="number" value={formData.quantity} icon={Box} onChange={handleInputChange} placeholder="e.g. 100" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField label="Color Variant" name="color_id" icon={Palette} value={formData.color_id} onChange={handleInputChange} options={colors.map(c => ({ value: c.id, label: c.name }))} />
                  <SelectField label="Size Variant" name="size_id" icon={Ruler} value={formData.size_id} onChange={handleInputChange} options={sizes.map(s => ({ value: s.id, label: s.name }))} />
                </div>
            </div>

            {/* --- DESCRIPTION --- */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                 <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Info size={14} strokeWidth={2.5} /></div>
                 <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Product Description</h3>
              </div>
              <textarea 
                name="description" value={formData.description} onChange={handleInputChange} rows={4}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-100 transition-all outline-none resize-none placeholder:text-slate-300 leading-relaxed"
                placeholder="Describe your product — materials, features, key benefits..."
              />
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-4 pt-2 pb-6">
            <button 
              type="button" onClick={() => router.back()}
              className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all py-3 px-6 active:scale-95"
            >
              Discard
            </button>
            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={isSubmitting}
              className="px-10 py-3 bg-emerald-500 text-white rounded-[20px] text-[10px] font-black shadow-lg shadow-emerald-100/50 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 transition-all uppercase tracking-[0.2em] flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={13} strokeWidth={3} />
                  {mode === 'edit' ? 'Save Changes' : 'Publish Product'}
                </>
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
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 ml-1">
        <Icon size={11} className="text-slate-400" />
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      </div>
      <input 
        required={required} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all outline-none placeholder:text-slate-300"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false, icon: Icon }) {
  return (
    <div className="space-y-1.5 relative">
      <div className="flex items-center gap-1.5 ml-1">
        <Icon size={11} className="text-slate-400" />
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      </div>
      <div className="relative group">
        <select 
          required={required} name={name} value={value} onChange={onChange}
          className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all outline-none appearance-none cursor-pointer"
        >
          <option value="">— Select —</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
          <ArrowLeft className="-rotate-90" size={12} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
