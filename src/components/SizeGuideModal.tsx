import React, { useState } from 'react';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  gender?: 'women' | 'men' | 'unisex';
}

export function SizeGuideModal({
  isOpen,
  onClose,
  gender = 'women',
}: SizeGuideModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'chart' | 'my-size'>('chart');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  // My Size interactive calculation state
  const [userChest, setUserChest] = useState<number>(34);
  const [userWaist, setUserWaist] = useState<number>(28);
  const [userFitPreference, setUserFitPreference] = useState<'fitted' | 'regular' | 'relaxed'>('regular');
  const [recommendedSize, setRecommendedSize] = useState<string>('S');
  const [showRecommendation, setShowRecommendation] = useState(false);

  const calculateRecommendedSize = () => {
    let size = 'M';
    if (gender === 'women') {
      if (userChest <= 32) size = 'XS';
      else if (userChest <= 35) size = 'S';
      else if (userChest <= 38) size = 'M';
      else if (userChest <= 41) size = 'L';
      else size = 'XL';
    } else {
      if (userChest <= 38) size = 'S';
      else if (userChest <= 40) size = 'M';
      else if (userChest <= 42) size = 'L';
      else size = 'XL';
    }

    if (userFitPreference === 'relaxed' && size !== 'XL') {
      // recommend a comfortable ease
    }
    setRecommendedSize(size);
    setShowRecommendation(true);
  };

  const chartDataWomen = [
    { size: 'XS', bustIn: '32', bustCm: '81', waistIn: '26', waistCm: '66', hipIn: '36', hipCm: '91', shoulderIn: '14.0' },
    { size: 'S', bustIn: '34', bustCm: '86', waistIn: '28', waistCm: '71', hipIn: '38', hipCm: '96', shoulderIn: '14.5' },
    { size: 'M', bustIn: '36', bustCm: '91', waistIn: '30', waistCm: '76', hipIn: '40', hipCm: '101', shoulderIn: '15.0' },
    { size: 'L', bustIn: '38', bustCm: '96', waistIn: '32', waistCm: '81', hipIn: '42', hipCm: '106', shoulderIn: '15.5' },
    { size: 'XL', bustIn: '40', bustCm: '101', waistIn: '34', waistCm: '86', hipIn: '44', hipCm: '111', shoulderIn: '16.0' },
    { size: 'XXL', bustIn: '42', bustCm: '106', waistIn: '36', waistCm: '91', hipIn: '46', hipCm: '116', shoulderIn: '16.5' },
  ];

  const chartDataMen = [
    { size: 'S (38)', bustIn: '38', bustCm: '96', waistIn: '30-32', waistCm: '76-81', hipIn: '38', hipCm: '96', shoulderIn: '17.0' },
    { size: 'M (40)', bustIn: '40', bustCm: '101', waistIn: '32-34', waistCm: '81-86', hipIn: '40', hipCm: '101', shoulderIn: '17.5' },
    { size: 'L (42)', bustIn: '42', bustCm: '106', waistIn: '34-36', waistCm: '86-91', hipIn: '42', hipCm: '106', shoulderIn: '18.0' },
    { size: 'XL (44)', bustIn: '44', bustCm: '112', waistIn: '36-38', waistCm: '91-96', hipIn: '44', hipCm: '112', shoulderIn: '18.5' },
    { size: 'XXL (46)', bustIn: '46', bustCm: '117', waistIn: '38-40', waistCm: '96-101', hipIn: '46', hipCm: '117', shoulderIn: '19.0' },
  ];

  const currentChart = gender === 'men' ? chartDataMen : chartDataWomen;

  return (
    <div
      id="size-guide-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        id="size-guide-modal"
        className="w-full max-w-2xl bg-[#FAF8F5] rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EAE3D7] flex items-center justify-between bg-white/70">
          <div>
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#A85B3F]" />
              <h3 className="font-editorial text-2xl font-normal text-[#1A1816]">
                Garment Sizing &amp; Fit Guide
              </h3>
            </div>
            <p className="text-xs text-[#7D7063] mt-0.5">
              Standard Indian apparel measurements with tailor ease
            </p>
          </div>
          <button
            id="btn-close-size-guide"
            onClick={onClose}
            className="p-1.5 text-[#5C5146] hover:text-[#1A1816] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs & Unit Toggle */}
        <div className="px-5 pt-3 pb-2 border-b border-[#EAE3D7] flex flex-wrap items-center justify-between gap-3 bg-[#F6F2EA]">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors ${
                activeTab === 'chart'
                  ? 'bg-[#1A1816] text-[#FAF8F5]'
                  : 'text-[#695F54] hover:text-[#1A1816]'
              }`}
            >
              Measurements Chart
            </button>
            <button
              onClick={() => setActiveTab('my-size')}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'my-size'
                  ? 'bg-[#A85B3F] text-white'
                  : 'text-[#A85B3F] hover:bg-[#A85B3F]/10'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>My Size Finder</span>
            </button>
          </div>

          {activeTab === 'chart' && (
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-[#DCD3C5] text-xs">
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  unit === 'in' ? 'bg-[#1A1816] text-white' : 'text-[#7D7063]'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  unit === 'cm' ? 'bg-[#1A1816] text-white' : 'text-[#7D7063]'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {activeTab === 'chart' ? (
            <>
              {/* Measurements Table */}
              <div className="overflow-x-auto border border-[#E3DBCE] rounded-xs bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2ECE1] text-[#2F2924] font-semibold border-b border-[#E3DBCE] uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Brand Size</th>
                      <th className="p-3">{gender === 'men' ? 'Chest' : 'Bust'} ({unit})</th>
                      <th className="p-3">Waist ({unit})</th>
                      <th className="p-3">Hip ({unit})</th>
                      <th className="p-3">Shoulder (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE8DC]">
                    {currentChart.map((row) => (
                      <tr key={row.size} className="hover:bg-[#FAF8F5]">
                        <td className="p-3 font-semibold text-[#1A1816]">{row.size}</td>
                        <td className="p-3 text-[#4A423B]">
                          {unit === 'in' ? row.bustIn : row.bustCm}
                        </td>
                        <td className="p-3 text-[#4A423B]">
                          {unit === 'in' ? row.waistIn : row.waistCm}
                        </td>
                        <td className="p-3 text-[#4A423B]">
                          {unit === 'in' ? row.hipIn : row.hipCm}
                        </td>
                        <td className="p-3 text-[#6E645A]">{row.shoulderIn}″</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* How to Measure note */}
              <div className="bg-[#F3ECE1]/70 p-4 rounded-xs border border-[#E3DBCE] text-xs text-[#594E44] space-y-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#2F2924] block">
                  How to Measure Accurately
                </span>
                <p>
                  <strong>Bust / Chest:</strong> Measure under arms around the fullest part of your bust/chest while holding the tape level.
                </p>
                <p>
                  <strong>Waist:</strong> Measure around your natural waistline, typically the narrowest point just above the navel.
                </p>
                <p>
                  <strong>Hips:</strong> Stand with feet together and measure around the fullest point of the hips.
                </p>
              </div>
            </>
          ) : (
            /* My Size Finder UX (Master brief placeholder with interactive prototype estimator) */
            <div className="space-y-5 bg-white p-5 rounded-xs border border-[#E3DBCE]">
              <div className="border-b border-[#EFE8DC] pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A85B3F] font-semibold">
                  Personalized Fit Profile
                </span>
                <h4 className="text-base font-medium text-[#1A1816] mt-0.5">
                  Find Your VANYA True Size
                </h4>
                <p className="text-xs text-[#7A6F64] mt-1">
                  Adjust your measurements below to calculate your recommended fit across our silhouettes.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#38312B] mb-1">
                    {gender === 'men' ? 'Chest Circumference' : 'Bust Circumference'} (in inches): <span className="font-semibold text-[#1A1816]">{userChest}″</span>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="48"
                    value={userChest}
                    onChange={(e) => setUserChest(Number(e.target.value))}
                    className="w-full accent-[#A85B3F]"
                  />
                  <div className="flex justify-between text-[10px] text-[#9A8E82] mt-1">
                    <span>30″</span>
                    <span>38″</span>
                    <span>48″</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#38312B] mb-1">
                    Waist Circumference (in inches): <span className="font-semibold text-[#1A1816]">{userWaist}″</span>
                  </label>
                  <input
                    type="range"
                    min="24"
                    max="44"
                    value={userWaist}
                    onChange={(e) => setUserWaist(Number(e.target.value))}
                    className="w-full accent-[#A85B3F]"
                  />
                  <div className="flex justify-between text-[10px] text-[#9A8E82] mt-1">
                    <span>24″</span>
                    <span>32″</span>
                    <span>44″</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#38312B] mb-1.5">
                  Preferred Fit Feeling
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['fitted', 'regular', 'relaxed'] as const).map((fit) => (
                    <button
                      key={fit}
                      onClick={() => setUserFitPreference(fit)}
                      className={`py-2 px-3 text-xs capitalize rounded-xs border transition-all ${
                        userFitPreference === fit
                          ? 'border-[#1A1816] bg-[#1A1816] text-[#FAF8F5] font-semibold'
                          : 'border-[#DFD7CB] bg-white text-[#5C534A] hover:border-[#1A1816]'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-calculate-size"
                onClick={calculateRecommendedSize}
                className="w-full py-2.5 bg-[#A85B3F] hover:bg-[#8F482F] text-white text-xs uppercase tracking-[0.16em] font-semibold transition-colors rounded-xs shadow-xs"
              >
                Calculate My Size
              </button>

              {showRecommendation && (
                <div className="p-4 bg-[#F5EFE4] rounded-xs border border-[#DFD3C2] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-wider uppercase text-[#88786B] font-semibold">
                      Recommendation
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3F6A48]" />
                      <span className="text-sm font-semibold text-[#1A1816]">
                        We recommend Size <strong className="text-base text-[#A85B3F]">{recommendedSize}</strong> for you
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E645A] mt-1">
                      Based on {userChest}″ {gender === 'men' ? 'chest' : 'bust'} and {userFitPreference} fit profile.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
