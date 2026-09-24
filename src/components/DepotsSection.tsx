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
  ChevronRight,
  Route,
  Store,
  Landmark,
  Headphones
} from 'lucide-react';
import { Depot } from '../types';

interface RouteScheduleRow {
  day: string;
  flax: string;
  kapsabet: string;
  kapsowar: string;
}

interface RouteLine {
  name: string;
  phone: string;
  till: string;
  sites: string[];
}

const ROUTE_SCHEDULE: RouteScheduleRow[] = [
  { day: 'Monday', flax: 'Kapkoi / Iten', kapsabet: 'Sellia', kapsowar: 'Kapsowar Route' },
  { day: 'Tuesday', flax: 'Flax Route', kapsabet: 'Kapsabet Route', kapsowar: 'Misembe' },
  { day: 'Wednesday', flax: 'Burnt Forest Route', kapsabet: 'Lessos / Himaki / Kipsigak / Kaptumo', kapsowar: 'Matunda / Moisbridge' },
  { day: 'Thursday', flax: 'Chemaluk / Koshin / Ilula / Kesses / Moi', kapsabet: 'Kapsabet / Nandi Hills', kapsowar: 'Kapcherop / Moiben' },
  { day: 'Friday', flax: 'Burnt Route', kapsabet: 'Sellia', kapsowar: 'Kapsowar Route' },
  { day: 'Saturday', flax: 'Flax Route', kapsabet: 'Kapsabet Route', kapsowar: 'Misembe' },
  { day: 'Sunday', flax: 'Annex / Kesses / Moi', kapsabet: 'Lessos / Himaki / Kipsigak / Kaptumo', kapsowar: 'Matunda / Moisbridge' },
];

const ROUTE_LINES: RouteLine[] = [
  { name: 'Eldoret CBD', phone: '0181674419', till: '3283447', sites: ['Eldoret CBD', 'Annex', 'Elgon View', 'Kapsoya', 'Ilula', 'Kipkorgot'] },
  { name: 'Annex / Roady Route', phone: '0795426770', till: '9391895', sites: ['Eldoret Main Stage', 'Eastleigh', 'Kokwas', 'West Indies', 'West Market', 'Mwanzo', 'Hurum', 'Roady', 'Maili Nne', 'Baharini'] },
  { name: 'Kimumu Route', phone: '0746560473', till: '5170669', sites: ['Eldoret Iten Stage', 'Wagon', 'Railway', 'Talex', 'Subaru', 'Jerusalem', 'Hawaii', 'Munyaka', 'Kimumu', 'Sogomo', 'Kuinet', 'Chepkanga'] },
  { name: 'Langas Route', phone: '0795363253', till: '5600201', sites: ['Pioneer', 'Rivertex', 'Teleview', 'Kona / Kisumu Ndogo', 'Chinese', 'Kapseret'] },
  { name: 'Flax Route', phone: '0702426770', till: '5170673', sites: ['Kapkoi', 'Iten', 'Flax', 'Burnt Forest', 'Chemaluk', 'Koshin', 'Ilula', 'Kesses', 'Moi'] },
  { name: 'Kapsabet Route', phone: '0782302586', till: '5600195', sites: ['Selia', 'Kapsabet', 'Lessos', 'Himaki', 'Kipsigak', 'Kaptumo', 'Nandi Hills'] },
  { name: 'Kapsowar Route', phone: '0746426770', till: '8469578', sites: ['Kapsowar', 'Misembe', 'Matunda', 'Moisbridge', 'Kapcherop', 'Moiben'] },
  { name: 'Webuye Route', phone: '0118829893', till: '8469574', sites: ['Misikhu', 'Kamukuywa', 'Mukuiyoni', 'Nabingenge', 'Naitiri', 'Tongaren', 'Bregedia', 'Mayanja', 'Sikusi', 'Chwele', 'Kugwa', 'Kamiti', 'Maliki', 'Sikhindu', 'Lugulu', 'Webuye', 'Namwela', 'Sisrisia', 'Tulienge', 'Cheptais', 'Lwendanyi', 'Luakhakha', 'Changara', 'Malikisi'] },
  { name: 'Bungoma Van', phone: '0118829889', till: '3299367', sites: ['Kanduyi', 'Kimaeti', 'Kocholia', 'Malaba', 'Machugusi', 'Bumula', 'Meteka', 'Bokoli', 'Bukembe', 'Harambee', 'Mayoni', 'Ogalo', 'Murumba', 'Siandu', 'Marachi', 'Bao-Bel', 'Bumala', 'Matuyo', 'CBD', 'Sikendu', 'Kuywa', 'Kimilili', 'Matili', 'Misikhu', 'Webuye'] },
  { name: 'Bungoma Route', phone: '0118829880', till: '8718068', sites: ['Bukembe', 'Webuye', 'Chimoi', 'Lwandeti', 'Muturi', 'Matete', 'Malava', 'Butali', 'Kambiya Mwanza', 'West Kenya', 'Kanduyi', 'Mayanja', 'Kibuke', 'Kimwanga', 'Kimaeti', 'Myianga', 'Lunao', 'Mabusi', 'Munyore', 'Muyofu', 'Mungore', 'Kabula', 'Harambe', 'Mayoni', 'Mumias', 'Sienda', 'Ekero', 'Malaach', 'Musemba', 'Sangalo', 'Musigoma', 'Bogoli', 'Kuywa', 'Kimilili', 'Matili', 'Misikhu', 'Webuye'] },
];

