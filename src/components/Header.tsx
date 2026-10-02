import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Truck,
  Coins,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { Gender } from '../types';
import { RewardsModal } from './RewardsModal';

interface HeaderProps {
  currentRoute: string;
  currentGender?: Gender;
  onSelectDepartment?: (gender: 'men' | 'women') => void;
  onNavigate: (route: string, params?: { gender?: Gender; category?: string; productId?: string }) => void;
  onOpenSearch: () => void;
  onOpenBag: () => void;
  cartCount: number;
  wishlistCount: number;
  loyaltyPoints?: number;
  earnedCartPoints?: number;
  cartTotal?: number;
}

export function Header({
  currentRoute,
  currentGender = 'women',
  onSelectDepartment,
  onNavigate,
  onOpenSearch,
  onOpenBag,
  cartCount,
  wishlistCount,
  loyaltyPoints = 1250,
  earnedCartPoints = 0,
  cartTotal = 0,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMen = currentGender === 'men';

  return (
    <>
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-2xs border-b border-[#EFECE6]'
            : 'bg-white border-b border-[#F0ECE4]'
        }`}
      >
        {/* Tier 1: Slim, Airy Utility Bar (Removes clutter from main row) */}
        <div className="hidden lg:block border-b border-[#F4EFE6] bg-[#FAF8F5]/80 text-[#7A7065] text-[11px] py-1.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Direct gateway link */}
            <button
              type="button"
              onClick={() => onNavigate('gateway')}
              className="flex items-center gap-1.5 hover:text-[#181716] transition-colors cursor-pointer tracking-wider uppercase font-light"
              title="Return to Main Department Gateway to choose Men or Women"
            >
              <Compass className="w-3 h-3 text-[var(--color-primary)]" />
              <span>← Atelier Portals (Choose Department)</span>
            </button>

            {/* Center: Subtle Curated Announcement */}
            <p className="text-[11px] tracking-[0.16em] uppercase font-light text-[#8A7E72]">
              Complimentary Express Delivery &amp; Bespoke Tailoring on Orders above ₹5,000
            </p>

            {/* Right: Quick Utilities */}
            <div className="flex items-center gap-5 tracking-wider uppercase font-light">
              <button
                type="button"
                onClick={() => onNavigate('order-status')}
                className="flex items-center gap-1 hover:text-[#181716] transition-colors cursor-pointer"
              >
                <Truck className="w-3 h-3 text-[var(--color-primary)]" />
                <span>Track Order</span>
              </button>

              <button
                type="button"
                onClick={() => setRewardsModalOpen(true)}
                className="flex items-center gap-1 hover:text-[#181716] transition-colors cursor-pointer font-medium text-[#705139]"
              >
                <Coins className="w-3 h-3 text-[var(--color-primary)]" />
                <span>Rewards ({loyaltyPoints.toLocaleString()} Pts)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Main Spacious Haute Couture Navigation Bar */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Mobile menu button */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#221D19] hover:opacity-70 transition-opacity"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Left Nav: Primary Categories */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[11px] xl:text-[12px] tracking-[0.16em] uppercase font-medium whitespace-nowrap">
              <button
                onClick={() => onNavigate('home', { gender: currentGender })}
                className={`py-2 transition-colors relative cursor-pointer ${
                  currentRoute === 'home' ? 'text-[#181716] font-semibold' : 'text-[#60554A] hover:text-[#181716]'
                }`}
              >
                {isMen ? 'MEN' : 'WOMEN'}
                {currentRoute === 'home' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[#181716]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>

              <button
                onClick={() => onNavigate('plp', { gender: currentGender, category: isMen ? 'Festive & Ceremonial' : 'Festive Silk Edit' })}
                className="py-2 text-[#60554A] hover:text-[#181716] transition-colors cursor-pointer"
              >
                FESTIVE
              </button>

              <button
                onClick={() => onNavigate('plp', { gender: currentGender, category: 'all' })}
                className="py-2 text-[#60554A] hover:text-[#181716] transition-colors cursor-pointer"
              >
                NEW IN
              </button>

              {isMen ? (
                <>
                  <button
                    onClick={() => onNavigate('plp', { gender: 'men', category: 'Bandhgalas & Jackets' })}
                    className="py-2 text-[#60554A] hover:text-[#181716] transition-colors cursor-pointer"
                  >
                    BANDHGALAS
                  </button>
                  <button
                    onClick={() => onNavigate('plp', { gender: 'men', category: 'Linen & Silk Shirts' })}
                    className="py-2 text-[#60554A] hover:text-[#181716] transition-colors cursor-pointer"
                  >
                    SHIRTS
                  </button>
                  <button
                    onClick={() => onNavigate('plp', { gender: 'men', category: 'Kurtas' })}
                    className="py-2 text-[#60554A] hover:text-[#181716] transition-colors cursor-pointer"
                  >
                    KURTAS
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('plp', { gender: 'women', category: 'Modern Sarees' })}
                    className="py-2 text-[#60554A] hover:text-[#181716] transition-colors cursor-pointer"
                  >
                    SAREES
                  </button>
                  <button
                    onClick={() => onNavigate('plp', { gender: 'women', category: 'Co-ords & Sets' })}
                    className="py-2 text-[#60554A] hover:text-[#181716] transition-colors cursor-pointer"
                  >
                    CO-ORDS
                  </button>
                  <button
                    onClick={() => onNavigate('plp', { gender: 'women', category: 'Dresses' })}
                    className="py-2 text-[#60554A] hover:text-[#181716] transition-colors cursor-pointer"
                  >
                    DRESSES
                  </button>
                </>
              )}
            </nav>

            {/* Center Column: Prominent Luxury Brand Logo with Tagline */}
            <div
              className="text-center cursor-pointer select-none px-2 lg:px-4 shrink-0"
              onClick={() => onNavigate('home', { gender: currentGender })}
              title="Return to Atelier Home"
            >
              <span className="font-editorial text-2xl sm:text-3xl lg:text-[34px] tracking-[0.28em] font-normal uppercase text-[#181716] block hover:opacity-90 transition-opacity leading-none">
                VANYA
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.28em] uppercase text-[#73685C] font-light block mt-1">
                — INDIAN ROOTS · MODERN TODAY —
              </span>
            </div>

            {/* Right Column: Secondary Nav, Integrated Search, and Icons */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
              {/* Secondary links */}
              <nav className="hidden xl:flex items-center gap-5 text-[11px] xl:text-[12px] tracking-[0.16em] uppercase font-medium whitespace-nowrap">
                <button
                  onClick={() => onNavigate('plp', { gender: currentGender, category: isMen ? 'Pleated Trousers' : 'Co-ords & Sets' })}
                  className="py-2 text-[#60554A] hover:text-[#181716] transition-colors cursor-pointer"
                >
                  {isMen ? 'TROUSERS' : 'SETS'}
                </button>
                <button
                  onClick={() => onNavigate('reels')}
                  className={`py-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    currentRoute === 'reels' ? 'text-[#181716] font-semibold' : 'text-[#60554A] hover:text-[#181716]'
                  }`}
                >
                  <span>WATCH &amp; SHOP</span>
                </button>
              </nav>

              {/* Integrated Search Input (as seen in mockup) */}
              <div
                onClick={onOpenSearch}
                className="hidden lg:flex items-center gap-2 bg-[#F6F4F0] hover:bg-[#EFECE5] px-3 py-1.5 rounded-full border border-[#E5DFD5] transition-colors cursor-pointer w-48 xl:w-56 text-[#7E7468]"
              >
                <Search className="w-3.5 h-3.5 shrink-0 text-[#9E9488]" />
                <span className="text-[11px] truncate tracking-normal font-light">
                  Search kurtas, bandhgalas...
                </span>
              </div>

              {/* Mobile Search Icon */}
              <button
                onClick={onOpenSearch}
                className="lg:hidden p-2 text-[#59534C] hover:text-[#181716] transition-colors cursor-pointer"
                aria-label="Search garments"
              >
                <Search className="w-4 h-4 text-[#7A7065]" />
              </button>

              {/* User Account Icon */}
              <button
                type="button"
                onClick={() => onNavigate('order-status')}
                className="p-1.5 text-[#3D3732] hover:text-[#181716] transition-colors cursor-pointer"
                title="Account &amp; Orders"
                aria-label="Account"
              >
                <User className="w-4 h-4 stroke-[1.6]" />
              </button>

              {/* Wishlist Heart Icon */}
              <motion.button
                id="btn-header-wishlist"
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate('wishlist')}
                className="p-1.5 text-[#3D3732] hover:text-[#181716] relative transition-colors cursor-pointer"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[1.6]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#181716] text-white text-[9px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </motion.button>

              {/* Shopping Bag Button with Badge */}
              <motion.button
                id="btn-header-bag"
                whileTap={{ scale: 0.92 }}
                onClick={onOpenBag}
                className="p-1.5 text-[#3D3732] hover:text-[#181716] relative transition-colors cursor-pointer shrink-0"
                title="Shopping Bag"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.6]" />
                <span className="absolute -top-0.5 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#181716] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Dynamic Atmosphere Glow Accent Line */}
        <div
          className={`h-[1.5px] w-full transition-all duration-500 ${
            isMen
              ? 'bg-gradient-to-r from-transparent via-[#8F6B4E] to-transparent opacity-80'
              : 'bg-gradient-to-r from-transparent via-[#866791] to-transparent opacity-80'
          }`}
        />
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
              className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between rounded-r-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div>
                <div className="p-5 border-b border-[#EFECE6] flex items-center justify-between">
                  <div>
                    <span className="font-editorial text-2xl tracking-[0.22em] font-normal uppercase text-[#181716] block">
                      VANYA
                    </span>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--color-primary)] font-light">
                      {isMen ? 'Pour Homme · Men' : 'Pour Femme · Women'}
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-[#665F58] hover:text-black cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Links */}
                <div className="p-5 space-y-3.5 text-xs font-medium uppercase tracking-[0.16em] text-[#2E2A27]">
                  <button
                    onClick={() => {
                      onNavigate('home', { gender: currentGender });
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                  >
                    Home
                  </button>

                  {isMen ? (
                    <>
                      <button
                        onClick={() => {
                          onNavigate('plp', { gender: 'men', category: 'Bandhgalas & Jackets' });
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                      >
                        Bandhgalas &amp; Jackets
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('plp', { gender: 'men', category: 'Linen & Silk Shirts' });
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                      >
                        Linen &amp; Silk Shirts
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('plp', { gender: 'men', category: 'all' });
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                      >
                        Handloom Kurtas
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('plp', { gender: 'men', category: 'Pleated Trousers' });
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                      >
                        Pleated Trousers
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          onNavigate('plp', { gender: 'women', category: 'Modern Sarees' });
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                      >
                        Modern Sarees
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('plp', { gender: 'women', category: 'Co-ords & Sets' });
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                      >
                        Co-ords &amp; Sets
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('plp', { gender: 'women', category: 'Dresses' });
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                      >
                        Dresses &amp; Drapes
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('plp', { gender: 'women', category: 'Festive Silk Edit' });
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                      >
                        Festive Silk Edit
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      onNavigate('reels');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                  >
                    Watch &amp; Shop
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('order-status');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 border-b border-[#F4F1EA]"
                  >
                    Track Order
                  </button>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 bg-[#FAF8F5] border-t border-[#EFECE6] space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('gateway');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 bg-white hover:bg-[#F5EFE6] border border-[#DDD3C5] hover:border-[#1A1816] text-xs uppercase tracking-wider font-semibold text-[#181716] rounded-full flex items-center justify-between cursor-pointer shadow-xs transition-colors"
                >
                  <span>← Choose Department (Main Portal)</span>
                  <Compass className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rewards Tier Privileges Modal */}
      <RewardsModal
        isOpen={rewardsModalOpen}
        onClose={() => setRewardsModalOpen(false)}
        basePoints={loyaltyPoints}
        cartPoints={earnedCartPoints}
        cartTotal={cartTotal}
      />
    </>
  );
}
