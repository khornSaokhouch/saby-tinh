import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StatusFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus(initialData?.status || '');
    }
  }, [initialData, isOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ status });
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
            className="bg-white border text-gray-900 border-gray-100 rounded-xl shadow-2xl w-full max-w-[350px] p-5 relative z-10"
          >
            <h2 className="text-base font-bold mb-4 border-b border-gray-100 pb-2">
              {initialData ? 'Update State' : 'Register Lifecycle'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700">Status Designation</label>
                <input 
                  type="text" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  required 
                  disabled={isSubmitting}
                  className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" 
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 mt-2">
                <button 
                  onClick={onClose} 
                  disabled={isSubmitting} 
                  type="button" 
                  className="px-4 py-1.5 rounded-md border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-4 py-1.5 rounded-md bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : (initialData ? 'Sync' : 'Register')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}