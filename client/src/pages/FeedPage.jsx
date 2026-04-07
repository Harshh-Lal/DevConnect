import React, { useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Telescope } from 'lucide-react';
import { Link } from 'react-router-dom';

import PostComposer from '../components/feed/PostComposer';
import PostCard from '../components/feed/PostCard';
import FeedSkeleton from '../components/feed/FeedSkeleton';
import ProfileSnapshot from '../components/sidebar/ProfileSnapshot';
import WhoToFollow from '../components/sidebar/WhoToFollow';

export default function HomePage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('following');

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setPosts([
            {
              id: Math.random().toString(),
              title: activeTab === 'for-you' ? 'Global explore post!' : 'DevConnect is finally live!',
              description: 'It took weeks of sleepless nights, but I finally shipped the first version. Built securely with React, Vite, Node and Tailwind. Let me know what you think!',
              githubUrl: 'https://github.com/react/react',
              liveUrl: 'https://react.dev',
              tags: ['React', 'Node.js', 'TailwindCSS'],
              createdAt: new Date(Date.now() - 10000000).toISOString(),
              likesCount: 142,
              commentsCount: 12,
              isLikedByMe: false,
              userId: 'dev123',
              user: {
                username: 'thecreator',
                displayName: 'The Creator',
                avatarUrl: ''
              }
            },
            {
              id: Math.random().toString(),
              title: 'A cool python script for automating boring stuff',
              description: 'Just pushed a small python utility that scrapes your favorite sites and emails you a morning brief.',
              githubUrl: 'https://github.com/python/cpython',
              tags: ['Python'],
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              likesCount: 45,
              commentsCount: 3,
              isLikedByMe: true,
              userId: 'pyfan',
              user: {
                username: 'pyfan',
                displayName: 'Py Fan',
                avatarUrl: ''
              }
            }
          ]);
          setIsLoading(false);
          return;
        }

        const endpoint = activeTab === 'for-you' ? '/posts/explore' : '/posts/feed';
        const response = await axiosInstance.get(endpoint);
        setPosts(response.data.posts || response.data);
      } catch (error) {
        console.error('Failed to load feed', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [activeTab]);

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
              className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
                activeTab === 'for-you' ? 'text-[#ffffff]' : 'text-[#666666] hover:text-[#999999]'
              }`}
            >
              For You
              {activeTab === 'for-you' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f5a623]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
                activeTab === 'following' ? 'text-[#ffffff]' : 'text-[#666666] hover:text-[#999999]'
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
              <h2 className="text-xl font-bold text-[#ffffff]">Your feed is empty</h2>
              <p className="mt-2 text-[#888888] max-w-sm">
                Follow some developers to see their projects here, or share what you're working on!
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
