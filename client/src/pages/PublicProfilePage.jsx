import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import PostCard from '../components/feed/PostCard';
import { Code } from 'lucide-react';
import EditProfileModal from '../components/profile/EditProfileModal';
import FollowButton from '../components/FollowButton';
import RepoCard, { RepoCardSkeleton } from '../components/profile/RepoCard';
import { useGithubRepos } from '../hooks/useGithubRepos';

export default function PublicProfilePage() {
  const { username } = useParams();
  const { currentUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // GitHub repos — auto-fetches when profileData.githubUrl changes
  const { repos, loading: reposLoading, error: reposError, refetch: refetchRepos } = useGithubRepos(profileData?.githubUrl);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/users/${username}`);
      // getPublicProfile wraps data in { success, data: { ...user, isFollowing } }
      setProfileData(response.data.data ?? response.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Developer not found.");
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-60px)] items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-[#f5a623]" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex flex-col h-[calc(100vh-60px)] items-center justify-center bg-[#0a0a0a] text-[#ffffff]">
        <h1 className="text-2xl font-bold mb-2">404</h1>
        <p className="text-[#888888]">{error}</p>
        <Link to="/home" className="mt-4 text-[#f5a623] hover:underline">Back to Feed</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === profileData.username;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await axiosInstance.post('/github/sync');
      // Force the hook to re-fetch by calling refetch
      await refetchRepos();
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Profile Header Card */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] relative" />

          <div className="px-6 pb-6 relative">
            {/* Avatar */}
            <div className="absolute -top-12 border-4 border-[#111111] rounded-full bg-[#1f1f1f] h-24 w-24 flex items-center justify-center text-3xl font-bold text-[#f5a623] overflow-hidden">
              {profileData.avatarUrl ? (
                <img 
                  src={profileData.avatarUrl} 
                  alt={profileData.displayName || profileData.username} 
                  className="h-full w-full object-cover"
                />
              ) : (
                (profileData.displayName || profileData.username).charAt(0).toUpperCase()
              )}
            </div>

            {/* Action Button Row */}
            <div className="flex justify-end pt-4">
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="rounded-full border border-[#f5a623] text-[#f5a623] px-4 py-1.5 text-sm font-semibold hover:bg-[#f5a623]/10 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <FollowButton
                  userId={profileData.id}
                  initialIsFollowing={profileData.isFollowing}
                  onToggle={(nowFollowing) => {
                    setProfileData(prev => ({
                      ...prev,
                      isFollowing: nowFollowing,
                      _count: {
                        ...prev._count,
                        followers: prev._count.followers + (nowFollowing ? 1 : -1)
                      }
                    }));
                  }}
                />
              )}
            </div>

            {/* User Info */}
            <div className="mt-2">
              <h1 className="text-2xl font-bold text-[#ffffff]">{profileData.displayName || profileData.username}</h1>
              <p className="text-[#888888]">@{profileData.username}</p>
            </div>

            {profileData.bio && (
              <p className="mt-3 text-sm text-[#cccccc] whitespace-pre-wrap">{profileData.bio}</p>
            )}

            {profileData.skills && profileData.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {profileData.skills.map(skill => (
                  <span key={skill} className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-xs text-[#aaaaaa] hover:border-[#f5a623] hover:text-[#f5a623] transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {profileData.githubUrl && (
              <a
                href={profileData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-2 text-sm font-medium text-[#555555] hover:text-[#f5a623] transition-colors w-fit"
              >
                <Code className="h-4 w-4" />
                github.com/{profileData.githubUrl.split('/').pop()}
              </a>
            )}

            {/* Stats Row */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#888888]">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Joined {format(new Date(profileData.createdAt), 'MMMM yyyy')}
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#ffffff]">{profileData.posts?.length ?? profileData._count?.posts ?? 0}</span> Projects Built
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#ffffff]">{profileData._count?.followers ?? 0}</span> Followers
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#ffffff]">{profileData._count?.following ?? 0}</span> Following
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Repositories Section */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#888888] fill-current" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <h2 className="text-base font-bold text-[#ffffff]">GitHub Repositories</h2>
            </div>
            {isOwnProfile && profileData.githubUrl && (
              <button
                onClick={handleSync}
                disabled={syncing || reposLoading}
                className="flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#f5a623] transition-colors disabled:opacity-40"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing…' : 'Sync'}
              </button>
            )}
          </div>

          {/* Loading skeletons */}
          {reposLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => <RepoCardSkeleton key={i} />)}
            </div>
          )}

          {/* Error state */}
          {!reposLoading && reposError && (
            <p className="text-sm text-[#555555] py-4">
              {reposError === 'GitHub user not found'
                ? 'GitHub username not found — check your profile settings.'
                : reposError}
            </p>
          )}

          {/* Empty states */}
          {!reposLoading && !reposError && repos.length === 0 && (
            <p className="text-sm text-[#555555] py-4">
              {profileData.githubUrl
                ? 'No public repositories found.'
                : isOwnProfile
                  ? 'Add your GitHub URL in Edit Profile to show your repos here.'
                  : 'This developer hasn\'t linked a GitHub profile.'}
            </p>
          )}

          {/* Repo grid */}
          {!reposLoading && repos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {repos.map(repo => <RepoCard key={repo.name} repo={repo} />)}
            </div>
          )}
        </div>

        {/* User's Timeline */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#ffffff] pb-2 border-b border-[#2a2a2a]">
            Projects by {profileData.displayName || profileData.username}
          </h2>

          {profileData.posts.length === 0 ? (
            <p className="text-[#555555] text-center py-8">This developer hasn't posted any projects yet.</p>
          ) : (
            profileData.posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onPostDeleted={() => window.location.reload()}
              />
            ))
          )}
        </div>

      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentData={profileData}
        onProfileUpdated={(updatedData) => {
          setProfileData({ ...profileData, ...updatedData });
        }}
      />

    </div>
  );
}