import React from 'react';
import { Star, GitFork, ExternalLink } from 'lucide-react';

// GitHub's canonical language colors
const LANGUAGE_COLORS = {
  JavaScript:  '#f7df1e',
  TypeScript:  '#3178c6',
  Python:      '#3572A5',
  Go:          '#00ADD8',
  Rust:        '#dea584',
  Java:        '#b07219',
  CSS:         '#563d7c',
  HTML:        '#e34c26',
  Vue:         '#41b883',
  Svelte:      '#ff3e00',
  Ruby:        '#701516',
  PHP:         '#4F5D95',
  'C++':       '#f34b7d',
  'C#':        '#178600',
  Shell:       '#89e051',
  Kotlin:      '#A97BFF',
  Swift:       '#F05138',
  Dart:        '#00B4AB',
};

export default function RepoCard({ repo }) {
  const langColor = LANGUAGE_COLORS[repo.language] || '#8b949e';

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 rounded-xl border border-[#2a2a2a] bg-[#111111] p-4 hover:border-[#f5a623]/40 hover:bg-[#141414] transition-all duration-200"
    >
      {/* Top row — name + external link icon */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-[#ffffff] group-hover:text-[#f5a623] transition-colors truncate leading-tight">
          {repo.name}
        </span>
        <ExternalLink className="h-3.5 w-3.5 text-[#555555] group-hover:text-[#f5a623] transition-colors flex-shrink-0 mt-0.5" />
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-xs text-[#888888] line-clamp-2 leading-relaxed">
          {repo.description}
        </p>
      )}

      {/* Footer — language, stars, forks */}
      <div className="flex items-center gap-4 mt-auto pt-1 text-xs text-[#555555]">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {repo.forks}
        </span>
      </div>
    </a>
  );
}

/** Skeleton placeholder for loading state */
export function RepoCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4 animate-pulse space-y-2">
      <div className="h-3.5 w-2/3 rounded bg-[#1f1f1f]" />
      <div className="h-3 w-full rounded bg-[#1f1f1f]" />
      <div className="h-3 w-4/5 rounded bg-[#1f1f1f]" />
      <div className="flex gap-3 mt-2">
        <div className="h-3 w-12 rounded bg-[#1f1f1f]" />
        <div className="h-3 w-8 rounded bg-[#1f1f1f]" />
        <div className="h-3 w-8 rounded bg-[#1f1f1f]" />
      </div>
    </div>
  );
}
