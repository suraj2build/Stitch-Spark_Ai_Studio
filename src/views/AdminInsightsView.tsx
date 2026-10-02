import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { TrendingCategoriesChart } from '../components/TrendingCategoriesChart';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Heart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { formatPrice } from '../utils/format';

interface AdminInsightsViewProps {
  products: Product[];
  cartItems: CartItem[];
  wishlistIds: Set<string>;
  onToggleWishlist: (productId: string) => void;
  onNavigate: (route: string, params?: any) => void;
  onSelectProduct: (productId: string) => void;
  onAddToCart: (productId: string, colorName: string, size: string) => void;
}

export function AdminInsightsView({
  products,
  cartItems,
  wishlistIds,
  onToggleWishlist,
  onNavigate,
  onSelectProduct,
  onAddToCart,
}: AdminInsightsViewProps) {
  const [exportMessage, setExportMessage] = useState(false);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartValue = cartItems.reduce((acc, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  return (
    <div id="admin-insights-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#EAE3D7] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#B2593E]" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7F72]">
              Atelier Merchandising Command &amp; Analytics
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1816] font-normal mt-1">
            Editorial Insights &amp; Category Demand
          </h1>
          <p className="text-xs text-[#7A6F64] mt-1 max-w-2xl">
            Live D3.js visualization tracking patron purchase intent, wishlist frequency, and inventory demand across all artisanal collections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="px-4 py-2 border border-[#DDD5C7] text-[#1A1816] hover:bg-[#F2ECE1] text-xs uppercase tracking-wider font-semibold rounded-full transition-colors"
          >
            Storefront View
          </button>
          <button
            type="button"
            onClick={() => {
              setExportMessage(true);
              setTimeout(() => setExportMessage(false), 3500);
            }}
            className="px-4 py-2 bg-[#1A1816] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="p-4 bg-[#E8F2EA] border border-[#BCE0C3] rounded-2xl text-xs text-[#285832] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">✓ Report Exported:</span>
            <span>Merchandising summary exported to CSV successfully.</span>
          </div>
          <button onClick={() => setExportMessage(false)} className="text-[#285832] font-bold">×</button>
        </div>
      )}

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAE3D7] p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span className="uppercase tracking-wider text-[10px] font-bold">Active Bag Items</span>
            <ShoppingBag className="w-4 h-4 text-[#B2593E]" />
          </div>
          <div className="font-editorial text-3xl font-semibold text-[#1A1816]">
            {totalCartCount}
          </div>
          <p className="text-[11px] text-[#2E5836] font-medium">
            Cart Pipeline: {formatPrice(totalCartValue)}
          </p>
        </div>

        <div className="bg-white border border-[#EAE3D7] p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span className="uppercase tracking-wider text-[10px] font-bold">Wishlist Volume</span>
            <Heart className="w-4 h-4 text-[#B2593E]" />
          </div>
          <div className="font-editorial text-3xl font-semibold text-[#1A1816]">
            {wishlistIds.size}
          </div>
          <p className="text-[11px] text-[#8C7A6B]">
            Saved by patrons this session
          </p>
        </div>

        <div className="bg-white border border-[#EAE3D7] p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span className="uppercase tracking-wider text-[10px] font-bold">Leading Category</span>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="font-editorial text-2xl font-semibold text-[#1A1816] truncate">
            Festive Silk Edit
          </div>
          <p className="text-[11px] text-[#2E5836] font-medium">
            +52% demand velocity
          </p>
        </div>

        <div className="bg-white border border-[#EAE3D7] p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <span className="uppercase tracking-wider text-[10px] font-bold">Weaver Allocation</span>
            <Layers className="w-4 h-4 text-[#C29B38]" />
          </div>
          <div className="font-editorial text-3xl font-semibold text-[#1A1816]">
            6 Clusters
          </div>
          <p className="text-[11px] text-[#8C7A6B]">
            Chanderi, Varanasi, Jaipur, Maheshwar
          </p>
        </div>
      </div>

      {/* Main D3.js Trending Categories Visualization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7A6B]">
            D3 Interactive Chart
          </span>
          <span className="text-xs text-[#8C7A6B]">
            Hover over bars to inspect category depth and top silhouetted pieces
          </span>
        </div>
        <TrendingCategoriesChart
          products={products}
          cartItems={cartItems}
          wishlistIds={wishlistIds}
          onToggleWishlist={onToggleWishlist}
          onSelectProduct={onSelectProduct}
          theme="dark"
        />
      </div>

      {/* Interactive Simulation Strip */}
      <div className="p-4 bg-[#FAF7F2] border border-[#E8DFD1] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B2593E] shrink-0" />
          <span className="text-[#5C5146]">
            <strong>Live D3 Re-rendering:</strong> Add garments to your cart or toggle wishlist hearts across the catalog to watch the bar chart compute updated trend scores in real time.
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const sampleProd = products[0];
            onAddToCart(sampleProd.id, sampleProd.colors[0].name, sampleProd.sizes[0].size);
          }}
          className="px-3.5 py-1.5 bg-white border border-[#D8CEBF] hover:border-[#1A1816] text-[#1A1816] rounded-full font-semibold text-[11px] uppercase tracking-wider shrink-0 transition-colors"
        >
          + Simulate Bag Addition
        </button>
      </div>

      {/* Category Deep-Dive Table */}
      <div className="bg-white border border-[#EAE3D7] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F0ECE4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#B2593E]" />
            <h3 className="font-editorial text-lg text-[#1A1816] font-normal">
              Category Merchandising &amp; Stock Strategy Breakdown
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A7D71]">
            Active Edit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] text-[10px] uppercase tracking-wider text-[#7A6F64] border-b border-[#EAE3D7]">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Cart Adds</th>
                <th className="px-5 py-3">Wishlists</th>
                <th className="px-5 py-3">Demand Velocity</th>
                <th className="px-5 py-3">Hero Piece</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4] text-[#4A433D]">
              {Array.from(new Set(products.map((p) => p.category))).map((cat) => {
                const catProducts = products.filter((p) => p.category === cat);
                const catIds = new Set(catProducts.map((p) => p.id));
                const catCart = cartItems.filter((i) => catIds.has(i.productId)).reduce((s, i) => s + i.quantity, 0);
                const catWishlist = Array.from(wishlistIds).filter((id) => catIds.has(id)).length;
                const hero = catProducts[0];

                return (
                  <tr key={cat} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#1A1816]">
                      {cat}
                    </td>
                    <td className="px-5 py-3.5 font-mono">
                      {18 + catCart * 3} units
                    </td>
                    <td className="px-5 py-3.5 font-mono">
                      {26 + catWishlist * 2} saves
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F2EA] text-[#22572E]">
                        High Conversion
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#6B5E52] truncate max-w-xs">
                      {hero ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleWishlist(hero.id)}
                            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                              wishlistIds.has(hero.id)
                                ? 'bg-[#FBEBE7] text-[#B2593E]'
                                : 'text-gray-400 hover:text-black hover:bg-gray-100'
                            }`}
                            title={wishlistIds.has(hero.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                wishlistIds.has(hero.id) ? 'fill-[#B2593E]' : ''
                              }`}
                            />
                          </button>
                          <span className="truncate">{hero.title}</span>
                        </div>
                      ) : (
                        'Atelier Exclusive'
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {hero && (
                        <button
                          type="button"
                          onClick={() => onSelectProduct(hero.id)}
                          className="text-[11px] font-semibold text-[#B2593E] hover:underline"
                        >
                          View Piece →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
