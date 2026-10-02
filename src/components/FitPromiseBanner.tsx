import React from 'react';
import { motion } from 'motion/react';
import { Ruler, ShieldCheck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export function FitPromiseBanner() {
  const highlights = [
    {
      icon: <Ruler className="w-5 h-5 text-[#C29B38]" />,
      title: 'Fits Tailored for Indian Bodies',
      desc: 'Engineered proportions, contoured waistbands & no-gape silhouettes',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#C29B38]" />,
      title: 'Certified Artisanal Handloom',
      desc: 'Pure Chanderi zari, wild tussar & Normandy flax linens',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-[#C29B38]" />,
      title: '7-Day Doorstep Exchanges',
      desc: 'Complimentary home pickup for instant size & style swaps',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C29B38]" />,
      title: 'COD & Express Dispatch',
      desc: 'Free 48-hour dispatch across 19,000+ Indian postal codes',
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] border-y border-[#EFEBE3] py-7 sm:py-8 my-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex items-start gap-3.5"
            >
              <div className="p-2 bg-white rounded-full shadow-xs shrink-0 border border-[#EFECE6]">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#181716] tracking-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#706860] mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
