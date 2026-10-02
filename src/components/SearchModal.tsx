import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

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

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.fabric.toLowerCase().includes(query.toLowerCase()) ||
          p.collection.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-0 sm:p-6 sm:pt-16"
      onClick={onClose}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-3xl bg-[#FAF8F5] sm:rounded-lg shadow-2xl overflow-hidden max-h-screen sm:max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3D7] bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-[#887C70] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search silhouettes, fabrics, occasions (e.g. Silk, Linen, Festive)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm sm:text-base text-[#1A1816] placeholder:text-[#9F9386] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#7A6E63] hover:text-[#1A1816] px-1"
            >
              Clear
            </button>
          )}
          <button
            id="btn-close-search-modal"
            onClick={onClose}
            className="p-1.5 text-[#5C5146] hover:text-black rounded-full"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {query.trim() ? (
            /* Results View */
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[#786C60]">
                  Showing <strong className="text-[#1A1816] font-semibold">{filteredProducts.length}</strong> results for &ldquo;{query}&rdquo;
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-[#7E7164] space-y-2">
                  <p className="font-editorial text-xl">No garments found matching your search</p>
                  <p className="text-xs">
                    Try searching for &ldquo;Silk&rdquo;, &ldquo;Linen&rdquo;, &ldquo;Kurta&rdquo; or browse our curated categories.
                  </p>
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
                      className="group cursor-pointer flex flex-col"
                    >
                      <div className="aspect-[3/4] bg-[#F1ECE2] overflow-hidden rounded-xs relative">
                        <img
                          src={p.colors[0].images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-[#1A1816] line-clamp-1 group-hover:text-[#A85B3F]">
                          {p.title}
                        </h5>
                        <p className="text-[11px] text-[#7A6E63]">{p.fabric}</p>
                        <span className="text-xs font-semibold text-[#1A1816] mt-1 block">
                          {formatPrice(p.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Default Search Discovery */
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
                      className="px-3 py-1.5 bg-white border border-[#DFD6C8] hover:border-[#1A1816] text-xs text-[#3E3832] rounded-full transition-colors flex items-center gap-1"
                    >
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
                      className="px-3 py-1 bg-[#F2EDE4] hover:bg-[#EAE3D7] text-xs text-[#52483E] rounded-full transition-colors"
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Co-ords & Sets', count: '14 styles' },
                    { label: 'Dresses', count: '18 styles' },
                    { label: 'Shirts & Overshirts', count: '12 styles' },
                    { label: 'Jackets & Blazers', count: '9 styles' },
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => {
                        onSelectCategory(cat.label);
                        onClose();
                      }}
                      className="p-3 bg-white border border-[#DFD6C8] hover:border-[#1A1816] text-left rounded-xs transition-colors group"
                    >
                      <span className="text-xs font-medium text-[#1A1816] group-hover:text-[#A85B3F] block">
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-[#8C8073]">
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
