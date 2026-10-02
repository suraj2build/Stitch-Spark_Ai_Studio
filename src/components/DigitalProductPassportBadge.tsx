import React from 'react';
import { ShieldCheck, QrCode, ArrowRight, Leaf } from 'lucide-react';
import { Product } from '../types';

interface DigitalProductPassportBadgeProps {
  product: Product;
  onOpenPassport: () => void;
  className?: string;
}

export function DigitalProductPassportBadge({
  product,
  onOpenPassport,
  className = '',
}: DigitalProductPassportBadgeProps) {
  const passportId = `VNY-DPP-${product.id.replace('prod-', 'ATELIER-').toUpperCase()}`;

  return (
    <div
      onClick={onOpenPassport}
      id="btn-digital-product-passport"
      className={`group p-3.5 bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#E5DDD0] hover:border-[#B2593E]/60 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${className}`}
      title="Inspect Verified Digital Product Passport"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#1A1816] text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7A6B]">
              Digital Product Passport
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#E8F2EA] text-[#22572E] font-bold font-mono">
              EU-DPP Ready
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1816] mt-0.5">
            <span className="font-mono text-[11px] text-[#5C5146]">{passportId}</span>
            <span className="text-[#A89C8E]">•</span>
            <span className="flex items-center gap-1 text-[11px] text-[#2E5836]">
              <Leaf className="w-3 h-3 text-[#2E5836]" />
              <span>100% Traceable Handloom</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold text-[#B2593E] shrink-0 group-hover:translate-x-0.5 transition-transform">
        <span className="text-[11px] uppercase tracking-wider font-bold">Inspect Passport</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
