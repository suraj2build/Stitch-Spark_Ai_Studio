import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Award, Gift, Check, ArrowRight, ShieldCheck, ChevronRight, Coins } from 'lucide-react';
import { formatPrice } from '../utils/format';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  basePoints: number;
  cartPoints: number;
  cartTotal: number;
}

export function RewardsModal({
  isOpen,
  onClose,
  basePoints,
  cartPoints,
  cartTotal,
}: RewardsModalProps) {
  if (!isOpen) return null;

  const [calcAmount, setCalcAmount] = useState<number>(cartTotal > 0 ? cartTotal : 5000);
  const potentialPoints = Math.floor(calcAmount / 10);
  const redemptionValue = Math.floor(potentialPoints / 2);

  // User tier calculation
  const totalWithCart = basePoints + cartPoints;
  const currentTier = totalWithCart >= 2500 ? 'Platinum Connoisseur' : totalWithCart >= 1000 ? 'Gold Atelier Patron' : 'Silver Aficionado';
  const nextTierPoints = totalWithCart >= 2500 ? 5000 : 2500;
  const progressPercent = Math.min(100, Math.round((totalWithCart / nextTierPoints) * 100));

  return (
    <div
      id="rewards-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-[#FAF8F5] border border-[#E8DFD1] rounded-3xl shadow-2xl p-6 sm:p-7 relative overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative gold glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FAF3E0] text-[#936616] flex items-center justify-center">
              <Award className="w-4 h-4 text-[#C29B38]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C7A6B] block">
                The Atelier Circle
              </span>
              <h3 className="font-editorial text-2xl text-[#1A1816] font-normal leading-tight">
                VANYA Rewards Privileges
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C7F72] hover:text-[#1A1816] transition-colors rounded-full"
            aria-label="Close rewards modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance & Tier Card */}
        <div className="mt-5 p-5 bg-gradient-to-br from-[#1F1C18] to-[#2C2621] text-white rounded-2xl space-y-4 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                Current Member Balance
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-editorial text-3xl sm:text-4xl font-normal text-white">
                  {basePoints.toLocaleString()}
                </span>
                <span className="text-xs uppercase tracking-wider text-[#C4B8A8]">Points</span>
              </div>
              <p className="text-[11px] text-[#A6998A] mt-0.5">
                Equivalent to <strong className="text-[#D4AF37] font-semibold">{formatPrice(Math.floor(basePoints / 2))}</strong> store credit
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[9px] uppercase tracking-widest text-[#9E9080] block font-semibold">
                Tier Status
              </span>
              <span className="inline-block mt-0.5 text-xs bg-[#FAF3E0]/15 text-[#F2DEB0] border border-[#D4AF37]/40 px-2.5 py-1 rounded-full font-semibold">
                {currentTier}
              </span>
            </div>
          </div>

          {/* Pending from Cart Banner */}
          {cartPoints > 0 ? (
            <div className="p-3 bg-[#38312A] border border-[#52463B] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>
                  You will earn <strong className="text-[#D4AF37] font-bold">+{cartPoints} points</strong> with current bag ({formatPrice(cartTotal)})
                </span>
              </div>
              <span className="text-[10px] bg-[#D4AF37] text-[#1A1816] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pending
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-[#A6998A]">
              Add pieces to your bag to calculate instant points earned on checkout.
            </p>
          )}

          {/* Tier Progress */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-[#B8AA9B]">
              <span>Next Tier Progress</span>
              <span>{totalWithCart} / {nextTierPoints} Pts</span>
            </div>
            <div className="w-full h-1.5 bg-[#40362E] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C29B38] to-[#E5C76B] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* How It Works Grid */}
        <div className="mt-5 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7A6B] block">
            How Customers Earn &amp; Redeem
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-white border border-[#EAE3D7] rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B2593E] block">
                1. Earn on Every Order
              </span>
              <p className="text-[#5C5146] text-[11px] leading-relaxed">
                Earn <strong>1 Point per ₹10</strong> spent automatically on all handloom silken &amp; cotton attire.
              </p>
            </div>

            <div className="p-3.5 bg-white border border-[#EAE3D7] rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B2593E] block">
                2. 2× Festive Multipliers
              </span>
              <p className="text-[#5C5146] text-[11px] leading-relaxed">
                Get <strong>Double Points</strong> during seasonal runway drops and festive collection launches.
              </p>
            </div>

            <div className="p-3.5 bg-white border border-[#EAE3D7] rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B2593E] block">
                3. Instant Redemption
              </span>
              <p className="text-[#5C5146] text-[11px] leading-relaxed">
                Redeem at checkout. <strong>100 Points = ₹50 discount</strong> with zero expiry limits.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Points Calculator */}
        <div className="mt-5 p-4 bg-[#F5EFE6] border border-[#E5DFD5] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6F62]">
              Points Earnings Calculator
            </span>
            <span className="text-[11px] text-[#A0452E] font-semibold">
              10% Effective Rewards Back
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2 text-xs font-semibold text-[#665D52]">₹</span>
              <input
                type="number"
                min="500"
                step="500"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D8CEBF] rounded-full text-xs font-semibold text-[#1A1816] focus:outline-none focus:border-[#B2593E]"
                placeholder="Cart amount..."
              />
            </div>
            <div className="flex gap-1">
              {[3000, 5000, 10000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCalcAmount(preset)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                    calcAmount === preset
                      ? 'bg-[#1A1816] text-white border-[#1A1816]'
                      : 'bg-white text-[#6B5F54] border-[#D8CEBF] hover:border-[#B2593E]'
                  }`}
                >
                  ₹{preset / 1000}k
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EAE3D7]">
            <span className="text-[#5C5146]">Points you will earn:</span>
            <span className="font-bold text-[#1A1816]">
              +{potentialPoints} Vanya Points ({formatPrice(redemptionValue)} value)
            </span>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 bg-[#1A1816] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-full transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
