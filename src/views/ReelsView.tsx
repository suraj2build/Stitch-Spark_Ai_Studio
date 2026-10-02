import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
  Heart,
  Share2,
  X,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ShoppableReel, Product } from '../types';
import { formatPrice } from '../utils/format';

interface ReelsViewProps {
  reels: ShoppableReel[];
  products: Product[];
  initialReelId?: string;
  onSelectProduct: (productId: string) => void;
  onAddToCart: (productId: string, colorName: string, size: string) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (productId: string) => void;
  onOpenBag: () => void;
}

export function ReelsView({
  reels,
  products,
  initialReelId,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  onOpenBag,
}: ReelsViewProps) {
  const initialIndex = initialReelId
    ? Math.max(0, reels.findIndex((r) => r.id === initialReelId))
    : 0;

  const [activeReelIndex, setActiveReelIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Bottom drawer / Sheet state for tagged products
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProductForSheet, setSelectedProductForSheet] = useState<Product | null>(null);
  const [sheetColor, setSheetColor] = useState<string>('');
  const [sheetSize, setSheetSize] = useState<string>('');
  const [addedItemConfirm, setAddedItemConfirm] = useState(false);

  const currentReel = reels[activeReelIndex] || reels[0];
  const taggedProducts = currentReel.taggedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleNext = () => {
    if (activeReelIndex < reels.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
      setSheetOpen(false);
      setSelectedProductForSheet(null);
    }
  };

  const handlePrev = () => {
    if (activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
      setSheetOpen(false);
      setSelectedProductForSheet(null);
    }
  };

  const openProductMiniSheet = (prod: Product) => {
    setSelectedProductForSheet(prod);
    setSheetColor(prod.colors[0].name);
    setSheetSize(prod.sizes[0]?.size || 'S');
    setSheetOpen(true);
  };

  const handleSheetAddToCart = () => {
    if (!selectedProductForSheet || !sheetSize) return;
    onAddToCart(selectedProductForSheet.id, sheetColor, sheetSize);
    setAddedItemConfirm(true);
    setTimeout(() => {
      setAddedItemConfirm(false);
      setSheetOpen(false);
    }, 1200);
  };

  return (
    <div id="watch-and-shop-page" className="min-h-[90vh] bg-[#141210] text-[#FAF8F5] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Subtitle & Info */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2521] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A85B3F] animate-ping" />
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#D4AF37]">
                Watch &amp; Shop Cinema
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-white mt-0.5">
              Live Fashion in Motion
            </h1>
          </div>
          <p className="text-xs text-[#9E9084] max-w-md">
            Direct shoppable video. Tap tagged products to select your size and add directly to your bag without pausing the experience.
          </p>
        </div>

        {/* Layout: Main 9:16 Video Player + Desktop Adjacent Product Rack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main 9:16 Vertical Video Frame */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-2xl border border-[#2B2621]">
              {/* HTML5 Video or Poster fallback */}
              {currentReel.videoUrl ? (
                <video
                  ref={videoRef}
                  src={currentReel.videoUrl}
                  poster={currentReel.thumbnail}
                  loop
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer"
                />
              ) : (
                <img
                  src={currentReel.thumbnail}
                  alt={currentReel.title}
                  className="w-full h-full object-cover"
                  onClick={togglePlay}
                />
              )}

              {/* Top Bar with Creator Info & Sound Control */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                  <img
                    src={currentReel.creator.avatar}
                    alt={currentReel.creator.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/50"
                  />
                  <div>
                    <span className="text-xs font-semibold block leading-tight">
                      {currentReel.creator.name}
                    </span>
                    <span className="text-[10px] text-[#D8CEBF]">
                      {currentReel.creator.handle}
                    </span>
                  </div>
                </div>

                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/15 hover:bg-black/60 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Center Play/Pause Overlay Indicator */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/35 z-10 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Vertical Navigation Arrows (Up / Down) */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                <button
                  disabled={activeReelIndex === 0}
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20 disabled:opacity-30 hover:bg-black"
                  aria-label="Previous reel"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  disabled={activeReelIndex === reels.length - 1}
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20 disabled:opacity-30 hover:bg-black"
                  aria-label="Next reel"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Reel Caption & Tagged Items Strip */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-12 z-20 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold tracking-wide drop-shadow-md">
                    {currentReel.title}
                  </h3>
                  <p className="text-xs text-[#D8CEBF] font-light mt-0.5 line-clamp-2">
                    {currentReel.caption}
                  </p>
                </div>

                {/* Tagged Products Mini Carousel / Button */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#A89D91]">
                    <span className="font-semibold uppercase tracking-wider text-[#FAF8F5]">
                      Shop Tagged Pieces ({taggedProducts.length})
                    </span>
                    <span>Tap item to select size</span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {taggedProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => openProductMiniSheet(p)}
                        className="flex items-center gap-2 bg-white/95 text-[#1A1816] p-2 rounded-xs shrink-0 cursor-pointer hover:bg-white transition-all shadow-md active:scale-95"
                      >
                        <img
                          src={p.colors[0].images[0]}
                          alt={p.title}
                          className="w-10 h-12 object-cover rounded-xs bg-[#EFE9DF]"
                        />
                        <div className="text-left">
                          <p className="text-[11px] font-semibold line-clamp-1 w-28">
                            {p.title}
                          </p>
                          <p className="text-xs font-bold text-[#A85B3F]">
                            {formatPrice(p.price)}
                          </p>
                          <span className="text-[9px] text-[#554C42] uppercase tracking-wider font-semibold">
                            Select Size →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Desktop Tagged Product Rack & Detail View */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#1C1815] p-5 rounded-xs border border-[#2B2621]">
              <div className="flex items-center justify-between pb-3 border-b border-[#2E2823]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#EDE6DC]">
                    Tagged Garments in This Reel
                  </h4>
                </div>
                <span className="text-[11px] text-[#9A8D80]">
                  Reel {activeReelIndex + 1} of {reels.length}
                </span>
              </div>

              <div className="divide-y divide-[#2E2823] mt-2">
                {taggedProducts.map((p) => (
                  <div key={p.id} className="py-4 first:pt-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.colors[0].images[0]}
                        alt={p.title}
                        onClick={() => onSelectProduct(p.id)}
                        className="w-16 h-20 object-cover rounded-xs bg-[#24201C] cursor-pointer hover:opacity-90"
                      />
                      <div>
                        <h5
                          onClick={() => onSelectProduct(p.id)}
                          className="text-xs sm:text-sm font-medium text-white hover:text-[#D4AF37] cursor-pointer"
                        >
                          {p.title}
                        </h5>
                        <p className="text-[11px] text-[#8C7F72]">{p.fabric}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs font-bold text-white">
                            {formatPrice(p.price)}
                          </span>
                          {p.mrp > p.price && (
                            <span className="text-[10px] text-[#7A6E63] line-through">
                              {formatPrice(p.mrp)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        onClick={() => openProductMiniSheet(p)}
                        className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-white text-[#1A1816] text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors"
                      >
                        Quick Buy
                      </button>
                      <button
                        onClick={() => onSelectProduct(p.id)}
                        className="text-[10px] text-[#A89C8F] hover:text-white underline"
                      >
                        Full Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reel Carousel Selector (Thumbnails) */}
            <div className="bg-[#1C1815] p-5 rounded-xs border border-[#2B2621]">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8C7F72] block mb-3">
                Explore All Shoppable Reels
              </span>
              <div className="grid grid-cols-4 gap-2">
                {reels.map((r, idx) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setActiveReelIndex(idx);
                      setSheetOpen(false);
                    }}
                    className={`aspect-[9/16] rounded-xs overflow-hidden cursor-pointer border-2 transition-all relative ${
                      activeReelIndex === idx
                        ? 'border-[#D4AF37] scale-102'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 text-[8px] bg-black/60 px-1 rounded-xs">
                      {r.views}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REEL PRODUCT MINI-SHEET (Instant Add to Bag without leaving Reel!) */}
      {sheetOpen && selectedProductForSheet && (
        <div
          id="reel-product-sheet-backdrop"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSheetOpen(false)}
        >
          <div
            id="reel-product-sheet"
            className="w-full sm:max-w-md bg-[#FAF8F5] text-[#1A1816] rounded-t-xl sm:rounded-lg p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#EAE3D7]">
              <div className="flex gap-3">
                <img
                  src={selectedProductForSheet.colors[0].images[0]}
                  alt={selectedProductForSheet.title}
                  className="w-14 h-18 object-cover rounded-xs bg-[#EFE9DF]"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A85B3F]">
                    Shop In-Reel
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#1A1816] line-clamp-1 mt-0.5">
                    {selectedProductForSheet.title}
                  </h4>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-bold text-sm text-[#1A1816]">
                      {formatPrice(selectedProductForSheet.price)}
                    </span>
                    {selectedProductForSheet.mrp > selectedProductForSheet.price && (
                      <span className="text-[11px] text-[#9A8D80] line-through">
                        {formatPrice(selectedProductForSheet.mrp)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSheetOpen(false)}>
                <X className="w-5 h-5 text-[#655A50]" />
              </button>
            </div>

            {/* Colour Variant */}
            <div className="mt-4">
              <span className="text-xs font-medium text-[#443B33] block mb-1.5">
                Colour: <strong>{sheetColor}</strong>
              </span>
              <div className="flex gap-2">
                {selectedProductForSheet.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSheetColor(c.name)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${
                      sheetColor === c.name
                        ? 'border-[#1A1816] bg-white font-semibold'
                        : 'border-[#DDD3C5] bg-white/50 text-[#6B5E51]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-4">
              <span className="text-xs font-medium text-[#443B33] block mb-1.5">
                Select Size
              </span>
              <div className="grid grid-cols-4 gap-2">
                {selectedProductForSheet.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={!s.inStock}
                    onClick={() => setSheetSize(s.size)}
                    className={`py-2 text-xs font-semibold rounded-xs border transition-all ${
                      !s.inStock
                        ? 'border-[#EAE3D7] bg-[#F2ECE1] text-[#A6998C] line-through'
                        : sheetSize === s.size
                        ? 'border-[#1A1816] bg-[#1A1816] text-white'
                        : 'border-[#DDD3C5] bg-white hover:border-[#1A1816]'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={handleSheetAddToCart}
                className={`flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-[0.16em] rounded-xs transition-all flex items-center justify-center gap-2 ${
                  addedItemConfirm
                    ? 'bg-[#3F6A48] text-white'
                    : 'bg-[#1F1C18] text-white hover:bg-black'
                }`}
              >
                {addedItemConfirm ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <span>Add to Bag</span>
                )}
              </button>

              <button
                onClick={() => {
                  onSelectProduct(selectedProductForSheet.id);
                  setSheetOpen(false);
                }}
                className="px-4 py-3 border border-[#1A1816] text-[#1A1816] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#1A1816] hover:text-white transition-colors"
              >
                PDP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
