import React, { useEffect, useState } from 'react';
import { X, Rocket, Gift, BadgePercent, Sparkles, Copy, Check } from 'lucide-react';
import { Promotion, PromotionKind } from '../types';

interface PromotionsPopoutProps {
  isOpen: boolean;
  onClose: () => void;
  promotions: Promotion[];
}

type FilterId = 'all' | PromotionKind;

const KIND_META: Record<
  PromotionKind,
  { label: string; icon: React.ElementType; gradient: string; ring: string; text: string }
> = {
  innovation: {
    label: 'Innovation',
    icon: Rocket,
    gradient: 'bg-linear-to-br from-[#7c3aed] to-[#2563eb]',
    ring: 'ring-violet-400/40',
    text: 'text-violet-600 dark:text-violet-300',
  },
  promotion: {
    label: 'Promotions',
    icon: Gift,
    gradient: 'bg-linear-to-br from-[#F2693F] to-[#FFD700]',
    ring: 'ring-amber-400/40',
    text: 'text-amber-600 dark:text-amber-300',
  },
  discount: {
    label: 'Discounts',
    icon: BadgePercent,
    gradient: 'bg-linear-to-br from-emerald-500 to-teal-400',
    ring: 'ring-emerald-400/40',
    text: 'text-emerald-600 dark:text-emerald-300',
  },
};

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'innovation', label: 'Innovation' },
  { id: 'promotion', label: 'Promotions' },
  { id: 'discount', label: 'Discounts' },
];

export const PromotionsPopout: React.FC<PromotionsPopoutProps> = ({ isOpen, onClose, promotions }) => {
  const [filter, setFilter] = useState<FilterId>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const visible = promotions.filter((p) => filter === 'all' || p.kind === filter);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode((prev) => (prev === code ? null : prev)), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#171728] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bright gradient header */}
        <div className="relative bg-linear-to-r from-[#0E01B5] via-[#7c3aed] to-[#F2693F] text-white p-5 sm:p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close promotions"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#FFD700]" />
              Innovation &amp; Offers
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-display mt-2.5">
            What&apos;s New at Bessich
          </h3>
          <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-lg">
            Platform innovations, active promotions and live discounts — synced from our online store.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 px-5 sm:px-6 pt-4">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                filter === f.id
                  ? 'bg-[#0E01B5] text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-[#23233a] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c47]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[55vh] overflow-y-auto">
          {visible.map((promo) => {
            const meta = KIND_META[promo.kind];
            const Icon = meta.icon;
            return (
              <div
                key={promo.id}
                className={`relative rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1f1f35] p-4 ring-1 ${meta.ring} transition-transform hover:-translate-y-0.5`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 shrink-0 rounded-lg ${meta.gradient} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-gray-900 dark:text-white leading-tight">
                        {promo.title}
                      </h4>
                      {promo.badge && (
                        <span className="bg-[#F2693F] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                          {promo.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.text}`}>
                      {meta.label}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-2.5">
                  {promo.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                  {promo.value ? (
                    <span className="text-sm font-extrabold bg-linear-to-r from-[#0E01B5] to-[#7c3aed] bg-clip-text text-transparent">
                      {promo.value}
                    </span>
                  ) : (
                    <span />
                  )}

                  {promo.code && (
                    <button
                      type="button"
                      onClick={() => handleCopy(promo.code as string)}
                      className="inline-flex items-center gap-1.5 bg-white dark:bg-[#12121e] border border-dashed border-[#0E01B5]/50 text-[#0E01B5] dark:text-[#8c82ff] text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer hover:bg-[#0E01B5]/5 transition-colors"
                    >
                      {copiedCode === promo.code ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedCode === promo.code ? 'Copied!' : promo.code}
                    </button>
                  )}
                </div>

                {promo.validUntil && (
                  <div className="text-[10px] text-gray-400 mt-2">Valid until: {promo.validUntil}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#12121e] flex items-center justify-between gap-3">
          <span className="text-[10px] text-gray-400">
            Offers sync live from the Bessich e-commerce platform.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#0E01B5] hover:bg-[#09007A] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer active:scale-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
