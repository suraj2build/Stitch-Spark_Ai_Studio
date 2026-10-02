import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Plus, Check, Star } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (productId: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, selectedColor: string) => void;
  onInstantAddSize?: (product: Product, colorName: string, size: string) => void;
}

export function ProductCard({
  product,
  onSelectProduct,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onInstantAddSize,
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const currentColor = product.colors[selectedColorIndex] || product.colors[0];
  const primaryImage = currentColor.images[0];
  const hoverImage = currentColor.images[1] || currentColor.images[0];

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    if (onInstantAddSize) {
      onInstantAddSize(product, currentColor.name, size);
      setAddedSize(size);
      setTimeout(() => setAddedSize(null), 1200);
    } else {
      onQuickAdd(product, currentColor.name);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="group flex flex-col bg-white rounded-xs overflow-hidden border border-[#F0ECE4] hover:border-[#DFD9CE] hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div
        onClick={() => onSelectProduct(product.id)}
        className="relative aspect-[3/4] bg-[#F7F5F0] overflow-hidden cursor-pointer"
      >
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isHovered && hoverImage !== primaryImage ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Hover Crossfade Image */}
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${product.title} back view`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered && hoverImage !== primaryImage ? 'opacity-100 scale-103' : 'opacity-0'
            }`}
          />
        )}

        {/* Top Badges (Discount / BestSeller / New) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.mrp > product.price && (
            <span className="px-2 py-0.5 bg-[#B2593E] text-white text-[9px] uppercase tracking-wider font-bold rounded-xs shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.badges?.includes('BESTSELLER') && (
            <span className="px-2 py-0.5 bg-[#161514] text-white text-[9px] uppercase tracking-wider font-semibold rounded-xs shadow-xs">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button (Heart) */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-[#161514] shadow-xs z-10 transition-colors"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 stroke-[1.5] transition-colors ${
              isWishlisted ? 'fill-[#B2593E] text-[#B2593E]' : 'text-[#4A4540] hover:text-[#B2593E]'
            }`}
          />
        </motion.button>

        {/* Quick Size Bar on Hover (FableStreet / Uptownie style) */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-xs p-2.5 border-t border-[#EFEBE3] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <div className="flex items-center justify-between text-[10px] text-[#706860] mb-1 font-semibold uppercase tracking-wider">
            <span>Instant Select Size</span>
            <span className="text-[#B2593E]">Quick Add</span>
          </div>
          <div className="flex gap-1.5 justify-between">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                disabled={!s.inStock}
                onClick={(e) => handleSizeClick(e, s.size)}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-xs transition-all ${
                  !s.inStock
                    ? 'bg-[#F2ECE3] text-[#B5ACA0] cursor-not-allowed line-through'
                    : addedSize === s.size
                    ? 'bg-[#2D5A46] text-white'
                    : 'bg-[#FAF8F5] hover:bg-[#161514] hover:text-white border border-[#E5DFD4] text-[#2E2A27]'
                }`}
              >
                {addedSize === s.size ? <Check className="w-3 h-3 mx-auto" /> : s.size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Fabric & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#8C8379] mb-1">
            <span className="uppercase tracking-wider truncate max-w-[140px] font-medium">
              {product.fabric.split(' ')[0]} {product.fabric.split(' ')[1] || ''}
            </span>
            <div className="flex items-center gap-1 text-[#C29B38] font-semibold text-[10px]">
              <Star className="w-3 h-3 fill-[#C29B38]" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product.id)}
            className="text-xs sm:text-sm font-medium text-[#181716] group-hover:text-[#B2593E] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.title}
          </h3>

          {/* Subtitle / Fit note */}
          <p className="text-[11px] text-[#8C8379] line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing & Colour Swatches */}
        <div className="mt-3 pt-2.5 border-t border-[#F5F2EC] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-[#181716]">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-[#9E958A] line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          {/* Color Switcher Swatches */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                onClick={() => setSelectedColorIndex(idx)}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColorIndex === idx
                    ? 'ring-1.5 ring-[#181716] scale-110'
                    : 'border-black/20 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
