import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';
import {
  Sparkles,
  ShoppingBag,
  Check,
  ArrowRight,
  Eye,
  Plus,
  ShieldCheck,
  Tag,
  Info,
} from 'lucide-react';

interface LookHotspot {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  image: string;
  xPercent: number; // 0 - 100%
  yPercent: number; // 0 - 100%
  defaultSize: string;
}

interface ShopTheCompleteLookProps {
  currentProduct: Product;
  allProducts: Product[];
  onAddToCart: (productId: string, colorName: string, size: string) => void;
  onSelectProduct: (productId: string) => void;
  onOpenBag?: () => void;
  className?: string;
}

export function ShopTheCompleteLook({
  currentProduct,
  allProducts,
  onAddToCart,
  onSelectProduct,
  onOpenBag,
  className = '',
}: ShopTheCompleteLookProps) {
  // Find coordinating pieces from the catalog to build a balanced 3-piece ensemble
  const coordinatingProducts = allProducts.filter((p) => p.id !== currentProduct.id);
  const bottomPiece = coordinatingProducts[0] || currentProduct;
  const accessoryPiece = coordinatingProducts[1] || currentProduct;

  // Selected sizes for each piece in the ensemble
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    [currentProduct.id]: currentProduct.sizes.find((s) => s.inStock)?.size || 'M',
    [bottomPiece.id]: bottomPiece.sizes.find((s) => s.inStock)?.size || 'M',
    [accessoryPiece.id]: accessoryPiece.sizes.find((s) => s.inStock)?.size || 'Free Size',
  });

  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(currentProduct.id);
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);
  const [addedSinglePieceId, setAddedSinglePieceId] = useState<string | null>(null);

  // Hotspots definitions placed anatomically on the styled model
  const hotspots: LookHotspot[] = [
    {
      id: currentProduct.id,
      productId: currentProduct.id,
      name: currentProduct.title,
      category: currentProduct.category,
      price: currentProduct.price,
      image: currentProduct.colors[0]?.images[0] || '',
      xPercent: 48,
      yPercent: 36,
      defaultSize: 'M',
    },
    {
      id: bottomPiece.id,
      productId: bottomPiece.id,
      name: bottomPiece.title,
      category: bottomPiece.category,
      price: bottomPiece.price,
      image: bottomPiece.colors[0]?.images[0] || '',
      xPercent: 52,
      yPercent: 68,
      defaultSize: 'M',
    },
    {
      id: accessoryPiece.id,
      productId: accessoryPiece.id,
      name: accessoryPiece.title,
      category: accessoryPiece.category,
      price: accessoryPiece.price,
      image: accessoryPiece.colors[0]?.images[0] || '',
      xPercent: 34,
      yPercent: 48,
      defaultSize: 'Free Size',
    },
  ];

  // Pricing calculations
  const totalRegularPrice = currentProduct.price + bottomPiece.price + accessoryPiece.price;
  const ensembleDiscount = Math.round(totalRegularPrice * 0.15); // 15% Ensemble bundle discount
  const bundleTotalPrice = totalRegularPrice - ensembleDiscount;

  // Add individual piece
  const handleAddSinglePiece = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0]?.size || 'M';
    const color = product.colors[0]?.name || 'Standard';
    onAddToCart(product.id, color, size);

    setAddedSinglePieceId(product.id);
    setTimeout(() => {
      setAddedSinglePieceId(null);
      if (onOpenBag) onOpenBag();
    }, 900);
  };

  // Add all 3 pieces in one click
  const handleAddEntireEnsemble = () => {
    const piecesToAdd = [currentProduct, bottomPiece, accessoryPiece];

    piecesToAdd.forEach((prod) => {
      const size = selectedSizes[prod.id] || prod.sizes[0]?.size || 'M';
      const color = prod.colors[0]?.name || 'Standard';
      onAddToCart(prod.id, color, size);
    });

    setAddedAllSuccess(true);
    setTimeout(() => {
      setAddedAllSuccess(false);
      if (onOpenBag) onOpenBag();
    }, 1200);
  };

  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId) || hotspots[0];
  const activeProduct = [currentProduct, bottomPiece, accessoryPiece].find(
    (p) => p.id === activeHotspot.productId
  ) || currentProduct;

  return (
    <div
      id="shop-the-complete-look-section"
      className={`bg-[#FAF7F2] border border-[#E8DFD1] p-6 sm:p-8 rounded-3xl space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2D8C9] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C7A6B]">
              Atelier Coordinated Dressing
            </span>
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl text-[#1A1816] font-normal mt-0.5">
            Shop the Complete Look
          </h3>
          <p className="text-xs text-[#7A6F64] mt-0.5">
            Tap pins on the styled model below to select sizing and add individual garments or the complete 3-piece coordinated ensemble.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#EFE9DF] px-3.5 py-1.5 rounded-full border border-[#DFD5C5]">
          <Tag className="w-3.5 h-3.5 text-[#B2593E]" />
          <span className="text-xs font-semibold text-[#1A1816]">
            15% Ensemble Privilege Applied
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Styled Model Photo + Hotspot Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Styled Model Photography with Hotspot Pins */}
        <div className="lg:col-span-6 relative aspect-[3/4] bg-[#221D18] rounded-2xl overflow-hidden shadow-md select-none group">
          <img
            src={
              currentProduct.gender === 'men'
                ? 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
                : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
            }
            alt="Styled Ensemble Complete Look"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />

          {/* Dark gradient base overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Interactive Hotspot Pins */}
          {hotspots.map((spot) => {
            const isSelected = activeHotspotId === spot.id;

            return (
              <div
                key={spot.id}
                style={{
                  top: `${spot.yPercent}%`,
                  left: `${spot.xPercent}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                {/* Ping wave animation */}
                <span className="absolute -inset-2 rounded-full bg-[#D4AF37]/50 animate-ping opacity-75" />

                <button
                  type="button"
                  onClick={() => setActiveHotspotId(spot.id)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4AF37] text-[#1A1816] scale-110 ring-4 ring-white/70'
                      : 'bg-[#1A1816]/90 text-white hover:bg-black hover:scale-105 border border-white/40'
                  }`}
                  aria-label={`Inspect ${spot.name}`}
                >
                  <Plus className={`w-4 h-4 ${isSelected ? 'rotate-45' : ''} transition-transform`} />
                </button>
              </div>
            );
          })}

          {/* Model Overlay Tip */}
          <div className="absolute bottom-3 inset-x-3 bg-black/65 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/10 flex items-center justify-between text-xs text-white">
            <span className="text-[11px] text-[#EDE6DC]">
              Active: <strong>{activeHotspot.name}</strong> ({activeHotspot.category})
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
              Tap Pins to Switch
            </span>
          </div>
        </div>

        {/* RIGHT: Active Piece Inspector & Ensemble Add Action */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Piece Card */}
          <div className="bg-white border border-[#E2D8C9] p-5 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={activeProduct.colors[0]?.images[0] || ''}
                  alt={activeProduct.title}
                  className="w-14 h-18 object-cover rounded-xl border border-[#EAE3D7]"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#B2593E] block">
                    {activeProduct.category}
                  </span>
                  <h4 className="font-semibold text-sm text-[#1A1816] mt-0.5 line-clamp-1">
                    {activeProduct.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-sm text-[#1A1816]">
                      {formatPrice(activeProduct.price)}
                    </span>
                    <span className="text-xs text-[#8C7A6B] line-through">
                      {formatPrice(activeProduct.mrp)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectProduct(activeProduct.id)}
                className="text-[11px] font-semibold text-[#8C7A6B] hover:text-[#1A1816] flex items-center gap-1 shrink-0"
              >
                <span>Full Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Size Selector for Active Piece */}
            <div className="space-y-1.5 pt-2 border-t border-[#F2ECE3]">
              <div className="flex justify-between text-xs">
                <span className="text-[#6D6257] font-medium">Select Size:</span>
                <span className="font-bold text-[#1A1816]">
                  {selectedSizes[activeProduct.id]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeProduct.sizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() =>
                      setSelectedSizes((prev) => ({
                        ...prev,
                        [activeProduct.id]: s.size,
                      }))
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      selectedSizes[activeProduct.id] === s.size
                        ? 'bg-[#1A1816] text-white border-[#1A1816]'
                        : 'bg-[#FAF8F5] text-[#5C5146] border-[#DDD5C7] hover:border-[#1A1816]'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Individual Piece CTA */}
            <button
              type="button"
              onClick={() => handleAddSinglePiece(activeProduct)}
              disabled={addedSinglePieceId === activeProduct.id}
              className={`w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                addedSinglePieceId === activeProduct.id
                  ? 'bg-[#2E5836] text-white'
                  : 'bg-white hover:bg-[#FAF8F5] text-[#1A1816] border border-[#1A1816]'
              }`}
            >
              {addedSinglePieceId === activeProduct.id ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added {activeProduct.title} to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Only This Piece ({formatPrice(activeProduct.price)})</span>
                </>
              )}
            </button>
          </div>

          {/* ENTIRE ENSEMBLE BUNDLE CARD */}
          <div className="p-5 bg-[#1A1816] text-[#FAF8F5] rounded-2xl space-y-4 shadow-md border border-[#3E362C]">
            <div className="flex items-center justify-between pb-3 border-b border-[#3E362C]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                  The Complete Curated Ensembe
                </span>
                <h4 className="font-editorial text-lg text-white font-normal mt-0.5">
                  All 3 Coordinating Pieces
                </h4>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#8C7A6B] line-through block">
                  {formatPrice(totalRegularPrice)}
                </span>
                <span className="text-lg font-bold font-mono text-[#D4AF37]">
                  {formatPrice(bundleTotalPrice)}
                </span>
              </div>
            </div>

            {/* Mini List of the 3 pieces */}
            <div className="space-y-2 text-xs">
              {[currentProduct, bottomPiece, accessoryPiece].map((piece, idx) => (
                <div
                  key={piece.id}
                  className="flex items-center justify-between py-1.5 border-b border-[#2C2620] last:border-none"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[#D4AF37] font-mono text-[11px] font-bold">
                      0{idx + 1}.
                    </span>
                    <span className="truncate text-[#DDD5C7]">{piece.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] bg-[#2E2822] text-[#D4AF37] px-2 py-0.5 rounded-full font-mono font-bold">
                      Size: {selectedSizes[piece.id]}
                    </span>
                    <span className="font-mono text-white text-[11px]">
                      {formatPrice(piece.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 1-Click "Add Complete Look to Bag" Button */}
            <button
              type="button"
              onClick={handleAddEntireEnsemble}
              disabled={addedAllSuccess}
              className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                addedAllSuccess
                  ? 'bg-[#2E5836] text-white'
                  : 'bg-[#D4AF37] hover:bg-[#E5C258] text-[#1A1816]'
              }`}
            >
              {addedAllSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ensemble Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add Complete 3-Piece Look ({formatPrice(bundleTotalPrice)})
                  </span>
                </>
              )}
            </button>

            <p className="text-[10px] text-[#A6998A] text-center">
              Includes 15% Atelier Ensemble Discount • Complimentary bespoke alteration pledge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
