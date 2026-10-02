import React, { useState } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BagDrawer } from './components/BagDrawer';
import { QuickAddModal } from './components/QuickAddModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SearchModal } from './components/SearchModal';
import { HomeView } from './views/HomeView';
import { PlpView } from './views/PlpView';
import { PdpView } from './views/PdpView';
import { ReelsView } from './views/ReelsView';
import { WishlistView } from './views/WishlistView';
import { PRODUCTS, REELS, STYLED_LOOKS } from './data/mockData';
import { Product, CartItem, Gender } from './types';

export default function App() {
  // Navigation & Routing State
  const [currentView, setCurrentView] = useState<'home' | 'plp' | 'pdp' | 'reels' | 'wishlist'>('home');
  const [activeGender, setActiveGender] = useState<Gender>('all');
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [activeReelId, setActiveReelId] = useState<string | undefined>(undefined);

  // Commerce State: Bag & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'initial-cart-1',
      productId: PRODUCTS[0].id,
      colorName: PRODUCTS[0].colors[0].name,
      size: 'S',
      quantity: 1,
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set(['prod-1', 'prod-3']));
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(['prod-2', 'prod-4']);

  // Modals & Drawers
  const [bagDrawerOpen, setBagDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [sizeGuideModalOpen, setSizeGuideModalOpen] = useState(false);
  const [quickAddData, setQuickAddData] = useState<{ product: Product; colorName: string } | null>(null);

  // Scroll to top on view changes
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation Handler
  const handleNavigate = (
    view: string,
    params?: { gender?: Gender; category?: string; productId?: string; reelId?: string }
  ) => {
    if (view === 'home' || view === 'plp' || view === 'pdp' || view === 'reels' || view === 'wishlist') {
      setCurrentView(view);
    }
    if (params?.gender) setActiveGender(params.gender);
    if (params?.category) setActiveCategory(params.category);
    if (params?.productId) {
      setSelectedProductId(params.productId);
      recordRecentlyViewed(params.productId);
    }
    if (params?.reelId) setActiveReelId(params.reelId);
    scrollToTop();
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    recordRecentlyViewed(productId);
    setCurrentView('pdp');
    scrollToTop();
  };

  const handleOpenReel = (reelId: string) => {
    setActiveReelId(reelId);
    setCurrentView('reels');
    scrollToTop();
  };

  const recordRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 6);
    });
  };

  // Wishlist Toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Add to Bag Handler
  const handleAddToCart = (productId: string, colorName: string, size: string, quantity = 1) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const existingIndex = cartItems.findIndex(
      (item) => item.productId === productId && item.colorName === colorName && item.size === size
    );

    if (existingIndex > -1) {
      setCartItems((prev) => {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      });
    } else {
      const newItem: CartItem = {
        id: `${productId}-${colorName}-${size}-${Date.now()}`,
        productId,
        colorName,
        size,
        quantity,
      };
      setCartItems((prev) => [newItem, ...prev]);
    }
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleQuickAddTrigger = (product: Product, selectedColor: string) => {
    setQuickAddData({ product, colorName: selectedColor });
  };

  const totalBagItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  return (
    <div id="vanya-app-root" className="min-h-screen bg-[#FAF8F5] text-[#1A1816] flex flex-col font-sans selection:bg-[#EAE0D2] selection:text-[#1A1816]">
      {/* Top Global Announcement Bar */}
      <AnnouncementBar />

      {/* Main Header */}
      <Header
        currentRoute={currentView}
        currentGender={activeGender}
        onNavigate={handleNavigate}
        wishlistCount={wishlistIds.size}
        cartCount={totalBagItemsCount}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenBag={() => setBagDrawerOpen(true)}
      />

      {/* Primary Dynamic View Content */}
      <div className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={PRODUCTS}
            reels={REELS}
            styledLooks={STYLED_LOOKS}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAddTrigger}
            onInstantAddSize={(product, colorName, size) => handleAddToCart(product.id, colorName, size)}
            onOpenReel={handleOpenReel}
            recentlyViewedIds={recentlyViewedIds}
          />
        )}

        {currentView === 'plp' && (
          <PlpView
            products={PRODUCTS}
            gender={activeGender}
            initialCategory={activeCategory}
            onSelectProduct={handleSelectProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAddTrigger}
            onInstantAddSize={(product, colorName, size) => handleAddToCart(product.id, colorName, size)}
          />
        )}

        {currentView === 'pdp' && (
          <PdpView
            product={currentProduct}
            allProducts={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            isWishlisted={wishlistIds.has(currentProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onOpenSizeGuide={() => setSizeGuideModalOpen(true)}
            onOpenBag={() => setBagDrawerOpen(true)}
            recentlyViewedIds={recentlyViewedIds}
          />
        )}

        {currentView === 'reels' && (
          <ReelsView
            reels={REELS}
            products={PRODUCTS}
            initialReelId={activeReelId}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onOpenBag={() => setBagDrawerOpen(true)}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            wishlistIds={wishlistIds}
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onRemoveFromWishlist={handleToggleWishlist}
            onMoveToBag={(prod, col, size) => handleAddToCart(prod.id, col, size)}
            onNavigateToCatalog={() => handleNavigate('plp', { gender: 'all' })}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer
        onOpenSizeGuide={() => setSizeGuideModalOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Cart Bag Drawer */}
      <BagDrawer
        isOpen={bagDrawerOpen}
        onClose={() => setBagDrawerOpen(false)}
        cartItems={cartItems}
        products={PRODUCTS}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onMoveToWishlist={(cartItemId, productId) => {
          handleRemoveCartItem(cartItemId);
          handleToggleWishlist(productId);
        }}
        onSelectProduct={handleSelectProduct}
        onCheckout={() => {
          alert('Thank you for choosing VANYA. In production, this proceeds to secure payment processing.');
        }}
      />

      {/* Quick Add Modal */}
      {quickAddData && (
        <QuickAddModal
          isOpen={!!quickAddData}
          onClose={() => setQuickAddData(null)}
          product={quickAddData.product}
          initialColor={quickAddData.colorName}
          onAddToCart={(productId, colorName, size) => {
            handleAddToCart(productId, colorName, size);
            setBagDrawerOpen(true);
          }}
          onOpenSizeGuide={() => {
            setQuickAddData(null);
            setSizeGuideModalOpen(true);
          }}
        />
      )}

      {/* Size Guide & My Size Finder Modal */}
      <SizeGuideModal
        isOpen={sizeGuideModalOpen}
        onClose={() => setSizeGuideModalOpen(false)}
      />

      {/* Search Overlay Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={PRODUCTS}
        onSelectProduct={handleSelectProduct}
        onSelectCategory={(cat) => handleNavigate('plp', { category: cat })}
      />
    </div>
  );
}
