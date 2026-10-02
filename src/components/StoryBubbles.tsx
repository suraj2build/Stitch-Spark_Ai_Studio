import React from 'react';
import { motion } from 'motion/react';
import { Gender } from '../types';

interface StoryBubble {
  id: string;
  title: string;
  image: string;
  route: string;
  params?: { gender?: Gender; category?: string };
}

interface StoryBubblesProps {
  onNavigate: (route: string, params?: { gender?: Gender; category?: string }) => void;
  activeGender?: Gender;
}

export function StoryBubbles({ onNavigate, activeGender = 'men' }: StoryBubblesProps) {
  const isMen = activeGender === 'men';

  // Strictly dedicated Menswear circular categories matching reference mockup
  const menCategories: StoryBubble[] = [
    {
      id: 'cat-bandhgalas',
      title: 'BANDHGALAS',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'men', category: 'Bandhgalas & Jackets' },
    },
    {
      id: 'cat-linen-shirts',
      title: 'LINEN SHIRTS',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'men', category: 'Linen & Silk Shirts' },
    },
    {
      id: 'cat-kurtas',
      title: 'KURTAS',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'men', category: 'all' },
    },
    {
      id: 'cat-trousers',
      title: 'TROUSERS',
      image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'men', category: 'Pleated Trousers' },
    },
    {
      id: 'cat-jackets',
      title: 'JACKETS',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'men', category: 'Bandhgalas & Jackets' },
    },
    {
      id: 'cat-polos',
      title: 'POLOS',
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'men', category: 'Linen & Silk Shirts' },
    },
    {
      id: 'cat-festive',
      title: 'FESTIVE EDIT',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'men', category: 'The Festive Silk Edit' },
    },
    {
      id: 'cat-accessories',
      title: 'ACCESSORIES',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'men', category: 'all' },
    },
  ];

  // Strictly dedicated Womenswear circular categories
  const womenCategories: StoryBubble[] = [
    {
      id: 'cat-w-sarees',
      title: 'MODERN SAREES',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'women', category: 'Modern Sarees' },
    },
    {
      id: 'cat-w-coords',
      title: 'CO-ORDS & SETS',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'women', category: 'Co-ords & Sets' },
    },
    {
      id: 'cat-w-chanderi',
      title: 'CHANDERI KURTAS',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'women', category: 'all' },
    },
    {
      id: 'cat-w-dresses',
      title: 'DRAPED DRESSES',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'women', category: 'Dresses' },
    },
    {
      id: 'cat-w-jackets',
      title: 'CAPES & JACKETS',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'women', category: 'Festive Silk Edit' },
    },
    {
      id: 'cat-w-tops',
      title: 'SILK BLOUSES',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'women', category: 'all' },
    },
    {
      id: 'cat-w-festive',
      title: 'FESTIVE SILKS',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'women', category: 'Festive Silk Edit' },
    },
    {
      id: 'cat-w-accessories',
      title: 'JEWELRY & BAGS',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
      route: 'plp',
      params: { gender: 'women', category: 'all' },
    },
  ];

  const categories = isMen ? menCategories : womenCategories;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none">
      <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar py-2">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.4 }}
            whileHover={{ y: -4 }}
            onClick={() => onNavigate(cat.route, cat.params)}
            className="flex flex-col items-center gap-2.5 cursor-pointer group shrink-0"
          >
            {/* Circular Image Container with Subtle Border */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 lg:w-26 lg:h-26 rounded-full overflow-hidden p-0.5 border border-[#DFD7CB] group-hover:border-[#181716] group-hover:shadow-md transition-all duration-300 bg-white">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#FAF8F5]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
            </div>

            {/* Title */}
            <span className="text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-medium text-[#29221B] group-hover:text-black transition-colors text-center max-w-[85px] sm:max-w-[95px] truncate">
              {cat.title}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
