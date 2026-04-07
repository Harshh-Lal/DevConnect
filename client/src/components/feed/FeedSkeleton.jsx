import React from 'react';

export default function FeedSkeleton() {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#1f1f1f]"></div>
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 w-32 animate-pulse rounded bg-[#1f1f1f]"></div>
          <div className="h-3 w-24 animate-pulse rounded bg-[#1f1f1f]"></div>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#1f1f1f]"></div>
        <div className="h-4 w-full animate-pulse rounded bg-[#1f1f1f]"></div>
        <div className="h-4 w-5/6 animate-pulse rounded bg-[#1f1f1f]"></div>
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-[#1f1f1f]"></div>
        <div className="h-5 w-20 animate-pulse rounded-full bg-[#1f1f1f]"></div>
      </div>
      <div className="mt-6 flex gap-6 border-t border-[#1f1f1f] pt-4">
        <div className="h-5 w-12 animate-pulse rounded bg-[#1f1f1f]"></div>
        <div className="h-5 w-12 animate-pulse rounded bg-[#1f1f1f]"></div>
      </div>
    </div>
  );
}
