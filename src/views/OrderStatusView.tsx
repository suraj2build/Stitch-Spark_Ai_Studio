import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  Phone,
  User,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
  X,
} from 'lucide-react';
import { CustomerOrder, OrderProgressStepKey } from '../types';
import { MOCK_ORDERS, lookupCustomerOrder } from '../data/mockOrders';
import { OrderProgressStepper } from '../components/OrderProgressStepper';
import { formatPrice } from '../utils/format';

interface OrderStatusViewProps {
  initialOrderId?: string;
  onSelectProduct: (productId: string) => void;
  onNavigate: (route: string, params?: any) => void;
}

export function OrderStatusView({
  initialOrderId,
  onSelectProduct,
  onNavigate,
}: OrderStatusViewProps) {
  // Input fields for lookup
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || 'VAN-8921-DEL');
  const [emailInput, setEmailInput] = useState('aanya.sharma@example.com');
  const [activeOrder, setActiveOrder] = useState<CustomerOrder | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false);
  const [showConciergeModal, setShowConciergeModal] = useState(false);

  // Initialize with initial order or default demo order
  useEffect(() => {
    const defaultId = initialOrderId || 'VAN-8921-DEL';
    const targetOrder = MOCK_ORDERS.find((o) => o.id === defaultId) || MOCK_ORDERS[0];
    if (targetOrder) {
      setActiveOrder(targetOrder);
      setOrderIdInput(targetOrder.id);
      setEmailInput(targetOrder.customerEmail);
    }
  }, [initialOrderId]);

  // Lookup validation & submission
  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError(null);

    const trimmedId = orderIdInput.trim();
    const trimmedEmail = emailInput.trim();

    if (!trimmedId) {
      setSearchError('Please enter your Order ID (e.g. VAN-8921-DEL)');
      return;
    }

    if (!trimmedEmail) {
      setSearchError('Please enter the email address used at checkout');
      return;
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setSearchError('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const result = lookupCustomerOrder(trimmedId, trimmedEmail);
      if (result.order) {
        setActiveOrder(result.order);
        setSearchError(null);
      } else {
        setSearchError(result.error || 'No order matching those credentials could be found.');
      }
    }, 400);
  };

  const handleSelectDemoOrder = (demoOrder: CustomerOrder) => {
    setOrderIdInput(demoOrder.id);
    setEmailInput(demoOrder.customerEmail);
    setActiveOrder(demoOrder);
    setSearchError(null);
  };

  const handleCopyTrackingNumber = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleDownloadInvoice = () => {
    setInvoiceDownloaded(true);
    setTimeout(() => setInvoiceDownloaded(false), 3000);
  };

  return (
    <div id="order-status-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Breadcrumb & Header */}
      <div className="border-b border-[#EAE3D7] pb-6 mb-8">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#B2593E]" />
          <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8C7F72]">
            Client Care &amp; Concierge
          </span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#1A1816] font-normal mt-1">
          Order Status &amp; Shipment Tracking
        </h1>
        <p className="text-xs text-[#7A6F64] mt-1 max-w-2xl">
          Follow the progress of your handcrafted attire from master weaver loom to doorstep delivery.
        </p>
      </div>

      {/* Order Lookup Search Card */}
      <div className="bg-[#FAF7F2] border border-[#E8DFD1] rounded-2xl p-6 mb-10 shadow-xs">
        <div className="max-w-3xl">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7A6B] block mb-1">
            Track Existing Dispatch
          </span>
          <p className="text-xs text-[#6B5E52] mb-4">
            Enter your VANYA order reference number and checkout email to view real-time courier coordinates and artisan milestones.
          </p>

          <form onSubmit={handleLookup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  htmlFor="order-id-input"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-[#4A433D] mb-1"
                >
                  Order Reference ID *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7E72]">
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    id="order-id-input"
                    type="text"
                    placeholder="e.g. VAN-8921-DEL"
                    value={orderIdInput}
                    onChange={(e) => {
                      setOrderIdInput(e.target.value);
                      if (searchError) setSearchError(null);
                    }}
                    className="w-full bg-white border border-[#DDD5C7] pl-9 pr-3 py-2.5 text-xs text-[#1A1816] placeholder:text-[#9A8F83] rounded-xl focus:outline-none focus:border-[#B2593E] focus:ring-1 focus:ring-[#B2593E]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email-input"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-[#4A433D] mb-1"
                >
                  Billing Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7E72]">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    placeholder="e.g. aanya.sharma@example.com"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (searchError) setSearchError(null);
                    }}
                    className="w-full bg-white border border-[#DDD5C7] pl-9 pr-3 py-2.5 text-xs text-[#1A1816] placeholder:text-[#9A8F83] rounded-xl focus:outline-none focus:border-[#B2593E] focus:ring-1 focus:ring-[#B2593E]"
                  />
                </div>
              </div>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {searchError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-[#FDF2F0] border border-[#F4C6BE] rounded-2xl text-xs text-[#B23825] flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Order Lookup Notice:</span>
                    <span>{searchError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <button
                id="btn-track-order-submit"
                type="submit"
                disabled={isSearching}
                className="px-6 py-2.5 bg-[#1A1816] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-[0.16em] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shadow-xs"
              >
                {isSearching ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Locating Package...</span>
                  </>
                ) : (
                  <>
                    <span>Track Order Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Instant One-Click Demo Pickers */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
                <span className="text-[10px] uppercase tracking-wider text-[#8A7D71] font-semibold">
                  Quick Demo Orders:
                </span>
                {MOCK_ORDERS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleSelectDemoOrder(demo)}
                    className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider transition-all border ${
                      activeOrder?.id === demo.id
                        ? 'bg-[#1A1816] text-white border-[#1A1816] font-semibold'
                        : 'bg-white text-[#5C534A] border-[#D8D0C3] hover:border-[#B2593E]'
                    }`}
                  >
                    {demo.id.split('-')[1]} ({demo.statusLabel})
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Active Order Details Display */}
      {activeOrder ? (
        <div className="space-y-8">
          {/* Top Order Summary Header */}
          <div className="bg-white border border-[#EAE3D7] rounded-2xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[#F0ECE4] gap-4">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-lg sm:text-xl font-bold text-[#1A1816]">
                    {activeOrder.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyOrderId(activeOrder.id)}
                    className="p-1 text-[#8C7E72] hover:text-[#1A1816] transition-colors rounded-xl"
                    title="Copy Order ID"
                  >
                    {copiedOrderId ? (
                      <Check className="w-4 h-4 text-green-700" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <span
                    className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                      activeOrder.currentStep === 'delivered'
                        ? 'bg-[#E8F2EA] text-[#22572E] border-[#BEDEC4]'
                        : activeOrder.currentStep === 'out_for_delivery'
                        ? 'bg-[#FDF2E9] text-[#A0452E] border-[#F5CEBA]'
                        : 'bg-[#FAF2DE] text-[#8C6D1F] border-[#ECD9B7]'
                    }`}
                  >
                    {activeOrder.statusLabel}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#7A6F64] mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#A89F95]" />
                    <span>Placed on {activeOrder.orderDate}</span>
                  </span>
                  <span>•</span>
                  <span>{activeOrder.items.length} {activeOrder.items.length === 1 ? 'Garment' : 'Garments'}</span>
                  <span>•</span>
                  <span className="font-semibold text-[#1A1816]">
                    Total: {formatPrice(activeOrder.payment.total)}
                  </span>
                </div>
              </div>

              {/* Header Action Suite */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD5C7] text-[#1A1816] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  <span>{invoiceDownloaded ? 'Invoice Saved ✓' : 'Tax Invoice'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowConciergeModal(true)}
                  className="px-3.5 py-2 bg-[#1A1816] hover:bg-black text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Concierge Help</span>
                </button>
              </div>
            </div>

            {/* Estimated Delivery Highlight Banner */}
            <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF2DE] text-[#936616] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block font-semibold">
                    {activeOrder.currentStep === 'delivered' ? 'Delivery Completed' : 'Estimated Arrival'}
                  </span>
                  <span className="font-editorial text-lg text-[#1A1816] font-medium">
                    {activeOrder.estimatedDeliveryDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#6B5E52]">
                <ShieldCheck className="w-4 h-4 text-[#2E5836] shrink-0" />
                <span>Inspected by VANYA Master Crafts Quality Guild</span>
              </div>
            </div>
          </div>

          {/* Visual Progress Stepper Component */}
          <OrderProgressStepper order={activeOrder} />

          {/* Two-Column Structured Deep Dive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Courier Logistics & Activity Log (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Courier & Transit Details Card */}
              <div className="bg-white border border-[#EAE3D7] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B2593E]" />
                    <h3 className="font-editorial text-lg text-[#1A1816] font-normal">
                      Courier &amp; Delivery Logistics
                    </h3>
                  </div>
                  <span className="text-[10px] bg-[#FAF7F2] text-[#8C7A6B] px-2.5 py-0.5 rounded-full border border-[#E5DFD5] font-semibold uppercase tracking-wider">
                    {activeOrder.carrier.serviceType}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block font-semibold">
                      Carrier Partner
                    </span>
                    <span className="font-medium text-[#1A1816] mt-0.5 block">
                      {activeOrder.carrier.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block font-semibold">
                      Airway Bill (AWB) Tracking No.
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs font-semibold text-[#1A1816] bg-[#FAF8F5] px-2 py-0.5 rounded-2xl border border-[#EAE3D7]">
                        {activeOrder.carrier.trackingNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTrackingNumber(activeOrder.carrier.trackingNumber)}
                        className="text-[11px] text-[#B2593E] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        {copiedTracking ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {activeOrder.carrier.currentLocation && (
                    <div className="sm:col-span-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block font-semibold">
                        Last Known Facility Scan
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#2E2A27] mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B2593E]" />
                        <span>{activeOrder.carrier.currentLocation}</span>
                      </div>
                    </div>
                  )}

                  {activeOrder.carrier.assignedRider && (
                    <div className="sm:col-span-2 bg-[#FAF7F2] border border-[#EAE3D7] p-3 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#1A1816] text-white flex items-center justify-center text-xs">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block font-semibold">
                            Assigned Courier Associate
                          </span>
                          <span className="font-medium text-[#1A1816]">
                            {activeOrder.carrier.assignedRider.name}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`tel:${activeOrder.carrier.assignedRider.phone}`}
                        className="px-2.5 py-1 bg-white border border-[#DDD5C7] text-[#1A1816] hover:bg-[#F2ECE1] rounded-full font-semibold text-[11px] uppercase tracking-wider transition-colors"
                      >
                        Call Associate
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Full Detailed Activity Timeline */}
              <div className="bg-white border border-[#EAE3D7] rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 border-b border-[#F0ECE4] pb-3 mb-5">
                  <Clock className="w-4 h-4 text-[#B2593E]" />
                  <h3 className="font-editorial text-lg text-[#1A1816] font-normal">
                    Transit Activity Logs &amp; Scans
                  </h3>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-[#EAE3D7]">
                  {activeOrder.timeline.map((event, idx) => (
                    <div key={event.id || idx} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-transform ${
                          event.isCompleted
                            ? 'bg-[#1A1816] border-[#D4AF37]'
                            : 'bg-white border-[#C4B9AA]'
                        }`}
                      />

                      <div className="space-y-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`text-xs font-semibold ${
                              event.isCompleted ? 'text-[#1A1816]' : 'text-[#8A7E72]'
                            }`}
                          >
                            {event.title}
                          </h4>
                          <span className="text-[10px] text-[#8C7A6B] font-mono">
                            {event.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#5C534A] leading-relaxed">
                          {event.description}
                        </p>
                        {event.location && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#A89F95]">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{event.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Garment Items, Shipping Address & Payment (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Ordered Items Summary */}
              <div className="bg-white border border-[#EAE3D7] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
                  <h3 className="font-editorial text-lg text-[#1A1816] font-normal">
                    Order Items ({activeOrder.items.length})
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] font-semibold">
                    Artisanal Handcraft
                  </span>
                </div>

                <div className="divide-y divide-[#F0ECE4]">
                  {activeOrder.items.map((item, index) => (
                    <div key={index} className="py-3 flex gap-3.5 items-start">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded-2xl border border-[#EAE3D7] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#1A1816] leading-tight truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#7A6F64]">
                          <span>Color: <strong className="text-[#1A1816]">{item.colorName}</strong></span>
                          <span>•</span>
                          <span>Size: <strong className="text-[#1A1816]">{item.size}</strong></span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-semibold text-[#1A1816]">
                            {formatPrice(item.price)} × {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onSelectProduct(item.productId)}
                            className="text-[10px] uppercase tracking-wider text-[#B2593E] hover:underline font-semibold"
                          >
                            View Product
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Recipient Card */}
              <div className="bg-white border border-[#EAE3D7] rounded-2xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 border-b border-[#F0ECE4] pb-3">
                  <MapPin className="w-4 h-4 text-[#B2593E]" />
                  <h3 className="font-editorial text-lg text-[#1A1816] font-normal">
                    Delivery Destination
                  </h3>
                </div>

                <div className="text-xs text-[#5C534A] space-y-1">
                  <p className="font-semibold text-[#1A1816]">
                    {activeOrder.shippingAddress.fullName}
                  </p>
                  <p>{activeOrder.shippingAddress.street}</p>
                  <p>
                    {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} -{' '}
                    <span className="font-mono">{activeOrder.shippingAddress.pincode}</span>
                  </p>
                  <p className="text-[#8C7A6B]">{activeOrder.shippingAddress.country}</p>
                  <p className="pt-1 text-[#1A1816]">
                    Phone: <span className="font-medium">{activeOrder.shippingAddress.phone}</span>
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white border border-[#EAE3D7] rounded-2xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 border-b border-[#F0ECE4] pb-3">
                  <CreditCard className="w-4 h-4 text-[#B2593E]" />
                  <h3 className="font-editorial text-lg text-[#1A1816] font-normal">
                    Payment Breakdown
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-[#5C534A]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(activeOrder.payment.subtotal)}</span>
                  </div>
                  {activeOrder.payment.discount > 0 && (
                    <div className="flex justify-between text-[#2E5836]">
                      <span>Privilege Voucher</span>
                      <span>- {formatPrice(activeOrder.payment.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express Air Courier</span>
                    <span className="text-[#2E5836] font-medium">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between font-semibold text-sm text-[#1A1816] pt-2 border-t border-[#F0ECE4]">
                    <span>Total Paid</span>
                    <span>{formatPrice(activeOrder.payment.total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#8C7A6B] pt-1">
                    <span>Method: {activeOrder.payment.method}</span>
                    <span className="text-[#2E5836] font-bold">
                      {activeOrder.payment.isPaid ? 'PAID' : 'COD'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* ARTISAN CONCIERGE MODAL */}
      {showConciergeModal && activeOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowConciergeModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EAE3D7] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D7]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg text-[#1A1816]">Artisan Concierge</h3>
                  <p className="text-[11px] text-[#8C7A6B]">Order #{activeOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowConciergeModal(false)}
                className="p-1.5 text-[#8C7E72] hover:text-[#1A1816] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5C534A] leading-relaxed">
              Our Jaipur atelier styling desk is on standby for personal styling guidance, complimentary doorstep fitting alterations, or priority delivery schedule inquiries.
            </p>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-white border border-[#E8E1D5] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7A6B] block">Direct Atelier Line</span>
                  <span className="text-xs font-semibold text-[#1A1816] font-mono">+91 141 289 4000</span>
                </div>
                <a
                  href="tel:+911412894000"
                  className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD5C7] rounded-xl text-xs font-semibold text-[#1A1816] transition-colors"
                >
                  Call Now
                </a>
              </div>

              <div className="p-3.5 bg-white border border-[#E8E1D5] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7A6B] block">WhatsApp Concierge</span>
                  <span className="text-xs font-semibold text-[#1A1816] font-mono">+91 98290 12000</span>
                </div>
                <span className="px-3 py-1.5 bg-[#E8F2EA] text-[#285832] rounded-xl text-xs font-semibold">
                  Online
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowConciergeModal(false)}
              className="w-full py-3 bg-[#1A1816] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-[0.16em] font-semibold rounded-full transition-colors cursor-pointer"
            >
              Close Concierge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
