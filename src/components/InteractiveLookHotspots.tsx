import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Product, StyledLook } from '../types';
import { formatPrice } from '../utils/format';

interface InteractiveLookHotspotsProps {
  looks: StyledLook[];
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onInstantAdd: (productId: string, colorName: string, size: string) => void;
}

export function InteractiveLookHotspots({
  looks,
  products,
  onSelectProduct,
  onInstantAdd,
}: InteractiveLookHotspotsProps) {
  const [activeLookIdx, setActiveLookIdx] = useState(0);
  const currentLook = looks[activeLookIdx] || looks[0];

  const lookProducts = currentLook.taggedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  // Hotspot coordinates on the model photo (percentage x, y)
  const hotspots = [
    { x: 48, y: 36, productId: currentLook.taggedProductIds[0] },
    { x: 55, y: 68, productId: currentLook.taggedProductIds[1] || currentLook.taggedProductIds[0] },
  ];

  const [activeHotspotProduct, setActiveHotspotProduct] = useState<Product | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleHotspotAdd = (p: Product) => {
    onInstantAdd(p.id, p.colors[0].name, p.sizes[0].size);
    setAddedItem(p.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <section id="interactive-shop-the-look" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C29B38] font-bold block">
          Editorial Curation
        </span>
        <h2 className="font-editorial text-3xl sm:text-5xl text-[#181716] font-normal mt-1">
          Shop The Curated Look
        </h2>
        <p className="text-xs sm:text-sm text-[#706860] mt-1.5">
          Tap the pulsing markers on the outfit to reveal and shop individual pieces styled by our studio.
        </p>

        {/* Look Switcher Pills */}
        <div className="flex justify-center gap-2 mt-4">
          {looks.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => {
                setActiveLookIdx(idx);
                setActiveHotspotProduct(null);
              }}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all ${
                activeLookIdx === idx
                  ? 'bg-[#181716] text-white shadow-xs'
                  : 'bg-[#F2ECE3] text-[#59534C] hover:bg-[#EAE2D5]'
              }`}
            >
              {l.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF9F5] p-5 sm:p-8 rounded-xs border border-[#EFEBE3]">
        {/* Left: Model Image Stage with Interactive Hotspots */}
        <div className="lg:col-span-7 relative aspect-[3/4] bg-[#F0ECE3] rounded-xs overflow-hidden shadow-xs">
          <img
            src={currentLook.image}
            alt={currentLook.title}
            className="w-full h-full object-cover"
          />

          {/* Interactive Pulsing Hotspots */}
          {hotspots.map((spot, i) => {
            const product = products.find((p) => p.id === spot.productId);
            if (!product) return null;

            return (
              <div
                key={i}
                style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                {/* Hotspot Button */}
                <motion.button
                  whileHover={{ scale: 1.25 }}
                  onClick={() => setActiveHotspotProduct(product)}
                  className="relative w-8 h-8 rounded-full bg-white/95 text-[#181716] shadow-xl flex items-center justify-center border-2 border-[#C29B38] group cursor-pointer"
                  aria-label={`Hotspot for ${product.title}`}
                >
                  <Plus className="w-4 h-4 text-[#181716] group-hover:rotate-45 transition-transform" />
                  <span className="absolute inset-0 rounded-full bg-[#C29B38]/40 animate-ping" />
                </motion.button>
              </div>
            );
          })}

          {/* Active Hotspot Floating Card */}
          <AnimatePresence>
            {activeHotspotProduct && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-white/95 backdrop-blur-md p-3.5 rounded-xs border border-[#EFEBE3] shadow-2xl z-30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={activeHotspotProduct.colors[0].images[0]}
                    alt={activeHotspotProduct.title}
                    className="w-12 h-15 object-cover rounded-xs bg-[#F7F5F0] shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#B2593E] block">
                      Styled Piece
                    </span>
                    <h5
                      onClick={() => onSelectProduct(activeHotspotProduct.id)}
                      className="text-xs font-semibold text-[#181716] truncate cursor-pointer hover:underline"
                    >
                      {activeHotspotProduct.title}
                    </h5>
                    <span className="text-xs font-bold text-[#181716] mt-0.5 block">
                      {formatPrice(activeHotspotProduct.price)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => handleHotspotAdd(activeHotspotProduct)}
                    className="px-3 py-1.5 bg-[#181716] hover:bg-black text-white text-[10px] uppercase font-bold rounded-xs flex items-center gap-1"
                  >
                    {addedItem === activeHotspotProduct.id ? <Check className="w-3 h-3" /> : 'Add'}
                  </button>
                  <button
                    onClick={() => setActiveHotspotProduct(null)}
                    className="text-[9px] text-[#8C8379] hover:text-black uppercase text-center"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Breakdown of all items in this look */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-b border-[#EFEBE3] pb-3">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#B2593E]">
              {currentLook.season}
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#181716] font-normal mt-0.5">
              {currentLook.title}
            </h3>
            <p className="text-xs text-[#706860] mt-1">{currentLook.subtitle}</p>
          </div>

          <div className="space-y-3">
            {lookProducts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ x: 2 }}
                className="p-3.5 bg-white border border-[#EFEBE3] rounded-xs flex items-center justify-between gap-3 shadow-2xs hover:border-[#C29B38] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.colors[0].images[0]}
                    alt={p.title}
                    onClick={() => onSelectProduct(p.id)}
                    className="w-14 h-18 object-cover rounded-xs cursor-pointer hover:opacity-90 bg-[#F7F5F0]"
                  />
                  <div>
                    <h5
                      onClick={() => onSelectProduct(p.id)}
                      className="text-xs sm:text-sm font-semibold text-[#181716] hover:text-[#B2593E] cursor-pointer"
                    >
                      {p.title}
                    </h5>
                    <p className="text-[11px] text-[#8C8379]">{p.fabric}</p>
                    <span className="text-xs font-bold text-[#181716] mt-1 block">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <button
                    onClick={() => handleHotspotAdd(p)}
                    className="px-3.5 py-1.5 bg-[#181716] hover:bg-black text-white text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1"
                  >
                    {addedItem === p.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onSelectProduct(p.id)}
                    className="text-[10px] text-[#706860] hover:text-black underline"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-2 text-xs text-[#706860] flex items-center justify-between">
            <span>Complimentary matching artisan accessories styled</span>
            <span className="font-semibold text-[#181716]">{lookProducts.length} Pieces</span>
          </div>
        </div>
      </div>
    </section>
  );
}
