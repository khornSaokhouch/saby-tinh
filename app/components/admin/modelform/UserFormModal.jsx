import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserFormModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'user',
    bio: '',
    image_profile: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone_number: initialData.phone_number || '',
        password: '',
        role: initialData.role || 'user',
        bio: initialData.profile?.bio || '',
        image_profile: null,
      });
      setPreviewUrl(initialData.profile?.image_profile || initialData.profile_image_url || null);
    } else {
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        role: 'user',
        bio: '',
        image_profile: null,
      });
      setPreviewUrl(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image_profile: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white border text-gray-900 border-gray-100 rounded-xl shadow-2xl w-full max-w-[450px] p-5 relative z-10 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-base font-bold mb-4 border-b border-gray-100 pb-2">
              {initialData ? 'Update Profile' : 'New Member'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col items-center mb-4 border-b border-gray-100 pb-4">
                <div className="relative group rounded-full overflow-hidden w-20 h-20 border border-gray-200 mb-2 flex items-center justify-center bg-gray-50 shadow-sm">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-medium text-gray-400">Avatar</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px] font-bold">Change</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                   />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Phone</label>
                  <input 
                    type="tel" 
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Role</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                    <option value="owner">Business Owner</option>
                  </select>
                </div>
              </div>

              <div>
                 <label className="block text-xs font-bold mb-1.5 text-gray-700">
                    {initialData ? 'Password (leave blank to keep)' : 'Password'}
                 </label>
                <input 
                  type="password" 
                  name="password"
                  required={!initialData} 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700">Biography</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 mt-2">
                <button
                  onClick={onClose}
                  type="button"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-md border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-md bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : (initialData ? 'Sync' : 'Save')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
