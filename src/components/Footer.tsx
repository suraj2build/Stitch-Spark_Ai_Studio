import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Truck, HeartHandshake, Coins, Award, Sparkles, Gift, ArrowRight, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { NewsletterSignup } from './NewsletterSignup';
import { RewardsModal } from './RewardsModal';
import { TrendingCategoriesChart } from './TrendingCategoriesChart';
import { Product, CartItem, Gender } from '../types';

interface FooterProps {
  currentGender?: Gender;
  onOpenSizeGuide: () => void;
  onNavigate: (route: string, params?: any) => void;
  loyaltyPoints?: number;
  earnedCartPoints?: number;
  cartTotal?: number;
  products?: Product[];
  cartItems?: CartItem[];
  wishlistIds?: Set<string>;
  onToggleWishlist?: (productId: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export function Footer({
  currentGender = 'women',
  onOpenSizeGuide,
  onNavigate,
  loyaltyPoints = 1250,
  earnedCartPoints = 0,
  cartTotal = 0,
  products = [],
  cartItems = [],
  wishlistIds = new Set(),
  onToggleWishlist,
  onSelectProduct,
}: FooterProps) {
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [showFooterChart, setShowFooterChart] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const isMen = currentGender === 'men';

  return (
    <footer id="main-footer" className="bg-[#1A1816] text-[#FAF8F5] pt-14 pb-8 border-t border-[#312C28]">
      {/* Brand Trust Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#312C28]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <Truck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-[#EDE6DC]">
                Complimentary Shipping
              </h5>
              <p className="text-[11px] text-[#A69A8E] mt-0.5">
                All-India express dispatch on orders above ₹1,999
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <RefreshCw className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-[#EDE6DC]">
                7-Day Exchanges
              </h5>
              <p className="text-[11px] text-[#A69A8E] mt-0.5">
                Complimentary door-step size &amp; style pickup
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-[#EDE6DC]">
                Artisanal Craft
              </h5>
              <p className="text-[11px] text-[#A69A8E] mt-0.5">
                Woven by certified master clusters across India
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-[#EDE6DC]">
                Secure Checkout
              </h5>
              <p className="text-[11px] text-[#A69A8E] mt-0.5">
                UPI, NetBanking, Cards &amp; Cash on Delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vanya Rewards Loyalty Section */}
      <div id="vanya-rewards-footer-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-[#312C28]">
        <div className="bg-gradient-to-r from-[#241F1A] via-[#2B231D] to-[#201A16] border border-[#44382B] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#3D3328]">
            <div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#D4AF37]">
                  Vanya Rewards • The Atelier Loyalty Circle
                </span>
              </div>
              <h4 className="font-editorial text-2xl sm:text-3xl text-white font-normal mt-1 tracking-wide">
                Earn Handcrafted Privileges on Every Purchase
              </h4>
              <p className="text-xs text-[#B5A89B] max-w-2xl mt-1 leading-relaxed">
                Every rupee spent honoring Indian handloom crafts returns to you as member privileges. Collect Atelier Points on every silhouette and redeem effortlessly at checkout.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setRewardsModalOpen(true)}
                className="px-6 py-2.5 bg-[#FAF8F5] hover:bg-[#EAE4D8] text-[#1A1816] text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
              >
                <Award className="w-3.5 h-3.5 text-[#C29B38]" />
                <span>Check Your Balance</span>
              </button>
            </div>
          </div>

          {/* 4 Core Pillars of Points Earning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="bg-[#1C1814]/70 border border-[#382E24] p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Coins className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold text-[#FAF8F5]">
                  1 Point per ₹10
                </span>
              </div>
              <p className="text-[11px] text-[#A6998A] leading-relaxed">
                Earn 1 Vanya Point for every ₹10 spent across all women&apos;s, men&apos;s, and festive collections automatically.
              </p>
            </div>

            <div className="bg-[#1C1814]/70 border border-[#382E24] p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold text-[#FAF8F5]">
                  2× Festive Multipliers
                </span>
              </div>
              <p className="text-[11px] text-[#A6998A] leading-relaxed">
                Enjoy Double Points on all limited-edition Festive Silk, Banarasi Katan &amp; Chanderi bridal releases.
              </p>
            </div>

            <div className="bg-[#1C1814]/70 border border-[#382E24] p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Gift className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold text-[#FAF8F5]">
                  100 Pts = ₹50 Credit
                </span>
              </div>
              <p className="text-[11px] text-[#A6998A] leading-relaxed">
                Redeem points seamlessly at checkout for instant cash savings with zero expiry dates and no cart minimums.
              </p>
            </div>

            <div className="bg-[#1C1814]/70 border border-[#382E24] p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Award className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold text-[#FAF8F5]">
                  Tier Privileges
                </span>
              </div>
              <p className="text-[11px] text-[#A6998A] leading-relaxed">
                Unlock complimentary bespoke alterations, surprise birthday tokens, and private trunk show viewings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Categories D3 Bar Chart Section */}
      <div id="footer-trending-categories-d3" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-[#312C28]">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#EDE6DC]">
              Trending Categories • Editorial Demand Insights (D3.js)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('admin-insights')}
              className="text-[11px] uppercase tracking-wider font-semibold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Analytics View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowFooterChart((prev) => !prev)}
              className="px-3.5 py-1.5 bg-[#26211C] hover:bg-[#342D26] border border-[#44382B] text-xs text-[#FAF8F5] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{showFooterChart ? 'Hide D3 Chart' : 'Show D3 Chart'}</span>
              {showFooterChart ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {showFooterChart && (
          <div className="mt-2 pt-2">
            <TrendingCategoriesChart
              products={products}
              cartItems={cartItems}
              wishlistIds={wishlistIds}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              theme="dark"
            />
          </div>
        )}
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#292420]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Intro Column */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-editorial text-2xl sm:text-3xl tracking-[0.24em] font-normal uppercase text-white">
              VANYA
            </div>
            <span className="text-[9px] tracking-[0.28em] uppercase text-[#A89E92] font-light block">
              — INDIAN ROOTS · MODERN TODAY —
            </span>
            <p className="text-xs text-[#A89E92] font-light leading-relaxed max-w-xs pt-1 italic sm:not-italic">
              &ldquo;Modern Indian {isMen ? 'menswear' : 'womenswear'} for a more thoughtful tomorrow.&rdquo;
            </p>
          </div>

          {/* Column 1: Shop (Strictly dedicated to current gender catalog) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs uppercase tracking-[0.18em] font-medium text-white block">
              Shop {isMen ? 'Men' : 'Women'}
            </span>
            <ul className="space-y-2 text-xs text-[#A89E92] font-light">
              <li>
                <button onClick={() => onNavigate('plp', { gender: currentGender, category: 'all' })} className="hover:text-white transition-colors cursor-pointer">
                  New In
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plp', { gender: currentGender, category: isMen ? 'Festive & Ceremonial' : 'Festive Silk Edit' })} className="hover:text-white transition-colors cursor-pointer">
                  {isMen ? 'Festive & Ceremonial' : 'Festive Silk Edit'}
                </button>
              </li>
              {isMen ? (
                <>
                  <li>
                    <button onClick={() => onNavigate('plp', { gender: 'men', category: 'Bandhgalas & Jackets' })} className="hover:text-white transition-colors cursor-pointer">
                      Bandhgalas &amp; Jackets
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('plp', { gender: 'men', category: 'Kurtas' })} className="hover:text-white transition-colors cursor-pointer">
                      Handloom Kurtas
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('plp', { gender: 'men', category: 'Linen & Silk Shirts' })} className="hover:text-white transition-colors cursor-pointer">
                      Linen &amp; Silk Shirts
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('plp', { gender: 'men', category: 'Pleated Trousers' })} className="hover:text-white transition-colors cursor-pointer">
                      Pleated Trousers
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button onClick={() => onNavigate('plp', { gender: 'women', category: 'Modern Sarees' })} className="hover:text-white transition-colors cursor-pointer">
                      Modern Sarees
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('plp', { gender: 'women', category: 'Co-ords & Sets' })} className="hover:text-white transition-colors cursor-pointer">
                      Co-ords &amp; Sets
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('plp', { gender: 'women', category: 'Dresses' })} className="hover:text-white transition-colors cursor-pointer">
                      Dresses &amp; Drapes
                    </button>
                  </li>
                </>
              )}
              <li className="pt-1.5 border-t border-[#312C28]">
                <button
                  onClick={() => onNavigate('gateway')}
                  className="text-[var(--color-primary)] hover:underline transition-colors cursor-pointer font-medium flex items-center gap-1 text-[11px]"
                  title="Return to Atelier Gateway to choose department"
                >
                  <span>← Switch Department (Main Portal)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs uppercase tracking-[0.18em] font-medium text-white block">
              Help
            </span>
            <ul className="space-y-2 text-xs text-[#A89E92] font-light">
              <li>
                <button onClick={onOpenSizeGuide} className="hover:text-white transition-colors cursor-pointer">
                  Size Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('order-status')} className="hover:text-white transition-colors cursor-pointer">
                  Shipping &amp; Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('order-status')} className="hover:text-white transition-colors cursor-pointer">
                  Returns &amp; Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('order-status')} className="hover:text-white transition-colors cursor-pointer">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('order-status')} className="hover:text-white transition-colors cursor-pointer">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('order-status')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: About Vanya */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs uppercase tracking-[0.18em] font-medium text-white block">
              About Vanya
            </span>
            <ul className="space-y-2 text-xs text-[#A89E92] font-light">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Our Story</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Craft &amp; Artisans</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Sustainability</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Journal</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Atelier</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Stores</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Join The Atelier */}
          <div className="lg:col-span-3 space-y-3.5">
            <span className="text-xs uppercase tracking-[0.18em] font-medium text-white block">
              Join The Atelier
            </span>
            <p className="text-xs text-[#A89E92] font-light">
              Exclusive updates, styling stories and early access.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#241F1A] border border-[#44382C] rounded-2xl text-xs text-[#E8DFD3] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A278] shrink-0" />
                <span>Thank you for joining. Welcome to the VANYA Atelier.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="bg-[#12100E] border border-[#3A332C] px-4 py-2.5 text-xs text-white placeholder-[#786E63] rounded-full focus:outline-none focus:border-[#C5A278] flex-1"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-white text-[#181716] hover:bg-[#F0ECE4] rounded-full transition-colors cursor-pointer shrink-0 shadow-xs"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Social Icons (Instagram, YouTube, Pinterest, Facebook) */}
            <div className="flex items-center gap-4 text-[#A89E92] pt-1">
              <span className="hover:text-white transition-colors cursor-pointer text-xs font-mono">IG</span>
              <span className="hover:text-white transition-colors cursor-pointer text-xs font-mono">YT</span>
              <span className="hover:text-white transition-colors cursor-pointer text-xs font-mono">PIN</span>
              <span className="hover:text-white transition-colors cursor-pointer text-xs font-mono">FB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[#2B2622] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#786D61] gap-3">
        <div>
          © 2026 VANYA ATELIER PRIVATE LIMITED. All rights reserved.
        </div>
        <div className="flex gap-4">
          <span className="hover:text-[#B5A89B] cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-[#B5A89B] cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-[#B5A89B] cursor-pointer">Artisan Transparency</span>
        </div>
      </div>

      {/* Rewards Details Modal */}
      <RewardsModal
        isOpen={rewardsModalOpen}
        onClose={() => setRewardsModalOpen(false)}
        basePoints={loyaltyPoints}
        cartPoints={earnedCartPoints}
        cartTotal={cartTotal}
      />
    </footer>
  );
}
