import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ruler, Sparkles, Check, X, Sliders, ChevronDown, RotateCcw, Info } from 'lucide-react';
import { FitFilterCriteria, Gender } from '../types';

interface FitFirstNavigationProps {
  gender: Gender;
  fitCriteria: FitFilterCriteria;
  onChangeFitCriteria: (criteria: FitFilterCriteria) => void;
  matchingCount: number;
  totalCount: number;
  className?: string;
  isCompact?: boolean;
}

export function FitFirstNavigation({
  gender,
  fitCriteria,
  onChangeFitCriteria,
  matchingCount,
  totalCount,
  className = '',
  isCompact = false,
}: FitFirstNavigationProps) {
  const isMen = gender === 'men';
  const unit = fitCriteria.unit;

  const [activeTab, setActiveTab] = useState<'shoulder' | 'inseam' | 'chest' | 'waist'>('shoulder');
  const [showHowToMeasure, setShowHowToMeasure] = useState(false);

  // Dimension presets in inches
  const shoulderOptions = isMen
    ? [16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0, 19.5, 20.0]
    : [13.5, 14.0, 14.5, 15.0, 15.5, 16.0, 16.5, 17.0];

  const inseamOptions = isMen
    ? [28.0, 29.0, 29.5, 30.0, 30.5, 31.0, 31.5, 32.0, 33.0]
    : [27.0, 28.0, 28.5, 29.0, 29.5, 30.0, 30.5, 31.0];

  const chestOptions = isMen
    ? [36, 38, 40, 42, 44, 46, 48]
    : [32, 34, 36, 38, 40, 42, 44];

  const waistOptions = isMen
    ? [28, 30, 32, 34, 36, 38, 40]
    : [26, 28, 30, 32, 34, 36, 38];

  // Fit Profiles for rapid 1-click calibration
  const fitProfiles = isMen
    ? [
        { label: 'Slim / Contoured', shoulder: 16.5, chest: 38, waist: 30, inseam: 29.5 },
        { label: 'Athletic / Broad', shoulder: 18.5, chest: 42, waist: 34, inseam: 31.0 },
        { label: 'Relaxed Ease', shoulder: 19.5, chest: 44, waist: 38, inseam: 31.5 },
      ]
    : [
        { label: 'Petite / Sculpted', shoulder: 14.0, chest: 34, waist: 26, inseam: 28.0 },
        { label: 'Contemporary Regular', shoulder: 15.0, chest: 37, waist: 30, inseam: 29.0 },
        { label: 'Relaxed Fluid Drape', shoulder: 16.0, chest: 41, waist: 34, inseam: 30.0 },
      ];

  const formatDim = (valInInches?: number) => {
    if (valInInches === undefined) return '';
    if (unit === 'cm') {
      return `${Math.round(valInInches * 2.54)} cm`;
    }
    return `${valInInches}"`;
  };

  const hasActiveDimension =
    fitCriteria.shoulder !== undefined ||
    fitCriteria.inseam !== undefined ||
    fitCriteria.chest !== undefined ||
    fitCriteria.waist !== undefined;

  const handleUnitToggle = (newUnit: 'in' | 'cm') => {
    onChangeFitCriteria({
      ...fitCriteria,
      unit: newUnit,
    });
  };

  const handleSelectShoulder = (val: number) => {
    onChangeFitCriteria({
      ...fitCriteria,
      shoulder: fitCriteria.shoulder === val ? undefined : val,
    });
  };

  const handleSelectInseam = (val: number) => {
    onChangeFitCriteria({
      ...fitCriteria,
      inseam: fitCriteria.inseam === val ? undefined : val,
    });
  };

  const handleSelectChest = (val: number) => {
    onChangeFitCriteria({
      ...fitCriteria,
      chest: fitCriteria.chest === val ? undefined : val,
    });
  };

  const handleSelectWaist = (val: number) => {
    onChangeFitCriteria({
      ...fitCriteria,
      waist: fitCriteria.waist === val ? undefined : val,
    });
  };

  const handleApplyProfile = (profile: {
    shoulder: number;
    chest: number;
    waist: number;
    inseam: number;
  }) => {
    onChangeFitCriteria({
      ...fitCriteria,
      shoulder: profile.shoulder,
      chest: profile.chest,
      waist: profile.waist,
      inseam: profile.inseam,
    });
  };

  const handleClearFitFilters = () => {
    onChangeFitCriteria({
      unit,
      shoulder: undefined,
      inseam: undefined,
      chest: undefined,
      waist: undefined,
      tolerance: 1.2,
      easePreference: 'classic',
    });
  };

  return (
    <div
      id="fit-first-navigation"
      className={`bg-white rounded-2xl border border-[var(--color-border)] shadow-xs overflow-hidden transition-all ${className}`}
    >
      {/* Top Header Strip */}
      <div className="px-4 py-3 bg-[var(--color-surface)]/40 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white rounded-full border border-[var(--color-border)] shadow-2xs">
            <Ruler className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#1A1816] tracking-wide flex items-center gap-1.5">
              <span>Fit-First Navigation</span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full">
                Bespoke Fit
              </span>
            </h4>
            <p className="text-[10px] text-[#70645A] font-light">
              Filter by your true physical measurements instead of generic tags
            </p>
          </div>
        </div>

        {/* Unit Switcher */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-[var(--color-border)] text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => handleUnitToggle('in')}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              unit === 'in'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[#695D51] hover:text-[#1A1816]'
            }`}
          >
            IN
          </button>
          <button
            type="button"
            onClick={() => handleUnitToggle('cm')}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              unit === 'cm'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[#695D51] hover:text-[#1A1816]'
            }`}
          >
            CM
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Rapid Fit Profile Presets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#54493F]">
              Quick Tailor Presets
            </span>
            <button
              type="button"
              onClick={() => setShowHowToMeasure(!showHowToMeasure)}
              className="text-[10px] text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>How to Measure</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {fitProfiles.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyProfile(p)}
                className={`py-1.5 px-2 text-[10px] font-medium border rounded-xl transition-all text-center truncate cursor-pointer ${
                  fitCriteria.shoulder === p.shoulder && fitCriteria.chest === p.chest
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white font-semibold shadow-xs'
                    : 'border-[var(--color-border)] bg-[#FAF8F5] text-[#4A4137] hover:border-[var(--color-primary)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Measuring Guide Accordion */}
          <AnimatePresence>
            {showHowToMeasure && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2.5 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC2] text-[11px] text-[#554A40] space-y-1.5"
              >
                <div className="flex items-start gap-1.5">
                  <strong className="text-[#1A1816] shrink-0">Shoulder Width:</strong>
                  <span>Measure horizontally from outer shoulder bone to bone across upper back.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <strong className="text-[#1A1816] shrink-0">Inseam:</strong>
                  <span>Measure inside of the leg from crotch junction straight down to desired hem.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dimension Dimension Selector Tabs */}
        <div>
          <div className="flex items-center border-b border-[var(--color-border)] mb-3 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('shoulder')}
              className={`pb-2 px-2.5 text-xs font-semibold uppercase tracking-wider relative transition-colors cursor-pointer ${
                activeTab === 'shoulder'
                  ? 'text-[#1A1816] border-b-2 border-[var(--color-primary)]'
                  : 'text-[#8C7E72] hover:text-[#1A1816]'
              }`}
            >
              <span>Shoulder</span>
              {fitCriteria.shoulder && (
                <span className="ml-1.5 text-[10px] font-bold text-[var(--color-primary)]">
                  ({formatDim(fitCriteria.shoulder)})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inseam')}
              className={`pb-2 px-2.5 text-xs font-semibold uppercase tracking-wider relative transition-colors cursor-pointer ${
                activeTab === 'inseam'
                  ? 'text-[#1A1816] border-b-2 border-[var(--color-primary)]'
                  : 'text-[#8C7E72] hover:text-[#1A1816]'
              }`}
            >
              <span>Inseam</span>
              {fitCriteria.inseam && (
                <span className="ml-1.5 text-[10px] font-bold text-[var(--color-primary)]">
                  ({formatDim(fitCriteria.inseam)})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chest')}
              className={`pb-2 px-2.5 text-xs font-semibold uppercase tracking-wider relative transition-colors cursor-pointer ${
                activeTab === 'chest'
                  ? 'text-[#1A1816] border-b-2 border-[var(--color-primary)]'
                  : 'text-[#8C7E72] hover:text-[#1A1816]'
              }`}
            >
              <span>{isMen ? 'Chest' : 'Bust'}</span>
              {fitCriteria.chest && (
                <span className="ml-1.5 text-[10px] font-bold text-[var(--color-primary)]">
                  ({formatDim(fitCriteria.chest)})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('waist')}
              className={`pb-2 px-2.5 text-xs font-semibold uppercase tracking-wider relative transition-colors cursor-pointer ${
                activeTab === 'waist'
                  ? 'text-[#1A1816] border-b-2 border-[var(--color-primary)]'
                  : 'text-[#8C7E72] hover:text-[#1A1816]'
              }`}
            >
              <span>Waist</span>
              {fitCriteria.waist && (
                <span className="ml-1.5 text-[10px] font-bold text-[var(--color-primary)]">
                  ({formatDim(fitCriteria.waist)})
                </span>
              )}
            </button>
          </div>

          {/* Active Tab Dimension Chips */}
          <div className="min-h-[64px]">
            {activeTab === 'shoulder' && (
              <div>
                <p className="text-[10px] text-[#70645A] mb-2">
                  Select your exact shoulder bone-to-bone measurement:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {shoulderOptions.map((val) => {
                    const isSelected = fitCriteria.shoulder === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectShoulder(val)}
                        className={`py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xs'
                            : 'border-[var(--color-border)] bg-white text-[#2F2923] hover:border-[var(--color-primary)] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {formatDim(val)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'inseam' && (
              <div>
                <p className="text-[10px] text-[#70645A] mb-2">
                  Select your preferred bottomwear inseam drop (crotch to ankle):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {inseamOptions.map((val) => {
                    const isSelected = fitCriteria.inseam === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectInseam(val)}
                        className={`py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xs'
                            : 'border-[var(--color-border)] bg-white text-[#2F2923] hover:border-[var(--color-primary)] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {formatDim(val)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'chest' && (
              <div>
                <p className="text-[10px] text-[#70645A] mb-2">
                  Select {isMen ? 'chest' : 'bust'} circumference:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {chestOptions.map((val) => {
                    const isSelected = fitCriteria.chest === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectChest(val)}
                        className={`py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xs'
                            : 'border-[var(--color-border)] bg-white text-[#2F2923] hover:border-[var(--color-primary)] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {formatDim(val)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'waist' && (
              <div>
                <p className="text-[10px] text-[#70645A] mb-2">
                  Select waistband circumference:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {waistOptions.map((val) => {
                    const isSelected = fitCriteria.waist === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectWaist(val)}
                        className={`py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xs'
                            : 'border-[var(--color-border)] bg-white text-[#2F2923] hover:border-[var(--color-primary)] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {formatDim(val)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fit Match Status Bar */}
        <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="text-[#38312B] font-medium">
              {hasActiveDimension ? (
                <span>
                  <strong>{matchingCount}</strong> of {totalCount} tailored pieces match
                </span>
              ) : (
                <span>All {totalCount} pieces shown (tap dimensions above)</span>
              )}
            </span>
          </div>

          {hasActiveDimension && (
            <button
              type="button"
              onClick={handleClearFitFilters}
              className="text-[11px] text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Dimensions</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
