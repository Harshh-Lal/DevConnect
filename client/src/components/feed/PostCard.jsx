import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Code, ExternalLink, Trash2 } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import { toast } from 'react-hot-toast';
import CommentSection from './CommentSection';

const getTechChipClass = (tag) => {
  const base = "px-2 py-0.5 text-[11px] rounded-full border bg-[#1a1a1a] "
  switch (tag.toLowerCase()) {
    case 'react': return base + "border-[rgba(6,182,212,0.3)] text-[#06b6d4]";
    case 'node.js': return base + "border-[rgba(34,197,94,0.3)] text-[#22c55e]";
    case 'typescript': return base + "border-[rgba(99,102,241,0.3)] text-[#6366f1]";
    case 'python': return base + "border-[rgba(234,179,8,0.3)] text-[#eab308]";
    default: return base + "border-[#2a2a2a] text-[#888888]";
  }
};

export default function PostCard({ post, currentUser, onPostDeleted }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const postOwner = post.author || post.user || { username: 'Unknown' };
  const ownerId = post.authorId || post.userId;

  const initialIsLiked = post.likes?.some(like => like.userId === currentUser?.id) || false;
  const initialComments = post._count?.comments || post.commentsCount || 0;

  const postDescription = post.description || post.content || '';

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(post._count?.likes ?? post.likesCount ?? 0);
  const [commentCount, setCommentCount] = useState(post._count?.comments ?? post.commentsCount ?? 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleToggleLike = async () => {
    if (isLiking) return;

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiking(true);

    try {
      await axiosInstance.post(`/posts/${post.id}/like`);
    } catch (error) {
      setIsLiked(isLiked);
      setLikeCount(post._count?.likes ?? post.likesCount ?? 0);
      toast.error('Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/posts/${post.id}`);
      toast.success('Post deleted');
      onPostDeleted(post.id);
    } catch (error) {
      toast.error('Failed to delete post');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const hasLongDescription = postDescription.length > 150;

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 transition-colors hover:bg-[#141414] hover:border-[#333333]">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/users/${postOwner.username}`}>
            {postOwner.avatarUrl ? (
              <img src={postOwner.avatarUrl} alt={postOwner.displayName} className="h-[40px] w-[40px] rounded-full object-cover" />
            ) : (
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#1f1f1f] text-sm font-medium text-[#f5a623]">
                {getInitials(postOwner.displayName || postOwner.username)}
              </div>
            )}
          </Link>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <Link to={`/users/${postOwner.username}`} className="text-[14px] font-semibold text-[#ffffff] hover:underline">
                {postOwner.displayName || postOwner.username}
              </Link>
              <span className="text-[13px] text-[#666666]">@{postOwner.username}</span>
              <span className="text-[12px] text-[#555555]">· {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Just Now'}</span>
            </div>
          </div>
        </div>

        {/* Delete Options */}
        {currentUser && ownerId === currentUser.id && (
          <div className="relative z-10">
            {showDeleteConfirm ? (
              <div className="absolute right-0 top-0 flex items-center gap-2 rounded-md bg-[#181818] border border-[#2a2a2a] p-1 shadow-md whitespace-nowrap">
                <span className="pl-2 text-xs text-[#888888]">Delete post?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded px-2 py-1 text-xs font-semibold text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="rounded px-2 py-1 text-xs font-semibold text-[#888888] hover:text-[#ffffff] transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-[#555555] hover:text-[#ffffff] transition-colors p-1"
                aria-label="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="mt-4">
        {post.title && <h2 className="text-[16px] font-semibold text-[#ffffff] mb-[6px]">{post.title}</h2>}
        <div className="text-[#aaaaaa] text-[14px] whitespace-pre-wrap leading-[1.6]">
          {isExpanded || !hasLongDescription
            ? postDescription
            : `${postDescription.substring(0, 150)}...`}

          {hasLongDescription && (
            <span
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-[13px] text-[#f5a623] cursor-pointer hover:underline"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </span>
          )}
        </div>
      </div>

      {/* Tech Stack Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 5).map((tag) => (
            <span key={tag} className={getTechChipClass(tag)}>
              {tag}
            </span>
          ))}
          {post.tags.length > 5 && (
            <span className={getTechChipClass('default')}>
              +{post.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Links Row */}
      {(post.githubUrl || post.liveUrl) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {post.githubUrl && (
            <a
              href={post.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded bg-transparent border border-[#2a2a2a] px-3 py-1.5 text-sm font-medium text-[#555555] hover:text-[#ffffff] hover:border-[#3a3a3a] transition-colors"
            >
              <Code className="h-4 w-4" />
              GitHub
            </a>
          )}
          {post.liveUrl && (
            <a
              href={post.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded bg-transparent border border-[#2a2a2a] px-3 py-1.5 text-sm font-medium text-[#555555] hover:text-[#ffffff] hover:border-[#3a3a3a] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      )}

      {/* Actions Row */}
      <div className="mt-5 border-t border-[#1f1f1f] pt-4">
        <div className="flex gap-6">
          <button
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 transition-colors group ${isLiked
                ? 'text-[#ef4444]'
                : 'text-[#666666] hover:text-[#ef4444]'
              }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className={`text-[13px] font-medium ${isLiked ? 'text-[#ef4444]' : 'text-[#888888] group-hover:text-[#ef4444]'}`}>
              {likeCount}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 transition-colors group ${showComments ? 'text-[#f5a623]' : 'text-[#666666] hover:text-[#f5a623]'
              }`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className={`text-[13px] font-medium ${showComments ? 'text-[#f5a623]' : 'text-[#888888] group-hover:text-[#f5a623]'}`}>
              {commentCount}
            </span>
          </button>
        </div>
      </div>

      {/* Comment Section */}
      {showComments && (
        <CommentSection postId={post.id} setCommentCount={setCommentCount} />
      )}

    </div>
  );
}
