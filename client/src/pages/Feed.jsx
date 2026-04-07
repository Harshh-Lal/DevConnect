import React from 'react';

export default function Feed() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f0f0f0] flex flex-col items-center pt-20">
      <h1 className="text-3xl font-bold mb-4">
        <span className="text-[#f5a623]">Developer</span> Feed
      </h1>
      <p className="text-[#888888]">Welcome to the inside of DevConnect. The vault is open.</p>
      
      {/* A sleek placeholder card */}
      <div className="mt-8 w-full max-w-2xl bg-[#111] border border-[#2a2a2a] rounded-lg p-6 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700"></div>
          <div>
            <h3 className="font-semibold">Alex Johnson</h3>
            <p className="text-xs text-zinc-500">Just joined DevConnect</p>
          </div>
        </div>
        <p className="text-sm text-zinc-300">Excited to start sharing my projects here!</p>
      </div>
    </div>
  );
}