import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, ChevronDown, Check, LayoutGrid, Grid3X3, Grid2X2 } from 'lucide-react';
import { Product, Gender } from '../types';
import { ProductCard } from '../components/ProductCard';

interface PlpViewProps {
  products: Product[];
  gender: Gender;
  initialCategory?: string;
  onSelectProduct: (productId: string) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, selectedColor: string) => void;
  onInstantAddSize?: (product: Product, colorName: string, size: string) => void;
}

export function PlpView({
  products,
  gender,
  initialCategory,
  onSelectProduct,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onInstantAddSize,
}: PlpViewProps) {
  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(true);

  // Grid column density (desktop)
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  // Filter states
  const [selectedGender, setSelectedGender] = useState<Gender>(gender);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory && initialCategory !== 'new' && initialCategory !== 'all'
      ? [initialCategory]
      : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Available filter options extracted from data
  const availableCategories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      p.colors.forEach((c) => map.set(c.name, c.hex));
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const availableFabrics = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.fabric.split(' ')[0])));
  }, [products]);

  const availableOccasions = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.occasion)));
  }, [products]);

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Gender filter
        if (selectedGender !== 'all' && p.gender !== 'unisex' && p.gender !== selectedGender) {
          return false;
        }
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
          return false;
        }
        // Size filter
        if (selectedSizes.length > 0) {
          const hasMatchingSize = p.sizes.some(
            (s) => selectedSizes.includes(s.size) && s.inStock
          );
          if (!hasMatchingSize) return false;
        }
        // Color filter
        if (selectedColors.length > 0) {
          const hasMatchingColor = p.colors.some((c) => selectedColors.includes(c.name));
          if (!hasMatchingColor) return false;
        }
        // Fabric filter
        if (selectedFabrics.length > 0) {
          const hasFabric = selectedFabrics.some((f) => p.fabric.includes(f));
          if (!hasFabric) return false;
        }
        // Occasion filter
        if (selectedOccasions.length > 0 && !selectedOccasions.includes(p.occasion)) {
          return false;
        }
        // In stock only
        if (inStockOnly && !p.sizes.some((s) => s.inStock)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.badges?.includes('NEW') ? 1 : 0) - (a.badges?.includes('NEW') ? 1 : 0);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [
    products,
    selectedGender,
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedFabrics,
    selectedOccasions,
    inStockOnly,
    sortBy,
  ]);

  const activeFiltersCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedColors.length +
    selectedFabrics.length +
    selectedOccasions.length +
    (inStockOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setInStockOnly(false);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Dynamic Page Title
  const pageTitle =
    selectedCategories.length === 1
      ? selectedCategories[0]
      : selectedGender === 'women'
      ? "Women's Collection"
      : selectedGender === 'men'
      ? "Men's Collection"
      : 'All Silhouettes';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Category Editorial Banner & Title */}
      <div className="mb-8 border-b border-[#EAE3D7] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C8074] font-semibold">
              <span>Atelier Catalog</span>
              <span>•</span>
              <span className="text-[#A85B3F] font-bold">
                {selectedGender === 'women' ? 'Women' : selectedGender === 'men' ? 'Men' : 'All'}
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl text-[#1A1816] font-normal mt-1">
              {pageTitle}
            </h1>
            <p className="text-xs text-[#7A6F64] mt-1.5 max-w-xl">
              Sculpted drapes, raw wild silks, and natural handwoven textiles. Designed with ease for contemporary living.
            </p>
          </div>

          {/* Gender Filter Switcher Tabs */}
          <div className="flex items-center gap-1 bg-[#F2EDE4] p-1 rounded-full border border-[#DFD6C8] self-start sm:self-auto">
            {(['all', 'women', 'men'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                  selectedGender === g
                    ? 'bg-[#1A1816] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6E645A] hover:text-[#1A1816]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Trigger, Product Count, Sort & View Density */}
      <div className="flex items-center justify-between py-3 border-b border-[#EAE3D7] mb-6 text-xs text-[#52483E]">
        {/* Left: Filter Toggle Button */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            id="btn-open-mobile-filter"
            onClick={() => setMobileFilterOpen(true)}
            className="sm:hidden flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DDD3C5] rounded-xs font-semibold text-[#1A1816]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#A85B3F]" />
            <span>Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Desktop Filter Toggle */}
          <button
            id="btn-toggle-desktop-filter"
            onClick={() => setDesktopFilterOpen(!desktopFilterOpen)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DDD3C5] hover:border-[#1A1816] rounded-xs font-semibold text-[#1A1816] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#A85B3F]" />
            <span>{desktopFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#A85B3F] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="hidden md:inline text-xs text-[#8C8074]">
            Showing <strong className="text-[#1A1816] font-semibold">{filteredProducts.length}</strong> styles
          </span>
        </div>

        {/* Right: Sort & Desktop Grid Density */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C8074]" />
            <select
              id="select-plp-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-medium text-[#1A1816] focus:outline-none cursor-pointer border-b border-transparent hover:border-[#1A1816] py-1"
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Desktop Grid Switcher */}
          <div className="hidden lg:flex items-center gap-1 border-l border-[#DFD6C8] pl-3">
            <button
              onClick={() => setGridCols(3)}
              className={`p-1 rounded-xs ${gridCols === 3 ? 'text-[#1A1816] bg-[#EAE3D7]' : 'text-[#9C8F83] hover:text-[#1A1816]'}`}
              title="3 Columns"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1 rounded-xs ${gridCols === 4 ? 'text-[#1A1816] bg-[#EAE3D7]' : 'text-[#9C8F83] hover:text-[#1A1816]'}`}
              title="4 Columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-[#8C8074] font-medium text-[11px] uppercase tracking-wider">
            Active:
          </span>

          {selectedCategories.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFD6C8] rounded-full text-[#1A1816]"
            >
              <span>{c}</span>
              <X
                className="w-3 h-3 cursor-pointer text-[#8C8074] hover:text-black"
                onClick={() => toggleCategory(c)}
              />
            </span>
          ))}

          {selectedSizes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFD6C8] rounded-full text-[#1A1816]"
            >
              <span>Size: {s}</span>
              <X
                className="w-3 h-3 cursor-pointer text-[#8C8074] hover:text-black"
                onClick={() => toggleSize(s)}
              />
            </span>
          ))}

          {selectedColors.map((col) => (
            <span
              key={col}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFD6C8] rounded-full text-[#1A1816]"
            >
              <span>{col}</span>
              <X
                className="w-3 h-3 cursor-pointer text-[#8C8074] hover:text-black"
                onClick={() => toggleColor(col)}
              />
            </span>
          ))}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DFD6C8] rounded-full text-[#1A1816]">
              <span>In Stock Only</span>
              <X
                className="w-3 h-3 cursor-pointer text-[#8C8074] hover:text-black"
                onClick={() => setInStockOnly(false)}
              />
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-[11px] uppercase tracking-wider text-[#A85B3F] hover:underline font-semibold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        {desktopFilterOpen && (
          <aside className="hidden sm:block lg:col-span-3 space-y-6 bg-[#FAF7F2] p-5 rounded-xs border border-[#EAE3D7] text-xs">
            <div className="flex items-center justify-between border-b border-[#E3DBD0] pb-3">
              <span className="font-semibold uppercase tracking-[0.16em] text-[#1A1816] text-[11px]">
                Refine Selection
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-[#A85B3F] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <span className="font-semibold text-[#2D2722] block mb-2 uppercase tracking-wider text-[11px]">
                Category
              </span>
              <div className="space-y-1.5">
                {availableCategories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer hover:text-[#1A1816] text-[#554A40]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded-xs accent-[#1A1816]"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter Chips */}
            <div className="border-t border-[#EAE3D7] pt-4">
              <span className="font-semibold text-[#2D2722] block mb-2 uppercase tracking-wider text-[11px]">
                Size
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`py-1.5 text-xs font-medium border rounded-xs transition-all ${
                      selectedSizes.includes(s)
                        ? 'border-[#1A1816] bg-[#1A1816] text-[#FAF8F5]'
                        : 'border-[#DDD4C6] bg-white text-[#4A4137] hover:border-[#1A1816]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Swatches Filter */}
            <div className="border-t border-[#EAE3D7] pt-4">
              <span className="font-semibold text-[#2D2722] block mb-2 uppercase tracking-wider text-[11px]">
                Colour Palette
              </span>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((col) => {
                  const isSelected = selectedColors.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      onClick={() => toggleColor(col.name)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] transition-all ${
                        isSelected
                          ? 'border-[#1A1816] bg-white font-semibold shadow-xs'
                          : 'border-[#DDD3C5] bg-white/60 text-[#695D51] hover:border-[#1A1816]'
                      }`}
                      title={col.name}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In Stock Only Toggle */}
            <div className="border-t border-[#EAE3D7] pt-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2D2722]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-xs accent-[#1A1816]"
                />
                <span>In-Stock Only</span>
              </label>
            </div>
          </aside>
        )}

        {/* Product Grid Area */}
        <main
          className={`${
            desktopFilterOpen ? 'lg:col-span-9' : 'lg:col-span-12'
          }`}
        >
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-3 bg-[#FAF7F2] border border-[#EAE3D7] rounded-xs p-8">
              <p className="font-editorial text-2xl text-[#5E5246]">No garments match your filters</p>
              <p className="text-xs text-[#8A7D70] max-w-sm mx-auto">
                Try deselecting some of your size or colour preferences to view more pieces in our catalog.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-3 px-5 py-2.5 bg-[#1F1C18] text-white text-xs uppercase tracking-wider font-semibold rounded-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 gap-3 sm:gap-6 ${
                gridCols === 4 && !desktopFilterOpen
                  ? 'sm:grid-cols-3 lg:grid-cols-4'
                  : gridCols === 4 && desktopFilterOpen
                  ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  isWishlisted={wishlistIds.has(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={onQuickAdd}
                  onInstantAddSize={onInstantAddSize}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom-Sheet Filter Drawer */}
      {mobileFilterOpen && (
        <div
          id="mobile-filter-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:hidden"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            id="mobile-filter-sheet"
            className="w-full bg-[#FAF8F5] rounded-t-xl max-h-[85vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="p-4 border-b border-[#EAE3D7] flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-xl font-normal text-[#1A1816]">
                  Filter &amp; Refine
                </h3>
                <span className="text-[10px] text-[#7A6E63] uppercase tracking-wider">
                  {filteredProducts.length} styles available
                </span>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-[#5C5146] hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="p-4 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Category */}
              <div>
                <span className="font-semibold uppercase tracking-wider text-[11px] block mb-2 text-[#1A1816]">
                  Category
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                        selectedCategories.includes(cat)
                          ? 'border-[#1A1816] bg-[#1A1816] text-[#FAF8F5] font-semibold'
                          : 'border-[#DDD4C6] bg-white text-[#52483E]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="border-t border-[#EAE3D7] pt-4">
                <span className="font-semibold uppercase tracking-wider text-[11px] block mb-2 text-[#1A1816]">
                  Size
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`py-2 text-xs font-semibold rounded-xs border transition-all ${
                        selectedSizes.includes(s)
                          ? 'border-[#1A1816] bg-[#1A1816] text-[#FAF8F5]'
                          : 'border-[#DDD4C6] bg-white text-[#52483E]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colours */}
              <div className="border-t border-[#EAE3D7] pt-4">
                <span className="font-semibold uppercase tracking-wider text-[11px] block mb-2 text-[#1A1816]">
                  Colour
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => toggleColor(col.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${
                        selectedColors.includes(col.name)
                          ? 'border-[#1A1816] bg-white font-bold'
                          : 'border-[#DDD3C5] bg-white text-[#655A4F]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sheet Footer */}
            <div className="p-4 border-t border-[#EAE3D7] bg-white flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 text-xs uppercase tracking-wider font-semibold border border-[#DDD3C5] text-[#1A1816] rounded-xs"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-2 py-3 bg-[#1F1C18] text-white text-xs uppercase tracking-[0.16em] font-semibold rounded-xs"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
