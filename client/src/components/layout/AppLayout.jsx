import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, Compass, Plus, User } from 'lucide-react';
import AppNavbar from './AppNavbar';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { currentUser } = useAuth();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ffffff] relative">
      <AppNavbar />
      <main className="mx-auto w-full pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-[#2a2a2a] h-[56px] flex items-center justify-around px-2">
        <NavLink 
          to="/home" 
          className={({ isActive }) => `p-2 ${isActive ? 'text-[#f5a623]' : 'text-[#555555]'}`}
        >
          <Home className="w-6 h-6" />
        </NavLink>
        <NavLink 
          to="/explore"
          className={({ isActive }) => `p-2 ${isActive ? 'text-[#f5a623]' : 'text-[#555555]'}`}
        >
          <Compass className="w-6 h-6" />
        </NavLink>
        
        <Link 
          to="/home" 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#f5a623] text-[#000000] shadow-[0_4px_12px_rgba(245,166,35,0.2)] hover:bg-[#e09415] transition-colors"
        >
          <Plus className="w-6 h-6" />
        </Link>
        
        <NavLink 
          to={`/users/${currentUser?.username}`}
          className={({ isActive }) => `p-2 ${isActive ? 'text-[#f5a623]' : 'text-[#555555]'}`}
        >
          <User className="w-6 h-6" />
        </NavLink>
      </div>
    </div>
  );
}
