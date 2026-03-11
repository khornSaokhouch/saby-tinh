'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import Sub-Components
import SettingsHeader from './SettingsHeader';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import AppearanceSection from './AppearanceSection';
import RegionalSection from './RegionalSection';
import AccountRoleSection from './AccountRoleSection';

export default function SettingsPage() {
  const { user, fetchProfile, loading, updateProfile } = useUserStore();
  
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    bio: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        password: '',
        bio: user.profile?.bio || '' 
      });

      if (user.profile?.image_profile) {
        setImagePreview(user.profile.image_profile);
      }
    }
  }, [user]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email); // Only if your backend allows email updates
      
      if (formData.phone_number) data.append('phone_number', formData.phone_number);
      if (formData.bio) data.append('bio', formData.bio);
      if (formData.password && formData.password.length >= 6) {
        data.append('password', formData.password);
      }
      if (imageFile) {
        data.append('image_profile', imageFile); 
      }

      if (updateProfile && user?.id) {
        await updateProfile(user.id, data);
        toast.success('Profile updated');
        setFormData(prev => ({ ...prev, password: '' })); // Clear password on success
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error('Could not save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !user) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6 pb-20 font-sans max-w-[1400px] mx-auto pt-4 animate-in fade-in duration-500">
      
      <SettingsHeader isSaving={isSaving} onSave={handleSave} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          <ProfileSection 
            user={user}
            formData={formData}
            imagePreview={imagePreview}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
          />
          <NotificationSection />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <AppearanceSection />
          <RegionalSection />
          <AccountRoleSection role={user?.role} />
        </div>

      </div>
    </div>
  );
}