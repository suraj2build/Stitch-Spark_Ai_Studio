import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Instagram } from 'lucide-react';
import { Product, Gender } from '../types';
import { formatPrice } from '../utils/format';

interface CelebritySpotlightProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
  activeGender?: Gender;
}

export function CelebritySpotlight({
  products,
  onSelectProduct,
  activeGender = 'women',
}: CelebritySpotlightProps) {
  const isMen = activeGender === 'men';

  const menCelebrityFeatures = [
    {
      name: 'Siddhant M.',
      occasion: 'Jaipur Destination Wedding',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      productId: 'prod-4',
      tag: 'Raw Silk Bandhgala',
    },
    {
      name: 'Kabir K.',
      occasion: 'Udaipur Sangeet Soirée',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      productId: 'prod-8',
      tag: 'Tussar Mandarin Kurta',
    },
    {
      name: 'Rohan V.',
      occasion: 'Alibaug Sunset Gathering',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      productId: 'prod-2',
      tag: 'Normandy Flax Linen Shirt',
    },
  ];

  const womenCelebrityFeatures = [
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
      name: 'Tara M.',
      occasion: 'Diwali Soirée',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      productId: 'prod-7',
      tag: 'Pre-Draped Georgette Saree',
    },
  ];

  const celebrityFeatures = isMen ? menCelebrityFeatures : womenCelebrityFeatures;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-primary)] font-light block">
            Spotted in Vanya Atelier
          </span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-[#181716] font-normal mt-1">
            As Seen on Tastemakers
          </h2>
          <p className="text-xs text-[#706860] mt-1 font-light">
            {isMen
              ? 'Handcrafted bandhgalas and pure flax linen chosen for royal weddings and celebrations.'
              : 'Sculpted Chanderi silks and pre-draped silhouettes chosen for red carpets and celebrations.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {celebrityFeatures.map((item, idx) => {
          const matchedProd = products.find((p) => p.id === item.productId);
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              onClick={() => onSelectProduct(item.productId)}
              className="bg-white rounded-2xl overflow-hidden border border-[#EAE2D5] shadow-xs group cursor-pointer flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#241F1A] rounded-t-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3.5 inset-x-3.5 text-white">
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-[#E8DED1]">
                    <Instagram className="w-3 h-3 text-[#E8DED1]" />
                    <span>{item.occasion}</span>
                  </div>
                  <h3 className="font-editorial text-lg sm:text-xl font-normal text-white mt-0.5">
                    {item.name}
                  </h3>
                </div>
              </div>

              {matchedProd && (
                <div className="p-3.5 bg-white flex items-center justify-between border-t border-[#F2ECE1]">
                  <div>
                    <span className="text-[10px] tracking-wider uppercase text-[#8C8379] block">
                      Wearing
                    </span>
                    <span className="text-xs font-medium text-[#181716] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                      {matchedProd.title}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#181716] shrink-0 ml-2">
                    {formatPrice(matchedProd.price)}
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
