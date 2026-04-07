import React from 'react';
import { useParams } from 'react-router-dom';

export default function PublicProfilePage() {
  const { username } = useParams();
  
  return (
    <div className="flex h-full items-center justify-center p-8 text-[#888888]">
      <h2 className="text-xl">Profile for @{username} coming soon</h2>
    </div>
  );
}
