import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  ShieldCheck,
  Truck,
  FileText
} from 'lucide-react';
import { DEPOTS } from '../data/depots';
import { BusinessType } from '../types';

interface ContactSectionProps {
  // TODO: Admin-only — onOpenCreditModal
  // onOpenCreditModal: () => void;
  onNavigate?: (page: import('../types').ActivePage) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onNavigate }) => {
  // Form state
  const [formData, setFormData] = useState({
    contactPerson: '',
    businessName: '',
    businessType: 'Bar & Lounge' as BusinessType,
    phoneNumber: '',
    email: '',
    preferredBranch: 'Eldoret Central Hub (HQ)',
    subject: 'Wholesale Supply Request',
    message: '',
  });

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketId = `BD-TKT-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedTicket(ticketId);
    }, 600);
  };

  const FAQS = [
    {
      q: 'What is the Minimum Order Quantity (MOQ) for commercial delivery?',
      a: 'For delivery via our direct company fleet within Eldoret and major branch zones, the minimum order quantity is 2 cases (or mixed cases totaling at least KES 25,000). Single bottle purchases can also be accommodated directly at our branch pickup counters.'
    },
    {
      q: 'What documents are required to open a wholesale account?',
      a: 'To comply with Kenya Revenue Authority (KRA) regulations and the Alcoholic Drinks Control Act, new commercial accounts must provide a copy of their KRA PIN Certificate, County Liquor Licensing Board (CLLB) permit, and Business Registration Certificate.'
    },
    {
      q: 'How does Bessich handle weekend emergency restocks for clubs and lounges?',
      a: 'We understand the fast-paced nature of hospitality. Our Emergency Weekend Restock Desk operates on Saturday afternoons and Sundays specifically to replenish high-velocity spirits, beers, and mixers for verified nightlife and lounge partners.'
    },
    {
      q: 'How do I qualify for Net-14 or Net-30 revolving trade credit?',
      a: 'Verified hospitality and licensed retail establishments that maintain an active purchasing record for at least 30 days or undergo credit assessment can qualify for revolving trade credit lines up to KES 2,000,000.'
    },
    {
      q: 'Are all beverages authenticated with genuine KRA Track & Trace stamps?',
      a: 'Yes. 100% of our wines, spirits, and beers are stamped with genuine KRA Quick Response (QR) excise tax stamps. We source exclusively from authorized international brand owners and local breweries.'
    }
  ];

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0c0c14] text-gray-900 dark:text-gray-100 min-h-screen py-6 sm:py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E01B5]/10 dark:bg-[#0E01B5]/30 text-[#0E01B5] dark:text-[#8c82ff] text-[11px] sm:text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Commercial Wholesale & Hospitality Desk</span>
          </div>
          <h1 className="hero-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-gray-900 dark:text-white">
            Connect with Bessich Distributors
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Have questions about wholesale pricing, volume supply contracts, trade credit facilities, or regional delivery routes? Our beverage consultants are ready to assist.
          </p>
        </div>

        {/* Contact Channels Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0E01B5]/10 dark:bg-[#0E01B5]/30 text-[#0E01B5] dark:text-[#8c82ff] flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Wholesale Hotline</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Order placement & inquiries</p>
            </div>
            <div className="space-y-1 text-xs">
              <a href="tel:+254708727848" className="font-bold text-[#0E01B5] dark:text-[#8c82ff] hover:underline block">
                +254 708 727 848 (HQ Line)
              </a>
              <a href="tel:+254712345678" className="text-gray-600 dark:text-gray-300 hover:underline block">
                +254 712 345 678 (Dispatch)
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] dark:text-[#FFD700] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Official Correspondence</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Quotes & commercial invoices</p>
            </div>
            <div className="space-y-1 text-xs">
              <a href="mailto:bessichdistributors@gmail.com" className="font-semibold text-[#0E01B5] dark:text-[#8c82ff] hover:underline block truncate">
                bessichdistributors@gmail.com
              </a>
              <a href="mailto:orders@bessich.co.ke" className="text-gray-500 dark:text-gray-400 hover:underline block truncate">
                orders@bessich.co.ke
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F2693F]/10 text-[#F2693F] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Eldoret Central HQ</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Warehouse & executive offices</p>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
              Jumbo House, Iten Road, Opp. Fire Station, Eldoret Town, Kenya
            </p>
          </div>

          <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Operating Hours</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Order cutoff: 16:30 Daily</p>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
              <p>Mon - Sat: 07:30 - 18:30</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Sun: 09:00 - 15:00 (Emergency)</p>
            </div>
          </div>
        </div>

        {/* Main Grid: Contact Form & HQ Map/Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs">
            <div className="mb-5">
              <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white">
                Send a Commercial Wholesale Inquiry
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Fill in your establishment's details below. An assigned beverage account manager will review your request and contact you within 2 business hours.
              </p>
            </div>

            {submittedTicket ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    Thank you, <strong className="font-semibold">{formData.contactPerson}</strong>. Your commercial wholesale inquiry for <strong className="font-semibold">{formData.businessName}</strong> has been logged into our Eldoret distribution system.
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-[#1b1b2d] rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-mono text-gray-800 dark:text-gray-200 inline-block">
                  Reference Ticket: <strong className="text-[#0E01B5] dark:text-[#8c82ff]">{submittedTicket}</strong>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedTicket(null);
                      setFormData({
                        contactPerson: '',
                        businessName: '',
                        businessType: 'Bar & Lounge',
                        phoneNumber: '',
                        email: '',
                        preferredBranch: 'Eldoret Central Hub (HQ)',
                        subject: 'Wholesale Supply Request',
                        message: '',
                      });
                    }}
                    className="text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] hover:underline cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Brian Kiprop"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1b1b2d] text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E01B5] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Business / Establishment Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. The Loft Lounge & Grill"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1b1b2d] text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E01B5] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Business Type *
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1b1b2d] text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E01B5] focus:outline-hidden cursor-pointer"
                    >
                      <option value="Bar & Lounge">Bar & Lounge</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Hotel & Resort">Hotel & Resort</option>
                      <option value="Retail Liquor Store">Retail Liquor Store</option>
                      <option value="Supermarket / Hypermarket">Supermarket / Hypermarket</option>
                      <option value="Event & Catering Company">Event & Catering Company</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number (M-PESA / WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1b1b2d] text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E01B5] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="purchasing@establishment.co.ke"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1b1b2d] text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E01B5] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Preferred Dispatch Branch *
                    </label>
                    <select
                      value={formData.preferredBranch}
                      onChange={(e) => setFormData({ ...formData, preferredBranch: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1b1b2d] text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E01B5] focus:outline-hidden cursor-pointer"
                    >
                      {DEPOTS.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} ({d.region})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Subject of Inquiry *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1b1b2d] text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E01B5] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Wholesale Supply Request">Wholesale Supply & Bulk Case Order</option>
                    <option value="Trade Credit Application">Net-14 / Net-30 Trade Credit Application</option>
                    <option value="Product Availability & Quotation">Specific Vintage or Spirit Quotation</option>
                    <option value="Logistics & Route Inquiry">Delivery Schedule & Vehicle Dispatch Inquiry</option>
                    <option value="Sommelier & Staff Training">Beverage Program & Sommelier Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Message / Order Specification *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your establishment's beverage requirements, anticipated weekly case volume, preferred delivery times, or specific brands needed..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1b1b2d] text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E01B5] focus:outline-hidden resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Strict confidentiality assured. Authorized under CLLB.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0E01B5] hover:bg-[#0a018f] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Transmitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: HQ Location, B2B WhatsApp & Trade Credit Prompt */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            {/* Headquarters Location Card */}
            <div className="bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-white/10 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD700] bg-[#171728] p-2.5 rounded-xl">
                <MapPin className="w-4 h-4 text-[#F2693F]" />
                <span>Headquarters & Central Depot</span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Jumbo House Distribution Terminal
                </h3>
                <p>Iten Road, Opposite Eldoret Fire Station, Eldoret Town</p>
                <p className="text-gray-500 dark:text-gray-400">
                  Uasin Gishu County, Republic of Kenya
                </p>
              </div>

              {/* Map Illustration / Visual representation */}
              <div className="relative h-36 sm:h-40 rounded-xl bg-slate-900 overflow-hidden border border-gray-200 dark:border-white/10 flex items-center justify-center text-center p-3">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 space-y-1.5">
                  <div className="w-9 h-9 rounded-full bg-[#0E01B5] text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#FFD700]/30 animate-bounce">
                    <MapPin className="w-4 h-4 text-[#FFD700]" />
                  </div>
                  <span className="text-xs font-bold text-white block">
                    Bessich Central Logistics Hub
                  </span>
                  <span className="text-[10px] text-gray-300 block">
                    GPS: 0.5143° N, 35.2698° E • Central Loading Dock
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                <a
                  href="https://maps.google.com/?q=Eldoret,Kenya"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-center font-semibold text-gray-800 dark:text-gray-200 transition-colors"
                >
                  Open in Maps →
                </a>
                <a
                  href="tel:+254754320000"
                  className="py-2 px-3 rounded-lg bg-[#0E01B5]/10 text-[#0E01B5] dark:text-[#8c82ff] hover:bg-[#0E01B5]/20 text-center font-bold transition-colors"
                >
                  Call Reception
                </a>
              </div>
            </div>

            {/* Trade Credit Banner */}
            <div className="bg-linear-to-br from-[#171728] to-[#252542] text-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/10 shadow-md space-y-2.5">
              <div className="flex items-center gap-2 text-[#FFD700] text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Revolving Trade Credit</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold">
                Need Flexible 14 or 30-Day Payment Terms?
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Licensed bars, restaurants, and hotels can apply online in under 3 minutes for revolving credit facilities up to KES 2M.
              </p>
              {/* TODO: Admin-only - Credit Application
              <button
                type="button"
                onClick={onOpenCreditModal}
                className="w-full py-2.5 rounded-xl bg-[#FFD700] hover:bg-[#F2C200] text-[#171728] font-bold text-xs transition-all shadow-sm cursor-pointer text-center active:scale-95"
              >
                Launch Credit Application
              </button>
              */}
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('catalog')}
                  className="w-full py-2.5 rounded-xl bg-[#FFD700] hover:bg-[#F2C200] text-[#171728] font-bold text-xs transition-all shadow-sm text-center block cursor-pointer active:scale-95"
                >
                  Order from Our Catalog
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Commercial FAQ Accordion */}
        <div className="bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E01B5] dark:text-[#8c82ff]" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white">
              Frequently Asked Questions by Commercial Buyers
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 bg-[#FAF9F6] dark:bg-[#1f1f33] hover:bg-gray-100 dark:hover:bg-[#25253e] cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white dark:bg-[#171728] text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
