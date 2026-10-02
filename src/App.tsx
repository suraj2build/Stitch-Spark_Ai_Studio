import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { OrderStatusView } from './views/OrderStatusView';
import { AdminInsightsView } from './views/AdminInsightsView';
import { LandingGatewayView } from './views/LandingGatewayView';
import { PRODUCTS, REELS, STYLED_LOOKS } from './data/mockData';
import { Product, CartItem, Gender } from './types';

export default function App() {
  // Navigation & Routing State
  const [currentView, setCurrentView] = useState<'gateway' | 'home' | 'plp' | 'pdp' | 'reels' | 'wishlist' | 'order-status' | 'admin-insights'>('gateway');
  const [activeGender, setActiveGender] = useState<'men' | 'women'>('women');
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [activeReelId, setActiveReelId] = useState<string | undefined>(undefined);
  const [trackedOrderId, setTrackedOrderId] = useState<string | undefined>(undefined);

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

  // Synchronize dynamic pastel & light-brown theme with active gender
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeGender);
  }, [activeGender]);

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
    params?: { gender?: Gender; category?: string; productId?: string; reelId?: string; orderId?: string }
  ) => {
    if (
      view === 'gateway' ||
      view === 'home' ||
      view === 'plp' ||
      view === 'pdp' ||
      view === 'reels' ||
      view === 'wishlist' ||
      view === 'order-status' ||
      view === 'admin-insights'
    ) {
      setCurrentView(view as any);
    }
    if (params?.gender && (params.gender === 'men' || params.gender === 'women')) {
      setActiveGender(params.gender);
    }
    if (params?.category) setActiveCategory(params.category);
    if (params?.productId) {
      setSelectedProductId(params.productId);
      recordRecentlyViewed(params.productId);
    }
    if (params?.reelId) setActiveReelId(params.reelId);
    if (params?.orderId) setTrackedOrderId(params.orderId);
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

  // Loyalty Points: Customers earn 1 point per ₹10 spent based on cart total
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const prod = PRODUCTS.find((p) => p.id === item.productId);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);
  const baseLoyaltyPoints = 1250;
  const earnedCartPoints = Math.floor(cartSubtotal / 10);

  // Strictly dedicated department catalog (Zero cross-gender mixing)
  const departmentProducts = PRODUCTS.filter((p) =>
    activeGender === 'men' ? p.gender === 'men' || p.gender === 'unisex' : p.gender === 'women' || p.gender === 'unisex'
  );

  const departmentReels = REELS.filter((r) => {
    const tagged = r.taggedProductIds.map((id) => PRODUCTS.find((p) => p.id === id));
    return tagged.some((p) => p && (activeGender === 'men' ? p.gender === 'men' : p.gender === 'women'));
  });

  return (
    <AnimatePresence mode="wait">
      {currentView === 'gateway' ? (
        <motion.div
          key="portal-gateway"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen w-full bg-[#100E0D]"
        >
          <LandingGatewayView
            onSelectDepartment={(dept) => {
              setActiveGender(dept);
              setCurrentView('home');
              scrollToTop();
            }}
            onOpenSearch={() => {
              setCurrentView('home');
              setSearchModalOpen(true);
            }}
            onOpenBag={() => {
              setBagDrawerOpen(true);
            }}
            cartCount={totalBagItemsCount}
          />
        </motion.div>
      ) : (
        <motion.div
          key="atelier-main-store"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          id="vanya-app-root"
          data-theme={activeGender}
          className={`min-h-screen flex flex-col font-sans transition-colors duration-500 selection:bg-[#EAE0D2] selection:text-[#1A1816] ${
            activeGender === 'men'
              ? 'bg-[#FAF7F2] text-[#241F1A]'
              : 'bg-[#FAF6FB] text-[#231C26]'
          }`}
        >
          {/* Main Header with Spacious 2-Tier Architecture */}
          <Header
            currentRoute={currentView}
            currentGender={activeGender}
            onSelectDepartment={(dept) => {
              setActiveGender(dept);
              scrollToTop();
            }}
            onNavigate={handleNavigate}
            wishlistCount={wishlistIds.size}
            cartCount={totalBagItemsCount}
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenBag={() => setBagDrawerOpen(true)}
            loyaltyPoints={baseLoyaltyPoints}
            earnedCartPoints={earnedCartPoints}
            cartTotal={cartSubtotal}
          />

          {/* Primary Dynamic View Content with Fluid Motion Entrance */}
          <main className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentView}-${activeGender}-${activeCategory || ''}-${selectedProductId || ''}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1], // luxury easeOutExpo
                }}
                className="w-full flex-1 flex flex-col"
              >
                {currentView === 'home' && (
                  <HomeView
                    products={PRODUCTS}
                    reels={REELS}
                    styledLooks={STYLED_LOOKS}
                    activeGender={activeGender}
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
                    onNavigate={handleNavigate}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickAdd={handleQuickAddTrigger}
                    onInstantAddSize={(product, colorName, size) => handleAddToCart(product.id, colorName, size)}
                  />
                )}

                {currentView === 'pdp' && (
                  <PdpView
                    product={currentProduct}
                    allProducts={departmentProducts}
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
                    reels={departmentReels}
                    products={departmentProducts}
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
                    onNavigateToCatalog={() => handleNavigate('plp', { gender: activeGender })}
                  />
                )}

                {currentView === 'order-status' && (
                  <OrderStatusView
                    initialOrderId={trackedOrderId}
                    onSelectProduct={handleSelectProduct}
                    onNavigate={handleNavigate}
                  />
                )}

                {currentView === 'admin-insights' && (
                  <AdminInsightsView
                    products={PRODUCTS}
                    cartItems={cartItems}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                    onNavigate={handleNavigate}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

      {/* Global Footer */}
      <Footer
        currentGender={activeGender}
        onOpenSizeGuide={() => setSizeGuideModalOpen(true)}
        onNavigate={handleNavigate}
        loyaltyPoints={baseLoyaltyPoints}
        earnedCartPoints={earnedCartPoints}
        cartTotal={cartSubtotal}
        products={PRODUCTS}
        cartItems={cartItems}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
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
        onNavigate={handleNavigate}
        onCheckout={() => {
          setBagDrawerOpen(false);
          handleNavigate('order-status', { orderId: 'VAN-8921-DEL' });
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
        products={departmentProducts}
        onSelectProduct={handleSelectProduct}
        onSelectCategory={(cat) => handleNavigate('plp', { gender: activeGender, category: cat })}
      />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
