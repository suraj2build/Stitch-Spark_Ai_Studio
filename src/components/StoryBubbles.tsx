import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Video, Flame, Star, Crown } from 'lucide-react';
import { Gender } from '../types';

interface StoryBubble {
  id: string;
  title: string;
  badge?: string;
  icon?: React.ReactNode;
  image: string;
  route: string;
  params?: { gender?: Gender; category?: string };
}

interface StoryBubblesProps {
  onNavigate: (route: string, params?: { gender?: Gender; category?: string }) => void;
}

export function StoryBubbles({ onNavigate }: StoryBubblesProps) {
  const stories: StoryBubble[] = [
    {
      id: 'story-festive',
      title: 'Festive Luxe',
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
      route: 'plp',
      params: { category: 'Festive Silk Edit' },
    },
    {
      id: 'story-reels',
      title: 'Watch & Shop',
      badge: 'LIVE',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
      route: 'reels',
    },
    {
      id: 'story-coords',
      title: 'Co-ord Sets',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      route: 'plp',
      params: { category: 'Co-ords & Sets' },
    },
    {
      id: 'story-dresses',
      title: 'Dresses',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&q=80',
      route: 'plp',
      params: { category: 'Dresses' },
    },
    {
      id: 'story-celeb',
      title: 'As Seen On',
      badge: 'HOT',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80',
      route: 'plp',
      params: { category: 'all' },
    },
    {
      id: 'story-mens',
      title: 'Men’s Edit',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
      route: 'plp',
      params: { gender: 'men' },
    },
    {
      id: 'story-sarees',
      title: 'Modern Sarees',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
      route: 'plp',
      params: { category: 'Modern Sarees' },
    },
    {
      id: 'story-linen',
      title: 'Linen Studio',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80',
      route: 'plp',
      params: { category: 'Minimalist Resort' },
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] border-b border-[#EFECE6] py-3.5 sm:py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1">
          {stories.map((story) => (
            <motion.button
              key={story.id}
              onClick={() => onNavigate(story.route, story.params)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none group cursor-pointer"
            >
              {/* Ring Container with Gold/Rose Luxury Border */}
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#C29B38] via-[#E8D09E] to-[#B2593E] shadow-xs group-hover:shadow-md transition-shadow">
                <div className="w-15 h-15 sm:w-17 sm:h-17 rounded-full overflow-hidden p-0.5 bg-white">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Badge if available */}
                {story.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#161514] text-white text-[8px] uppercase tracking-wider font-bold rounded-full border border-white whitespace-nowrap shadow-xs">
                    {story.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <span className="text-[11px] sm:text-xs font-medium text-[#2E2A27] group-hover:text-[#B2593E] transition-colors whitespace-nowrap">
                {story.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