const SHOP_LINES: RouteLine[] = [
  { name: 'General Shop', phone: '0707333999', till: '5170671', sites: ['Eldoret Iten Stage'] },
  { name: 'Main Shop', phone: '0790986580', till: '8469580', sites: ['Eldoret Trocadero / Opp Ola'] },
  { name: 'Trocadero Shop', phone: '0737646305', till: '5600197', sites: ['Eldoret Next to Bata Trocadero'] },
  { name: 'Highlands Shop', phone: '0753320000', till: '8748716', sites: ['Eldoret Highlands Mall'] },
  { name: 'Iten Shop', phone: '0712326099', till: '5170667', sites: ['Iten Town'] },
  { name: 'Bungoma Shop', phone: '0784147253', till: '8469576', sites: ['Bungoma Jogoo Round About'] },
  { name: 'Online Shop', phone: '0754320000', till: '9393697', sites: ['Eldoret Iten Stage'] },
];

const CARE_LINES: RouteLine[] = [
  { name: 'Customer Care', phone: '0118829894', till: '', sites: ['For delivery and customer care'] },
];

const MAX_SITES_PER_CARD = 15;

const RouteCard: React.FC<{ line: RouteLine }> = ({ line }) => (
  <div className="bg-gray-50 dark:bg-[#25253d] rounded-xl border border-gray-200 dark:border-white/10 p-4 flex flex-col gap-3 hover:border-[#0E01B5]/40 dark:hover:border-[#8c82ff]/40 hover:shadow-md transition-all">
    <div>
      <h3 className="font-extrabold text-[15px] text-gray-900 dark:text-white leading-tight tracking-tight">{line.name}</h3>
    </div>
    <div className="space-y-1.5">
      <a
        href={`tel:${line.phone}`}
        className="inline-flex items-center gap-1.5 font-bold text-sm text-[#0E01B5] dark:text-[#8c82ff] hover:underline"
      >
        <Phone className="w-3.5 h-3.5" />
        {line.phone}
      </a>
      {line.till && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
          <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Till No: {line.till}
        </div>
      )}
    </div>
    <div className="pt-2 mt-auto border-t border-gray-200 dark:border-white/10 flex flex-wrap gap-1">
      {line.sites.map((site, idx) => (
        <span
          key={idx}
          className="bg-gray-100 dark:bg-[#171728] text-gray-900 dark:text-white text-[10px] px-2 py-0.5 rounded-md font-bold"
        >
          {site}
        </span>
      ))}
    </div>
  </div>
);

const RouteCards: React.FC<{ line: RouteLine }> = ({ line }) => {
  const parts = splitRouteLine(line);
  if (parts.length === 1) {
    return <RouteCard line={parts[0]} />;
  }
  return (
    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      {parts.map((part, idx) => (
        <RouteCard key={idx} line={part} />
      ))}
    </div>
  );
};

const splitRouteLine = (line: RouteLine): RouteLine[] => {
  if (line.sites.length <= MAX_SITES_PER_CARD) return [line];
  const mid = Math.ceil(line.sites.length / 2);
  return [
    { ...line, sites: line.sites.slice(0, mid) },
    { ...line, sites: line.sites.slice(mid) },
  ];
};

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
      {/* Commented out for now
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
      */}

      {/* Retail Shops & Stores */}
      <div className="bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E01B5] dark:text-[#8c82ff]" />
          <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white">
            Retail Shops & Stores
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Walk-in Bessich retail shops across Eldoret, Iten and Bungoma. Pay via the listed M-Pesa till number.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
          {SHOP_LINES.map((line) => (
            <RouteCard key={line.name} line={line} />
          ))}
        </div>
      </div>

      {/* Delivery Routes & Coverage */}
      <div className="bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E01B5] dark:text-[#8c82ff]" />
          <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white">
            Delivery Routes & Coverage
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Scheduled delivery routes with dedicated phone lines and M-Pesa till numbers. Tap a number to call.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
          {ROUTE_LINES.map((line) => (
            <RouteCards key={line.name} line={line} />
          ))}
        </div>
      </div>

      {/* Customer Care */}
      <div className="bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E01B5] dark:text-[#8c82ff]" />
          <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white">
            Customer Care
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          For delivery and customer care enquiries.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
          {CARE_LINES.map((line) => (
            <RouteCard key={line.name} line={line} />
          ))}
        </div>
      </div>

      {/* Weekly Route Schedule Table */}
      <div className="bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E01B5] dark:text-[#8c82ff]" />
          <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white">
            Weekly Route Delivery Schedule
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Our heavy distribution trucks operate scheduled multi-drop routes to guarantee predictable deliveries to your cellar. Order cut-off is 16:30 for next-day early morning drop-off.
        </p>

        <div className="overflow-x-auto pt-2 -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-[11px] uppercase font-bold">
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3">Flax Route</th>
                <th className="py-2.5 px-3">Kapsabet Route</th>
                <th className="py-2.5 px-3">Kapsowar Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-gray-700 dark:text-gray-200">
              {ROUTE_SCHEDULE.map((row) => (
                <tr key={row.day}>
                  <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">{row.day}</td>
                  <td className="py-3 px-3">{row.flax}</td>
                  <td className="py-3 px-3">{row.kapsabet}</td>
                  <td className="py-3 px-3">{row.kapsowar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

