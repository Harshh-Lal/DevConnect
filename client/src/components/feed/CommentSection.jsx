import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function CommentSection({ postId, setCommentCount }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 600));
          setComments([
            {
              id: 'c1',
              content: 'Wow, this looks absolutely incredible!',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              userId: 'user2',
              user: { displayName: 'Alice Lee', username: 'alicelee', avatarUrl: null }
            }
          ]);
          setIsLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/posts/${postId}/comments`);
        setComments(response.data.comments || response.data);
      } catch (error) {
        toast.error('Could not load comments.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const commentPayload = { content: newComment };
      
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 400));
        const addedComment = {
          id: Math.random().toString(36).substring(7),
          ...commentPayload,
          createdAt: new Date().toISOString(),
          userId: currentUser.id,
          user: {
            displayName: currentUser.displayName,
            username: currentUser.username,
            avatarUrl: currentUser.avatarUrl
          }
        };
        setComments([...comments, addedComment]);
        setCommentCount(prev => prev + 1);
        setNewComment('');
        setIsSubmitting(false);
        return;
      }

      const response = await axiosInstance.post(`/posts/${postId}/comments`, commentPayload);
      const addedComment = response.data.comment || response.data;
      setComments([...comments, addedComment]);
      setCommentCount(prev => prev + 1);
      setNewComment('');
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const prevComments = [...comments];
      setComments(comments.filter(c => c.id !== commentId));
      setCommentCount(prev => prev - 1);

      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 300));
        toast.success("Comment deleted");
        return;
      }

      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="mt-5 border-t border-[#1f1f1f] bg-[#0f0f0f] -mx-5 -mb-5 p-4 rounded-b-xl">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-[#888888]" />
        </div>
      ) : (
        <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {comments.length === 0 ? (
            <p className="text-center text-[13px] text-[#555555] py-2">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="group flex gap-3 relative">
                {comment.user.avatarUrl ? (
                  <img src={comment.user.avatarUrl} alt="Avatar" className="h-[32px] w-[32px] rounded-full object-cover shrink-0" />
                ) : (
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#181818] border border-[#2a2a2a] text-xs font-semibold text-[#f5a623] shrink-0">
                    {getInitials(comment.user.displayName || comment.user.username)}
                  </div>
                )}
                
                <div className="flex-1 flex flex-col justify-start min-w-0 pr-8">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="font-medium text-[13px] text-[#cccccc] truncate">{comment.user.displayName || comment.user.username}</span>
                    <span className="text-[11px] text-[#555555] shrink-0">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#999999] whitespace-pre-wrap break-words">{comment.content}</p>
                </div>

                {currentUser && comment.userId === currentUser.id && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="absolute top-0 right-0 p-1 text-[#444444] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#ef4444] rounded"
                    title="Delete comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handlePostComment} className="flex gap-3 mt-4 items-end">
        {currentUser?.avatarUrl ? (
          <img src={currentUser.avatarUrl} alt="Your Avatar" className="h-[32px] w-[32px] rounded-full object-cover mb-1 shrink-0" />
        ) : (
          <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#181818] border border-[#2a2a2a] text-xs font-semibold text-[#f5a623] shrink-0 mb-1">
            {getInitials(currentUser?.displayName || currentUser?.username)}
          </div>
        )}
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-[13px] text-[#ffffff] focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]/50 focus:outline-none placeholder:text-[#555555] min-h-[40px] max-h-[120px]"
            rows={1}
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePostComment(e);
              }
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="mb-1 px-3 py-2 text-[13px] font-semibold text-[#f5a623] transition-colors disabled:text-[#444444] hover:text-[#e09415] flex items-center"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
        </button>
      </form>
    </div>
  );
}
