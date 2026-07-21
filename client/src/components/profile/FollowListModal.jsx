import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, UserPlus, Check, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

// ── Inline mini follow button (self-contained state) ─────────────────────────
function MiniFollowButton({ userId, initialIsFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovering, setIsHovering] = useState(false);
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isFollowing) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#f5a623] text-black hover:bg-[#e09415] transition-all duration-150 disabled:opacity-50 cursor-pointer flex-shrink-0"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserPlus className="h-3 w-3" />}
        Follow
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 disabled:opacity-50 cursor-pointer flex-shrink-0 min-w-[90px] justify-center ${
        isHovering
          ? 'border-red-500/60 text-red-400 bg-red-500/10'
          : 'border-[#f5a623]/50 text-[#f5a623] bg-transparent'
      }`}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isHovering ? (
        <><UserMinus className="h-3 w-3" /> Unfollow</>
      ) : (
        <><Check className="h-3 w-3" /> Following</>
      )}
    </button>
  );
}

// ── User row skeleton ─────────────────────────────────────────────────────────
function UserRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-[#222] flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-32 rounded bg-[#222]" />
        <div className="h-2.5 w-20 rounded bg-[#1a1a1a]" />
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
/**
 * FollowListModal
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - userId: string   — the profile whose lists to fetch
 *  - initialTab: 'followers' | 'following'
 *  - followerCount: number
 *  - followingCount: number
 */
export default function FollowListModal({
  isOpen,
  onClose,
  userId,
  initialTab = 'followers',
  followerCount = 0,
  followingCount = 0,
}) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [lists, setLists] = useState({ followers: null, following: null });
  const [loading, setLoading] = useState(false);

  // Sync tab when parent changes initialTab
  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Fetch the active tab's list (cache once fetched)
  const fetchTab = useCallback(async (tab) => {
    if (!userId || lists[tab] !== null) return; // already cached
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/users/${userId}/${tab}`);
      setLists(prev => ({ ...prev, [tab]: res.data.data ?? [] }));
    } catch (err) {
      console.error(`Failed to fetch ${tab}:`, err);
      setLists(prev => ({ ...prev, [tab]: [] }));
    } finally {
      setLoading(false);
    }
  }, [userId, lists]);

  // Fetch on open / tab switch
  useEffect(() => {
    if (isOpen && userId) fetchTab(activeTab);
  }, [isOpen, activeTab, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset cache when modal closes so it re-fetches fresh data next open
  useEffect(() => {
    if (!isOpen) setLists({ followers: null, following: null });
  }, [isOpen]);

  const currentList = lists[activeTab];
  const tabs = [
    { key: 'followers', label: 'Followers', count: followerCount },
    { key: 'following', label: 'Following', count: followingCount },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="follow-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-[4px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal card */}
          <motion.div
            key="follow-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-sm pointer-events-auto bg-[#111] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: '70vh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-0 flex-shrink-0">
                <span className="text-sm font-semibold text-[#f0f0f0] font-sans">Connections</span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md text-[#555] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#2a2a2a] mt-3 flex-shrink-0">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2.5 text-xs font-semibold font-sans transition-colors relative ${
                      activeTab === tab.key
                        ? 'text-[#f0f0f0]'
                        : 'text-[#555] hover:text-[#888]'
                    }`}
                  >
                    {tab.count.toLocaleString()} {tab.label}
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="follow-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f5a623]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 py-1">
                {/* Loading */}
                {loading && (
                  <div className="space-y-0.5">
                    {[...Array(5)].map((_, i) => <UserRowSkeleton key={i} />)}
                  </div>
                )}

                {/* Users */}
                {!loading && currentList && currentList.length > 0 && (
                  <ul>
                    {currentList.map(user => (
                      <li key={user.id}>
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1a1a] transition-colors">
                          {/* Avatar */}
                          <Link
                            to={`/users/${user.username}`}
                            onClick={onClose}
                            className="flex-shrink-0"
                          >
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.displayName || user.username}
                                className="h-10 w-10 rounded-full border border-[#2a2a2a] object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full border border-[#2a2a2a] bg-[#222] flex items-center justify-center text-sm font-bold text-[#f5a623]">
                                {(user.displayName || user.username).charAt(0).toUpperCase()}
                              </div>
                            )}
                          </Link>

                          {/* Name + username */}
                          <Link
                            to={`/users/${user.username}`}
                            onClick={onClose}
                            className="flex-1 min-w-0"
                          >
                            <p className="text-sm font-semibold text-[#f0f0f0] truncate">
                              {user.displayName || user.username}
                            </p>
                            <p className="text-xs text-[#555] truncate">@{user.username}</p>
                          </Link>

                          {/* Follow button — hide for own account */}
                          {currentUser && currentUser.id !== user.id && (
                            <MiniFollowButton
                              userId={user.id}
                              initialIsFollowing={user.isFollowing ?? false}
                            />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Empty state */}
                {!loading && currentList && currentList.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <p className="text-sm text-[#555] font-sans">
                      {activeTab === 'followers'
                        ? 'No followers yet.'
                        : 'Not following anyone yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
