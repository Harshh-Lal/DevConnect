import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, Link as LinkIcon, Code } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description cannot exceed 500 characters'),
  githubUrl: z.string().refine((val) => !val || val.startsWith('https://github.com/'), {
    message: 'Must be a valid GitHub URL',
  }).optional().or(z.literal('')),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const SKILL_OPTIONS = [
  'React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 
  'MongoDB', 'Express', 'Next.js', 'Vue', 'Docker', 
  'AWS', 'GraphQL', 'Prisma', 'TailwindCSS', 'Java', 'Go'
];

export default function PostComposer({ onPostCreated }) {
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      description: '',
      githubUrl: '',
      liveUrl: '',
    }
  });

  const descriptionValue = watch('description');
  const descLength = descriptionValue ? descriptionValue.length : 0;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        toast.error('You can only select up to 5 tags');
      }
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    reset();
    setSelectedTags([]);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const postData = {
        title: data.title,
        description: data.description,
        githubUrl: data.githubUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        tags: selectedTags,
      };

      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newPost = {
          id: Math.random().toString(36).substring(7),
          ...postData,
          userId: currentUser.id,
          user: {
            username: currentUser.username,
            displayName: currentUser.displayName,
            avatarUrl: currentUser.avatarUrl,
          },
          createdAt: new Date().toISOString(),
          likesCount: 0,
          commentsCount: 0,
          isLikedByMe: false,
        };
        onPostCreated(newPost);
        toast.success('Project posted!');
        handleClose();
        return;
      }

      const response = await axiosInstance.post('/posts', postData);
      onPostCreated(response.data.post || response.data);
      toast.success('Project posted!');
      handleClose();
    } catch (error) {
      console.error('Failed to create post', error);
      toast.error(error.response?.data?.message || 'Failed to post project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  if (!isExpanded) {
    return (
      <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4 shadow-sm transition-colors cursor-pointer group hover:border-[#3a3a3a]" onClick={() => setIsExpanded(true)}>
        <div className="flex items-center gap-3">
          {currentUser?.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName || 'Avatar'}
              className="h-[40px] w-[40px] rounded-full border border-[#2a2a2a] object-cover"
            />
          ) : (
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#2a2a2a] bg-[#222222] text-sm font-medium text-[#f5a623]">
              {getInitials(currentUser?.displayName || currentUser?.username)}
            </div>
          )}
          <div className="flex h-10 flex-1 items-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 text-sm text-[#555555] group-hover:border-[#3a3a3a] transition-colors">
            Share a project you've been working on...
          </div>
        </div>
      </div>
    );
  }

  // Expanded State Modal Overlay
  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#000000]/70 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#2a2a2a] bg-[#111111] p-0 shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-4">
          <h2 className="text-lg font-bold text-[#ffffff]">Create Post</h2>
          <button onClick={handleClose} className="rounded-full p-1 text-[#888888] hover:text-[#ffffff] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 flex-1">
          <div className="flex items-center gap-3 mb-4">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName || 'Avatar'}
                className="h-[40px] w-[40px] rounded-full border border-[#2a2a2a] object-cover"
              />
            ) : (
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#2a2a2a] bg-[#222222] text-sm font-medium text-[#f5a623]">
                {getInitials(currentUser?.displayName || currentUser?.username)}
              </div>
            )}
            <div>
              <p className="font-semibold text-[#ffffff] text-sm">{currentUser?.displayName || currentUser?.username}</p>
              <p className="text-xs text-[#888888]">Posting to Your Network</p>
            </div>
          </div>

          <form id="post-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder="What is the title of your project?"
                className={cn(
                  "bg-[#0f0f0f] border-[#2a2a2a] text-[#ffffff] placeholder:text-[#555555] rounded-lg h-11 focus-visible:ring-1 focus-visible:ring-[#f5a623]/50 focus-visible:border-[#f5a623]",
                  errors.title && "border-red-500/50 focus-visible:ring-red-500/50 focus-visible:border-red-500"
                )}
                {...register('title')}
                disabled={isSubmitting}
              />
              {errors.title && <p className="text-xs text-red-500/80 mt-1">{errors.title.message}</p>}
            </div>

            <div className="relative">
              <textarea
                placeholder="Describe what you built, the challenges you faced, or what you learned..."
                className={cn(
                  "w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] p-3 text-sm text-[#ffffff] placeholder:text-[#555555] min-h-[120px] focus:outline-none focus:ring-1 focus:ring-[#f5a623]/50 focus:border-[#f5a623]",
                  errors.description && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                )}
                {...register('description')}
                disabled={isSubmitting}
              />
              <div className={cn(
                "absolute bottom-3 right-3 text-xs font-medium",
                descLength > 480 ? "text-red-500" : descLength > 400 ? "text-[#f5a623]" : "text-[#888888]"
              )}>
                {descLength} / 500
              </div>
            </div>
            {errors.description && <p className="text-xs text-red-500/80 -mt-2">{errors.description.message}</p>}

            <div className="space-y-2 pt-2 border-t border-[#1f1f1f]">
              <p className="text-sm font-medium text-[#ffffff]">Tech Stack <span className="text-[#888888] text-xs font-normal ml-1">up to 5</span></p>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => {
                  const isSelected = selectedTags.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleTag(skill)}
                      disabled={isSubmitting}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs transition-colors border",
                        isSelected
                          ? "bg-[rgba(245,166,35,0.15)] border-[#f5a623] text-[#f5a623] font-medium"
                          : "bg-[#1a1a1a] border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a] hover:text-[#cccccc]"
                      )}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-[#555555]" />
                <div className="flex-1">
                  <Input
                    placeholder="https://github.com/username/repo"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-[#ffffff] placeholder:text-[#555555] rounded-lg h-10 text-sm focus-visible:ring-1 focus-visible:ring-[#f5a623]/50 focus-visible:border-[#f5a623]"
                    {...register('githubUrl')}
                    disabled={isSubmitting}
                  />
                  {errors.githubUrl && <p className="text-xs text-red-500/80 mt-1">{errors.githubUrl.message}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LinkIcon className="h-5 w-5 text-[#555555]" />
                <div className="flex-1">
                  <Input
                    placeholder="Live URL (e.g. https://myproject.com)"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-[#ffffff] placeholder:text-[#555555] rounded-lg h-10 text-sm focus-visible:ring-1 focus-visible:ring-[#f5a623]/50 focus-visible:border-[#f5a623]"
                    {...register('liveUrl')}
                    disabled={isSubmitting}
                  />
                  {errors.liveUrl && <p className="text-xs text-red-500/80 mt-1">{errors.liveUrl.message}</p>}
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#2a2a2a] px-5 py-4">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting} className="bg-transparent border border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a] hover:text-[#ffffff] rounded-lg">
            Cancel
          </Button>
          <Button 
            form="post-form" 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-[#f5a623] text-[#000000] hover:bg-[#e09415] font-semibold flex items-center gap-2 rounded-lg"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Post Project
          </Button>
        </div>
      </div>
    </>
  );
}
