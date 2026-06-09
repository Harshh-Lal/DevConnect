import { useState } from 'react';
import { api } from '../lib/api';

export default function FollowButton({ userId, initialIsFollowing, onToggle }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/users/${userId}/follow`);
        setIsFollowing(false);
      } else {
        await api.post(`/users/${userId}/follow`);
        setIsFollowing(true);
      }
      onToggle?.(); // let parent refresh counts if needed
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-50 cursor-pointer
        ${isFollowing
          ? 'bg-transparent border border-[#f5a623]/50 text-[#f5a623] hover:border-red-400/60 hover:text-red-400'
          : 'bg-[#f5a623] text-black hover:bg-[#e09415]'
        }`}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
