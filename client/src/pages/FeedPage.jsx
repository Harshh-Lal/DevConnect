import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Telescope, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import PostComposer from '../components/feed/PostComposer';
import PostCard from '../components/feed/PostCard';
import FeedSkeleton from '../components/feed/FeedSkeleton';
import ProfileSnapshot from '../components/sidebar/ProfileSnapshot';
import WhoToFollow from '../components/sidebar/WhoToFollow';

export default function HomePage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  //two seperate loading states for better ux
  const [isLoading, setIsLoading] = useState(true); //for initial page loading
  const [isFetchingMore, setIsFetchingMore] = useState(false); // for scrolling 

  const [activeTab, setActiveTab] = useState('following');

  const fetchFeed = async (cursor = null) => {
    if (!cursor) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      // if (import.meta.env.DEV && !cursor) {
      //   await new Promise(resolve => setTimeout(resolve, 800));
      //   setPosts([]);
      //   setIsLoading(false);
      //   setHasMore(false);
      //   return;
      // }

      const endpoint = activeTab === 'for-you' ? '/posts/explore' : '/posts/feed';
      const params = cursor ? `?cursor=${cursor}&limit=5` : '?limit=5';
      const response = await axiosInstance.get(`${endpoint}${params}`);

      const newPosts = response.data.posts || response.data;
      const newCursor = response.data.nextCursor || null;
      // const response = await axiosInstance.get(endpoint);

      if (cursor) {
        setPosts((prev) => [...prev, ...newPosts]); // Scrolling: Add to bottom
      } else {
        setPosts(newPosts); // Initial load: Replace everything
      }

      setNextCursor(newCursor);
      setHasMore(newCursor !== null && newPosts.length > 0);

    } catch (error) {
      console.error('Failed to load feed', error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setNextCursor(null);
    setHasMore(true);
    fetchFeed(null);
  }, [activeTab]);


  const observer = useRef();

  const lastPostElementRef = useCallback((node) => {
    // Stop if we are currently loading something
    if (isLoading || isFetchingMore) return;

    // Disconnect the old observer
    if (observer.current) observer.current.disconnect();

    // Create a new observer
    observer.current = new IntersectionObserver(entries => {
      // If the user scrolls to the bottom AND there is more data in the database
      if (entries[0].isIntersecting && hasMore) {
        fetchFeed(nextCursor);
      }
    });

    if (node) observer.current.observe(node);

  }, [isLoading, isFetchingMore, hasMore, nextCursor]);

  // Handlers 
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <div
      className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-60px)] py-6 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-[1fr_260px] lg:grid-cols-[260px_1fr_300px]">

        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden lg:block relative">
          <div className="sticky" style={{ top: 'calc(60px + 16px)' }}>
            <ProfileSnapshot />
          </div>
        </div>

        {/* Center Feed */}
        <div className="mx-auto w-full max-w-2xl md:max-w-none">
          <PostComposer onPostCreated={handlePostCreated} />

          {/* Feed/Home Tab Switcher */}
          <div className="mb-6 flex border-b border-[#2a2a2a] mt-6">
            <button
              onClick={() => setActiveTab('for-you')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${activeTab === 'for-you' ? 'text-[#ffffff]' : 'text-[#666666] hover:text-[#999999]'
                }`}
            >
              For You
              {activeTab === 'for-you' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f5a623]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${activeTab === 'following' ? 'text-[#ffffff]' : 'text-[#666666] hover:text-[#999999]'
                }`}
            >
              Following
              {activeTab === 'following' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f5a623]" />
              )}
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <FeedSkeleton />
              <FeedSkeleton />
              <FeedSkeleton />
            </div>
          ) : posts.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#111111] py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#181818] border border-[#2a2a2a] mb-4">
                <Telescope className="h-8 w-8 text-[#f5a623]" />
              </div>
              <p className="text-lg font-medium text-[#ffffff] max-w-sm">
                Your feed is empty — follow some developers to see their work here
              </p>
              <Link
                to="/explore"
                className="mt-6 rounded-lg bg-[#f5a623] px-6 py-2.5 font-semibold text-[#000000] transition-colors hover:bg-[#e09415]"
              >
                Explore Developers
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onPostDeleted={handlePostDeleted}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar (Tablet & Desktop) */}
        <div className="hidden md:block relative">
          <div className="sticky" style={{ top: 'calc(60px + 16px)' }}>
            <WhoToFollow />
            <div className="mt-6 text-xs text-[#555555] px-2 text-center pb-8">
              &copy; {new Date().getFullYear()} DevConnect
              <div className="mt-2 flex justify-center space-x-3">
                <a href="#" className="hover:underline">About</a>
                <a href="#" className="hover:underline">Help</a>
                <a href="#" className="hover:underline">Privacy</a>
                <a href="#" className="hover:underline">Terms</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
