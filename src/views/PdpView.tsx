import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Star,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Ruler,
  Sparkles,
  Check,
  AlertCircle,
  Plus,
  ArrowRight,
  Maximize2,
  X,
  Share2,
} from 'lucide-react';
import { Product, Review } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../utils/format';
import {
  ContextualLightingControl,
  LightingMode,
  LIGHTING_CONFIGS,
} from '../components/ContextualLightingControl';
import { DigitalProductPassportModal } from '../components/DigitalProductPassportModal';
import { DigitalProductPassportBadge } from '../components/DigitalProductPassportBadge';
import { ShopTheCompleteLook } from '../components/ShopTheCompleteLook';

interface PdpViewProps {
  product: Product;
  allProducts: Product[];
  onSelectProduct: (productId: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string, colorName: string, size: string) => void;
  onOpenSizeGuide: () => void;
  onOpenBag: () => void;
  recentlyViewedIds: string[];
}

export function PdpView({
  product,
  allProducts,
  onSelectProduct,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenSizeGuide,
  onOpenBag,
  recentlyViewedIds,
}: PdpViewProps) {
  // Color and size selection state
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const currentColor = product.colors[selectedColorIndex] || product.colors[0];

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeError, setSizeError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  // Gallery zoom state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);

  // Next-Gen Features: Contextual Lighting & Digital Product Passport
  const [lightingMode, setLightingMode] = useState<LightingMode>('daylight');
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const lightingConfig = LIGHTING_CONFIGS[lightingMode];

  // Pincode Delivery State
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'deliverable' | 'undeliverable'>('idle');

  // Accordions open/close state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    fit: true,
    fabric: false,
    shipping: false,
    manufacturing: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Frequently bought together bundle selection
  const bundleCandidates = allProducts.filter((p) => p.id !== product.id).slice(0, 2);
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>([
    product.id,
    bundleCandidates[0]?.id || '',
  ].filter(Boolean));

  // Dynamic Reviews & Star Rating System
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  useEffect(() => {
    setReviews(product.reviews || []);
  }, [product.id, product.reviews]);

  const [reviewSortBy, setReviewSortBy] = useState<'highest' | 'lowest' | 'newest'>('highest');
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');

  // Review Form State (usable inline or in modal)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [showInlineReviewForm, setShowInlineReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewHoverRating, setNewReviewHoverRating] = useState(0);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewSize, setNewReviewSize] = useState('M');
  const [newReviewColor, setNewReviewColor] = useState(currentColor.name);
  const [newReviewFit, setNewReviewFit] = useState<'True to size' | 'Runs slightly small' | 'Runs slightly large'>('True to size');
  const [newReviewSubmitted, setNewReviewSubmitted] = useState(false);

  // Review submission handler
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewTitle.trim() || !newReviewComment.trim()) return;

    const newReviewItem: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewName.trim(),
      rating: newReviewRating,
      date: 'Just now',
      verified: true,
      title: newReviewTitle.trim(),
      comment: newReviewComment.trim(),
      fitFeedback: newReviewFit,
      purchasedSize: newReviewSize || selectedSize || 'M',
      purchasedColor: newReviewColor || currentColor.name,
    };

    setReviews((prev) => [newReviewItem, ...prev]);
    setNewReviewSubmitted(true);
    setTimeout(() => {
      setNewReviewSubmitted(false);
      setShowInlineReviewForm(false);
      setReviewModalOpen(false);
      setNewReviewName('');
      setNewReviewTitle('');
      setNewReviewComment('');
      setNewReviewRating(5);
    }, 1600);
  };

  // Dynamic calculations
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1))
    : product.rating;

  const starCounts: Record<number, number> = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const getStarPercentage = (count: number) => {
    if (totalReviewsCount === 0) return 0;
    return Math.round((count / totalReviewsCount) * 100);
  };

  // Filter and sort reviews (supports sorting by highest rating)
  const displayedReviews = [...reviews]
    .filter((r) => (starFilter === 'all' ? true : r.rating === starFilter))
    .sort((a, b) => {
      if (reviewSortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (reviewSortBy === 'lowest') {
        return a.rating - b.rating;
      }
      // newest
      return b.id.localeCompare(a.id);
    });

  // Sticky Mobile Purchase Bar
  const buyButtonRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (buyButtonRef.current) {
        const rect = buyButtonRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pincode validation handler
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus('undeliverable');
      return;
    }
    setPincodeStatus('checking');
    setTimeout(() => {
      if (['000000', '999999'].includes(pincode.trim())) {
        setPincodeStatus('undeliverable');
      } else {
        setPincodeStatus('deliverable');
      }
    }, 600);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    onAddToCart(product.id, currentColor.name, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    onAddToCart(product.id, currentColor.name, selectedSize);
    onOpenBag();
  };

  // Complete The Look items
  const completeLookItems = allProducts.filter((p) => p.id !== product.id).slice(0, 2);

  // Recommendations: Similar styles & recently viewed
  const similarStyles = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 4);

  const recentlyViewed = recentlyViewedIds
    .filter((id) => id !== product.id)
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <div id="pdp-container" className="pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-[#8C7F72]">
        <div className="flex items-center gap-2">
          <span className="hover:text-[#1A1816] cursor-pointer">Home</span>
          <span>/</span>
          <span className="capitalize">{product.gender}</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-[#1A1816] font-medium truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* Main PDP Grid: Media + Purchase Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* LEFT: Product Media Area */}
          <div className="lg:col-span-7 space-y-4">
            {/* Contextual Lighting Preview Controller */}
            <ContextualLightingControl
              currentMode={lightingMode}
              onChangeMode={setLightingMode}
              className="mb-2"
            />

            {/* Desktop 2-column or large gallery */}
            <div className="hidden sm:grid grid-cols-2 gap-3">
              {currentColor.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setZoomModalOpen(true);
                  }}
                  className={`group relative aspect-[3/4] bg-[#F0EBE2] overflow-hidden rounded-2xl cursor-zoom-in ${
                    idx === 0 ? 'col-span-2 aspect-[4/5]' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    style={{
                      filter: lightingConfig.filter,
                      transition: 'filter 0.4s ease',
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  {/* Ambient Light Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-500"
                    style={lightingConfig.overlayStyle}
                  />

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/80 rounded-full backdrop-blur-xs z-10">
                    <Maximize2 className="w-4 h-4 text-[#1A1816]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Swipeable Gallery */}
            <div className="sm:hidden relative aspect-[3/4] bg-[#F0EBE2] overflow-hidden rounded-2xl">
              <img
                src={currentColor.images[activeImageIndex] || currentColor.images[0]}
                alt={product.title}
                style={{
                  filter: lightingConfig.filter,
                  transition: 'filter 0.4s ease',
                }}
                className="w-full h-full object-cover"
                onClick={() => setZoomModalOpen(true)}
              />
              {/* Mobile Ambient Light Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-500"
                style={lightingConfig.overlayStyle}
              />

              {/* Image Indicators */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                {currentColor.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeImageIndex === idx ? 'w-5 bg-[#1A1816]' : 'w-1.5 bg-black/30'
                    }`}
                  />
                ))}
              </div>

              {/* Wishlist Floating Mobile */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs"
              >
                <Heart
                  className={`w-4 h-4 stroke-[1.5] ${isWishlisted ? 'fill-[#A85B3F] text-[#A85B3F]' : 'text-[#2C2723]'}`}
                />
              </button>
            </div>
          </div>

          {/* RIGHT: Purchase Panel (Sticky on Desktop) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Header / Brand / Title */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7F72]">
                  VANYA ATELIER
                </span>
                {product.badges?.[0] && (
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 bg-[#1F1C18] text-[#FAF8F5]">
                    {product.badges[0]}
                  </span>
                )}
              </div>

              <h1 className="font-editorial text-2xl sm:text-4xl text-[#1A1816] font-normal mt-1 leading-tight">
                {product.title}
              </h1>

              <p className="text-xs text-[#7A6F64] mt-1 font-light leading-relaxed">
                {product.subtitle}
              </p>

              {/* Ratings Summary (Click to scroll to reviews) */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('pdp-reviews');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 mt-3 text-xs cursor-pointer group text-left"
                aria-label="Scroll to customer reviews"
              >
                <div className="flex items-center text-[#D4AF37]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(averageRating)
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-[#DDD4C6]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-[#1A1816]">{averageRating}</span>
                <span className="text-[#8C7F72] group-hover:underline">
                  ({totalReviewsCount} verified {totalReviewsCount === 1 ? 'review' : 'reviews'})
                </span>
              </button>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1A1816]">
                  {formatPrice(product.price)}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-sm text-[#94887C] line-through">
                      {formatPrice(product.mrp)}
                    </span>
                    <span className="text-xs font-bold text-[#A85B3F] bg-[#F7EBE7] px-2 py-0.5 rounded-full">
                      {product.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#8C7F72] mt-0.5">Inclusive of all Indian taxes</p>
            </div>

            {/* Colour Variant Selection */}
            <div className="border-t border-[#EAE3D7] pt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-[#38312B]">
                  Colour:{' '}
                  <strong className="font-semibold text-[#1A1816]">{currentColor.name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColorIndex(idx);
                      setActiveImageIndex(0);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all ${
                      selectedColorIndex === idx
                        ? 'border-[#1A1816] bg-white font-semibold shadow-xs'
                        : 'border-[#DDD4C6] bg-white/50 text-[#61564C] hover:border-[#1A1816]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Experience */}
            <div className="border-t border-[#EAE3D7] pt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-[#38312B]">Select Size</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-[#A85B3F] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-[#A85B3F] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>My Size</span>
                  </button>
                </div>
              </div>

              {/* Size Chips */}
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s.size;
                  const isAvailable = s.inStock;

                  return (
                    <button
                      key={s.size}
                      onClick={() => {
                        if (!isAvailable) {
                          setNotifyModalOpen(s.size);
                        } else {
                          setSelectedSize(s.size);
                          setSizeError(false);
                        }
                      }}
                      className={`py-3 text-xs font-semibold rounded-full border transition-all relative ${
                        !isAvailable
                          ? 'border-[#EBE4D8] bg-[#F5EFE6]/60 text-[#B8ACA0] hover:bg-[#F2ECE1] cursor-pointer'
                          : isSelected
                          ? 'border-[#1A1816] bg-[#1A1816] text-[#FAF8F5] shadow-xs'
                          : 'border-[#DDD3C5] bg-white hover:border-[#1A1816] text-[#1A1816]'
                      }`}
                    >
                      <span className={!isAvailable ? 'line-through' : ''}>{s.size}</span>
                      {s.stockCount && s.stockCount <= 3 && isAvailable && (
                        <span className="block text-[8px] text-[#A85B3F] font-normal leading-none mt-0.5">
                          Only {s.stockCount} left
                        </span>
                      )}
                      {!isAvailable && (
                        <span className="block text-[7px] text-[#A85B3F] uppercase tracking-tighter font-bold leading-none mt-0.5">
                          Notify Me
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {sizeError && (
                <p className="text-xs text-[#962E3B] mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please select a size to proceed with purchase</span>
                </p>
              )}

              {/* Model Specification */}
              <div className="mt-3 text-[11px] text-[#7A6F64] bg-[#F2EDE4]/60 p-2.5 rounded-2xl border border-[#E5DDD1]">
                <strong>Model Note:</strong> Model is {product.modelInfo.height} wearing size {product.modelInfo.wearingSize}.
              </div>
            </div>

            {/* Primary Purchase CTAs */}
            <div ref={buyButtonRef} className="space-y-2 pt-2">
              <div className="flex gap-3">
                <button
                  id="btn-add-to-bag"
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-6 text-xs uppercase tracking-[0.2em] font-bold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isAdded
                      ? 'bg-[#3F6A48] text-white'
                      : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:scale-[0.99]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <span>Add to Bag</span>
                  )}
                </button>

                <button
                  id="btn-pdp-wishlist"
                  onClick={() => onToggleWishlist(product.id)}
                  className="w-13 border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 stroke-[1.5] ${
                      isWishlisted ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[#1A1816]'
                    }`}
                  />
                </button>
              </div>

              <button
                id="btn-buy-now"
                onClick={handleBuyNow}
                className="w-full py-3 text-xs uppercase tracking-[0.18em] font-semibold border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors rounded-full cursor-pointer"
              >
                Instant Buy
              </button>

              {/* Shop Complete Look Quick Trigger */}
              <button
                type="button"
                onClick={() => {
                  document.getElementById('complete-the-look')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-3 bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-semibold text-[#1A1816] rounded-full flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Shop Coordinated 3-Piece Ensemble (15% Off)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              </button>
            </div>

            {/* Next-Gen: Digital Product Passport (DPP) Badge */}
            <DigitalProductPassportBadge
              product={product}
              onOpenPassport={() => setPassportModalOpen(true)}
            />

            {/* Delivery Pincode Verification Module */}
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-4 rounded-2xl text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-[#2D2722] font-semibold uppercase tracking-wider text-[11px]">
                <Truck className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Delivery &amp; COD Availability</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Indian Pincode (e.g. 110001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[#DDD4C6] rounded-xl text-xs focus:outline-none focus:border-[#1A1816]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A1816] text-white uppercase text-[11px] font-semibold tracking-wider rounded-full hover:bg-black"
                >
                  {pincodeStatus === 'checking' ? 'Verifying...' : 'Check'}
                </button>
              </form>

              {pincodeStatus === 'deliverable' && (
                <div className="p-3 bg-[#EAF2EC] border border-[#CDE1D0] rounded-2xl text-[#204928] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Check className="w-4 h-4 text-[#3F6A48]" />
                    <span>Deliverable to {pincode}</span>
                  </div>
                  <p className="text-[11px]">
                    • <strong>Estimated Delivery:</strong> 3-4 business days (Free Express Shipping)
                  </p>
                  <p className="text-[11px]">• <strong>Cash on Delivery:</strong> Available</p>
                  <p className="text-[11px]">• <strong>Exchanges:</strong> 7-Day Doorstep Pickup</p>
                </div>
              )}

              {pincodeStatus === 'undeliverable' && (
                <p className="text-[#962E3B] text-[11px] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please enter a valid 6-digit Indian postal code.</span>
                </p>
              )}
            </div>

            {/* Progressive Disclosure Accordions */}
            <div className="border-t border-[#EAE3D7] divide-y divide-[#EAE3D7] text-xs">
              {/* Product Details */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between font-semibold uppercase tracking-wider text-[11px] text-[#1A1816]"
                >
                  <span>Product Details</span>
                  {openAccordions.details ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.details && (
                  <ul className="mt-3 space-y-1.5 text-[#5C5146] pl-4 list-disc">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Fit & Size */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion('fit')}
                  className="w-full flex items-center justify-between font-semibold uppercase tracking-wider text-[11px] text-[#1A1816]"
                >
                  <span>Fit &amp; Sizing Notes</span>
                  {openAccordions.fit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.fit && (
                  <div className="mt-3 text-[#5C5146] space-y-1.5">
                    <p><strong>Silhouette:</strong> {product.fit}</p>
                    <p>{product.fitNotes}</p>
                  </div>
                )}
              </div>

              {/* Fabric & Care */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full flex items-center justify-between font-semibold uppercase tracking-wider text-[11px] text-[#1A1816]"
                >
                  <span>Fabric &amp; Artisan Care</span>
                  {openAccordions.fabric ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.fabric && (
                  <div className="mt-3 text-[#5C5146] space-y-2">
                    <p><strong>Textile Composition:</strong> {product.fabric}</p>
                    <ul className="space-y-1 pl-4 list-disc">
                      {product.care.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between font-semibold uppercase tracking-wider text-[11px] text-[#1A1816]"
                >
                  <span>Shipping &amp; 7-Day Returns</span>
                  {openAccordions.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.shipping && (
                  <div className="mt-3 text-[#5C5146] space-y-1.5">
                    <p>• Complimentary express shipping across India on orders above ₹1,999.</p>
                    <p>• Hassle-free 7-day doorstep return and size exchange pickup.</p>
                    <p>• Reverse pickup scheduled within 24-48 hours of request initiation.</p>
                  </div>
                )}
              </div>

              {/* Manufacturing Information & Country of Origin */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleAccordion('manufacturing')}
                  className="w-full flex items-center justify-between font-semibold uppercase tracking-wider text-[11px] text-[#1A1816]"
                >
                  <span>Artisan Origin &amp; Transparency</span>
                  {openAccordions.manufacturing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.manufacturing && (
                  <div className="mt-3 text-[#5C5146] space-y-1.5">
                    <p><strong>Country of Origin:</strong> India</p>
                    <p><strong>Weaving Cluster:</strong> {product.manufacturing.artisanCluster}</p>
                    <p><strong>Craft Hub:</strong> {product.manufacturing.origin}</p>
                    <p><strong>Eco Protocol:</strong> {product.manufacturing.sustainableNote}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEXT-GEN: SHOP THE COMPLETE LOOK (INTERACTIVE MODEL HOTSPOTS + 1-CLICK ENSEMBLE) */}
      <section id="complete-the-look" className="py-12 border-t border-[#EAE3D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShopTheCompleteLook
            currentProduct={product}
            allProducts={allProducts}
            onAddToCart={onAddToCart}
            onSelectProduct={onSelectProduct}
            onOpenBag={onOpenBag}
          />
        </div>
      </section>

      {/* FREQUENTLY BOUGHT TOGETHER BUNDLE */}
      {bundleCandidates.length > 0 && (
        <section id="frequently-bought-together" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="border border-[#DFD6C8] bg-white p-6 sm:p-8 rounded-full">
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#A85B3F] block">
              Curated Ensemble
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#1A1816] font-normal mt-1 mb-6">
              Frequently Bought Together
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Product thumbnails with plus signs */}
              <div className="lg:col-span-8 flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Main Product */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBundleIds.includes(product.id)}
                    onChange={() => {
                      setSelectedBundleIds((prev) =>
                        prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
                      );
                    }}
                    className="accent-[#1A1816]"
                  />
                  <img
                    src={currentColor.images[0]}
                    alt={product.title}
                    className="w-16 h-20 sm:w-20 sm:h-26 object-cover rounded-2xl bg-[#EFE9DF]"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-[#1A1816] line-clamp-1">{product.title}</p>
                    <p className="text-[#A85B3F] font-bold">{formatPrice(product.price)}</p>
                  </div>
                </div>

                <Plus className="w-4 h-4 text-[#8C7F72] hidden sm:block" />

                {/* Candidate 1 */}
                {bundleCandidates[0] && (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedBundleIds.includes(bundleCandidates[0].id)}
                      onChange={() => {
                        setSelectedBundleIds((prev) =>
                          prev.includes(bundleCandidates[0].id)
                            ? prev.filter((id) => id !== bundleCandidates[0].id)
                            : [...prev, bundleCandidates[0].id]
                        );
                      }}
                      className="accent-[#1A1816]"
                    />
                    <img
                      src={bundleCandidates[0].colors[0].images[0]}
                      alt={bundleCandidates[0].title}
                      className="w-16 h-20 sm:w-20 sm:h-26 object-cover rounded-2xl bg-[#EFE9DF]"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-[#1A1816] line-clamp-1">{bundleCandidates[0].title}</p>
                      <p className="text-[#A85B3F] font-bold">{formatPrice(bundleCandidates[0].price)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bundle Checkout Box */}
              <div className="lg:col-span-4 bg-[#FAF7F2] p-5 border border-[#E3DBD0] rounded-2xl text-xs space-y-3">
                <div>
                  <span className="text-[#7A6E63]">Total for {selectedBundleIds.length} items:</span>
                  <div className="text-xl font-bold text-[#1A1816] mt-0.5">
                    {formatPrice(
                      [product, ...bundleCandidates]
                        .filter((p) => selectedBundleIds.includes(p.id))
                        .reduce((acc, curr) => acc + curr.price, 0)
                    )}
                  </div>
                </div>

                <button
                  disabled={selectedBundleIds.length === 0}
                  onClick={() => {
                    if (selectedBundleIds.includes(product.id)) {
                      onAddToCart(product.id, currentColor.name, selectedSize || product.sizes[0].size);
                    }
                    if (bundleCandidates[0] && selectedBundleIds.includes(bundleCandidates[0].id)) {
                      onAddToCart(
                        bundleCandidates[0].id,
                        bundleCandidates[0].colors[0].name,
                        bundleCandidates[0].sizes[0].size
                      );
                    }
                    onOpenBag();
                  }}
                  className="w-full py-3 bg-[#1F1C18] hover:bg-black text-[#FAF8F5] uppercase tracking-[0.16em] font-semibold rounded-full transition-colors"
                >
                  Add Selected to Bag
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RATINGS & REVIEWS SOCIAL PROOF */}
      <section id="pdp-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#EAE3D7]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Star Rating System & Distribution Bars */}
          <div className="md:col-span-4 space-y-5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#A85B3F]">
                Verified Customer Feedback
              </span>
              <h3 className="font-editorial text-3xl text-[#1A1816] font-normal mt-1">
                Ratings &amp; Reviews
              </h3>
            </div>

            {/* Overall Score */}
            <div className="flex items-baseline gap-3">
              <span className="font-editorial text-5xl font-bold text-[#1A1816]">
                {averageRating}
              </span>
              <div>
                <div className="flex text-[#D4AF37]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(averageRating)
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-[#DDD4C6]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#7A6F64] block mt-0.5">
                  Based on {totalReviewsCount} customer {totalReviewsCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            {/* Interactive Star Distribution Bars */}
            <div className="space-y-2 text-xs text-[#61564B]">
              <span className="text-[10px] uppercase tracking-wider text-[#8A7D70] font-semibold block">
                Filter by Star Rating:
              </span>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = starCounts[stars] || 0;
                const pct = getStarPercentage(count);
                const isSelected = starFilter === stars;

                return (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setStarFilter((prev) => (prev === stars ? 'all' : stars))}
                    className={`w-full flex items-center gap-2.5 p-1.5 rounded-full transition-colors group cursor-pointer ${
                      isSelected ? 'bg-[#FAF3E0] ring-1 ring-[#D4AF37]' : 'hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="w-6 text-right font-medium group-hover:text-[#1A1816]">
                      {stars}★
                    </span>
                    <div className="flex-1 bg-[#EAE3D7] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1A1816] h-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-[11px] text-[#8C8074] text-right font-mono">
                      {count} ({pct}%)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Fit Feedback Highlight */}
            <div className="p-3 bg-[#FAF7F2] border border-[#E8DFD1] rounded-2xl text-xs space-y-1">
              <span className="font-semibold text-[#1A1816] text-[11px] uppercase tracking-wider block">
                Patron Fit Consensus
              </span>
              <p className="text-[#6B5E52] text-[11px]">
                96% of verified buyers say this silhouette is <strong>True to size</strong> tailored for Indian body profiles.
              </p>
            </div>

            {/* Write a Review Button */}
            <button
              id="btn-write-review-toggle"
              type="button"
              onClick={() => setShowInlineReviewForm((prev) => !prev)}
              className="w-full py-3 bg-[#1A1816] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{showInlineReviewForm ? 'Close Review Form' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Right: Review Controls, Form & Reviews List */}
          <div className="md:col-span-8 space-y-5">
            {/* Inline Review Submission Form */}
            {showInlineReviewForm && (
              <div
                id="inline-review-submission-card"
                className="p-5 sm:p-6 bg-[#FAF8F5] border border-[#E5DFD5] rounded-2xl shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D7]">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A85B3F] block">
                      Share Your Experience
                    </span>
                    <h4 className="font-editorial text-2xl text-[#1A1816] font-normal mt-0.5">
                      Review {product.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInlineReviewForm(false)}
                    className="p-1 text-[#8C7F72] hover:text-[#1A1816]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {newReviewSubmitted ? (
                  <div className="py-8 text-center space-y-2">
                    <Check className="w-8 h-8 text-[#2E5836] mx-auto" />
                    <h5 className="font-editorial text-2xl text-[#1A1816]">Thank you for your feedback!</h5>
                    <p className="text-xs text-[#7A6E63] max-w-sm mx-auto">
                      Your review has been verified and added to the patron ledger.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                    {/* Interactive Star Rating Selector */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#38312A] mb-1.5">
                        Your Star Rating *
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setNewReviewHoverRating(star)}
                              onMouseLeave={() => setNewReviewHoverRating(0)}
                              onClick={() => setNewReviewRating(star)}
                              className="p-1 cursor-pointer transition-transform hover:scale-115"
                              aria-label={`${star} Stars`}
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  star <= (newReviewHoverRating || newReviewRating)
                                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                                    : 'text-[#DCD5C9]'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-[#8C6D1F] ml-2">
                          {(newReviewHoverRating || newReviewRating) === 5 && '5★ — Exceptional (Flawless drape & weave)'}
                          {(newReviewHoverRating || newReviewRating) === 4 && '4★ — Highly Recommended'}
                          {(newReviewHoverRating || newReviewRating) === 3 && '3★ — Satisfactory'}
                          {(newReviewHoverRating || newReviewRating) === 2 && '2★ — Below Expectations'}
                          {(newReviewHoverRating || newReviewRating) === 1 && '1★ — Needs Improvement'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#38312A] mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Radhika Menon"
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded-xl text-xs text-[#1A1816] focus:outline-none focus:border-[#B2593E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#38312A] mb-1">
                          Headline / Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sublime drape and rich texture"
                          value={newReviewTitle}
                          onChange={(e) => setNewReviewTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded-xl text-xs text-[#1A1816] focus:outline-none focus:border-[#B2593E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#38312A] mb-1">
                          Purchased Size
                        </label>
                        <select
                          value={newReviewSize}
                          onChange={(e) => setNewReviewSize(e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-[#DDD5C7] rounded-xl text-xs text-[#1A1816] focus:outline-none"
                        >
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((sz) => (
                            <option key={sz} value={sz}>{sz}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#38312A] mb-1">
                          Colorway
                        </label>
                        <select
                          value={newReviewColor}
                          onChange={(e) => setNewReviewColor(e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-[#DDD5C7] rounded-xl text-xs text-[#1A1816] focus:outline-none"
                        >
                          {product.colors.map((c) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#38312A] mb-1">
                          Fit Experience
                        </label>
                        <select
                          value={newReviewFit}
                          onChange={(e) => setNewReviewFit(e.target.value as any)}
                          className="w-full px-2.5 py-2 bg-white border border-[#DDD5C7] rounded-xl text-xs text-[#1A1816] focus:outline-none"
                        >
                          <option value="True to size">True to size</option>
                          <option value="Runs slightly small">Runs slightly small</option>
                          <option value="Runs slightly large">Runs slightly large</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#38312A] mb-1">
                        Detailed Review Feedback *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Tell other patrons about the fabric feel, drape, craftsmanship, and how you styled it..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded-xl text-xs text-[#1A1816] focus:outline-none focus:border-[#B2593E]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#8C7A6B]">
                        Reviews are published immediately after automatic spam filtering.
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowInlineReviewForm(false)}
                          className="px-4 py-2 border border-[#DDD5C7] text-[#5C5146] hover:bg-[#F2ECE1] uppercase tracking-wider text-xs font-semibold rounded-full transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#1A1816] hover:bg-black text-[#FAF8F5] uppercase tracking-wider text-xs font-semibold rounded-full transition-colors cursor-pointer shadow-xs"
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Filter & Sort Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE3D7]">
              {/* Star Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] font-semibold mr-1">
                  Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setStarFilter('all')}
                  className={`text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider font-medium transition-colors ${
                    starFilter === 'all'
                      ? 'bg-[#1A1816] text-white font-semibold'
                      : 'bg-white border border-[#D8CEBF] text-[#6B5E52] hover:border-[#1A1816]'
                  }`}
                >
                  All ({totalReviewsCount})
                </button>
                {[5, 4, 3].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarFilter(star)}
                    className={`text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider font-medium transition-colors ${
                      starFilter === star
                        ? 'bg-[#1A1816] text-white font-semibold'
                        : 'bg-white border border-[#D8CEBF] text-[#6B5E52] hover:border-[#1A1816]'
                    }`}
                  >
                    {star}★ ({starCounts[star] || 0})
                  </button>
                ))}
              </div>

              {/* Sort Selector: specifically provides "Sort by Highest Rating" */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] font-semibold shrink-0">
                  Sort:
                </span>
                <select
                  id="reviews-sort-by-select"
                  value={reviewSortBy}
                  onChange={(e) => setReviewSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-white border border-[#D8CEBF] rounded-full text-xs text-[#1A1816] font-medium focus:outline-none focus:border-[#B2593E] cursor-pointer"
                  aria-label="Sort reviews"
                >
                  <option value="highest">Highest Rating (5★ → 1★)</option>
                  <option value="lowest">Lowest Rating (1★ → 5★)</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Active Filter Notice */}
            {starFilter !== 'all' && (
              <div className="flex items-center justify-between p-2.5 bg-[#FAF3E0] border border-[#E8D4A2] rounded-2xl text-xs text-[#8C6D1F]">
                <span>
                  Showing reviews with <strong>{starFilter} Stars</strong> ({displayedReviews.length} found)
                </span>
                <button
                  type="button"
                  onClick={() => setStarFilter('all')}
                  className="text-xs font-semibold text-[#B2593E] hover:underline"
                >
                  Clear Filter ×
                </button>
              </div>
            )}

            {/* Reviews List */}
            {displayedReviews.length === 0 ? (
              <div className="py-12 text-center bg-[#FAF8F5] border border-[#EAE3D7] rounded-2xl space-y-2">
                <p className="font-editorial text-lg text-[#1A1816]">No reviews found matching this filter</p>
                <button
                  type="button"
                  onClick={() => setStarFilter('all')}
                  className="text-xs text-[#B2593E] font-semibold underline"
                >
                  Show all {totalReviewsCount} reviews
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#EAE3D7] space-y-4">
                {displayedReviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#1A1816]">{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-[#E8F2EA] text-[#2F6139] px-2 py-0.5 rounded-full font-semibold">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#9A8E82] font-mono">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-[#D4AF37]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : 'text-[#DDD4C6]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-[#1A1816]">{rev.title}</span>
                    </div>

                    <p className="text-xs text-[#52473D] leading-relaxed font-light">
                      {rev.comment}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#8C7F72]">
                      <span>Purchased: Size {rev.purchasedSize} ({rev.purchasedColor})</span>
                      <span>•</span>
                      <span className="text-[#3F6A48] font-medium">Fit: {rev.fitFeedback}</span>
                    </div>

                    {rev.userImage && (
                      <div className="pt-1">
                        <img
                          src={rev.userImage}
                          alt="Customer photo"
                          className="w-16 h-20 object-cover rounded-2xl border border-[#DFD6C8]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS: YOU MAY ALSO LIKE & RECENTLY VIEWED */}
      <section id="recommendations-rails" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#EAE3D7] space-y-14">
        {/* You May Also Like */}
        <div>
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7F72] block">
              Curated Companions
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#1A1816] font-normal mt-0.5">
              You May Also Like
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarStyles.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onSelectProduct={onSelectProduct}
                isWishlisted={false}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={() => onSelectProduct(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7F72] block">
                Session History
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#1A1816] font-normal mt-0.5">
                Recently Viewed
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onSelectProduct={onSelectProduct}
                  isWishlisted={false}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={() => onSelectProduct(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MOBILE STICKY PURCHASE BAR */}
      {showStickyBar && (
        <div
          id="mobile-sticky-purchase-bar"
          className="fixed bottom-0 inset-x-0 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#EAE3D7] p-3 z-40 sm:hidden shadow-lg"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={currentColor.images[0]}
                alt={product.title}
                className="w-10 h-12 object-cover rounded-2xl bg-[#EFE9DF] shrink-0"
              />
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-[#1A1816] truncate block leading-tight">
                  {product.title}
                </span>
                <span className="text-xs font-bold text-[#A85B3F]">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-5 py-2.5 bg-[#1F1C18] text-white text-xs uppercase tracking-wider font-semibold rounded-full shrink-0"
            >
              {selectedSize ? `Add ${selectedSize}` : 'Select Size'}
            </button>
          </div>
        </div>
      )}

      {/* NOTIFY ME MODAL FOR OUT-OF-STOCK SIZES */}
      {notifyModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setNotifyModalOpen(null)}
        >
          <div
            className="w-full max-w-sm bg-[#FAF8F5] p-6 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D7]">
              <h4 className="font-editorial text-xl font-normal text-[#1A1816]">
                Notify When Restocked
              </h4>
              <button onClick={() => setNotifyModalOpen(null)}>
                <X className="w-5 h-5 text-[#6E6358]" />
              </button>
            </div>
            <p className="text-xs text-[#7A6E63] mt-3">
              Size <strong>{notifyModalOpen}</strong> is currently being woven by our master artisans. Leave your email for immediate priority access.
            </p>
            {notifySubmitted ? (
              <div className="mt-4 p-3 bg-[#E8F2EA] text-[#285832] text-xs font-medium rounded-2xl flex items-center gap-2">
                <Check className="w-4 h-4 text-[#3F6A48]" />
                <span>You are on the restock notification list!</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (notifyEmail) setNotifySubmitted(true);
                }}
                className="mt-4 space-y-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD3C5] rounded-xl text-xs focus:outline-none focus:border-[#1A1816]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1A1816] text-white text-xs uppercase tracking-wider font-semibold rounded-full"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {zoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomModalOpen(false)}
        >
          <button
            onClick={() => setZoomModalOpen(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentColor.images[activeImageIndex] || currentColor.images[0]}
            alt="Fullscreen zoom"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {reviewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#FAF8F5] p-6 rounded-2xl shadow-2xl border border-[#EAE3D7] my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D7]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A85B3F] block">
                  Patron Review
                </span>
                <h4 className="font-editorial text-2xl font-normal text-[#1A1816]">
                  Review {product.title}
                </h4>
              </div>
              <button onClick={() => setReviewModalOpen(false)}>
                <X className="w-5 h-5 text-[#6E6358]" />
              </button>
            </div>

            {newReviewSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <Check className="w-8 h-8 text-[#2E5836] mx-auto" />
                <p className="font-editorial text-2xl text-[#1A1816]">Thank you for your feedback</p>
                <p className="text-xs text-[#7A6E63]">
                  Your review has been verified and added to the patron ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2F2823] mb-1.5">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setNewReviewHoverRating(star)}
                          onMouseLeave={() => setNewReviewHoverRating(0)}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (newReviewHoverRating || newReviewRating)
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : 'text-[#DDD4C6]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#8C6D1F]">
                      {(newReviewHoverRating || newReviewRating)} / 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2F2823] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Menon"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full p-2 bg-white border border-[#DDD3C5] rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2F2823] mb-1">
                      Headline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sublime drape and rich texture"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      className="w-full p-2 bg-white border border-[#DDD3C5] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2F2823] mb-1">
                      Purchased Size
                    </label>
                    <select
                      value={newReviewSize}
                      onChange={(e) => setNewReviewSize(e.target.value)}
                      className="w-full p-2 bg-white border border-[#DDD3C5] rounded-xl text-xs"
                    >
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((sz) => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2F2823] mb-1">
                      Colorway
                    </label>
                    <select
                      value={newReviewColor}
                      onChange={(e) => setNewReviewColor(e.target.value)}
                      className="w-full p-2 bg-white border border-[#DDD3C5] rounded-xl text-xs"
                    >
                      {product.colors.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2F2823] mb-1">
                      Fit Experience
                    </label>
                    <select
                      value={newReviewFit}
                      onChange={(e) => setNewReviewFit(e.target.value as any)}
                      className="w-full p-2 bg-white border border-[#DDD3C5] rounded-xl text-xs"
                    >
                      <option value="True to size">True to size</option>
                      <option value="Runs slightly small">Runs slightly small</option>
                      <option value="Runs slightly large">Runs slightly large</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2F2823] mb-1">
                    Your Review *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the fabric feel, drape, and sizing..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full p-2 bg-white border border-[#DDD3C5] rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1A1816] hover:bg-black text-white uppercase tracking-wider font-semibold rounded-full transition-colors cursor-pointer shadow-xs"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Next-Gen: Digital Product Passport (DPP) Full Transparency Modal */}
      <DigitalProductPassportModal
        isOpen={passportModalOpen}
        onClose={() => setPassportModalOpen(false)}
        product={product}
      />
    </div>
  );
}
