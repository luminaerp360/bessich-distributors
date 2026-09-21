import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const AgeGateModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('bessich_age_verified');
    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('bessich_age_verified', 'true');
    setIsOpen(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="age-gate-modal"
        className="bg-[#171728] text-white rounded-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="w-16 h-16 bg-white/10 rounded-2xl p-2 mx-auto flex items-center justify-center border border-white/20">
          <img
            src="/bessich-logo.png"
            alt="Bessich Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#FFD700] block mb-1">
            Statutory Age & Commercial Verification
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold font-display">
            Welcome to Bessich Distributors
          </h3>
        </div>

        <div className="bg-[#23233a] p-4 rounded-xl border border-white/10 text-xs text-[#F5F5DC]/90 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[#F2693F] font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Notice Under Alcoholic Drinks Control Act</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-300">
            Excessive consumption of alcohol is harmful to your health. Alcohol is strictly not for sale to persons under the age of 18 years.
          </p>
        </div>

        <p className="text-xs text-gray-400">
          Are you of legal purchasing age (18+) and authorized to represent a licensed hospitality, retail, or commercial entity in Kenya?
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3 px-4 rounded-xl bg-[#0E01B5] hover:bg-[#09007A] text-white font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            I am 18+ & Enter B2B Portal
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            I am Under 18
          </button>
        </div>
      </div>
    </div>
  );
};
