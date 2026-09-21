import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';
import { B2BOrder, CartItem, B2BProfile } from '../types';
import { formatKes, calculateOrderTotals, calculateItemPricing } from '../utils/formatters';

interface InvoiceViewerModalProps {
  order: B2BOrder | null;
  proFormaItems?: CartItem[];
  b2bProfile: B2BProfile;
  onClose: () => void;
}

export const InvoiceViewerModal: React.FC<InvoiceViewerModalProps> = ({
  order,
  proFormaItems,
  b2bProfile,
  onClose,
}) => {
  if (!order && (!proFormaItems || proFormaItems.length === 0)) return null;

  const isProForma = !order;
  const items = order ? order.items : (proFormaItems || []);
  const totals = calculateOrderTotals(items);

  const invoiceNumber = order ? order.id : `PRO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const invoiceDate = order ? order.orderDate : new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  const poNumber = order?.poNumber || `PO-DRAFT-${b2bProfile.businessName.substring(0, 3).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="invoice-viewer-modal"
        className="bg-white dark:bg-[#171728] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Control Bar */}
        <div className="p-4 bg-[#171728] text-white flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            {isProForma ? 'Official B2B Pro-Forma Quotation' : 'Official Electronic Tax Invoice'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#0E01B5] hover:bg-[#09007A] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 space-y-6 text-gray-800 dark:text-gray-200 text-xs font-sans">
          
          {/* Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-[#0E01B5] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white p-1 rounded-xl border border-gray-200 flex items-center justify-center shrink-0">
                <img src="/bessich-logo.png" alt="Bessich" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#0E01B5] dark:text-[#8c82ff] font-display">
                  BESSICH DISTRIBUTORS LTD
                </h1>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium">
                  Licensed Importer & Wholesale Distributor of Fine Wine, Spirits & Beers
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Jumbo House, Iten Road, Opp. Fire Station, Eldoret, Kenya
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                  KRA PIN: P051992014B • Hotline: +254 754 320 000 • orders@bessich.co.ke
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block bg-[#171728] text-[#FFD700] text-xs font-extrabold px-3 py-1 rounded uppercase tracking-wider">
                {isProForma ? 'PRO-FORMA QUOTE' : 'TAX INVOICE'}
              </span>
              <div className="font-mono font-bold text-sm text-gray-900 dark:text-white mt-1">{invoiceNumber}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">Date: {invoiceDate}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">Ref PO: {poNumber}</div>
            </div>
          </div>

          {/* Consignee / Bill To */}
          <div className="grid grid-cols-2 gap-6 bg-[#FAF9F6] dark:bg-[#12121e] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
                Billed To (Licensed Buyer):
              </span>
              <div className="font-extrabold text-sm text-gray-900 dark:text-white">{b2bProfile.businessName}</div>
              <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{b2bProfile.deliveryAddress}</div>
              <div className="text-[11px] text-gray-600 dark:text-gray-400">Attn: {b2bProfile.contactPerson} ({b2bProfile.phoneNumber})</div>
              <div className="text-[11px] font-mono text-[#0E01B5] dark:text-[#8c82ff] font-bold mt-1">KRA PIN: {b2bProfile.kraPin}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
                Fulfillment Logistics:
              </span>
              <div className="font-bold text-gray-900 dark:text-white">
                {order ? order.depotName : b2bProfile.primaryDepot}
              </div>
              <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                Dispatch Slot: {order ? order.deliverySlot : 'Next Business Morning Fleet'}
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                Settlement: {order ? order.paymentMethod.toUpperCase() : (b2bProfile.paymentTermsDays > 0 ? `Net ${b2bProfile.paymentTermsDays} Days Credit` : 'Cash on Delivery')}
              </div>
            </div>
          </div>

          {/* Table of Items */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#FAF9F6] dark:bg-[#12121e] text-gray-600 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-center">Packaging</th>
                  <th className="py-2.5 px-3 text-center">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (KES)</th>
                  <th className="py-2.5 px-3 text-right">Total (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item, idx) => {
                  const pricing = calculateItemPricing(item);
                  const unitPrice = item.orderType === 'case' ? item.product.casePriceKes : item.product.bottlePriceKes;

                  return (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-mono text-gray-500 dark:text-gray-400">{item.product.sku}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900 dark:text-white">{item.product.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{item.product.brand} • {item.product.abv}% ABV</div>
                      </td>
                      <td className="py-2.5 px-3 text-center text-gray-600 dark:text-gray-300 capitalize">
                        {item.orderType === 'case' ? `Case of ${item.product.casePack}` : 'Bottle'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-700 dark:text-gray-300">
                        {formatKes(unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-gray-900 dark:text-white">
                        {formatKes(pricing.netSubtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals & Banking Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-4 bg-gray-50 dark:bg-[#12121e] rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] space-y-1.5 text-gray-600 dark:text-gray-300">
              <span className="font-bold text-gray-900 dark:text-white block text-xs">Official Banking Remittance Instructions:</span>
              <div><span className="font-semibold text-gray-800 dark:text-gray-200">Bank:</span> Absa Bank Kenya PLC</div>
              <div><span className="font-semibold text-gray-800 dark:text-gray-200">Branch:</span> Eldoret Commercial Branch (Code: 03054)</div>
              <div><span className="font-semibold text-gray-800 dark:text-gray-200">Account No:</span> 03-054-9218002</div>
              <div><span className="font-semibold text-gray-800 dark:text-gray-200">Lipa na M-PESA:</span> Paybill 891200 / Till 5824102</div>
            </div>

            <div className="space-y-2 text-right text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Gross Wholesale Total:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatKes(totals.grossSubtotal)}</span>
              </div>
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                  <span>Tier Volume Discount:</span>
                  <span>-{formatKes(totals.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                <span>16% Value Added Tax (Included):</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">{formatKes(totals.vatAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Depot Logistics Transport:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {totals.deliveryFee === 0 ? 'FREE' : formatKes(totals.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-gray-900 dark:text-white pt-2 border-t-2 border-gray-300 dark:border-gray-700">
                <span>Net Payable (KES):</span>
                <span className="text-[#0E01B5] dark:text-[#8c82ff] font-black">{formatKes(totals.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Stamp & Authorized Signatory */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <div>
              <p>Generated by Bessich B2B Procurement Electronic System</p>
              <p className="font-mono text-[10px]">VERIFICATION HASH: BESSICH-KE-2026-X89F2</p>
            </div>
            <div className="text-right border-t border-gray-400 dark:border-gray-600 pt-1 w-48 text-center font-serif text-gray-700 dark:text-gray-300 italic">
              Bessich Commercial Finance Desk
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
