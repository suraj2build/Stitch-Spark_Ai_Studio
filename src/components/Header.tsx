import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, Sparkles, ChevronDown, Truck } from 'lucide-react';
import { Gender } from '../types';

interface HeaderProps {
  currentRoute: string;
  currentGender?: Gender;
  onNavigate: (route: string, params?: { gender?: Gender; category?: string; productId?: string }) => void;
  onOpenSearch: () => void;
  onOpenBag: () => void;
  cartCount: number;
  wishlistCount: number;
}

export function Header({
  currentRoute,
  currentGender,
  onNavigate,
  onOpenSearch,
  onOpenBag,
  cartCount,
  wishlistCount,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#EFECE6]'
            : 'bg-white border-b border-[#F0ECE4]'
        }`}
      >
        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile Hamburger + Desktop Nav Links */}
            <div className="flex items-center gap-6">
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[#181716] hover:text-[#B2593E] transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-[0.05em] uppercase font-medium">
                <button
                  onClick={() => onNavigate('home')}
                  className={`py-2 transition-colors relative ${
                    currentRoute === 'home' ? 'text-[#181716] font-semibold' : 'text-[#59534C] hover:text-[#181716]'
                  }`}
                >
                  Home
                  {currentRoute === 'home' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-[#181716]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>

                {/* Women Mega Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setActiveDropdown('women')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => onNavigate('plp', { gender: 'women' })}
                    className={`py-2 flex items-center gap-1 transition-colors ${
                      currentRoute === 'plp' && currentGender === 'women'
                        ? 'text-[#181716] font-semibold'
                        : 'text-[#59534C] hover:text-[#181716]'
                    }`}
                  >
                    <span>Women</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === 'women' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-0 top-full w-80 bg-white shadow-xl border border-[#EFECE6] rounded-xs p-5 grid grid-cols-2 gap-4 z-50"
                      >
                        <div className="space-y-2">
                          <span className="text-[10px] tracking-[0.2em] font-bold text-[#A89F95] block uppercase">
                            Apparel
                          </span>
                          <div className="space-y-1.5 text-xs text-[#4A4540]">
                            <button
                              onClick={() => {
                                onNavigate('plp', { gender: 'women', category: 'Dresses' });
                                setActiveDropdown(null);
                              }}
                              className="block hover:text-[#B2593E] text-left"
                            >
                              Dresses &amp; Drapes
                            </button>
                            <button
                              onClick={() => {
                                onNavigate('plp', { gender: 'women', category: 'Co-ords & Sets' });
                                setActiveDropdown(null);
                              }}
                              className="block hover:text-[#B2593E] text-left"
                            >
                              Co-ords &amp; Sets
                            </button>
                            <button
                              onClick={() => {
                                onNavigate('plp', { gender: 'women', category: 'Modern Sarees' });
                                setActiveDropdown(null);
                              }}
                              className="block hover:text-[#B2593E] text-left"
                            >
                              Modern Sarees
                            </button>
                            <button
                              onClick={() => {
                                onNavigate('plp', { gender: 'women', category: 'Festive Silk Edit' });
                                setActiveDropdown(null);
                              }}
                              className="block hover:text-[#B2593E] text-left"
                            >
                              Festive Silk Edit
                            </button>
                          </div>
                        </div>

                        <div className="bg-[#FAF8F5] p-3 rounded-xs border border-[#EFEBE3] flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-[#B2593E] block">
                              Curated Edit
                            </span>
                            <p className="font-editorial text-sm font-normal text-[#181716] mt-1 leading-snug">
                              Fits That Flatter Indian Bodies
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              onNavigate('plp', { gender: 'women' });
                              setActiveDropdown(null);
                            }}
                            className="text-[10px] uppercase font-bold text-[#181716] flex items-center gap-1 mt-2 hover:text-[#B2593E]"
                          >
                            <span>Explore All</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Men Dropdown */}
                <button
                  onClick={() => onNavigate('plp', { gender: 'men' })}
                  className={`py-2 transition-colors ${
                    currentRoute === 'plp' && currentGender === 'men'
                      ? 'text-[#181716] font-semibold'
                      : 'text-[#59534C] hover:text-[#181716]'
                  }`}
                >
                  Men
                </button>

                <button
                  onClick={() => onNavigate('plp', { category: 'Festive Silk Edit' })}
                  className="py-2 text-[#59534C] hover:text-[#181716] transition-colors flex items-center gap-1.5"
                >
                  <span>Festive</span>
                  <span className="text-[9px] bg-[#FAF2DE] text-[#8C6D1F] px-1.5 py-0.5 rounded-full font-bold">
                    LUXE
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('reels')}
                  className={`py-2 transition-colors flex items-center gap-1.5 ${
                    currentRoute === 'reels' ? 'text-[#B2593E] font-semibold' : 'text-[#59534C] hover:text-[#B2593E]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B2593E] animate-pulse" />
                  <span>Watch &amp; Shop</span>
                </button>

                <button
                  id="btn-header-track-order"
                  onClick={() => onNavigate('order-status')}
                  className={`py-2 transition-colors flex items-center gap-1.5 ${
                    currentRoute === 'order-status' ? 'text-[#181716] font-semibold' : 'text-[#59534C] hover:text-[#181716]'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-[#B2593E]" />
                  <span>Track Order</span>
                </button>
              </nav>
            </div>

            {/* Center: Brand Identity Logo */}
            <div className="text-center cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="font-editorial text-2xl sm:text-4xl tracking-[0.22em] font-normal uppercase text-[#181716] block hover:opacity-90 transition-opacity">
                VANYA
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-[#8A8177] font-semibold block -mt-0.5">
                New Delhi • Atelier
              </span>
            </div>

            {/* Right: Search, Wishlist, Bag Action Suite */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Quick Search Trigger with subtle shortcut pill on desktop */}
              <button
                id="btn-header-search"
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-[#59534C] hover:text-[#181716] bg-[#FAF9F6] sm:border border-[#EFECE6] rounded-full transition-all group"
                aria-label="Search garments"
              >
                <Search className="w-4 h-4 text-[#8A8177] group-hover:text-[#181716]" />
                <span className="hidden md:inline text-xs text-[#8A8177] group-hover:text-[#59534C]">
                  Search sarees, kurtas, co-ords...
                </span>
              </button>

              {/* Wishlist Button */}
              <motion.button
                id="btn-header-wishlist"
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate('wishlist')}
                className="p-2 text-[#3D3732] hover:text-[#B2593E] relative transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B2593E] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </motion.button>

              {/* Shopping Bag Button */}
              <motion.button
                id="btn-header-bag"
                whileTap={{ scale: 0.9 }}
                onClick={onOpenBag}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181716] hover:bg-black text-[#FAF9F6] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                aria-label="Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Bag</span>
                <span className="text-[11px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {cartCount}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            id="mobile-nav-backdrop"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div>
                <div className="p-4 border-b border-[#EFECE6] flex items-center justify-between">
                  <span className="font-editorial text-2xl tracking-[0.2em] font-normal uppercase text-[#181716]">
                    VANYA
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-[#665F58] hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Links */}
                <div className="p-5 space-y-4 text-sm font-medium uppercase tracking-wider text-[#2E2A27]">
                  <button
                    onClick={() => {
                      onNavigate('home');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA] hover:text-[#B2593E]"
                  >
                    Home
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('plp', { gender: 'women' });
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA] hover:text-[#B2593E]"
                  >
                    Women&apos;s Collection
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('plp', { gender: 'men' });
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA] hover:text-[#B2593E]"
                  >
                    Men&apos;s Collection
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('plp', { category: 'Festive Silk Edit' });
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA] text-[#B2593E] font-semibold"
                  >
                    Festive Silk Luxe ✨
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('reels');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA] hover:text-[#B2593E] flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#B2593E] animate-pulse" />
                    <span>Watch &amp; Shop Reels</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('wishlist');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA] hover:text-[#B2593E]"
                  >
                    Saved Garments ({wishlistCount})
                  </button>

                  <button
                    id="btn-mobile-track-order"
                    onClick={() => {
                      onNavigate('order-status');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA] hover:text-[#B2593E] flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4 text-[#B2593E]" />
                    <span>Track Order Status</span>
                  </button>
                </div>
              </div>

              {/* Drawer Bottom Perks */}
              <div className="p-5 bg-[#FAF9F5] border-t border-[#EFECE6] text-xs text-[#706860] space-y-2">
                <p className="font-semibold text-[#181716]">Complimentary Shipping on all orders above ₹1,999</p>
                <p>7-Day Hassle-Free Doorstep Exchanges across India</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
