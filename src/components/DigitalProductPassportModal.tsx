import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  QrCode,
  Leaf,
  Droplets,
  Wind,
  MapPin,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../types';

interface DigitalProductPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function DigitalProductPassportModal({
  isOpen,
  onClose,
  product,
}: DigitalProductPassportModalProps) {
  const [activeTab, setActiveTab] = useState<'provenance' | 'artisan' | 'impact' | 'circularity'>('provenance');

  if (!isOpen) return null;

  const passportId = `VNY-DPP-${product.id.replace('prod-', 'ATELIER-').toUpperCase()}-2026`;
  const isSilk =
    product.title.toLowerCase().includes('silk') ||
    (typeof product.fabric === 'string' && product.fabric.toLowerCase().includes('silk'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#DDD5C7] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-[#1A1816]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury Passport Header */}
        <div className="bg-[#1A1816] text-[#FAF8F5] px-6 py-5 flex items-center justify-between border-b border-[#362E25]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2A241E] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#D4AF37]">
                  Digital Product Passport (DPP)
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#2E5836] text-white font-mono font-semibold">
                  Verified Traceability
                </span>
              </div>
              <h2 className="font-editorial text-xl sm:text-2xl font-normal tracking-wide mt-0.5">
                {product.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#C4B8A8] hover:text-white transition-colors cursor-pointer"
            aria-label="Close passport"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Identity Ribbon */}
        <div className="bg-[#F2ECE1] border-b border-[#E3DACB] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#B2593E]" />
            <span className="text-[11px] font-mono font-bold text-[#1A1816]">
              {passportId}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#7A6E63]">
            <span>EU DPP &amp; India Handloom Standard Compliant</span>
            <span className="font-mono text-[#2E5836] font-semibold">● Live Immutable Ledger</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E5DDD0] bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab('provenance')}
            className={`py-3 px-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'provenance'
                ? 'border-[#B2593E] text-[#B2593E]'
                : 'border-transparent text-[#7A6E63] hover:text-[#1A1816]'
            }`}
          >
            Fiber Provenance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('artisan')}
            className={`py-3 px-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'artisan'
                ? 'border-[#B2593E] text-[#B2593E]'
                : 'border-transparent text-[#7A6E63] hover:text-[#1A1816]'
            }`}
          >
            Artisan &amp; Loom
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('impact')}
            className={`py-3 px-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'impact'
                ? 'border-[#B2593E] text-[#B2593E]'
                : 'border-transparent text-[#7A6E63] hover:text-[#1A1816]'
            }`}
          >
            Eco Footprint
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('circularity')}
            className={`py-3 px-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'circularity'
                ? 'border-[#B2593E] text-[#B2593E]'
                : 'border-transparent text-[#7A6E63] hover:text-[#1A1816]'
            }`}
          >
            Heirloom &amp; Care
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: FIBER PROVENANCE */}
          {activeTab === 'provenance' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#EAE3D7] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#B2593E]">
                    Botanical &amp; Yarn Composition
                  </span>
                  <span className="text-[10px] bg-[#E8F2EA] text-[#22572E] font-bold px-2 py-0.5 rounded-full">
                    100% Bio-Based
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8C7E72] block text-[11px]">Primary Textile:</span>
                    <strong className="text-[#1A1816] text-sm">
                      {isSilk ? 'Ahimsa Mulberry & Tussar Silk' : 'European Flax Linen & Organic Cotton'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#8C7E72] block text-[11px]">Zari / Accent Spec:</span>
                    <strong className="text-[#1A1816] text-sm">
                      Real Silver Electroplated Thread (Tested Zari)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#8C7E72] block text-[11px]">Dyeing Methodology:</span>
                    <strong className="text-[#1A1816] text-sm">
                      Natural Pomegranate Peel &amp; Fermented Indigo
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#8C7E72] block text-[11px]">Micro-Plastics:</span>
                    <strong className="text-[#2E5836] text-sm">
                      0.0% Synthetic Fibers
                    </strong>
                  </div>
                </div>
              </div>

              {/* Supply Chain Timeline */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C7E72]">
                  Farm-to-Atelier Traceability Chain
                </span>
                <div className="border-l-2 border-[#D8CEBF] ml-3 pl-4 space-y-3">
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B2593E] absolute -left-[21px] top-1" />
                    <strong className="text-xs text-[#1A1816] block">1. Organic Cultivation &amp; Reeling</strong>
                    <p className="text-[11px] text-[#7A6F64]">Non-violent Ahimsa sericulture clusters in Bhagalpur &amp; Assam.</p>
                  </div>
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] absolute -left-[21px] top-1" />
                    <strong className="text-xs text-[#1A1816] block">2. Botanical Vat Dyeing</strong>
                    <p className="text-[11px] text-[#7A6F64]">Zero-chemical closed-loop water recovery vats in Sanganer &amp; Maheshwar.</p>
                  </div>
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A1816] absolute -left-[21px] top-1" />
                    <strong className="text-xs text-[#1A1816] block">3. Handloom Weaving &amp; Tailoring</strong>
                    <p className="text-[11px] text-[#7A6F64]">Sculpted and tailored under ethical fair-wage conditions in New Delhi Atelier.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTISAN & CLUSTER */}
          {activeTab === 'artisan' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#EAE3D7] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-[#B2593E]">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold text-xs text-[#1A1816]">
                    Varanasi &amp; Chanderi Artisan Guild
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5146] leading-relaxed">
                  Woven on traditional wooden pit looms requiring zero electrical grid power. The intricate drape and jacquard motifs are manually punched by 4th-generation master weavers.
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F2ECE3] text-center">
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl">
                    <Clock className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                    <span className="text-[10px] text-[#8C7E72] block">Loom Craft Hours</span>
                    <strong className="text-sm text-[#1A1816]">42 Hours</strong>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl">
                    <Award className="w-4 h-4 text-[#2E5836] mx-auto mb-1" />
                    <span className="text-[10px] text-[#8C7E72] block">Fair-Wage Audit</span>
                    <strong className="text-sm text-[#2E5836]">100% Certified</strong>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl">
                    <Sparkles className="w-4 h-4 text-[#B2593E] mx-auto mb-1" />
                    <span className="text-[10px] text-[#8C7E72] block">Master Weavers</span>
                    <strong className="text-sm text-[#1A1816]">Kotwa Cluster</strong>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF3E0] border border-[#EADBBD] p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C6D1F] block">Artisan Premium Pledge</span>
                  <p className="text-[11px] text-[#6D5315]">
                    5% of proceeds from this garment are directly deposited into the Mubarakpur Weavers Health &amp; Loom Endowment.
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#8C6D1F] shrink-0 ml-3" />
              </div>
            </div>
          )}

          {/* TAB 3: ECO FOOTPRINT */}
          {activeTab === 'impact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-white border border-[#EAE3D7] rounded-2xl text-center space-y-1">
                  <Droplets className="w-5 h-5 text-[#2A75D3] mx-auto" />
                  <span className="text-[10px] text-[#8C7E72] block uppercase tracking-wider font-semibold">Water Saved</span>
                  <span className="text-xl font-bold font-mono text-[#1A1816]">420 Liters</span>
                  <p className="text-[10px] text-[#2E5836] font-medium">-72% vs industrial finishing</p>
                </div>

                <div className="p-3.5 bg-white border border-[#EAE3D7] rounded-2xl text-center space-y-1">
                  <Wind className="w-5 h-5 text-[#2E5836] mx-auto" />
                  <span className="text-[10px] text-[#8C7E72] block uppercase tracking-wider font-semibold">Carbon Offset</span>
                  <span className="text-xl font-bold font-mono text-[#1A1816]">-68% CO₂e</span>
                  <p className="text-[10px] text-[#2E5836] font-medium">Zero-emission handloom shuttle</p>
                </div>

                <div className="p-3.5 bg-white border border-[#EAE3D7] rounded-2xl text-center space-y-1">
                  <Leaf className="w-5 h-5 text-[#D4AF37] mx-auto" />
                  <span className="text-[10px] text-[#8C7E72] block uppercase tracking-wider font-semibold">Biodegradability</span>
                  <span className="text-xl font-bold font-mono text-[#1A1816]">100% Compostable</span>
                  <p className="text-[10px] text-[#2E5836] font-medium">Decomposes in soil in ~180 days</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#EAE3D7] rounded-2xl space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1816]">
                  Ecological Comparison Index
                </span>
                <div className="space-y-2 text-[11px]">
                  <div>
                    <div className="flex justify-between text-[#5C5146] mb-0.5">
                      <span>VANYA Handloom Ahimsa Silk</span>
                      <strong className="text-[#2E5836]">3.2 kg CO₂e / garment</strong>
                    </div>
                    <div className="w-full bg-[#EAE3D7] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2E5836] h-full w-[22%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[#5C5146] mb-0.5">
                      <span>Fast-Fashion Polyester Dress (Mill Produced)</span>
                      <strong className="text-[#A85B3F]">24.8 kg CO₂e / garment</strong>
                    </div>
                    <div className="w-full bg-[#EAE3D7] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#A85B3F] h-full w-[88%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CIRCULARITY & CARE */}
          {activeTab === 'circularity' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#EAE3D7] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-[#2E5836]">
                  <RefreshCw className="w-4 h-4" />
                  <span className="font-semibold text-xs text-[#1A1816]">
                    Atelier Heirloom Life-Cycle Warranty
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5146] leading-relaxed">
                  Every VANYA garment is sculpted as a collectible heirloom. This Digital Product Passport guarantees complimentary repair, seam re-enforcement, and zari polishing at our New Delhi atelier for life.
                </p>

                <div className="space-y-2 pt-2 border-t border-[#F2ECE3] text-[11px]">
                  <div className="flex items-center gap-2 text-[#2E5836]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complimentary Lifetime Alterations &amp; Hemming</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2E5836]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Natural Zari Shimmer Polishing Protocol</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2E5836]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Guaranteed 40% Store Credit Buyback via Atelier Archive</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#DDD5C7] rounded-2xl text-[11px] text-[#7A6F64]">
                <strong>Care Protocol:</strong> Hand-wash only in cold water with chemical-free reetha (soapnut) or gentle dry clean. Store in breathable mulmul cotton pouch provided with your box.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white px-6 py-3.5 border-t border-[#EAE3D7] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-[#8C7E72]">
            <FileCheck className="w-3.5 h-3.5 text-[#2E5836]" />
            <span>Cryptographically Signed by VANYA Ethics Council</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1A1816] hover:bg-black text-[#FAF8F5] uppercase tracking-wider font-semibold rounded-full transition-colors cursor-pointer"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
}
