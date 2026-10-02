export type Gender = 'women' | 'men' | 'all';

export interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
}

export interface SizeVariant {
  size: string;
  inStock: boolean;
  stockCount?: number; // e.g. 2 or 3 for low stock demonstration
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  fitFeedback: 'True to size' | 'Runs slightly small' | 'Runs slightly large';
  userImage?: string;
  purchasedSize: string;
  purchasedColor: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  gender: 'women' | 'men' | 'unisex';
  category: string;
  collection: string;
  price: number;
  mrp: number;
  discountPercent?: number;
  colors: ColorVariant[];
  sizes: SizeVariant[];
  fit: string;
  fabric: string;
  care: string[];
  occasion: string;
  badges?: ('NEW' | 'BESTSELLER' | 'LIMITED' | 'LOW STOCK')[];
  rating: number;
  reviewCount: number;
  modelInfo: {
    height: string;
    wearingSize: string;
  };
  details: string[];
  fitNotes: string;
  styleNotes: string;
  manufacturing: {
    origin: string;
    artisanCluster: string;
    sustainableNote: string;
  };
  reviews: Review[];
}

export interface ShoppableReel {
  id: string;
  title: string;
  caption: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
  };
  thumbnail: string;
  videoUrl?: string;
  views: string;
  likes: number;
  taggedProductIds: string[];
}

export interface StyledLook {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  season: string;
  taggedProductIds: string[];
}

export interface CartItem {
  id: string; // unique item uuid
  productId: string;
  colorName: string;
  size: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface FilterState {
  gender: Gender;
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  fabrics: string[];
  occasions: string[];
  fits: string[];
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  inStockOnly: boolean;
}
