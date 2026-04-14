import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, User } from 'lucide-react';

export default function AppNavbar() {
  const { currentUser, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const navLinks = [
    { name: 'Home', to: '/home' },
    { name: 'Explore', to: '/explore' },
    { name: 'Profile', to: `/users/${currentUser?.username}` },
  ];

  return (
    <nav 
      className="sticky top-0 z-50 w-full border-b border-[#2a2a2a] backdrop-blur-[12px] h-[56px] md:h-[60px]"
      style={{ background: 'rgba(10, 10, 10, 0.85)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          
          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <Link to="/home" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ffffff] to-[#f5a623]">
                <span className="text-[#ffffff]">Dev</span><span className="text-[#f5a623]">Connect</span>
              </span>
            </Link>
          </div>

          {/* Center - Nav Links (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-10 h-full">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center h-full text-sm font-medium transition-colors hover:text-[#ffffff] relative ${
                    isActive ? 'text-[#f5a623]' : 'text-[#888888]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f5a623] rounded-t-sm" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right - Profile & Actions */}
          <div className="flex items-center gap-4">
            <button className="text-[#888888] hover:text-[#ffffff] transition-colors relative">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 outline-none focus:ring-2 ring-[#f5a623] rounded-full"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName || 'Avatar'}
                    className="h-[32px] w-[32px] rounded-full border-[2px] border-[#2a2a2a] object-cover"
                  />
                ) : (
                  <div className="h-[32px] w-[32px] rounded-full bg-[#222222] border-[2px] border-[#2a2a2a] flex items-center justify-center text-xs font-medium text-[#f5a623]">
                    {getInitials(currentUser?.displayName || currentUser?.username)}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-[#181818] border border-[#2a2a2a] shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-[#2a2a2a]">
                      <p className="text-sm font-medium text-[#ffffff] truncate">
                        {currentUser?.displayName || currentUser?.username}
                      </p>
                      <p className="text-xs text-[#888888] truncate">
                        @{currentUser?.username}
                      </p>
                    </div>
                    <Link
                      to={`/users/${currentUser?.username}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#888888] hover:bg-[#222222] hover:text-[#ffffff]"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#888888] hover:bg-[#222222] hover:text-[#ffffff] text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
