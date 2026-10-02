import React from 'react';
import { ShieldCheck, RefreshCw, Truck, HeartHandshake } from 'lucide-react';
import { NewsletterSignup } from './NewsletterSignup';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onNavigate: (route: string, params?: any) => void;
}

export function Footer({ onOpenSizeGuide, onNavigate }: FooterProps) {

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

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Intro & Newsletter */}
          <div className="md:col-span-5 space-y-4">
            <div className="font-editorial text-3xl tracking-[0.2em] font-normal uppercase text-white">
              VANYA
            </div>
            <p className="text-xs text-[#B5A89B] leading-relaxed max-w-sm">
              Contemporary Indian luxury fashion. Rooted in artisanal handloom traditions, sculpted for fluid modern living.
            </p>

            <div className="pt-2">
              <NewsletterSignup />
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#EDE6DC] block">
              Collections
            </span>
            <ul className="space-y-2 text-xs text-[#B5A89B]">
              <li>
                <button onClick={() => onNavigate('plp', { gender: 'women' })} className="hover:text-white transition-colors">
                  Women&apos;s Edit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plp', { gender: 'men' })} className="hover:text-white transition-colors">
                  Men&apos;s Edit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plp', { category: 'Festive Silk Edit' })} className="hover:text-white transition-colors">
                  The Festive Silk Edit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plp', { category: 'Minimalist Resort' })} className="hover:text-white transition-colors">
                  Minimalist Resort
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reels')} className="hover:text-white transition-colors">
                  Watch &amp; Shop Reels
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#EDE6DC] block">
              Client Care
            </span>
            <ul className="space-y-2 text-xs text-[#B5A89B]">
              <li>
                <button onClick={onOpenSizeGuide} className="hover:text-white transition-colors">
                  Garment Size Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('order-status')}
                  className="hover:text-white transition-colors text-left"
                >
                  Shipping &amp; Order Tracking
                </button>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  7-Day Returns &amp; Exchanges
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Wash &amp; Textile Care
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Concierge Support
                </span>
              </li>
            </ul>
          </div>

          {/* Brand Ethos */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#EDE6DC] block">
              Our Ethos
            </span>
            <ul className="space-y-2 text-xs text-[#B5A89B]">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Weaving Clusters of Chanderi &amp; Varanasi
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Low-Impact Botanicals &amp; Ahimsa Silks
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Artisan Fair-Wage Commitment
                </span>
              </li>
              <li>
                <span className="text-[11px] text-[#887D70]">
                  concierge@vanya.in • Jaipur &amp; Mumbai
                </span>
              </li>
            </ul>
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
    </footer>
  );
}
