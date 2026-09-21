import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Building2,
  Check,
  Search,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Depot } from '../types';

interface DepotsSectionProps {
  depots: Depot[];
  activeDepot: Depot;
  onSelectDepot: (depot: Depot) => void;
}

export const DepotsSection: React.FC<DepotsSectionProps> = ({
  depots,
  activeDepot,
  onSelectDepot,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [branchSearch, setBranchSearch] = useState<string>('');

  const filteredDepots = depots.filter((d) => {
    const matchesRegion = selectedRegion === 'all' || d.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesSearch = !branchSearch || 
      d.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
      d.address.toLowerCase().includes(branchSearch.toLowerCase()) ||
      d.manager.toLowerCase().includes(branchSearch.toLowerCase()) ||
      d.coverageAreas.some(area => area.toLowerCase().includes(branchSearch.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Branches Section Header */}
      <div className="bg-[#171728] text-white p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E01B5]/50 border border-[#0E01B5] text-[11px] sm:text-xs font-semibold text-[#FFD700]">
              <Truck className="w-3.5 h-3.5 text-[#F2693F]" />
              <span>10 Strategic Branches Across Kenya</span>
            </div>
            <h1 className="hero-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-white">
              Bessich Branch Network
            </h1>
            <p className="text-xs sm:text-sm text-[#F5F5DC]/80 max-w-2xl leading-relaxed">
              Bessich operates ten company-owned distribution hubs strategically situated across Eldoret, Uasin Gishu, Nandi, Elgeyo Marakwet, and the Western corridor, ensuring rapid 24-hour turnaround on bulk beverage orders and emergency restocks.
            </p>
          </div>

          <div className="bg-[#23233a] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/15 text-xs shrink-0 max-w-xs">
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Your Active Dispatch Branch:</span>
            <span className="font-bold text-white text-xs sm:text-sm block mt-0.5">{activeDepot.name}</span>
            <span className="text-[#FFD700] text-[11px] sm:text-xs block mt-0.5">{activeDepot.address}</span>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 block mt-1 font-medium">✓ Fleet Assigned for Direct Delivery</span>
          </div>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={branchSearch}
              onChange={(e) => setBranchSearch(e.target.value)}
              placeholder="Search branch, town or area..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFD700]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0 scrollbar-none">
            {['all', 'Eldoret', 'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Western'].map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer text-xs ${
                  selectedRegion === reg
                    ? 'bg-[#0E01B5] text-white shadow-xs'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {reg === 'all' ? 'All 10 Branches' : reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Depots Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredDepots.map((depot) => {
          const isSelected = depot.id === activeDepot.id;
          return (
            <div
              key={depot.id}
              className={`bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0E01B5] dark:border-[#8c82ff] ring-2 ring-[#0E01B5]/30 dark:ring-[#8c82ff]/30 shadow-lg'
                  : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">
                      {depot.name}
                    </h3>
                    <span className="text-xs text-[#0E01B5] dark:text-[#8c82ff] font-semibold">
                      {depot.region}
                    </span>
                  </div>
                  {depot.isCentralHub ? (
                    <span className="bg-[#0E01B5] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                      Central HQ
                    </span>
                  ) : (
                    <span className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                      Sub-Branch
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#F2693F] shrink-0 mt-0.5" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{depot.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff] shrink-0" />
                    <a href={`tel:${depot.phone.replace(/\s+/g, '')}`} className="font-bold text-gray-900 dark:text-white hover:underline">
                      {depot.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <a href={`mailto:${depot.email}`} className="text-gray-500 dark:text-gray-400 hover:underline truncate">
                      {depot.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-[11px] text-gray-600 dark:text-gray-300">{depot.hours}</span>
                  </div>

                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Branch Manager: </span>
                    {depot.manager}
                  </div>
                </div>

                {/* Coverage tags */}
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 block mb-1">
                    Assigned Coverage Towns:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {depot.coverageAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 dark:bg-[#25253d] text-gray-700 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-md font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => onSelectDepot(depot)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-[#0E01B5]/10 dark:bg-[#0E01B5]/30 hover:bg-[#0E01B5] hover:text-white text-[#0E01B5] dark:text-[#8c82ff]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Active Dispatch Branch (Selected)
                    </>
                  ) : (
                    'Set as My Preferred Branch'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Regional Delivery Schedule Table */}
      <div className="bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E01B5] dark:text-[#8c82ff]" />
          <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white">
            Weekly Wholesale Dispatch Schedule
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Our heavy distribution trucks operate scheduled multi-drop routes to guarantee predictable deliveries to your cellar. Order cut-off is 16:30 for next-day early morning drop-off.
        </p>

        <div className="overflow-x-auto pt-2 -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[620px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-[11px] uppercase font-bold">
                <th className="py-2.5 px-3">Route Zone</th>
                <th className="py-2.5 px-3">Dispatched From</th>
                <th className="py-2.5 px-3">Scheduled Days</th>
                <th className="py-2.5 px-3">Standard Lead Time</th>
                <th className="py-2.5 px-3">Emergency Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-gray-700 dark:text-gray-200">
              <tr>
                <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">Eldoret CBD, Pioneer & Rupa Mall</td>
                <td className="py-3 px-3">Jumbo House HQ</td>
                <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">Daily (Mon - Sat)</td>
                <td className="py-3 px-3">&lt; 3 Hours (Same Day)</td>
                <td className="py-3 px-3">Yes (Sunday included)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">Kimumu, Chepkoilel & Iten Road</td>
                <td className="py-3 px-3">Kimumu Depot</td>
                <td className="py-3 px-3">Daily (Mon - Sat)</td>
                <td className="py-3 px-3">&lt; 4 Hours</td>
                <td className="py-3 px-3">Available</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">Kapsowar, Iten & Elgeyo Marakwet</td>
                <td className="py-3 px-3">Kapsowar Depot</td>
                <td className="py-3 px-3">Mon, Wed, Fri & Sat</td>
                <td className="py-3 px-3">24 Hours</td>
                <td className="py-3 px-3">On-call dispatch</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">Nandi Hills, Kapsabet & Lessos</td>
                <td className="py-3 px-3">Nandi Hills Depot</td>
                <td className="py-3 px-3">Tue, Thu & Sat</td>
                <td className="py-3 px-3">24 Hours</td>
                <td className="py-3 px-3">Available</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">Turbo, Lugari & Western Gateway</td>
                <td className="py-3 px-3">Turbo Hub</td>
                <td className="py-3 px-3">Mon, Wed & Fri</td>
                <td className="py-3 px-3">24 Hours</td>
                <td className="py-3 px-3">Available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

