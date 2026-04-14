import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../lib/axios';

export default function EditProfileModal({ isOpen, onClose, currentData, onProfileUpdated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentData?.displayName || '',
    bio: currentData?.bio || '',
    avatarUrl: currentData?.avatarUrl || '',
    githubUrl: currentData?.githubUrl || '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.put('/users/profile', formData);
      toast.success('Profile updated!');
      onProfileUpdated(response.data.user);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#2a2a2a] bg-[#111111] shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-4">
          <h2 className="text-lg font-bold text-[#ffffff]">Edit Profile</h2>
          <button onClick={onClose} className="text-[#888888] hover:text-[#ffffff] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#888888]">Display Name</label>
            <input
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 text-sm text-[#ffffff] focus:border-[#f5a623] focus:outline-none"
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#888888]">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 text-sm text-[#ffffff] min-h-[80px] focus:border-[#f5a623] focus:outline-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#888888]">Avatar Image URL</label>
            <input
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 text-sm text-[#ffffff] focus:border-[#f5a623] focus:outline-none"
              placeholder="https://example.com/my-photo.jpg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#888888]">GitHub URL</label>
            <input
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 text-sm text-[#ffffff] focus:border-[#f5a623] focus:outline-none"
              placeholder="https://github.com/username"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#888888] hover:text-[#ffffff]">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-lg bg-[#f5a623] px-4 py-2 text-sm font-bold text-black hover:bg-[#e09415] disabled:opacity-50">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}