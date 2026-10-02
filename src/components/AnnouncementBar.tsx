import React from 'react';

interface AnnouncementBarProps {
  gender?: 'men' | 'women';
  onNavigate?: (route: string) => void;
}

export function AnnouncementBar({ gender = 'men', onNavigate }: AnnouncementBarProps) {
  return (
    <div
      id="announcement-bar"
      className="bg-[#111111] text-[#E5DFD7] text-[10px] sm:text-[11px] py-2 px-4 sm:px-8 relative z-40 border-b border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between tracking-[0.20em] uppercase font-light">
        {/* Left: Shipping perk */}
        <div className="hidden md:block">
          <span className="text-[#CFC6BA]">FREE DELIVERY ON ORDERS ABOVE ₹999</span>
        </div>

        {/* Center: Brand declaration */}
        <div className="mx-auto md:mx-0 text-center font-normal text-white tracking-[0.24em]">
          <span>
            {gender === 'men'
              ? 'A MODERN INDIAN MENSWEAR BRAND'
              : 'A MODERN INDIAN WOMENSWEAR ATELIER'}
          </span>
        </div>

        {/* Right: Quick utility links */}
        <div className="hidden sm:flex items-center gap-3 text-[#A89E92] font-light">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('order-status')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            TRACK ORDER
          </button>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('plp')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            STORES
          </button>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('order-status')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            HELP
          </button>
        </div>
      </div>
    </div>
  );
}

