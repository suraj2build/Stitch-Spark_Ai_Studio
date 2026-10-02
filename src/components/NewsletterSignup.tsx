import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, ArrowRight, Sparkles, Copy, CheckCheck, AlertCircle } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'footer' | 'standalone';
}

export function NewsletterSignup({ className = '', variant = 'footer' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [preference, setPreference] = useState<'all' | 'women' | 'men'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Email format validation (RFC-compliant standard regex)
  const validateEmail = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your email address');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com)');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) {
      // Clear error as user types
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);
    // Simulate luxury newsletter registration delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('VANYA-GAZETTE15');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleReset = () => {
    setEmail('');
    setIsSuccess(false);
    setErrorMessage('');
    setCopiedCode(false);
  };

  return (
    <div id="newsletter-signup-widget" className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Header & Privilege Benefit */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.26em] uppercase font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  The Private Gazette
                </span>
                <span className="text-[9px] bg-[#342D26] text-[#E0CEB7] px-2 py-0.5 rounded-full font-medium tracking-wider">
                  ₹1,500 PRIVILEGE
                </span>
              </div>
              <h4 className="font-editorial text-2xl text-white font-normal mt-1 tracking-wide">
                Seasonal Runway &amp; Handloom Previews
              </h4>
              <p className="text-xs text-[#B5A89B] leading-relaxed mt-1 max-w-md">
                Subscribe to receive private invitations to bespoke atelier trunk shows, artisanal journal dispatches, and an exclusive ₹1,500 privilege voucher.
              </p>
            </div>

            {/* Interest Preferences Selection */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] font-semibold">
                Curate:
              </span>
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: 'All Curations' },
                  { id: 'women', label: "Women's Edit" },
                  { id: 'men', label: "Men's Edit" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreference(item.id as any)}
                    className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider transition-all ${
                      preference === item.id
                        ? 'bg-[#FAF8F5] text-[#1A1816] font-semibold'
                        : 'bg-[#26221E] text-[#9E9083] hover:text-white border border-[#3E3832]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subscription Form */}
            <form onSubmit={handleSubmit} className="space-y-2 max-w-md" noValidate>
              <div className="relative">
                <div className="relative flex rounded-xs overflow-hidden border transition-colors shadow-inner bg-[#241F1B] focus-within:ring-1 focus-within:ring-[#D4AF37] focus-within:border-[#D4AF37] border-[#3E3832]">
                  <div className="pl-3.5 flex items-center pointer-events-none text-[#8A7D70]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="newsletter-email-input"
                    type="email"
                    placeholder="Enter your personal email address..."
                    value={email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white placeholder:text-[#7A6F62] focus:outline-none"
                    aria-label="Email for newsletter signup"
                    aria-invalid={!!errorMessage}
                    aria-describedby={errorMessage ? 'newsletter-error' : undefined}
                  />
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#EAE4D8] text-[#1A1816] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-75 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-[#1A1816] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Join</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Validation Error Message */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    id="newsletter-error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-[11px] text-[#E07A5F] pt-0.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Privacy guarantee */}
              <p className="text-[10px] text-[#786D61] pt-0.5">
                We respect your personal sanctuary. No unsolicited messages. Unsubscribe with one click anytime.
              </p>
            </form>
          </motion.div>
        ) : (
          /* Animated Success State */
          <motion.div
            key="signup-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="p-5 bg-gradient-to-br from-[#25201B] to-[#1C1815] border border-[#4A3F33] rounded-xs max-w-md space-y-4 shadow-xl relative overflow-hidden"
          >
            {/* Subtle decorative gold sheen */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3.5">
              {/* Animated check circle with gold aura */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F1E0B3] flex items-center justify-center shrink-0 shadow-md shadow-[#D4AF37]/20"
              >
                <Check className="w-5 h-5 text-[#1A1816] stroke-[2.5]" />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-[#D4AF37]">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                    You Are Now On The Private Ledger
                  </span>
                </div>
                <h5 className="font-editorial text-lg text-white font-normal mt-0.5">
                  Welcome to VANYA Atelier
                </h5>
                <p className="text-xs text-[#B5A89B] mt-1 leading-snug">
                  An inaugural edition has been reserved for <strong className="text-white font-medium">{email}</strong>.
                </p>
              </div>
            </div>

            {/* Voucher token copy card */}
            <div className="bg-[#181512] border border-[#3A332B] p-3 rounded-xs flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#8A7D70] block font-semibold">
                  Privilege Voucher Code (₹1,500 Off)
                </span>
                <span className="font-mono text-sm tracking-wider font-semibold text-[#D4AF37]">
                  VANYA-GAZETTE15
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1.5 rounded-xs bg-[#2B2520] hover:bg-[#3B332B] text-white transition-colors cursor-pointer"
                title="Copy voucher code"
              >
                {copiedCode ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-[#8A7D70]">Valid on your inaugural order above ₹4,000</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                Register another email
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
