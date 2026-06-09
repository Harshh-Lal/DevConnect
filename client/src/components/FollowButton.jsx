import { useState } from 'react';
import { api } from '../lib/api';
import { Check, UserPlus, UserMinus, Loader2 } from 'lucide-react';

export default function FollowButton({ userId, initialIsFollowing, onToggle }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/users/${userId}/follow`);
        setIsFollowing(false);
        onToggle?.(false); // pass new state to parent
      } else {
        await api.post(`/users/${userId}/follow`);
        setIsFollowing(true);
        onToggle?.(true); // pass new state to parent
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Not following ──────────────────────────────────────────────
  if (!isFollowing) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-[#f5a623] text-black hover:bg-[#e09415] transition-all duration-200 disabled:opacity-50 cursor-pointer flex-shrink-0"
      >
        {loading
          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
          : <UserPlus className="h-3.5 w-3.5" />
        }
        Follow
      </button>
    );
  }

  // ── Already following — show ✓ Following, switch to Unfollow on hover ──
  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 disabled:opacity-50 cursor-pointer flex-shrink-0 min-w-[110px] justify-center ${
        isHovering
          ? 'border-red-500/60 text-red-400 bg-red-500/10'
          : 'border-[#f5a623]/50 text-[#f5a623] bg-transparent'
      }`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isHovering ? (
        <>
          <UserMinus className="h-3.5 w-3.5" />
          Unfollow
        </>
      ) : (
        <>
          <Check className="h-3.5 w-3.5" />
          Following
        </>
      )}
    </button>
  );
}
