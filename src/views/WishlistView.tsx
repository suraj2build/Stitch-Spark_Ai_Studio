import React from 'react';
import { Heart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

interface WishlistViewProps {
  wishlistIds: Set<string>;
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToBag: (product: Product, colorName: string, size: string) => void;
  onNavigateToCatalog: () => void;
}

export function WishlistView({
  wishlistIds,
  products,
  onSelectProduct,
  onRemoveFromWishlist,
  onMoveToBag,
  onNavigateToCatalog,
}: WishlistViewProps) {
  const wishlistedProducts = products.filter((p) => wishlistIds.has(p.id));

  return (
    <div id="wishlist-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b border-[#EAE3D7] pb-6 mb-8">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 fill-[#A85B3F] text-[#A85B3F]" />
          <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7F72]">
            Personal Curation
          </span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1816] font-normal mt-1">
          Saved Garments ({wishlistedProducts.length})
        </h1>
        <p className="text-xs text-[#7A6F64] mt-1">
          Handloom pieces you have set aside. Move them to your bag whenever you are ready.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F2ECE1] mx-auto flex items-center justify-center text-[#8C7F72]">
            <Heart className="w-7 h-7 stroke-[1.2]" />
          </div>
          <h2 className="font-editorial text-2xl text-[#1A1816]">Your wishlist is currently empty</h2>
          <p className="text-xs text-[#7A6F64] leading-relaxed">
            As you explore our festive edits and handcrafted silhouettes, tap the heart icon on any piece to save it here.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-[#1A1816] text-white text-xs uppercase tracking-[0.16em] font-semibold rounded-xs hover:bg-black"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => {
            const defaultColor = product.colors[0];
            const defaultSize = product.sizes.find((s) => s.inStock)?.size || product.sizes[0].size;

            return (
              <div
                key={product.id}
                className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div
                    onClick={() => onSelectProduct(product.id)}
                    className="aspect-[3/4] bg-[#EFE9DF] overflow-hidden cursor-pointer relative group"
                  >
                    <img
                      src={defaultColor.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full text-[#6E6358] hover:text-[#962E3B] transition-colors shadow-xs"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3
                      onClick={() => onSelectProduct(product.id)}
                      className="text-xs sm:text-sm font-medium text-[#1A1816] line-clamp-1 hover:text-[#A85B3F] cursor-pointer"
                    >
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-[#7A6F64] mt-0.5">{product.fabric}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-semibold text-xs text-[#1A1816]">
                        {formatPrice(product.price)}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-[10px] text-[#9A8D80] line-through">
                          {formatPrice(product.mrp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Move to bag button */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      onMoveToBag(product, defaultColor.name, defaultSize);
                      onRemoveFromWishlist(product.id);
                    }}
                    className="w-full py-2.5 bg-[#1F1C18] hover:bg-black text-[#FAF8F5] text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag ({defaultSize})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
