import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { Loader2, Search, Users } from 'lucide-react';
import FollowButton from '../components/FollowButton';
import { useAuth } from '../context/AuthContext';

const PRESET_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL',
  'MongoDB', 'Express', 'Next.js', 'Vue', 'Docker',
  'AWS', 'GraphQL', 'Prisma', 'TailwindCSS', 'Java', 'Go',
];

function getInitials(name) {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
}

export default function ExplorePage() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce text search by 400ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSkills.length > 0) params.set('skills', selectedSkills.join(','));
      if (debouncedSearch) params.set('q', debouncedSearch);

      const response = await axiosInstance.get(`/users/search?${params.toString()}`);
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSkills, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div
      className="min-h-[calc(100vh-60px)] py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#ffffff] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#f5a623]" />
            Explore Developers
          </h1>
          <p className="text-[#888888] text-sm mt-1">Find developers by skill or name</p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search by name or username..."
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111111] pl-10 pr-4 py-3 text-sm text-[#ffffff] placeholder:text-[#555555] focus:border-[#f5a623] focus:outline-none transition-colors"
          />
        </div>

        {/* Skill filter chips */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
          <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-3">Filter by Skill</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_SKILLS.map(skill => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                    active
                      ? 'bg-[rgba(245,166,35,0.15)] border-[#f5a623] text-[#f5a623]'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a] hover:text-[#cccccc]'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
          {selectedSkills.length > 0 && (
            <button
              onClick={() => setSelectedSkills([])}
              className="mt-3 text-xs text-[#555555] hover:text-[#f5a623] transition-colors"
            >
              Clear filters ×
            </button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => <UserCardSkeleton key={i} />)}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] py-16 text-center">
            <p className="text-[#555555]">No developers found{selectedSkills.length > 0 ? ' with those skills' : ''}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.map(user => (
              <UserCard key={user.id} user={user} currentUser={currentUser} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function UserCard({ user, currentUser }) {
  const isOwnProfile = currentUser?.id === user.id;
  const overflowSkills = user.skills?.slice(5) || [];
  const [followersCount, setFollowersCount] = useState(user._count?.followers ?? 0);

  const handleFollowToggle = (nowFollowing) => {
    setFollowersCount(prev => nowFollowing ? prev + 1 : Math.max(0, prev - 1));
  };

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 flex flex-col gap-3 hover:border-[#3a3a3a] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/users/${user.username}`} className="flex items-center gap-3 min-w-0">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.displayName} className="h-11 w-11 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="h-11 w-11 rounded-full bg-[#222222] flex items-center justify-center text-lg font-bold text-[#f5a623] flex-shrink-0">
              {getInitials(user.displayName || user.username)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-[#ffffff] text-sm truncate hover:underline">
              {user.displayName || user.username}
            </p>
            <p className="text-xs text-[#666666] truncate">@{user.username}</p>
          </div>
        </Link>

        {!isOwnProfile && (
          <FollowButton
            userId={user.id}
            initialIsFollowing={user.isFollowing}
            onToggle={handleFollowToggle}
          />
        )}
      </div>

      {user.bio && (
        <p className="text-xs text-[#888888] line-clamp-2">{user.bio}</p>
      )}

      {user.skills && user.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {user.skills.slice(0, 5).map(skill => (
            <span key={skill} className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-0.5 text-[10px] text-[#888888]">
              {skill}
            </span>
          ))}
          {overflowSkills.length > 0 && (
            <span
              title={overflowSkills.join(', ')}
              className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-0.5 text-[10px] text-[#555555] cursor-default"
            >
              +{overflowSkills.length}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-4 text-xs text-[#555555] pt-1 border-t border-[#1f1f1f]">
        <span><strong className="text-[#888888]">{followersCount}</strong> Followers</span>
        <span><strong className="text-[#888888]">{user._count?.posts ?? 0}</strong> Projects</span>
      </div>
    </div>
  );
}
function UserCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-[#1f1f1f] flex-shrink-0" />
          <div className="flex flex-col gap-2 pt-1">
            <div className="h-3 w-24 bg-[#1f1f1f] rounded" />
            <div className="h-2 w-16 bg-[#1f1f1f] rounded" />
          </div>
        </div>
        <div className="h-8 w-20 bg-[#1f1f1f] rounded-md" />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-2 w-full bg-[#1f1f1f] rounded" />
        <div className="h-2 w-2/3 bg-[#1f1f1f] rounded" />
      </div>
      <div className="flex gap-2 mt-2">
        <div className="h-5 w-12 bg-[#1f1f1f] rounded-full" />
        <div className="h-5 w-16 bg-[#1f1f1f] rounded-full" />
      </div>
      <div className="flex gap-4 pt-3 border-t border-[#1f1f1f] mt-1">
        <div className="h-3 w-20 bg-[#1f1f1f] rounded" />
        <div className="h-3 w-20 bg-[#1f1f1f] rounded" />
      </div>
    </div>
  );
}
