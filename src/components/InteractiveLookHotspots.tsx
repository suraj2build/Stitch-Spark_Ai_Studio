import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check } from 'lucide-react';
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

  const lookProducts = currentLook?.taggedProductIds
    ?.map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[] || [];

  // Hotspot coordinates on the model photo (percentage x, y)
  const hotspots = [
    { x: 48, y: 36, productId: currentLook?.taggedProductIds?.[0] },
    { x: 55, y: 68, productId: currentLook?.taggedProductIds?.[1] || currentLook?.taggedProductIds?.[0] },
  ];

  const [activeHotspotProduct, setActiveHotspotProduct] = useState<Product | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleHotspotAdd = (p: Product) => {
    onInstantAdd(p.id, p.colors[0].name, p.sizes[0].size);
    setAddedItem(p.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  if (!currentLook) return null;

  return (
    <section id="interactive-shop-the-look" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)] font-light block">
          Editorial Curation
        </span>
        <h2 className="font-editorial text-3xl sm:text-5xl text-[#181716] font-normal mt-1">
          Shop The Curated Look
        </h2>
        <p className="text-xs sm:text-sm text-[#706860] mt-1.5 font-light">
          Tap the pulsing markers on the ensemble to reveal and shop individual handcrafted pieces.
        </p>

        {/* Look Switcher Pills */}
        {looks.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {looks.map((l, idx) => (
              <button
                key={l.id}
                onClick={() => {
                  setActiveLookIdx(idx);
                  setActiveHotspotProduct(null);
                }}
                className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                  activeLookIdx === idx
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'bg-white border border-[var(--color-border)] text-[#59534C] hover:bg-[var(--color-surface)]'
                }`}
              >
                {l.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[var(--color-surface)]/30 p-5 sm:p-8 rounded-3xl border border-[var(--color-border)]">
        {/* Left: Model Image Stage with Interactive Hotspots */}
        <div className="lg:col-span-7 relative aspect-[3/4] bg-[#F0ECE3] rounded-2xl overflow-hidden shadow-xs">
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
                  className="relative w-8 h-8 rounded-full bg-white/95 text-[#181716] shadow-xl flex items-center justify-center border-2 border-[var(--color-primary)] group cursor-pointer"
                  aria-label={`Hotspot for ${product.title}`}
                >
                  <Plus className="w-4 h-4 text-[#181716] group-hover:rotate-45 transition-transform" />
                  <span className="absolute inset-0 rounded-full bg-[var(--color-primary)]/40 animate-ping" />
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
                className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[var(--color-border)] shadow-2xl z-30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={activeHotspotProduct.colors[0].images[0]}
                    alt={activeHotspotProduct.title}
                    className="w-12 h-15 object-cover rounded-xl bg-[#F7F5F0] shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--color-primary)] block">
                      Styled Piece
                    </span>
                    <h5
                      onClick={() => onSelectProduct(activeHotspotProduct.id)}
                      className="text-xs font-medium text-[#181716] truncate cursor-pointer hover:underline"
                    >
                      {activeHotspotProduct.title}
                    </h5>
                    <span className="text-xs font-semibold text-[#181716] mt-0.5 block">
                      {formatPrice(activeHotspotProduct.price)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => handleHotspotAdd(activeHotspotProduct)}
                    className="px-3.5 py-1.5 bg-[var(--color-primary)] hover:opacity-90 text-white text-[10px] uppercase font-semibold rounded-full flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    {addedItem === activeHotspotProduct.id ? <Check className="w-3 h-3" /> : 'Add'}
                  </button>
                  <button
                    onClick={() => setActiveHotspotProduct(null)}
                    className="text-[9px] text-[#8C8379] hover:text-black uppercase text-center cursor-pointer"
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
          <div className="border-b border-[var(--color-border)] pb-3">
            <span className="text-[10px] tracking-[0.2em] uppercase font-light text-[var(--color-primary)]">
              {currentLook.season}
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#181716] font-normal mt-0.5">
              {currentLook.title}
            </h3>
            <p className="text-xs text-[#706860] mt-1 font-light">{currentLook.subtitle}</p>
          </div>

          <div className="space-y-3">
            {lookProducts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ x: 2 }}
                className="p-3.5 bg-white border border-[var(--color-border)] rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.colors[0].images[0]}
                    alt={p.title}
                    onClick={() => onSelectProduct(p.id)}
                    className="w-14 h-18 object-cover rounded-xl cursor-pointer hover:opacity-90 bg-[#F7F5F0]"
                  />
                  <div>
                    <h5
                      onClick={() => onSelectProduct(p.id)}
                      className="text-xs sm:text-sm font-medium text-[#181716] hover:text-[var(--color-primary)] cursor-pointer"
                    >
                      {p.title}
                    </h5>
                    <p className="text-[11px] text-[#8C8379]">{p.fabric}</p>
                    <span className="text-xs font-semibold text-[#181716] mt-1 block">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onInstantAdd(p.id, p.colors[0].name, p.sizes[0].size)}
                  className="p-2.5 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-colors text-xs cursor-pointer shadow-2xs"
                  title="Quick Add to Bag"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
