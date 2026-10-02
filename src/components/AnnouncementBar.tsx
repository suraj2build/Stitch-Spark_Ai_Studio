import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronRight, Truck, RefreshCw, Gift } from 'lucide-react';

interface AnnouncementBarProps {
  onPromoClick?: () => void;
}

export function AnnouncementBar({ onPromoClick }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const messages = [
    {
      icon: <Sparkles className="w-3 h-3 text-[#E8D09E] shrink-0" />,
      text: (
        <span>
          Festive Offer: Enjoy Flat 10% Off your first luxury purchase • Use Code{' '}
          <strong className="underline underline-offset-2 font-bold tracking-widest text-[#E8D09E]">
            VANYA10
          </strong>
        </span>
      ),
    },
    {
      icon: <Truck className="w-3 h-3 text-[#E8D09E] shrink-0" />,
      text: <span>Complimentary Pan-India Express Delivery on all orders above ₹1,999</span>,
    },
    {
      icon: <RefreshCw className="w-3 h-3 text-[#E8D09E] shrink-0" />,
      text: <span>Tailored For Indian Bodies • 7-Day Hassle-Free Doorstep Size Exchanges</span>,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  if (!isVisible) return null;

  return (
    <div
      id="announcement-bar"
      className="bg-[#181716] text-[#FAF9F6] text-xs py-2 px-4 relative z-40 border-b border-black/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:block w-6" />

        <div className="flex-1 overflow-hidden h-5 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMessageIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="flex items-center justify-center gap-2 tracking-wider font-normal text-[11px] sm:text-xs text-center cursor-pointer"
              onClick={onPromoClick}
            >
              {messages[activeMessageIndex].icon}
              <div className="truncate">{messages[activeMessageIndex].text}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          id="btn-close-announcement"
          onClick={() => setIsVisible(false)}
          className="text-[#A89F95] hover:text-white transition-colors p-0.5 rounded focus:outline-none"
          aria-label="Close announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
