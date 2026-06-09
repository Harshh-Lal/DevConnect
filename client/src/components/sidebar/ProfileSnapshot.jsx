import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProfileSnapshot() {
  const { currentUser, refreshUser } = useAuth();

  // Re-fetch current user on mount so follower/following counts are always live
  useEffect(() => {
    refreshUser();
  }, []);

  if (!currentUser) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-[20px]">
      <div className="flex flex-col items-center text-center">
        {currentUser.avatarUrl ? (
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName || 'Avatar'}
            className="h-[72px] w-[72px] rounded-full object-cover transition-shadow hover:ring-2 hover:ring-[#2a2a2a]"
          />
        ) : (
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#222222] text-2xl font-semibold text-[#f5a623] transition-shadow hover:ring-2 hover:ring-[#2a2a2a]">
            {getInitials(currentUser.displayName || currentUser.username)}
          </div>
        )}

        <h3 className="mt-[12px] text-[16px] font-semibold text-[#ffffff]">
          {currentUser.displayName || currentUser.username}
        </h3>
        <p className="text-[13px] text-[#888888]">@{currentUser.username}</p>

        {currentUser.bio && (
          <p className="mt-[8px] text-[13px] text-[#999999] line-clamp-2 px-2">
            {currentUser.bio}
          </p>
        )}

        <div className="mt-[16px] w-full border-t border-[#2a2a2a] pt-[16px] pb-[16px] flex justify-center gap-8">
          <div className="text-center">
            <p className="text-[11px] text-[#888888] mb-0.5">Followers</p>
            <p className="text-[15px] font-semibold text-[#ffffff]">
              {currentUser.followersCount ?? 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-[#888888] mb-0.5">Following</p>
            <p className="text-[15px] font-semibold text-[#ffffff]">
              {currentUser.followingCount ?? 0}
            </p>
          </div>
        </div>

        {currentUser.skills && currentUser.skills.length > 0 && (
          <div className="w-full border-t border-[#2a2a2a] pt-[16px]">
            <p className="text-[11px] text-[#888888] uppercase tracking-wider mb-3">Skills</p>
            <div className="flex flex-wrap justify-center gap-2">
              {currentUser.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1 text-[11px] text-[#cccccc] transition-colors hover:border-[#f5a623] hover:text-[#f5a623]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          to={`/users/${currentUser?.username}`}
          className="mt-6 flex w-full items-center justify-center rounded-lg border border-[#2a2a2a] bg-transparent py-2 text-sm text-[#888888] transition-colors hover:border-[#f5a623] hover:text-[#f5a623]"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
