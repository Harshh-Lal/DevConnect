import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import { Loader2 } from 'lucide-react';

export default function WhoToFollow() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setUsers([
            { id: '1', username: 'janesmith', displayName: 'Jane Smith', skills: ['Python', 'Django'] },
            { id: '2', username: 'bobd', displayName: 'Bob Developer', skills: ['React', 'Next.js'] },
            { id: '3', username: 'alicelee', displayName: 'Alice Lee', skills: ['Go', 'Docker'] },
          ]);
          setIsLoading(false);
          return;
        }

        const response = await axiosInstance.get('/users/suggestions');
        setUsers(response.data.users || response.data);
      } catch (error) {
        console.error('Failed to fetch user suggestions', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-[20px] space-y-4">
        <h3 className="text-[15px] font-semibold text-[#ffffff] mb-4">Who to follow</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse py-2">
            <div className="h-10 w-10 rounded-full bg-[#1f1f1f]"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 rounded bg-[#1f1f1f]"></div>
              <div className="h-3 w-16 rounded bg-[#1f1f1f]"></div>
            </div>
            <div className="h-6 w-16 rounded-full bg-[#1f1f1f]"></div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-[20px]">
      <h3 className="mb-4 text-[15px] font-semibold text-[#ffffff]">Who to follow</h3>
      
      <div className="flex flex-col">
        {users.map((user, idx) => (
          <React.Fragment key={user.id}>
            <UserSuggestionCard user={user} />
            {idx !== users.length - 1 && (
              <div className="h-[1px] w-full bg-[#1f1f1f] my-1" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4 pt-2">
        <Link
          to="/explore"
          className="text-[13px] text-[#f5a623] hover:underline transition-colors"
        >
          Explore all developers &rarr;
        </Link>
      </div>
    </div>
  );
}

function UserSuggestionCard({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleFollow = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const prevFollowing = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return;
      }
      if (!prevFollowing) {
        await axiosInstance.post(`/users/${user.id}/follow`);
      } else {
        await axiosInstance.delete(`/users/${user.id}/follow`);
      }
    } catch (error) {
      setIsFollowing(prevFollowing);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 py-3 group">
      <div className="flex items-center gap-3 overflow-hidden">
        <Link to={`/users/${user.username}`}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="h-[40px] w-[40px] flex-shrink-0 rounded-full object-cover transition-shadow group-hover:ring-2 group-hover:ring-[#2a2a2a]"
            />
          ) : (
            <div className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full bg-[#222222] font-semibold text-[#f5a623] transition-shadow group-hover:ring-2 group-hover:ring-[#2a2a2a]">
              {getInitials(user.displayName || user.username)}
            </div>
          )}
        </Link>
        <div className="min-w-0">
          <Link to={`/users/${user.username}`} className="truncate text-[14px] font-medium text-[#ffffff] hover:underline block">
            {user.displayName || user.username}
          </Link>
          <Link to={`/users/${user.username}`} className="truncate text-[12px] text-[#666666] block hover:text-[#888888] transition-colors">
            @{user.username}
          </Link>
          
          {user.skills && user.skills.length > 0 && (
            <div className="mt-[4px] flex gap-1.5 overflow-hidden">
              {user.skills.slice(0, 2).map((skill) => (
                <span key={skill} className="truncate rounded border border-[#2a2a2a] bg-[#1a1a1a] px-1.5 py-[1px] text-[10px] text-[#888888]">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleFollow}
        disabled={isLiking}
        className={`flex-shrink-0 rounded-full px-4 py-1 flex items-center justify-center text-[13px] transition-colors min-w-[80px] ${
          isFollowing
            ? 'bg-[rgba(245,166,35,0.1)] border border-[#f5a623] text-[#f5a623]'
            : 'bg-transparent border border-[#2a2a2a] text-[#ffffff] hover:border-[#f5a623] hover:text-[#f5a623]'
        }`}
      >
        {isLiking ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}
