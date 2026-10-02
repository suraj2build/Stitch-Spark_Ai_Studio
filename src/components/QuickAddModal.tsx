import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

interface QuickAddModalProps {
  product: Product | null;
  initialColor?: string;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string, colorName: string, size: string) => void;
  onOpenSizeGuide: () => void;
}

export function QuickAddModal({
  product,
  initialColor,
  isOpen,
  onClose,
  onAddToCart,
  onOpenSizeGuide,
}: QuickAddModalProps) {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState(
    initialColor || product.colors[0].name
  );
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  const activeColorObj =
    product.colors.find((c) => c.name === selectedColor) || product.colors[0];

  const handleAdd = () => {
    if (!selectedSize) return;
    onAddToCart(product.id, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div
      id="quick-add-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="quick-add-sheet"
        className="w-full sm:max-w-md bg-[#FAF8F5] rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl transition-all overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#EAE3D7]">
          <div className="flex gap-3">
            <img
              src={activeColorObj.images[0]}
              alt={product.title}
              className="w-16 h-20 object-cover rounded-xl bg-[#EFE9DF]"
            />
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[#8C8074] uppercase font-semibold">
                Quick Add
              </span>
              <h4 className="text-sm font-medium text-[#1A1816] line-clamp-1 mt-0.5">
                {product.title}
              </h4>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-semibold text-sm text-[#1A1816]">
                  {formatPrice(product.price)}
                </span>
                {product.mrp > product.price && (
                  <span className="text-xs text-[#9C8F83] line-through">
                    {formatPrice(product.mrp)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            id="btn-close-quick-add"
            onClick={onClose}
            className="text-[#645A50] hover:text-[#1A1816] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color Variants */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-[#443C35]">
              Colour: <strong className="font-semibold text-[#1A1816]">{selectedColor}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs transition-all ${
                  selectedColor === color.name
                    ? 'border-[#1A1816] bg-white font-medium shadow-xs'
                    : 'border-[#E0D8CB] bg-white/40 text-[#6B5F53] hover:border-[#1A1816]'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-[#443C35]">Select Size</span>
            <button
              onClick={onOpenSizeGuide}
              className="text-[#A85B3F] hover:underline font-medium text-[11px]"
            >
              Size Guide
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.sizes.map((s) => {
              const isAvailable = s.inStock;
              const isSelected = selectedSize === s.size;

              return (
                <button
                  key={s.size}
                  disabled={!isAvailable}
                  onClick={() => setSelectedSize(s.size)}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all relative ${
                    !isAvailable
                      ? 'border-[#EBE4D8] bg-[#F5EFE6]/50 text-[#B5A99B] cursor-not-allowed line-through'
                      : isSelected
                      ? 'border-[#1A1816] bg-[#1A1816] text-[#FAF8F5]'
                      : 'border-[#DFD6C8] bg-white hover:border-[#1A1816] text-[#1A1816]'
                  }`}
                >
                  <span>{s.size}</span>
                  {s.stockCount && s.stockCount <= 3 && isAvailable && (
                    <span className="block text-[8px] text-[#A85B3F] font-normal leading-tight">
                      {s.stockCount} left
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Button */}
        <div className="mt-6">
          <button
            id="btn-confirm-quick-add"
            disabled={!selectedSize || isAdded}
            onClick={handleAdd}
            className={`w-full py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.16em] rounded-full transition-all flex items-center justify-center gap-2 ${
              isAdded
                ? 'bg-[#3F6A48] text-white'
                : !selectedSize
                ? 'bg-[#DDD5C7] text-[#857B6F] cursor-not-allowed'
                : 'bg-[#1F1C18] text-[#FAF8F5] hover:bg-black active:scale-[0.99] shadow-sm'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag</span>
              </>
            ) : !selectedSize ? (
              'Select a Size to Add'
            ) : (
              'Add to Bag'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
