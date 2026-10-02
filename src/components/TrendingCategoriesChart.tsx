import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem } from '../types';
import {
  TrendingUp,
  ShoppingBag,
  Heart,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Info,
  Check,
  Tag,
  Eye,
} from 'lucide-react';
import { formatPrice } from '../utils/format';

export interface CategoryTrendData {
  category: string;
  cartCount: number;
  wishlistCount: number;
  viewCount: number;
  trendScore: number;
  growthRate: string;
  topProductTitle: string;
}

interface TrendingCategoriesChartProps {
  products: Product[];
  cartItems: CartItem[];
  wishlistIds: Set<string>;
  onToggleWishlist?: (productId: string) => void;
  onSelectProduct?: (productId: string) => void;
  className?: string;
  theme?: 'dark' | 'light';
}

export function TrendingCategoriesChart({
  products,
  cartItems,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  className = '',
  theme = 'dark',
}: TrendingCategoriesChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [metric, setMetric] = useState<'composite' | 'cart' | 'wishlist'>('composite');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{
    data: CategoryTrendData;
    x: number;
    y: number;
  } | null>(null);
  const [wishlistToast, setWishlistToast] = useState<{ title: string; added: boolean } | null>(null);

  // Compute aggregated category metrics based on catalog, dynamic cart, and wishlist state
  const data: CategoryTrendData[] = useMemo(() => {
    const categories = Array.from(new Set(products.map((p) => p.category)));

    const baseDemandWeights: Record<string, { views: number; baseCart: number; baseWishlist: number; growth: string }> = {
      'Co-ords & Sets': { views: 420, baseCart: 18, baseWishlist: 34, growth: '+38%' },
      'Festive Silk Edit': { views: 580, baseCart: 26, baseWishlist: 48, growth: '+52%' },
      'Modern Sarees': { views: 390, baseCart: 14, baseWishlist: 29, growth: '+24%' },
      'Dresses & Drapes': { views: 310, baseCart: 11, baseWishlist: 22, growth: '+19%' },
      'Shirts & Overshirts': { views: 280, baseCart: 9, baseWishlist: 16, growth: '+15%' },
      'Minimalist Resort': { views: 240, baseCart: 8, baseWishlist: 14, growth: '+12%' },
    };

    return categories.map((cat) => {
      const catProducts = products.filter((p) => p.category === cat);
      const catProductIds = new Set(catProducts.map((p) => p.id));

      // Dynamic cart additions
      const sessionCartAdds = cartItems
        .filter((item) => catProductIds.has(item.productId))
        .reduce((sum, item) => sum + item.quantity, 0);

      // Dynamic wishlist additions
      const sessionWishlistAdds = Array.from(wishlistIds).filter((id) =>
        catProductIds.has(id)
      ).length;

      const base = baseDemandWeights[cat] || {
        views: 200,
        baseCart: 5,
        baseWishlist: 10,
        growth: '+10%',
      };

      const totalCart = base.baseCart + sessionCartAdds * 4;
      const totalWishlist = base.baseWishlist + sessionWishlistAdds * 3;
      const totalViews = base.views + sessionCartAdds * 15 + sessionWishlistAdds * 8;

      // Composite Score: (Cart × 3.5) + (Wishlist × 2.0) + (Views × 0.1)
      const trendScore = Math.round(totalCart * 3.5 + totalWishlist * 2.0 + totalViews * 0.1);

      return {
        category: cat,
        cartCount: totalCart,
        wishlistCount: totalWishlist,
        viewCount: totalViews,
        trendScore,
        growthRate: base.growth,
        topProductTitle: catProducts[0]?.title || 'Atelier Collection',
      };
    }).sort((a, b) => {
      if (metric === 'cart') return b.cartCount - a.cartCount;
      if (metric === 'wishlist') return b.wishlistCount - a.wishlistCount;
      return b.trendScore - a.trendScore;
    });
  }, [products, cartItems, wishlistIds, metric]);

  // Set default selected category to top trending category if not set
  useEffect(() => {
    if (!selectedCategory && data.length > 0) {
      setSelectedCategory(data[0].category);
    }
  }, [data, selectedCategory]);

  // Render D3 Bar Chart with Entrance Animation and Smooth Hover Transitions
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 650;
    const height = 330;
    const margin = { top: 35, right: 25, bottom: 65, left: 55 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${containerWidth} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    // Defs for luxury gradients and drop shadow filters
    const defs = svg.append('defs');

    // Standard Gold-Terracotta bar gradient
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'vanya-bar-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#D4AF37')
      .attr('stop-opacity', 0.98);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#B2593E')
      .attr('stop-opacity', 0.88);

    // Active Hover radiant gold gradient
    const hoverGradient = defs
      .append('linearGradient')
      .attr('id', 'vanya-bar-hover-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    hoverGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FFF2B2')
      .attr('stop-opacity', 1);

    hoverGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#E5A044')
      .attr('stop-opacity', 0.95);

    // Selected category gradient
    const selectedGradient = defs
      .append('linearGradient')
      .attr('id', 'vanya-bar-selected-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    selectedGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FDE047')
      .attr('stop-opacity', 1);

    selectedGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#C25E3E')
      .attr('stop-opacity', 1);

    // Subtle drop shadow filter for entrance & standard state
    const barGlow = defs
      .append('filter')
      .attr('id', 'vanya-bar-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    barGlow
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 2)
      .attr('stdDeviation', 3)
      .attr('flood-color', '#D4AF37')
      .attr('flood-opacity', 0.25);

    // Luminous drop shadow filter for hovered bar
    const barHoverGlow = defs
      .append('filter')
      .attr('id', 'vanya-bar-hover-glow')
      .attr('x', '-40%')
      .attr('y', '-40%')
      .attr('width', '180%')
      .attr('height', '180%');

    barHoverGlow
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 3)
      .attr('stdDeviation', 6)
      .attr('flood-color', '#F5DF9E')
      .attr('flood-opacity', 0.65);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, innerWidth])
      .padding(0.36);

    // Y Value accessor
    const getYValue = (d: CategoryTrendData) => {
      if (metric === 'cart') return d.cartCount;
      if (metric === 'wishlist') return d.wishlistCount;
      return d.trendScore;
    };

    const maxVal = d3.max(data, getYValue) || 100;

    // Y Scale
    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.15])
      .nice()
      .range([innerHeight, 0]);

    // Gridlines
    const yAxisGrid = d3
      .axisLeft(y)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .ticks(5);

    g.append('g')
      .attr('class', 'grid-lines')
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', theme === 'dark' ? '#38322B' : '#E8DFD1')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-opacity', 0.6);

    g.select('.grid-lines .domain').remove();

    // X Axis
    const xAxis = d3.axisBottom(x);
    const xAxisG = g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisG.select('.domain').attr('stroke', theme === 'dark' ? '#4A4137' : '#D8CEBF');

    xAxisG
      .selectAll('text')
      .attr('transform', 'rotate(-16)')
      .attr('text-anchor', 'end')
      .attr('dx', '-0.5em')
      .attr('dy', '0.7em')
      .style('font-family', 'inherit')
      .style('font-size', '10px')
      .style('font-weight', '500')
      .style('fill', (d) => {
        if (d === selectedCategory) return '#D4AF37';
        return theme === 'dark' ? '#C4B8A8' : '#5C5146';
      })
      .style('cursor', 'pointer')
      .on('click', (_, d: any) => setSelectedCategory(d));

    // Y Axis
    const yAxis = d3.axisLeft(y).ticks(5);
    const yAxisG = g.append('g').attr('class', 'y-axis').call(yAxis);

    yAxisG.select('.domain').attr('stroke', theme === 'dark' ? '#4A4137' : '#D8CEBF');

    yAxisG
      .selectAll('text')
      .style('font-family', 'inherit')
      .style('font-size', '10px')
      .style('fill', theme === 'dark' ? '#A69A8E' : '#7A6E63');

    // Bars Group
    const barGroups = g
      .selectAll('.bar-group')
      .data(data, (d: any) => d.category)
      .enter()
      .append('g')
      .attr('class', 'bar-group');

    // Append bar rectangles
    const bars = barGroups
      .append('rect')
      .attr('class', 'vanya-bar cursor-pointer')
      .attr('x', (d) => x(d.category) || 0)
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', (d) => (d.category === selectedCategory ? 'url(#vanya-bar-selected-grad)' : 'url(#vanya-bar-grad)'))
      .attr('stroke', (d) => (d.category === selectedCategory ? '#FFF2B2' : '#D4AF37'))
      .attr('stroke-width', (d) => (d.category === selectedCategory ? 1.5 : 0.6))
      .attr('filter', 'url(#vanya-bar-glow)')
      .style('transform-origin', 'bottom')
      .style('transition', 'opacity 0.25s ease, stroke-width 0.25s ease, filter 0.25s ease');

    // Smooth Entrance Animation: Staggered upward growth
    bars
      .transition()
      .duration(850)
      .delay((_, i) => i * 70)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => y(getYValue(d)))
      .attr('height', (d) => innerHeight - y(getYValue(d)));

    // Value Labels on top of each bar
    const labels = barGroups
      .append('text')
      .attr('class', 'bar-label font-mono')
      .attr('x', (d) => (x(d.category) || 0) + x.bandwidth() / 2)
      .attr('y', innerHeight)
      .attr('text-anchor', 'middle')
      .attr('dy', '-8px')
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('opacity', 0)
      .style('fill', (d) => (d.category === selectedCategory ? '#FFF2B2' : theme === 'dark' ? '#D4AF37' : '#B2593E'))
      .text((d) => getYValue(d));

    // Animate Value Labels gliding upward alongside bars
    labels
      .transition()
      .duration(850)
      .delay((_, i) => i * 70)
      .ease(d3.easeCubicOut)
      .style('opacity', 1)
      .attr('y', (d) => y(getYValue(d)));

    // Interactive Smooth Hover Transitions
    bars
      .on('mouseenter', function (event, d) {
        setHoveredCategory(d.category);

        // Hovered bar smooth scale and radiant fill
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', 'url(#vanya-bar-hover-grad)')
          .attr('stroke', '#FFF6D1')
          .attr('stroke-width', 2.5)
          .attr('filter', 'url(#vanya-bar-hover-glow)')
          .style('opacity', 1);

        // Smoothly dim all other bars to provide focused visual feedback
        g.selectAll('.vanya-bar')
          .filter((node: any) => node.category !== d.category)
          .transition()
          .duration(200)
          .style('opacity', 0.28);

        // Highlight corresponding label
        g.selectAll('.bar-label')
          .transition()
          .duration(200)
          .style('opacity', (node: any) => (node.category === d.category ? 1 : 0.2));

        const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
        setActiveTooltip({
          data: d,
          x: mouseX,
          y: mouseY,
        });
      })
      .on('mousemove', function (event, d) {
        const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
        setActiveTooltip({
          data: d,
          x: mouseX,
          y: mouseY,
        });
      })
      .on('mouseleave', function () {
        setHoveredCategory(null);
        setActiveTooltip(null);

        // Smoothly restore all bars to original state
        g.selectAll('.vanya-bar')
          .transition()
          .duration(300)
          .style('opacity', 1)
          .attr('fill', (node: any) =>
            node.category === selectedCategory ? 'url(#vanya-bar-selected-grad)' : 'url(#vanya-bar-grad)'
          )
          .attr('stroke', (node: any) =>
            node.category === selectedCategory ? '#FFF2B2' : '#D4AF37'
          )
          .attr('stroke-width', (node: any) =>
            node.category === selectedCategory ? 1.5 : 0.6
          )
          .attr('filter', 'url(#vanya-bar-glow)');

        // Restore all labels
        g.selectAll('.bar-label')
          .transition()
          .duration(300)
          .style('opacity', 1);
      })
      .on('click', (_, d) => {
        setSelectedCategory(d.category);
      });
  }, [data, metric, theme, selectedCategory]);

  // Products belonging to the selected trending category
  const activeCategoryProducts = useMemo(() => {
    if (!selectedCategory) return products.slice(0, 4);
    const filtered = products.filter((p) => p.category === selectedCategory);
    return filtered.length > 0 ? filtered : products.slice(0, 4);
  }, [products, selectedCategory]);

  const handleHeartClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      const isCurrentlyWishlisted = wishlistIds.has(product.id);
      onToggleWishlist(product.id);
      setWishlistToast({
        title: product.title,
        added: !isCurrentlyWishlisted,
      });
      setTimeout(() => setWishlistToast(null), 2400);
    }
  };

  const topCategory = data[0];

  return (
    <div
      id="trending-categories-d3-widget"
      ref={containerRef}
      className={`rounded-3xl border p-5 sm:p-7 relative select-none ${
        theme === 'dark'
          ? 'bg-[#1F1C18] border-[#3E362C] text-[#FAF8F5]'
          : 'bg-[#FAF8F5] border-[#E8DFD1] text-[#1A1816]'
      } ${className}`}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {wishlistToast && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="absolute top-4 right-4 z-40 bg-[#161310] border border-[#D4AF37] px-4 py-2 rounded-full shadow-xl text-xs flex items-center gap-2"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlistToast.added ? 'fill-[#B2593E] text-[#B2593E]' : 'text-gray-400'}`} />
            <span className="text-white text-[11px]">
              {wishlistToast.added ? 'Added to Wishlist:' : 'Removed from Wishlist:'}{' '}
              <strong className="text-[#D4AF37]">{wishlistToast.title}</strong>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Header & Metrics Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#3E362C]/40 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#D4AF37]">
              Atelier Merchandising Intelligence (D3.js)
            </span>
          </div>
          <h3 className="font-editorial text-2xl font-normal mt-0.5 tracking-wide">
            Trending Categories &amp; Demand Velocity
          </h3>
          <p className="text-xs text-[#A89C8E] mt-0.5">
            Real-time D3 visualization responsive to patron bag additions and store wishlist frequency.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#14120F] p-1.5 rounded-full border border-[#3E362C] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric('composite')}
            className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer ${
              metric === 'composite'
                ? 'bg-[#D4AF37] text-[#1A1816] shadow-sm'
                : 'text-[#A6998A] hover:text-white'
            }`}
          >
            Trend Score
          </button>
          <button
            type="button"
            onClick={() => setMetric('cart')}
            className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              metric === 'cart'
                ? 'bg-[#D4AF37] text-[#1A1816] shadow-sm'
                : 'text-[#A6998A] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Bag Adds</span>
          </button>
          <button
            type="button"
            onClick={() => setMetric('wishlist')}
            className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              metric === 'wishlist'
                ? 'bg-[#D4AF37] text-[#1A1816] shadow-sm'
                : 'text-[#A6998A] hover:text-white'
            }`}
          >
            <Heart className="w-3 h-3" />
            <span>Wishlists</span>
          </button>
        </div>
      </div>

      {/* Main SVG Visualization */}
      <div className="relative my-3">
        <svg ref={svgRef} className="overflow-visible" />

        {/* Floating D3 Tooltip */}
        {activeTooltip && (
          <div
            className="absolute z-30 pointer-events-none p-3.5 bg-[#151311] border border-[#D4AF37] rounded-2xl shadow-2xl text-xs text-white -translate-x-1/2 -translate-y-full mb-3 backdrop-blur-md"
            style={{
              left: `${activeTooltip.x}px`,
              top: `${activeTooltip.y}px`,
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#383128] pb-1.5 mb-1.5">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
                {activeTooltip.data.category}
              </span>
              <span className="text-[10px] bg-[#D4AF37] text-[#1A1816] font-bold px-1.5 py-0.2 rounded-full">
                {activeTooltip.data.growthRate}
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-[#C4B9AA]">
              <div className="flex justify-between gap-4">
                <span>Composite Score:</span>
                <strong className="text-[#D4AF37] font-mono">{activeTooltip.data.trendScore} pts</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Active Bag Additions:</span>
                <strong className="text-white font-mono">{activeTooltip.data.cartCount} items</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Saved to Wishlist:</span>
                <strong className="text-white font-mono">{activeTooltip.data.wishlistCount} patrons</strong>
              </div>
              <div className="pt-1.5 text-[10px] text-[#D4AF37] border-t border-[#2D261E] flex items-center justify-between">
                <span>Click bar to inspect pieces</span>
                <span>↳</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Pills & Selection Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 pb-4 border-b border-[#3E362C]/40">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7E72] mr-1">
            Focus Category:
          </span>
          {data.map((cat) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setSelectedCategory(cat.category)}
              className={`text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.category
                  ? 'bg-[#D4AF37] text-[#1A1816] shadow-xs ring-1 ring-white/20'
                  : 'bg-[#28221B] text-[#A6998A] hover:bg-[#342D24] hover:text-white border border-[#3E362C]'
              }`}
            >
              {cat.category} ({cat.trendScore})
            </button>
          ))}
        </div>

        <div className="text-[11px] text-[#8C7E72]">
          Tip: Click any bar or category pill to inspect silhouetted pieces below
        </div>
      </div>

      {/* TRENDING CATEGORY PRODUCT CARDS WITH CLICKABLE HEART ICONS */}
      <div className="mt-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-editorial text-lg text-white font-normal">
              Trending Pieces in <span className="text-[#D4AF37]">{selectedCategory}</span>
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#A89C8E] font-semibold">
            {activeCategoryProducts.length} Silhouettes Available • Click Heart to Toggle Wishlist
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeCategoryProducts.map((prod) => {
            const isWishlisted = wishlistIds.has(prod.id);

            return (
              <motion.div
                key={prod.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-[#181512] border border-[#362E25] hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden group shadow-sm flex flex-col justify-between"
              >
                {/* Image & Clickable Heart Action */}
                <div className="relative aspect-[3/4] bg-[#221D18] overflow-hidden rounded-t-2xl">
                  <img
                    src={prod.colors[0]?.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* CLICKABLE HEART ICON TO QUICKLY ADD/REMOVE FROM STORE WISHLIST */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => handleHeartClick(e, prod)}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all shadow-md z-10 cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#B2593E] text-white ring-2 ring-white/50'
                        : 'bg-black/60 hover:bg-black text-white/90 hover:text-white border border-white/20'
                    }`}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    aria-label={`Toggle wishlist for ${prod.title}`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform ${
                        isWishlisted ? 'fill-white stroke-white' : 'stroke-current'
                      }`}
                    />
                  </motion.button>

                  {/* Stock & Category Tag */}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-black/75 text-[#E6DCB8] backdrop-blur-xs">
                      {prod.category}
                    </span>
                  </div>
                </div>

                {/* Card Info & Quick Actions */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-[#FAF8F5] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                      {prod.title}
                    </h4>
                    <p className="text-[11px] text-[#A6998A] line-clamp-1 mt-0.5">
                      {prod.subtitle}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#2D261E]">
                      <span className="font-bold text-xs text-white">
                        {formatPrice(prod.price)}
                      </span>
                      <span className={`text-[10px] font-semibold ${isWishlisted ? 'text-[#D4AF37]' : 'text-[#8C7F72]'}`}>
                        {isWishlisted ? 'Wishlisted ★' : 'In Catalog'}
                      </span>
                    </div>
                  </div>

                  {onSelectProduct && (
                    <button
                      type="button"
                      onClick={() => onSelectProduct(prod.id)}
                      className="w-full py-1.5 bg-[#25201A] hover:bg-[#342C23] border border-[#3E3429] text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37] rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect Garment</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Editorial Insights Strip */}
      <div className="mt-6 pt-5 border-t border-[#3E362C]/40 grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        <div className="p-4 bg-[#161310] border border-[#332A20] rounded-2xl flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] block">
              Leading Atelier Category
            </span>
            <p className="font-editorial text-sm text-white mt-0.5">
              {topCategory?.category} ({topCategory?.trendScore} pts)
            </p>
            <p className="text-[11px] text-[#8A7D70] mt-0.5">
              Outperforming baseline demand by {topCategory?.growthRate}.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#161310] border border-[#332A20] rounded-2xl flex items-start gap-2.5">
          <TrendingUp className="w-4 h-4 text-[#B2593E] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#E08A72] block">
              Merchandising Recommendation
            </span>
            <p className="text-[11px] text-[#C4B9AA] mt-0.5 leading-snug">
              Prioritize {topCategory?.category} in editorial lookbooks and maintain loom allocations with Jaipur and Varanasi artisans.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#161310] border border-[#332A20] rounded-2xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#C29B38] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] block">
              Live Wishlist Interaction
            </span>
            <p className="text-[11px] text-[#C4B9AA] mt-0.5 leading-snug">
              Clicking any heart icon above immediately updates the store wishlist, smoothly recalculating and animating the D3 chart bars above!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
