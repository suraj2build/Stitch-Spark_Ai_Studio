import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Instagram } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

interface CelebritySpotlightProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
}

export function CelebritySpotlight({ products, onSelectProduct }: CelebritySpotlightProps) {
  const celebrityFeatures = [
    {
      name: 'Kiara A.',
      occasion: 'Festive Pooja at Home',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      productId: 'prod-1',
      tag: 'Chanderi Wrap Kurta Set',
    },
    {
      name: 'Radhika S.',
      occasion: 'Cocktail Gala & Reception',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
      productId: 'prod-3',
      tag: 'Asymmetric Pleated Dress',
    },
    {
      name: 'Siddhant M.',
      occasion: 'Jaipur Destination Wedding',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      productId: 'prod-4',
      tag: 'Raw Silk Bandhgala',
    },
    {
      name: 'Tara M.',
      occasion: 'Diwali Soirée',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      productId: 'prod-7',
      tag: 'Pre-Draped Georgette Saree',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#C29B38] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spotted in Vanya</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#181716] font-normal mt-1">
            As Seen on Tastemakers &amp; Celebrities
          </h2>
          <p className="text-xs text-[#706860] mt-1">
            Contemporary silhouettes chosen for red carpets, intimate sangeets, and festival soirees.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {celebrityFeatures.map((celeb, idx) => {
          const product = products.find((p) => p.id === celeb.productId);

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => onSelectProduct(celeb.productId)}
              className="group cursor-pointer flex flex-col bg-white rounded-xs overflow-hidden border border-[#EFECE6] hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/5] bg-[#F7F5F0] overflow-hidden relative">
                <img
                  src={celeb.image}
                  alt={celeb.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Celebrity info bottom overlay */}
                <div className="absolute bottom-3 inset-x-3 text-white">
                  <div className="flex items-center justify-between text-[10px] text-[#E8DED1]">
                    <span className="font-medium">{celeb.name}</span>
                    <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px]">
                      {celeb.occasion}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold tracking-wide mt-1 text-white line-clamp-1">
                    {celeb.tag}
                  </h4>
                </div>
              </div>

              {product && (
                <div className="p-3 bg-white flex items-center justify-between">
                  <span className="text-xs font-bold text-[#181716]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#B2593E] group-hover:underline flex items-center gap-1">
                    <span>Shop Look</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
