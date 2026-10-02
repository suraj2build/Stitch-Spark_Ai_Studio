import { Product, GarmentDimensions, FitFilterCriteria } from '../types';

/**
 * Maps standard sizes to exact tailored garment dimensions based on silhouette category.
 */
export function getProductSizeDimensions(product: Product, size: string): GarmentDimensions {
  const isMen = product.gender === 'men';
  const category = product.category.toLowerCase();

  // Baseline multiplier based on standard size grade
  const sizeOffsets: Record<string, number> = {
    XS: 0,
    S: 1,
    M: 2,
    L: 3,
    XL: 4,
    XXL: 5,
  };

  const offset = sizeOffsets[size.toUpperCase()] ?? 2;

  // 1. TROUSERS & BOTTOMWEAR
  if (category.includes('trouser') || category.includes('bottom') || category.includes('pant')) {
    const baseWaist = isMen ? 28 : 26;
    const baseInseam = isMen ? 29 : 28;
    return {
      shoulder: 0, // not applicable for pure bottomwear
      chest: 0,
      waist: baseWaist + offset * 2, // 28, 30, 32, 34, 36, 38
      inseam: Number((baseInseam + offset * 0.5).toFixed(1)), // 29, 29.5, 30, 30.5, 31, 31.5
      length: 39 + offset * 0.5,
    };
  }

  // 2. BANDHGALAS, SUITS & JACKETS
  if (category.includes('bandhgala') || category.includes('jacket') || category.includes('blazer')) {
    const baseShoulder = isMen ? 16.5 : 14.5;
    const baseChest = isMen ? 36 : 33;
    const baseWaist = isMen ? 32 : 28;
    return {
      shoulder: Number((baseShoulder + offset * 0.6).toFixed(1)), // e.g. 16.5, 17.1, 17.7, 18.3, 18.9, 19.5
      chest: baseChest + offset * 2, // 36, 38, 40, 42, 44, 46
      waist: baseWaist + offset * 2,
      length: 28 + offset * 0.5,
    };
  }

  // 3. CO-ORDS & SETS (Top + Bottom Ensembles)
  if (category.includes('set') || category.includes('co-ord')) {
    const baseShoulder = isMen ? 16.5 : 14.0;
    const baseChest = isMen ? 37 : 33;
    const baseWaist = isMen ? 30 : 26;
    const baseInseam = isMen ? 29 : 28;
    return {
      shoulder: Number((baseShoulder + offset * 0.5).toFixed(1)),
      chest: baseChest + offset * 2,
      waist: baseWaist + offset * 2,
      inseam: Number((baseInseam + offset * 0.5).toFixed(1)),
      length: isMen ? 38 + offset * 0.5 : 40 + offset * 0.5,
    };
  }

  // 4. KURTAS & ETHNIC WEAR
  if (category.includes('kurta') || category.includes('ethnic')) {
    const baseShoulder = isMen ? 17.0 : 14.5;
    const baseChest = isMen ? 38 : 34;
    const baseWaist = isMen ? 34 : 30;
    return {
      shoulder: Number((baseShoulder + offset * 0.5).toFixed(1)),
      chest: baseChest + offset * 2,
      waist: baseWaist + offset * 2,
      length: isMen ? 42 + offset * 0.5 : 44 + offset * 0.5,
    };
  }

  // 5. SHIRTS & TOPS
  if (category.includes('shirt') || category.includes('top')) {
    const baseShoulder = isMen ? 16.5 : 14.0;
    const baseChest = isMen ? 38 : 34;
    const baseWaist = isMen ? 34 : 30;
    return {
      shoulder: Number((baseShoulder + offset * 0.5).toFixed(1)),
      chest: baseChest + offset * 2,
      waist: baseWaist + offset * 2,
      length: 29 + offset * 0.5,
    };
  }

  // 6. DRESSES, SAREES & DRAPES
  const baseShoulder = isMen ? 17.0 : 14.5;
  const baseChest = isMen ? 38 : 34;
  return {
    shoulder: Number((baseShoulder + offset * 0.5).toFixed(1)),
    chest: baseChest + offset * 2,
    waist: 28 + offset * 2,
    inseam: 29 + offset * 0.5,
    length: 46 + offset * 0.5,
  };
}

