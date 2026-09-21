import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  Upload, 
  CheckCircle2, 
  FileText, 
  CreditCard,
  Check
} from 'lucide-react';
import { B2BProfile } from '../types';

interface CreditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  b2bProfile: B2BProfile;
  onSubmitSuccess: (updatedProfile: B2BProfile) => void;
}

export const CreditApplicationModal: React.FC<CreditApplicationModalProps> = ({
  isOpen,
  onClose,
  b2bProfile,
  onSubmitSuccess,
}) => {
  if (!isOpen) return null;

  const [businessName, setBusinessName] = useState(b2bProfile.businessName === 'Unverified Guest / New Applicant' ? '' : b2bProfile.businessName);
  const [kraPin, setKraPin] = useState(b2bProfile.kraPin === 'Pending Submission' ? '' : b2bProfile.kraPin);
  const [liquorLicense, setLiquorLicense] = useState(b2bProfile.liquorLicenseNumber === 'Pending Verification' ? '' : b2bProfile.liquorLicenseNumber);
  const [businessType, setBusinessType] = useState(b2bProfile.businessType);
  const [requestedLimit, setRequestedLimit] = useState('500,000');
  const [terms, setTerms] = useState<30 | 14>(30);
  const [contactName, setContactName] = useState(b2bProfile.contactPerson);
  const [phone, setPhone] = useState(b2bProfile.phoneNumber);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);

      const updated: B2BProfile = {
        ...b2bProfile,
        businessName: businessName || 'Registered Hospitality Partner',
        kraPin: kraPin.toUpperCase() || 'P051982344X',
        liquorLicenseNumber: liquorLicense || 'CLLB/UG/2026/089',
        businessType: businessType as any,
        contactPerson: contactName,
        phoneNumber: phone,
        isVerified: true,
        tier: 'premium_hospitality',
        paymentTermsDays: terms,
        creditLimitKes: parseInt(requestedLimit.replace(/\D/g, '')) || 500000,
        availableCreditKes: parseInt(requestedLimit.replace(/\D/g, '')) || 500000,
      };

      setTimeout(() => {
        onSubmitSuccess(updated);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="credit-application-modal"
        className="bg-white dark:bg-[#171728] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="p-5 bg-[#171728] text-white flex items-center justify-between border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider block">
              B2B Commercial Accounts
            </span>
            <h3 className="font-extrabold text-lg font-display">
              Commercial Trade Credit Application
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">
              Commercial Facility Approved!
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
              Your business credentials have been authenticated. Net-{terms} credit terms have been unlocked on your profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Registered Trade / Business Name:
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. The Grand View Lounge Ltd"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  KRA PIN:
                </label>
                <input
                  type="text"
                  required
                  value={kraPin}
                  onChange={(e) => setKraPin(e.target.value)}
                  placeholder="e.g. P051890234M"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-mono bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  County Liquor License #:
                </label>
                <input
                  type="text"
                  required
                  value={liquorLicense}
                  onChange={(e) => setLiquorLicense(e.target.value)}
                  placeholder="e.g. CLLB/2026/049"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-mono bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Requested Credit Line (KES):
                </label>
                <select
                  value={requestedLimit}
                  onChange={(e) => setRequestedLimit(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                >
                  <option value="300,000">KES 300,000</option>
                  <option value="500,000">KES 500,000</option>
                  <option value="1,000,000">KES 1,000,000</option>
                  <option value="2,500,000">KES 2,500,000</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Requested Settlement Terms:
                </label>
                <select
                  value={terms}
                  onChange={(e) => setTerms(parseInt(e.target.value) as any)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] bg-white dark:bg-[#1b1b2d]"
                >
                  <option value={14}>Net 14 Calendar Days</option>
                  <option value={30}>Net 30 Calendar Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Director / F&B Manager Name:
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Patrick Chepkwony"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Contact Phone Number:
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +254 722 000 000"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div className="p-3 bg-[#FAF9F6] dark:bg-[#12121e] border border-gray-200 dark:border-gray-800 rounded-xl flex items-center gap-3">
              <Upload className="w-4 h-4 text-gray-400" />
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-700 dark:text-gray-200">Digital Verification:</span> We will auto-validate your KRA PIN against the national liquor excise registry.
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#0E01B5] hover:bg-[#09007A] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Validating KRA Credentials...' : 'Submit Commercial Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
