import React, { useState } from 'react';
import { X, Trash2, Heart, Plus, Minus, ArrowRight, ShieldCheck, Tag, Coins } from 'lucide-react';
import { CartItem, Product } from '../types';
import { formatPrice } from '../utils/format';

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onMoveToWishlist: (cartItemId: string, productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onCheckout: () => void;
  onNavigate?: (route: string, params?: any) => void;
}

export function BagDrawer({
  isOpen,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onSelectProduct,
  onCheckout,
  onNavigate,
}: BagDrawerProps) {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Hydrate items with product details
  const hydratedItems = cartItems
    .map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) return null;
      const colorObj =
        prod.colors.find((c) => c.name === item.colorName) || prod.colors[0];
      return {
        ...item,
        product: prod,
        image: colorObj.images[0],
      };
    })
    .filter(Boolean) as (CartItem & { product: Product; image: string })[];

  const subtotal = hydratedItems.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );

  const totalMrp = hydratedItems.reduce(
    (acc, curr) => acc + curr.product.mrp * curr.quantity,
    0
  );

  const promoDiscount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const freeShippingThreshold = 1999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const finalTotal = subtotal - promoDiscount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'VANYA10') {
      setDiscountApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try VANYA10 for 10% off');
    }
  };

  return (
    <div
      id="bag-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        id="bag-drawer-panel"
        className="w-full max-w-md sm:max-w-lg bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between overflow-hidden sm:rounded-l-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3D7] flex items-center justify-between bg-white/80">
          <div>
            <span className="text-[10px] tracking-[0.22em] uppercase text-[#8A7D71] font-semibold">
              Shopping Bag
            </span>
            <h3 className="font-editorial text-2xl text-[#1A1816] font-normal leading-tight">
              Review Bag ({hydratedItems.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button
            id="btn-close-bag"
            onClick={onClose}
            className="p-1.5 text-[#5C5146] hover:text-black rounded-full"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Ribbon */}
        <div className="px-5 py-2.5 bg-[#F2ECE1] border-b border-[#E4DDD0] text-xs">
          {isFreeShipping ? (
            <div className="flex items-center gap-2 text-[#2E5836] font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#3F6A48]" />
              <span>You have unlocked Complimentary Express Delivery!</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#554A41]">
                <span>
                  Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more for Free Express Delivery
                </span>
                <span className="font-medium">
                  {Math.round((subtotal / freeShippingThreshold) * 100)}%
                </span>
              </div>
              <div className="w-full bg-[#DDD4C6] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--color-primary)] h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#EFE8DC]">
          {hydratedItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="font-editorial text-2xl text-[#6B5F53]">Your bag is currently empty</p>
              <p className="text-xs text-[#8A7D71] max-w-xs mx-auto">
                Explore our curated handloom silks, linen tailoring, and modern silhouettes.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-8 py-3 bg-[#1F1C18] text-[#FAF8F5] text-xs uppercase tracking-[0.16em] font-semibold rounded-full hover:bg-black transition-colors cursor-pointer shadow-xs"
              >
                Continue Exploring
              </button>
            </div>
          ) : (
            hydratedItems.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                <img
                  src={item.image}
                  alt={item.product.title}
                  onClick={() => {
                    onSelectProduct(item.product.id);
                    onClose();
                  }}
                  className="w-20 h-26 object-cover rounded-xl bg-[#EFE9DF] cursor-pointer hover:opacity-90 transition-opacity"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => {
                          onSelectProduct(item.product.id);
                          onClose();
                        }}
                        className="text-xs sm:text-sm font-medium text-[#1A1816] line-clamp-1 cursor-pointer hover:text-[#A85B3F]"
                      >
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#96897E] hover:text-[#A85B3F] transition-colors p-1 -mr-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#7A6F64] mt-0.5">
                      Colour: <span className="font-medium text-[#2E2823]">{item.colorName}</span> | Size: <span className="font-medium text-[#2E2823]">{item.size}</span>
                    </p>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-[#1A1816]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      {item.product.mrp > item.product.price && (
                        <span className="text-[11px] text-[#9E9184] line-through">
                          {formatPrice(item.product.mrp * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Controls: Quantity & Move to Wishlist */}
                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity Control */}
                    <div className="flex items-center border border-[#DFD6C8] bg-white rounded-full overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 hover:bg-[#F2ECE1] transition-colors text-[#5C5146]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#1A1816]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 hover:bg-[#F2ECE1] transition-colors text-[#5C5146]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Move to wishlist */}
                    <button
                      onClick={() => onMoveToWishlist(item.id, item.productId)}
                      className="text-[11px] text-[#6E6358] hover:text-[#A85B3F] flex items-center gap-1 transition-colors"
                    >
                      <Heart className="w-3 h-3 stroke-[1.5]" />
                      <span>Save for later</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Order Summary */}
        {hydratedItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#EAE3D7] bg-white space-y-3">
            {/* Coupon Code Accordion / Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-[#9E9184]" />
                <input
                  type="text"
                  placeholder="Coupon code (try VANYA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs uppercase tracking-wider bg-[#FAF8F5] border border-[#DDD3C4] rounded-full focus:outline-none focus:border-[#1A1816]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#F0EAE0] hover:bg-[#E4DCD0] text-xs font-semibold uppercase tracking-wider text-[#2F2924] rounded-full transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {discountApplied && (
              <p className="text-[11px] text-[#2E5836] font-medium flex items-center gap-1">
                ✓ Coupon VANYA10 applied! 10% discount subtracted.
              </p>
            )}
            {couponError && (
              <p className="text-[11px] text-[#962E3B]">{couponError}</p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5C5146] border-t border-[#EFE9DF] pt-2">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span className="line-through text-[#8A7D71]">{formatPrice(totalMrp)}</span>
              </div>
              {totalMrp > subtotal && (
                <div className="flex justify-between text-[#2E5836]">
                  <span>Catalog Discount</span>
                  <span>- {formatPrice(totalMrp - subtotal)}</span>
                </div>
              )}
              {discountApplied && (
                <div className="flex justify-between text-[#2E5836]">
                  <span>Promo Code (VANYA10)</span>
                  <span>- {formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{isFreeShipping ? 'FREE' : '₹150'}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1A1816] pt-1 border-t border-[#EFE9DF]">
                <span>Order Total</span>
                <span>{formatPrice(finalTotal + (isFreeShipping ? 0 : 150))}</span>
              </div>

              {/* Loyalty Points Earned from this order */}
              <div className="flex items-center justify-between text-xs text-[var(--color-badge-text)] bg-[var(--color-badge-bg)] p-3 rounded-xl border border-[var(--color-border)] mt-2">
                <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                  <Coins className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                  <span>VANYA Rewards You&apos;ll Earn:</span>
                </span>
                <span className="font-bold font-mono text-[var(--color-badge-text)]">
                  +{Math.floor(subtotal / 10)} Pts
                </span>
              </div>

              <p className="text-[10px] text-[#9A8F83] text-right">
                Inclusive of all taxes &amp; duties
              </p>
            </div>

            {/* Checkout CTA */}
            <button
              id="btn-proceed-checkout"
              onClick={onCheckout}
              className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-[0.18em] font-semibold transition-all rounded-full shadow-md flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {onNavigate && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('order-status');
                  }}
                  className="text-[11px] text-[#8C7A6B] hover:text-[#1A1816] hover:underline transition-colors"
                >
                  Already ordered? Track your package status →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
