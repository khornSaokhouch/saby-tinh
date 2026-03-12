'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useBrandStore } from '@/stores/useBrandStore';
import { useStore } from '@/stores/useStore';
import { Menu, Sparkles } from 'lucide-react'; // Added Sparkles

import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import UserActions, { MobileBottomTabs } from './UserActions';
import MobileSidebar from './MobileSidebar';

export default function Navbar() {
  const { user: authUser } = useAuthStore();
  const { user: userProfile, fetchProfile } = useUserStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { brands, fetchBrands } = useBrandStore();
  const { stores, fetchStores } = useStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (authUser?.id && token) {
      // Fetch authenticated user profile instead of by ID to avoid 403
      fetchProfile();
    }
    fetchCategories();
    fetchBrands();
    fetchStores(); 
    
  
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [authUser, fetchProfile, fetchCategories, fetchBrands, fetchStores]);

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${isScrolled ? 'py-2' : 'py-0'}`}>
        <header 
          className={`mx-auto transition-all duration-500 ease-in-out
            ${isScrolled 
              ? 'max-w-5xl rounded-full bg-white/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 px-2' 
              : 'max-w-full bg-white border-b border-slate-100 px-0'
            }`}
        >
          <div className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 
            ${isScrolled ? 'h-12 px-4' : 'h-16 px-5'}`}
          >
            {/* BRAND */}
            <div className="flex items-center gap-4 lg:gap-10">
              <a href="/" className="group flex items-center gap-2 sm:gap-3">
                {/* <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300 shrink-0">
                  <Sparkles size={18} className="text-white sm:size-[20px]" fill="currentColor" />
                </div> */}
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-black text-slate-900 tracking-tighter leading-none uppercase">
                    Saby-Tinh
                  </span>
                </div>
              </a>
              
              <NavLinks 
                categories={categories} 
                brands={brands} 
                stores={stores} 
                isScrolled={isScrolled} 
              />
            </div>

            <SearchBar isScrolled={isScrolled} />

            <div className="flex items-center gap-2 sm:gap-3">
              <UserActions userProfile={userProfile} isScrolled={isScrolled} />
              
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>
      </div>

      <MobileBottomTabs userProfile={userProfile} />

      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        userProfile={userProfile}
        categories={categories}
        brands={brands}
      />
    </>
  );
}