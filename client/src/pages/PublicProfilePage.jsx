import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import PostCard from '../components/feed/PostCard';
import { Code } from 'lucide-react'; // Ensure Github is imported!
import EditProfileModal from '../components/profile/EditProfileModal'; // Import our new modal

export default function PublicProfilePage() {
  const { username } = useParams(); // Grabs "harsh" from /users/harsh
  const { currentUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/users/${username}`);
        setProfileData(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Developer not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

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

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Profile Header Card */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] relative">
            {/* We can add a banner image feature later! */}
          </div>

          <div className="px-6 pb-6 relative">
            {/* Avatar */}
            <div className="absolute -top-12 border-4 border-[#111111] rounded-full bg-[#1f1f1f] h-24 w-24 flex items-center justify-center text-3xl font-bold text-[#f5a623]">
              {(profileData.displayName || profileData.username).charAt(0).toUpperCase()}
            </div>

            {/* Edit Profile Button (Only shows if it's YOUR profile) */}
            <div className="flex justify-end pt-4">
              {isOwnProfile ? (
                <button onClick={() => setIsEditModalOpen(true)} className="rounded-full border border-[#f5a623] text-[#f5a623] px-4 py-1.5 text-sm font-semibold hover:bg-[#f5a623]/10 transition-colors">
                  Edit Profile
                </button>
              ) : (
                <button className="rounded-full bg-[#f5a623] text-black px-4 py-1.5 text-sm font-semibold hover:bg-[#e09415] transition-colors">
                  Follow
                </button>
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

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#888888]">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Joined {format(new Date(profileData.createdAt), 'MMMM yyyy')}
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#ffffff]">{profileData._count.posts}</span> Projects Built
              </div>
            </div>
          </div>
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
                // Note: If they delete a post here, you might want to refresh the profile data or handle state!
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
          // Instantly update the UI with the new data without reloading the page!
          setProfileData({ ...profileData, ...updatedData });
        }}
      />

    </div>
  );
}