import React, { useState } from 'react';
import { 
  Package, 
  Droplets, 
  Flame, 
  HeartHandshake, 
  Zap, 
  Wrench, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  PlusCircle, 
  Search, 
  Clock, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { MutualAidItem, AidCategory } from '../types';
import { ClaimVerificationModal } from './ClaimVerificationModal';
import { soundFX } from '../utils/audio';
import confetti from 'canvas-confetti';

interface MutualAidMarketplaceProps {
  aidItems: MutualAidItem[];
  onClaimItem: (itemId: string, token: string) => void;
  onOpenOfferModal: () => void;
  soundEnabled: boolean;
}

export const MutualAidMarketplace: React.FC<MutualAidMarketplaceProps> = ({
  aidItems,
  onClaimItem,
  onOpenOfferModal,
  soundEnabled,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AidCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeClaimItem, setActiveClaimItem] = useState<MutualAidItem | null>(null);

  const getCategoryIcon = (category: AidCategory) => {
    switch (category) {
      case 'WARMTH':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'WATER':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'FOOD':
        return <Package className="w-4 h-4 text-amber-400" />;
      case 'MEDICAL':
        return <HeartHandshake className="w-4 h-4 text-red-400" />;
      case 'POWER':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'TOOLS':
        return <Wrench className="w-4 h-4 text-purple-400" />;
    }
  };

  const filteredItems = aidItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.offeredBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleOpenClaimModal = (item: MutualAidItem) => {
    if (soundEnabled) soundFX.playChirp(700, 0.08);
    setActiveClaimItem(item);
  };

  const handleConfirmClaim = (item: MutualAidItem) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const token = `CN-TOKEN-${Date.now().toString().slice(-6)}`;
    onClaimItem(item.id, token);
    setActiveClaimItem(null);

    if (soundEnabled) soundFX.playChirp(900, 0.15);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {}
  };

  return (
    <div className="space-y-4">
      {/* Mutual Aid Banner */}
      <div className="bg-[#10141f] border border-[#1f283d] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-950/80 border border-blue-500/60 rounded-xl text-blue-400">
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                P2P Community Inventory
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Decentralized Sync
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Mutual Aid Marketplace (Offer &amp; Claim)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Share surplus disaster resources without internet. Cryptographic QR tokens prevent double-claiming.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenOfferModal}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-950/50 hover:scale-102 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Offer Surplus Supplies</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#11141d] border border-[#1e2538] rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search supplies by item, donor, or sector..."
            className="w-full bg-[#0a0c12] border border-[#232b40] focus:border-blue-500 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'ALL', label: 'All Items' },
              { id: 'WARMTH', label: 'Warmth' },
              { id: 'WATER', label: 'Water' },
              { id: 'FOOD', label: 'Food & MRE' },
              { id: 'MEDICAL', label: 'Medical' },
              { id: 'POWER', label: 'Charging' },
              { id: 'TOOLS', label: 'Tools' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'bg-[#181d2a] text-slate-400 hover:text-white border border-[#242c42]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Supplies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredItems.map((item) => {
          const isClaimed = item.status === 'CLAIMED';

          return (
            <div
              key={item.id}
              className={`relative bg-[#10131d] border rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all ${
                isClaimed
                  ? 'border-[#1e2538] opacity-70 bg-[#0d0f17]'
                  : item.urgent
                  ? 'border-amber-600/60 shadow-md shadow-amber-950/20'
                  : 'border-[#1f2639] hover:border-[#354366]'
              }`}
            >
              <div>
                {/* Header: Category, Sector, Distance */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#181e2e] border border-[#26314c]">
                      {getCategoryIcon(item.category)}
                    </span>
                    <span className="font-mono font-bold text-cyan-400 uppercase">
                      {item.sector}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.urgent && (
                      <span className="px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 text-[10px] font-bold border border-amber-600/50">
                        HIGH NEED
                      </span>
                    )}
                    <span className="text-slate-400 font-mono text-[11px]">
                      {item.distanceKm} km away
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-2.5">
                  {item.title}
                </h3>

                {/* Available Quantity */}
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                    {item.quantity}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {item.unit} available
                  </span>
                </div>

                {/* Donor / Source info */}
                <p className="text-xs text-slate-400 mt-2">
                  <span className="text-slate-500">Offered by:</span>{' '}
                  <span className="text-slate-300 font-semibold">{item.offeredBy}</span>
                </p>

                {/* Instructions */}
                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-[#0c0e15] p-2.5 rounded-lg border border-[#181e2b]">
                  {item.instructions}
                </p>
              </div>

              {/* Card Footer: Status / Claim Action */}
              <div className="mt-4 pt-3 border-t border-[#1a2133] flex items-center justify-between gap-3">
                <div className="text-[11px] font-mono text-slate-500">
                  Origin: {item.nodeOriginId}
                </div>

                {isClaimed ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-600/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Claimed &amp; Verified</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenClaimModal(item)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/40 hover:scale-102 active:scale-95"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Claim / Request Nav</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Token Verification Modal */}
      {activeClaimItem && (
        <ClaimVerificationModal
          item={activeClaimItem}
          onClose={() => setActiveClaimItem(null)}
          onConfirmClaim={handleConfirmClaim}
          soundEnabled={soundEnabled}
        />
      )}
    </div>
  );
};