/**
 * Checks if a product matches the specified physical garment dimension filters.
 */
export function matchProductToFit(
  product: Product,
  criteria: FitFilterCriteria
): {
  isMatch: boolean;
  bestMatchingSize?: string;
  details?: string;
  matchScore: number;
} {
  // If no dimension filters are set, consider it a match
  const hasDimensionFilter =
    criteria.shoulder !== undefined ||
    criteria.chest !== undefined ||
    criteria.waist !== undefined ||
    criteria.inseam !== undefined ||
    criteria.length !== undefined;

  if (!hasDimensionFilter) {
    return { isMatch: true, matchScore: 100 };
  }

  // Unit conversion factor
  const isCm = criteria.unit === 'cm';
  const toInches = (val: number) => (isCm ? val / 2.54 : val);

  const targetShoulder = criteria.shoulder ? toInches(criteria.shoulder) : undefined;
  const targetChest = criteria.chest ? toInches(criteria.chest) : undefined;
  const targetWaist = criteria.waist ? toInches(criteria.waist) : undefined;
  const targetInseam = criteria.inseam ? toInches(criteria.inseam) : undefined;
  const targetLength = criteria.length ? toInches(criteria.length) : undefined;

  const defaultTolerance = criteria.tolerance || 1.2; // +/- 1.2 inches tolerance
  const availableSizes = product.sizes.filter((s) => s.inStock);

  let bestSize: string | undefined = undefined;
  let highestScore = -1;
  let matchDetail = '';

  for (const s of availableSizes) {
    const dims = getProductSizeDimensions(product, s.size);
    let score = 100;
    let dimensionalMismatches = 0;
    const parts: string[] = [];

    // Check Shoulder Width (if requested & applicable)
    if (targetShoulder !== undefined && dims.shoulder > 0) {
      const diff = Math.abs(dims.shoulder - targetShoulder);
      if (diff > defaultTolerance) {
        dimensionalMismatches++;
        score -= diff * 15;
      } else {
        parts.push(`Shoulder ${dims.shoulder}"`);
      }
    }

    // Check Chest / Bust (if requested & applicable)
    if (targetChest !== undefined && dims.chest > 0) {
      const diff = Math.abs(dims.chest - targetChest);
      if (diff > defaultTolerance * 1.5) {
        dimensionalMismatches++;
        score -= diff * 10;
      } else {
        parts.push(`Chest ${dims.chest}"`);
      }
    }

    // Check Inseam (if requested & applicable to bottomwear / sets)
    if (targetInseam !== undefined && dims.inseam !== undefined && dims.inseam > 0) {
      const diff = Math.abs(dims.inseam - targetInseam);
      if (diff > defaultTolerance) {
        dimensionalMismatches++;
        score -= diff * 12;
      } else {
        parts.push(`Inseam ${dims.inseam}"`);
      }
    }

    // Check Waist (if requested)
    if (targetWaist !== undefined && dims.waist !== undefined && dims.waist > 0) {
      const diff = Math.abs(dims.waist - targetWaist);
      if (diff > defaultTolerance * 1.2) {
        dimensionalMismatches++;
        score -= diff * 10;
      } else {
        parts.push(`Waist ${dims.waist}"`);
      }
    }

    if (dimensionalMismatches === 0 && score > highestScore) {
      highestScore = score;
      bestSize = s.size;
      matchDetail = parts.join(' · ');
    }
  }

  if (bestSize && highestScore > 50) {
    return {
      isMatch: true,
      bestMatchingSize: bestSize,
      details: matchDetail,
      matchScore: Math.min(100, Math.round(highestScore)),
    };
  }

  return {
    isMatch: false,
    matchScore: 0,
  };
}
