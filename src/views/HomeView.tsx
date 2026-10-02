import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Play, Sparkles, ChevronLeft, ChevronRight, Star, Heart, Check, Quote } from 'lucide-react';
import { Product, ShoppableReel, StyledLook, Gender } from '../types';
import { ProductCard } from '../components/ProductCard';
import { StoryBubbles } from '../components/StoryBubbles';
import { FitPromiseBanner } from '../components/FitPromiseBanner';
import { CelebritySpotlight } from '../components/CelebritySpotlight';
import { InteractiveLookHotspots } from '../components/InteractiveLookHotspots';
import { CATEGORIES } from '../data/mockData';
import { formatPrice } from '../utils/format';

interface HomeViewProps {
  products: Product[];
  reels: ShoppableReel[];
  styledLooks: StyledLook[];
  onSelectProduct: (productId: string) => void;
  onNavigate: (route: string, params?: { gender?: Gender; category?: string; productId?: string }) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, selectedColor: string) => void;
  onInstantAddSize?: (product: Product, colorName: string, size: string) => void;
  onOpenReel: (reelId: string) => void;
  recentlyViewedIds: string[];
}

export function HomeView({
  products,
  reels,
  styledLooks,
  onSelectProduct,
  onNavigate,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onInstantAddSize,
  onOpenReel,
  recentlyViewedIds,
}: HomeViewProps) {
  // Hero Carousel Slides
  const heroSlides = [
    {
      id: 'slide-1',
      badge: 'FESTIVE 2026 CAPSULE',
      title: 'Fits That Flatter Indian Silhouettes',
      subtitle: 'Sculpted Chanderi silks, contoured drapes, and lightweight zari weaves engineered for modern Indian ease.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85',
      primaryCTA: { label: 'Shop Women', route: 'plp', params: { gender: 'women' as Gender } },
      secondaryCTA: { label: 'Shop Men', route: 'plp', params: { gender: 'men' as Gender } },
    },
    {
      id: 'slide-2',
      badge: 'CONTEMPORARY OCCASIONWEAR',
      title: 'The Art of the Pre-Draped Saree',
      subtitle: 'Zero pins, effortless drapes. Handloom mulberry silks and crinkled georgette tailored to glide with you.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85',
      primaryCTA: { label: 'Explore Sarees', route: 'plp', params: { category: 'Modern Sarees' } },
      secondaryCTA: { label: 'View Collection', route: 'plp', params: { category: 'Festive Silk Edit' } },
    },
    {
      id: 'slide-3',
      badge: 'BREATHABLE LUXURY',
      title: 'Normandy Flax & Raw Silk Tailoring',
      subtitle: 'Structured bandhgalas and airy 60-lea flax shirts. The definitive contemporary Indian wardrobe.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=85',
      primaryCTA: { label: 'Shop Menswear', route: 'plp', params: { gender: 'men' as Gender } },
      secondaryCTA: { label: 'Bestsellers', route: 'plp', params: { category: 'all' } },
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto rotate hero slides softly every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Tabbed Trending Collection Filter
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'men' | 'festive'>('all');

  const tabFilteredProducts = products.filter((p) => {
    if (activeTab === 'women') return p.gender === 'women' || p.gender === 'unisex';
    if (activeTab === 'men') return p.gender === 'men' || p.gender === 'unisex';
    if (activeTab === 'festive') return p.category.includes('Silk') || p.occasion.includes('Festive');
    return true;
  });

  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <div className="space-y-12 sm:space-y-18 pb-20">
      {/* 1. INSTAGRAM-STYLE STORY BUBBLES (FableStreet / Uptownie Signature) */}
      <StoryBubbles onNavigate={onNavigate} />

      {/* 2. HERO SLIDER WITH SOFT MOTION TRANSITIONS */}
      <section className="relative w-full overflow-hidden bg-[#181716] min-h-[70vh] sm:min-h-[82vh] lg:min-h-[86vh] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlideIndex].image}
              alt={heroSlides[currentSlideIndex].title}
              className="w-full h-full object-cover object-center brightness-[0.82]"
            />
            {/* Luminous Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/40 sm:to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl text-white space-y-4 sm:space-y-5">
            <motion.div
              key={`badge-${currentSlideIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/25 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold text-[#FAF9F6]"
            >
              <Sparkles className="w-3 h-3 text-[#E8D09E]" />
              <span>{heroSlides[currentSlideIndex].badge}</span>
            </motion.div>

            <motion.h1
              key={`title-${currentSlideIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.05] text-white"
            >
              {heroSlides[currentSlideIndex].title}
            </motion.h1>

            <motion.p
              key={`sub-${currentSlideIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-xs sm:text-sm lg:text-base text-[#E5DCD0] font-light max-w-lg leading-relaxed"
            >
              {heroSlides[currentSlideIndex].subtitle}
            </motion.p>

            {/* Slide Action CTAs */}
            <motion.div
              key={`cta-${currentSlideIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  onNavigate(
                    heroSlides[currentSlideIndex].primaryCTA.route,
                    heroSlides[currentSlideIndex].primaryCTA.params
                  )
                }
                className="px-8 py-3.5 bg-[#FAF9F6] text-[#181716] text-xs font-bold uppercase tracking-[0.18em] rounded-xs hover:bg-white transition-all shadow-lg cursor-pointer"
              >
                {heroSlides[currentSlideIndex].primaryCTA.label}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  onNavigate(
                    heroSlides[currentSlideIndex].secondaryCTA.route,
                    heroSlides[currentSlideIndex].secondaryCTA.params
                  )
                }
                className="px-8 py-3.5 bg-transparent border border-white/80 text-white text-xs font-bold uppercase tracking-[0.18em] rounded-xs hover:bg-white/15 backdrop-blur-xs transition-all cursor-pointer"
              >
                {heroSlides[currentSlideIndex].secondaryCTA.label}
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlideIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 3. FIT PROMISE / TRUST USP BAR (FableStreet / Ambraee Inspired) */}
      <FitPromiseBanner />

      {/* 4. SHOP BY CATEGORY (Visual Luxury Taxonomy Tiles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C29B38] font-bold block">
              Curated Taxonomy
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#181716] font-normal mt-0.5">
              Shop by Silhouette
            </h2>
          </div>
          <button
            onClick={() => onNavigate('plp', { gender: 'all' })}
            className="text-xs uppercase tracking-[0.16em] font-semibold text-[#B2593E] hover:underline flex items-center gap-1 group mt-2 sm:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              onClick={() => onNavigate('plp', { category: cat.name, gender: cat.gender })}
              className="group cursor-pointer flex flex-col bg-white rounded-xs overflow-hidden border border-[#EFECE6] shadow-xs"
            >
              <div className="aspect-[4/5] bg-[#F7F5F0] overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />
                <div className="absolute bottom-2.5 inset-x-2.5 text-white">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#E8DED1] block font-semibold">
                    {cat.gender}
                  </span>
                  <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-white leading-tight mt-0.5">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. TABBED TRENDING / NEW DROPS (FableStreet style instant tab filtering) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#C29B38] font-bold block">
            Autumn / Festive 2026
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[#181716] font-normal mt-0.5">
            Trending in the Atelier
          </h2>
          <p className="text-xs text-[#706860] mt-1.5">
            Pieces engineered with contoured fits, premium handloom textiles, and timeless Indian ease.
          </p>

          {/* Interactive Filter Tabs with Soft Motion Indicator */}
          <div className="flex justify-center gap-1.5 mt-5 bg-[#FAF9F5] p-1 rounded-full border border-[#EFECE6] w-fit mx-auto">
            {(
              [
                { id: 'all', label: 'All Curations' },
                { id: 'women', label: "Women's Edit" },
                { id: 'men', label: "Men's Edit" },
                { id: 'festive', label: 'Festive Silk Luxe ✨' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === tab.id ? 'text-[#FAF9F6]' : 'text-[#665F58] hover:text-[#181716]'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-[#181716] rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid with Soft Layout Transitions */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {tabFilteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                isWishlisted={wishlistIds.has(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onInstantAddSize={onInstantAddSize}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('plp', { gender: activeTab === 'men' ? 'men' : 'women' })}
            className="px-8 py-3.5 bg-[#FAF9F5] hover:bg-[#181716] hover:text-white border border-[#E5DFD4] text-[#181716] text-xs uppercase tracking-[0.18em] font-bold rounded-xs transition-colors shadow-xs"
          >
            Explore Complete Catalog →
          </motion.button>
        </div>
      </section>

      {/* 6. CELEBRITY SPOTLIGHT / AS SEEN ON (Ambraee / Uptownie signature) */}
      <CelebritySpotlight products={products} onSelectProduct={onSelectProduct} />

      {/* 7. INTERACTIVE SHOP THE LOOK WITH PULSING HOTSPOTS */}
      <InteractiveLookHotspots
        looks={styledLooks}
        products={products}
        onSelectProduct={onSelectProduct}
        onInstantAdd={(prodId, col, size) => {
          if (onInstantAddSize) {
            const p = products.find((prod) => prod.id === prodId);
            if (p) onInstantAddSize(p, col, size);
          }
        }}
      />

      {/* 8. WATCH & SHOP (Shoppable Reels - Bright Luxury Presentation) */}
      <section id="watch-and-shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B2593E] animate-ping" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#B2593E] font-bold">
                Social Discovery
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#181716] font-normal mt-0.5">
              Watch &amp; Shop • Trending Video Reels
            </h2>
            <p className="text-xs text-[#706860] mt-1">
              Tap any video to watch the drape in motion and shop exact pieces instantly.
            </p>
          </div>

          <button
            onClick={() => onNavigate('reels')}
            className="text-xs uppercase tracking-[0.16em] font-semibold text-[#B2593E] hover:underline flex items-center gap-1 group mt-2 sm:mt-0"
          >
            <span>View All Reels ({reels.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 9:16 Vertical Video Cards Grid with Soft Hover Effects */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          {reels.map((reel) => {
            const tagged = reel.taggedProductIds
              .map((id) => products.find((p) => p.id === id))
              .filter(Boolean) as Product[];

            return (
              <motion.div
                key={reel.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => onOpenReel(reel.id)}
                className="group relative aspect-[9/16] bg-[#1F1C18] rounded-xs overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                {/* Poster / Thumbnail */}
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

                {/* Creator Attribution */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between text-white text-xs z-10">
                  <div className="flex items-center gap-2">
                    <img
                      src={reel.creator.avatar}
                      alt={reel.creator.name}
                      className="w-6 h-6 rounded-full border border-white/60 object-cover"
                    />
                    <span className="text-[11px] font-semibold tracking-wide drop-shadow-xs">
                      {reel.creator.handle}
                    </span>
                  </div>
                  <span className="text-[9px] bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                    {reel.views}
                  </span>
                </div>

                {/* Center Play Icon with Ripple */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/35 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-115 transition-transform duration-300 shadow-lg">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Tagged Products Strip */}
                <div className="absolute bottom-3 inset-x-3 text-white z-10 space-y-1.5">
                  <p className="text-xs font-semibold line-clamp-1 drop-shadow-sm">
                    {reel.title}
                  </p>

                  {tagged[0] && (
                    <div className="bg-white/95 text-[#181716] backdrop-blur-md p-1.5 rounded-xs flex items-center justify-between gap-2 shadow-md">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={tagged[0].colors[0].images[0]}
                          alt={tagged[0].title}
                          className="w-7 h-8 object-cover rounded-xs bg-[#EFE9DF] shrink-0"
                        />
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-semibold truncate block leading-tight">
                            {tagged[0].title}
                          </span>
                          <span className="text-[10px] text-[#B2593E] font-bold">
                            {formatPrice(tagged[0].price)}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider font-bold bg-[#181716] text-white px-2 py-1 rounded-xs shrink-0">
                        Shop
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 9. PRESS & EDITORIAL CITATIONS (Vogue, Elle, Grazia) */}
      <section className="bg-[#FAF9F5] border-y border-[#EFECE6] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C29B38] font-bold block mb-6">
            In The Press
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <span className="font-editorial text-2xl font-bold tracking-widest text-[#181716] block">
                VOGUE
              </span>
              <p className="text-xs text-[#706860] italic leading-relaxed">
                &ldquo;VANYA marries the rich heritage of Chanderi with the precision of made-to-measure contemporary proportions.&rdquo;
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-editorial text-2xl font-bold tracking-widest text-[#181716] block">
                ELLE
              </span>
              <p className="text-xs text-[#706860] italic leading-relaxed">
                &ldquo;Finally, an Indian luxury label that understands true ease: zero-gape fits, breathable weaves, and festive poise.&rdquo;
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-editorial text-2xl font-bold tracking-widest text-[#181716] block">
                GRAZIA
              </span>
              <p className="text-xs text-[#706860] italic leading-relaxed">
                &ldquo;The pre-draped saree and handwoven co-ords have set a new benchmark for modern Indian eveningwear.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. RECENTLY VIEWED (Shown if history exists) */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#706860] font-bold block">
                Your Browsing History
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#181716] font-normal mt-0.5">
                Recently Viewed
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentlyViewedProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                isWishlisted={wishlistIds.has(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onInstantAddSize={onInstantAddSize}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
