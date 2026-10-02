import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Sparkles,
  Scissors,
  Home,
  Info,
} from 'lucide-react';
import { OrderProgressStepKey, CustomerOrder } from '../types';

interface OrderProgressStepperProps {
  order: CustomerOrder;
  className?: string;
}

interface StepDefinition {
  key: OrderProgressStepKey;
  stepNumber: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STEP_DEFINITIONS: StepDefinition[] = [
  {
    key: 'confirmed',
    stepNumber: 1,
    label: 'Order Confirmed',
    shortLabel: 'Confirmed',
    icon: Sparkles,
    description: 'Payment verified & handloom artisan allocated',
  },
  {
    key: 'crafting',
    stepNumber: 2,
    label: 'Artisan Atelier Crafting',
    shortLabel: 'Crafting',
    icon: Scissors,
    description: 'Bespoke tailoring, finishing & quality audit',
  },
  {
    key: 'dispatched',
    stepNumber: 3,
    label: 'Dispatched & In Transit',
    shortLabel: 'Dispatched',
    icon: Package,
    description: 'Handed to express air cargo with airway bill',
  },
  {
    key: 'out_for_delivery',
    stepNumber: 4,
    label: 'Out for Delivery',
    shortLabel: 'Out for Delivery',
    icon: Truck,
    description: 'Courier associate en route with secure OTP handover',
  },
  {
    key: 'delivered',
    stepNumber: 5,
    label: 'Delivered & Adorned',
    shortLabel: 'Delivered',
    icon: Home,
    description: 'Handed over at customer doorstep in pristine packaging',
  },
];

export function OrderProgressStepper({ order, className = '' }: OrderProgressStepperProps) {
  const currentStepNumber = order.stepNumber; // 1 to 5
  const [selectedStep, setSelectedStep] = useState<number>(currentStepNumber);

  // Calculate percentage for progress line (0% to 100%)
  // For 5 steps: step 1 = 12.5%, step 2 = 37.5%, step 3 = 62.5%, step 4 = 87.5%, step 5 = 100%
  const progressPercentages: Record<number, number> = {
    1: 10,
    2: 35,
    3: 62,
    4: 88,
    5: 100,
  };
  const activePercentage = progressPercentages[currentStepNumber] || 15;

  return (
    <div id="order-progress-stepper" className={`bg-[#FAF7F2] border border-[#E8DFD1] rounded-xs p-5 sm:p-7 shadow-xs ${className}`}>
      {/* Header with status badge & milestone message */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#EAE3D7] gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C7A6B] block">
            Visual Delivery Journey
          </span>
          <h3 className="font-editorial text-2xl text-[#1A1816] font-normal mt-0.5">
            Stage {currentStepNumber} of 5: {order.statusLabel}
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {order.currentStep === 'delivered' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F2EA] text-[#22572E] text-xs font-semibold uppercase tracking-wider rounded-full border border-[#BEDEC4]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Fulfilled Safely</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F0E1] text-[#936616] text-xs font-semibold uppercase tracking-wider rounded-full border border-[#ECD9B7]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>{order.estimatedDeliveryDate}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Desktop/Tablet Stepper Bar */}
      <div className="relative my-4 px-2 sm:px-6">
        {/* Background Track Line */}
        <div className="absolute top-5 left-6 right-6 sm:left-12 sm:right-12 h-1 bg-[#E5DFD5] -z-0 rounded-full" />

        {/* Animated Active Progress Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${activePercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute top-5 left-6 sm:left-12 h-1 bg-gradient-to-r from-[#C29B38] via-[#B2593E] to-[#A0452E] -z-0 rounded-full shadow-xs"
          style={{ maxWidth: 'calc(100% - 3rem)' }}
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-5 relative z-10">
          {STEP_DEFINITIONS.map((def) => {
            const isCompleted = def.stepNumber < currentStepNumber;
            const isCurrent = def.stepNumber === currentStepNumber;
            const isUpcoming = def.stepNumber > currentStepNumber;
            const Icon = def.icon;
            const isSelected = selectedStep === def.stepNumber;

            return (
              <div
                key={def.key}
                onClick={() => setSelectedStep(def.stepNumber)}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                {/* Node Circle */}
                <div className="relative">
                  {isCurrent && (
                    <motion.div
                      layoutId="pulsingStepperRing"
                      className="absolute -inset-1.5 rounded-full bg-[#D4AF37]/30 animate-pulse pointer-events-none"
                    />
                  )}

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all shadow-sm ${
                      isCompleted
                        ? 'bg-[#1A1816] text-[#FAF8F5] ring-2 ring-[#D4AF37]/60'
                        : isCurrent
                        ? 'bg-[#B2593E] text-white ring-4 ring-[#B2593E]/20 font-bold shadow-md'
                        : 'bg-[#FFFFFF] text-[#9A8F83] border-2 border-[#D8D0C3]'
                    } ${isSelected ? 'ring-2 ring-offset-2 ring-[#1A1816]' : ''}`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-[#D4AF37] stroke-[2.5]" />
                    ) : isCurrent ? (
                      <Icon className="w-5 h-5" />
                    ) : (
                      <span className="text-xs font-semibold">{def.stepNumber}</span>
                    )}
                  </motion.div>
                </div>

                {/* Step Labels */}
                <div className="mt-3 px-1">
                  <span
                    className={`text-[10px] sm:text-xs uppercase tracking-wider block font-semibold leading-tight ${
                      isCurrent
                        ? 'text-[#B2593E]'
                        : isCompleted
                        ? 'text-[#1A1816]'
                        : 'text-[#8C7E72]'
                    }`}
                  >
                    <span className="hidden sm:inline">{def.label}</span>
                    <span className="sm:hidden">{def.shortLabel}</span>
                  </span>

                  {isCurrent && (
                    <span className="inline-block mt-1 text-[9px] bg-[#B2593E] text-white px-2 py-0.2 rounded-full font-bold uppercase tracking-widest shadow-xs">
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detail Drawer / Info Banner */}
      {selectedStep && (
        <motion.div
          key={selectedStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[#FFFFFF] border border-[#E8E1D5] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xs bg-[#F5EFE6] text-[#1A1816] shrink-0 mt-0.5">
              <Info className="w-4 h-4 text-[#B2593E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1A1816] uppercase tracking-wider text-[11px]">
                  Milestone Details: {STEP_DEFINITIONS[selectedStep - 1]?.label}
                </span>
                {selectedStep < currentStepNumber && (
                  <span className="text-[9px] text-[#2E5836] font-bold uppercase tracking-wider bg-[#E8F2EA] px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                )}
                {selectedStep === currentStepNumber && (
                  <span className="text-[9px] text-[#8C6D1F] font-bold uppercase tracking-wider bg-[#FAF2DE] px-2 py-0.5 rounded-full">
                    Current Focus
                  </span>
                )}
                {selectedStep > currentStepNumber && (
                  <span className="text-[9px] text-[#8C7E72] font-semibold uppercase tracking-wider bg-[#F2EDE4] px-2 py-0.5 rounded-full">
                    Upcoming
                  </span>
                )}
              </div>
              <p className="text-[#6B5E52] mt-0.5">
                {STEP_DEFINITIONS[selectedStep - 1]?.description}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F0ECE4]">
            <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
              Estimated / Recorded Date
            </span>
            <span className="font-medium text-[#1A1816]">
              {selectedStep === 5 && order.currentStep === 'delivered'
                ? order.estimatedDeliveryDate
                : selectedStep === 4
                ? order.estimatedDeliveryDate
                : order.orderDate}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
