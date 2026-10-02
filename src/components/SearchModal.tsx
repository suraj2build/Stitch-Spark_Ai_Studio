import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, TrendingUp, Sparkles, Compass, Check, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

export interface VibeFilter {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  categories: string[];
  matcher: (p: Product) => boolean;
}

export const VIBE_OCCASIONS: VibeFilter[] = [
  {
    id: 'summer-wedding',
    name: 'Summer Wedding Guest',
    tagline: 'Airy Chanderi silk, pre-draped georgettes & pastel daytime ceremony ensembles',
    badge: 'Celebrations',
    categories: ['Modern Sarees', 'Co-ords & Sets', 'Kurtas', 'Bandhgalas & Jackets'],
    matcher: (p: Product) => {
      const occ = (p.occasion || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const col = (p.collection || '').toLowerCase();
      const fab = (p.fabric || '').toLowerCase();
      return (
        occ.includes('wedding') ||
        occ.includes('celebrat') ||
        occ.includes('sangeet') ||
        occ.includes('mehendi') ||
        occ.includes('festive') ||
        col.includes('festive') ||
        fab.includes('chanderi') ||
        fab.includes('georgette') ||
        fab.includes('organza') ||
        ['modern sarees', 'sarees & drapes', 'kurtas', 'kurtas & sets', 'co-ords & sets'].includes(cat)
      );
    },
  },
  {
    id: 'business-formal',
    name: 'Business Formal',
    tagline: 'Tailored Bandhgalas, double-pleated trousers & executive shirting',
    badge: 'Executive',
    categories: ['Bandhgalas & Jackets', 'Pleated Trousers', 'Shirts & Overshirts'],
    matcher: (p: Product) => {
      const cat = (p.category || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      const occ = (p.occasion || '').toLowerCase();
      const details = (p.details || []).join(' ').toLowerCase();
      return (
        cat.includes('bandhgala') ||
        cat.includes('trouser') ||
        cat.includes('jacket') ||
        cat.includes('shirt') ||
        title.includes('trouser') ||
        title.includes('bandhgala') ||
        title.includes('blazer') ||
        title.includes('shirt') ||
        details.includes('pleat') ||
        details.includes('cuff') ||
        details.includes('collar') ||
        occ.includes('formal')
      );
    },
  },
  {
    id: 'minimalist-luxe',
    name: 'Minimalist Luxe',
    tagline: 'Undyed Belgian linen, wild tussar & clean understated architectural cuts',
    badge: 'Quiet Luxury',
    categories: ['Co-ords & Sets', 'Shirts & Overshirts', 'Dresses', 'Pleated Trousers'],
    matcher: (p: Product) => {
      const col = (p.collection || '').toLowerCase();
      const fab = (p.fabric || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      const sub = (p.subtitle || '').toLowerCase();
      return (
        col.includes('minimalist') ||
        col.includes('essentials') ||
        col.includes('atelier') ||
        fab.includes('linen') ||
        fab.includes('tussar') ||
        fab.includes('matka') ||
        fab.includes('khadi') ||
        fab.includes('supima') ||
        title.includes('linen') ||
        title.includes('wrap') ||
        sub.includes('effortless') ||
        sub.includes('minimal')
      );
    },
  },
  {
    id: 'cocktail-soiree',
    name: 'Cocktail Soirée',
    tagline: 'Pre-draped metallic zari, sculpted corsets & midnight reception glamour',
    badge: 'Evening',
    categories: ['Modern Sarees', 'Dresses', 'Bandhgalas & Jackets', 'Co-ords & Sets'],
    matcher: (p: Product) => {
      const occ = (p.occasion || '').toLowerCase();
      const col = (p.collection || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      return (
        occ.includes('cocktail') ||
        occ.includes('soir') ||
        occ.includes('gala') ||
        occ.includes('evening') ||
        col.includes('evening') ||
        title.includes('corset') ||
        title.includes('bandhgala') ||
        title.includes('saree')
      );
    },
  },
  {
    id: 'resort-travel',
    name: 'Resort & Sun-Drenched',
    tagline: '60 lea French flax linen, breezy tunic sets & vacation ease',
    badge: 'Resort',
    categories: ['Shirts & Overshirts', 'Dresses', 'Co-ords & Sets'],
    matcher: (p: Product) => {
      const occ = (p.occasion || '').toLowerCase();
      const col = (p.collection || '').toLowerCase();
      const fab = (p.fabric || '').toLowerCase();
      return (
        occ.includes('resort') ||
        occ.includes('casual') ||
        occ.includes('luncheon') ||
        col.includes('resort') ||
        fab.includes('linen') ||
        fab.includes('chiffon')
      );
    },
  },
  {
    id: 'heritage-festive',
    name: 'Heritage Festive',
    tagline: 'Varanasi Ahimsa silks, Yeola Paithani motifs & authentic hand-sewn Gota Patti',
    badge: 'Artisanal',
    categories: ['Modern Sarees', 'Kurtas', 'Bandhgalas & Jackets', 'Co-ords & Sets'],
    matcher: (p: Product) => {
      const col = (p.collection || '').toLowerCase();
      const details = (p.details || []).join(' ').toLowerCase();
      const badges = (p.badges || []).join(' ');
      return (
        col.includes('festive') ||
        col.includes('heritage') ||
        details.includes('zari') ||
        details.includes('gota') ||
        details.includes('paithani') ||
        details.includes('handloom') ||
        badges.includes('LIMITED')
      );
    },
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onSelectCategory: (category: string) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onSelectCategory,
}: SearchModalProps) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [selectedVibeId, setSelectedVibeId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trendingSearches = [
    'Chanderi Silk Set',
    'Mandarin Linen Shirt',
    'Pleated Khadi Trousers',
    'Bandhgala Jacket',
    'Pre-Draped Saree',
    'Mulberry Silk',
  ];

  const recentSearches = [
    'Festive Kurtas',
    'Ivory Wrap Dress',
    'Resort Linen',
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const activeVibe = useMemo(() => {
    return VIBE_OCCASIONS.find((v) => v.id === selectedVibeId) || null;
  }, [selectedVibeId]);

  // Compute product counts for each vibe chip
  const vibeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    VIBE_OCCASIONS.forEach((v) => {
      counts[v.id] = products.filter(v.matcher).length;
    });
    return counts;
  }, [products]);

  // Filter products based on active vibe and search query
  const filteredProducts = useMemo(() => {
    let pool = products;

    if (activeVibe) {
      pool = pool.filter(activeVibe.matcher);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      pool = pool.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          (p.occasion && p.occasion.toLowerCase().includes(q)) ||
          (p.styleNotes && p.styleNotes.toLowerCase().includes(q))
      );
    } else if (!activeVibe) {
      // Neither query nor vibe selected: show default discovery view
      return [];
    }

    return pool;
  }, [products, activeVibe, query]);

  const hasActiveFilterOrQuery = !!selectedVibeId || !!query.trim();

  const handleToggleVibe = (vibeId: string) => {
    setSelectedVibeId((prev) => (prev === vibeId ? null : vibeId));
  };

  const handleClearAll = () => {
    setQuery('');
    setSelectedVibeId(null);
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-0 sm:p-6 sm:pt-14"
      onClick={onClose}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-3xl bg-[#FAF8F5] sm:rounded-3xl shadow-2xl overflow-hidden max-h-screen sm:max-h-[88vh] flex flex-col border border-[#EAE3D7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3D7] bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-[#887C70] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={
              activeVibe
                ? `Search within "${activeVibe.name}" (e.g. Silk, Blue, Trousers)...`
                : 'Search silhouettes, fabrics, occasions (e.g. Silk, Linen, Festive)...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm sm:text-base text-[#1A1816] placeholder:text-[#9F9386] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#7A6E63] hover:text-[#1A1816] px-1.5 py-0.5 rounded-full hover:bg-[#F2ECE1] transition-colors cursor-pointer"
            >
              Clear query
            </button>
          )}
          <button
            id="btn-close-search-modal"
            onClick={onClose}
            className="p-1.5 text-[#5C5146] hover:text-black rounded-full hover:bg-[#F4ECE1] transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIBE & OCCASION FILTER CHIP SET (Always accessible) */}
        <div className="px-5 pt-3.5 pb-3 border-b border-[#EAE3D7] bg-[#F7F3EB]/90">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-[#7A6E63] font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#A85B3F]" />
              <span>Vibe &amp; Occasion</span>
            </div>
            {selectedVibeId && (
              <button
                onClick={() => setSelectedVibeId(null)}
                className="text-[11px] text-[#A85B3F] hover:text-[#843F28] font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Reset Vibe</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Horizontally scrollable chip set with organic luxury curves */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {VIBE_OCCASIONS.map((vibe) => {
              const isSelected = selectedVibeId === vibe.id;
              const count = vibeCounts[vibe.id] || 0;

              return (
                <button
                  key={vibe.id}
                  onClick={() => handleToggleVibe(vibe.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816] shadow-sm font-semibold'
                      : 'bg-white text-[#383129] border-[#DDD5C7] hover:border-[#1A1816] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-[#D4AF37]" />}
                  <span>{vibe.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-white/20 text-[#FAF8F5]'
                        : 'bg-[#F0EAE0] text-[#7A6E62]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Vibe Editorial Callout Banner */}
          {activeVibe && (
            <div className="p-4 bg-gradient-to-r from-[#F5EFE6] to-[#FAF8F5] border border-[#E3D9CB] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#1A1816] text-[#FAF8F5]">
                    {activeVibe.badge}
                  </span>
                  <h4 className="font-editorial text-base text-[#1A1816] font-medium">
                    {activeVibe.name}
                  </h4>
                </div>
                <p className="text-xs text-[#706456] leading-relaxed">
                  {activeVibe.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#8C7E70]">
                  <span className="font-medium">Mapped Categories:</span>
                  {activeVibe.categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        onClose();
                      }}
                      className="px-2 py-0.5 bg-white border border-[#DDD5C7] hover:border-[#1A1816] rounded-full text-[#3A332B] transition-colors cursor-pointer"
                    >
                      {cat} →
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedVibeId(null)}
                  className="px-3 py-1.5 text-xs text-[#706456] hover:text-[#1A1816] border border-[#D5CBBC] hover:border-[#1A1816] rounded-full transition-colors cursor-pointer bg-white"
                >
                  Clear Vibe
                </button>
              </div>
            </div>
          )}

          {hasActiveFilterOrQuery ? (
            /* Results View */
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#786C60]">
                    Showing <strong className="text-[#1A1816] font-semibold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'garment' : 'garments'}
                    {activeVibe && (
                      <span> in <span className="font-semibold text-[#1A1816]">{activeVibe.name}</span></span>
                    )}
                    {query.trim() && (
                      <span> matching &ldquo;<span className="font-semibold text-[#1A1816]">{query}</span>&rdquo;</span>
                    )}
                  </span>
                </div>

                <button
                  onClick={handleClearAll}
                  className="text-xs text-[#A85B3F] hover:underline font-medium cursor-pointer"
                >
                  Reset all
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-[#7E7164] space-y-3">
                  <p className="font-editorial text-xl text-[#1A1816]">No garments found</p>
                  <p className="text-xs max-w-md mx-auto">
                    {activeVibe && query.trim()
                      ? `We found no garments in the "${activeVibe.name}" collection matching "${query}". Try searching for another fabric, silhouette, or clear your search term.`
                      : 'Try searching for "Silk", "Linen", "Kurta", or switch to a different curated Vibe & Occasion above.'}
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    {query.trim() && (
                      <button
                        onClick={() => setQuery('')}
                        className="px-4 py-2 bg-white border border-[#D5CBBC] rounded-full text-xs text-[#1A1816] hover:border-[#1A1816] transition-colors cursor-pointer"
                      >
                        Clear search term
                      </button>
                    )}
                    {selectedVibeId && (
                      <button
                        onClick={() => setSelectedVibeId(null)}
                        className="px-4 py-2 bg-[#1A1816] text-white rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors cursor-pointer"
                      >
                        Reset Vibe Filter
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p.id);
                        onClose();
                      }}
                      className="group cursor-pointer flex flex-col bg-white border border-[#EAE3D7] rounded-2xl overflow-hidden hover:border-[#D0C4B4] hover:shadow-lg transition-all"
                    >
                      <div className="aspect-[3/4] bg-[#F1ECE2] overflow-hidden relative rounded-t-2xl">
                        <img
                          src={p.colors[0].images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Occasion / Category Tag */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                          <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white rounded-full truncate max-w-[85%]">
                            {p.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-[#8C7E70] mb-0.5">
                            <span className="truncate max-w-[120px] font-medium">{p.occasion}</span>
                            <span className="text-[#A85B3F] font-semibold">★ {p.rating}</span>
                          </div>
                          <h5 className="text-xs font-medium text-[#1A1816] line-clamp-1 group-hover:text-[#A85B3F] transition-colors">
                            {p.title}
                          </h5>
                          <p className="text-[11px] text-[#7A6E63] truncate mt-0.5">{p.fabric}</p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-[#F2EDE4] flex items-baseline justify-between">
                          <span className="text-xs font-semibold text-[#1A1816]">
                            {formatPrice(p.price)}
                          </span>
                          {p.mrp > p.price && (
                            <span className="text-[10px] text-[#9C8F83] line-through">
                              {formatPrice(p.mrp)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Default Search Discovery View */
            <>
              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#8A7D71] font-semibold uppercase tracking-wider mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#A85B3F]" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 bg-white border border-[#DFD6C8] hover:border-[#1A1816] text-xs text-[#3E3832] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      <Search className="w-3 h-3 text-[#9A8E82]" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              <div>
                <span className="text-[11px] text-[#8A7D71] font-semibold uppercase tracking-wider block mb-2">
                  Recent Inquiries
                </span>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1 bg-[#F2EDE4] hover:bg-[#EAE3D7] text-xs text-[#52483E] rounded-full transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Category Shortcuts */}
              <div className="border-t border-[#EAE3D7] pt-4">
                <div className="flex items-center gap-1.5 text-xs text-[#8A7D71] font-semibold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Explore Key Categories</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Modern Sarees', count: 'Pre-draped ease' },
                    { label: 'Bandhgalas & Jackets', count: 'Ceremonial cuts' },
                    { label: 'Pleated Trousers', count: 'High-waisted fit' },
                    { label: 'Co-ords & Sets', count: 'Handloom luxury' },
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => {
                        onSelectCategory(cat.label);
                        onClose();
                      }}
                      className="p-3.5 bg-white border border-[#DFD6C8] hover:border-[#1A1816] text-left rounded-2xl transition-all group cursor-pointer shadow-2xs hover:shadow-md"
                    >
                      <span className="text-xs font-medium text-[#1A1816] group-hover:text-[#A85B3F] block transition-colors">
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-[#8C8073] mt-0.5 block">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
