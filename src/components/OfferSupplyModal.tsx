import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Send, 
  Flame, 
  Droplets, 
  HeartHandshake, 
  Zap, 
  Wrench 
} from 'lucide-react';
import { MutualAidItem, AidCategory } from '../types';
import { soundFX } from '../utils/audio';

interface OfferSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOffer: (offer: Omit<MutualAidItem, 'id' | 'status' | 'nodeOriginId'>) => void;
  soundEnabled: boolean;
}

export const OfferSupplyModal: React.FC<OfferSupplyModalProps> = ({
  isOpen,
  onClose,
  onSubmitOffer,
  soundEnabled,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AidCategory>('WARMTH');
  const [quantity, setQuantity] = useState(20);
  const [unit, setUnit] = useState('blankets');
  const [offeredBy, setOfferedBy] = useState('Household Volunteer');
  const [sector, setSector] = useState('Sector 4 (Highland)');
  const [instructions, setInstructions] = useState('Leave on front porch. QR verification token required.');
  const [urgent, setUrgent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (soundEnabled) soundFX.playChirp(800, 0.1);

    onSubmitOffer({
      title: title.trim(),
      category,
      quantity,
      unit,
      offeredBy: offeredBy.trim(),
      sector,
      distanceKm: 0.4,
      urgent,
      instructions: instructions.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e121c] border border-blue-600/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#141824] border-b border-[#252c40] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-950 border border-blue-600/60 text-blue-400">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Offer Surplus Relief Supplies
              </h3>
              <p className="text-xs text-slate-400">
                Publishes available items to all local peer nodes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1c2235] hover:bg-[#252e47] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Resource Name / Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 20 Thermal Sleeping Bags &amp; Mats"
              className="w-full bg-[#0a0c14] border border-[#232b40] focus:border-blue-500 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AidCategory)}
                className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="WARMTH">Warmth &amp; Blankets</option>
                <option value="WATER">Drinking Water</option>
                <option value="FOOD">Food &amp; Rations</option>
                <option value="MEDICAL">Medical &amp; First Aid</option>
                <option value="POWER">Power &amp; Charging</option>
                <option value="TOOLS">Rescue Tools</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Sector:
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Sector 1 (Downtown)">Sector 1 (Downtown)</option>
                <option value="Sector 2 (Industrial)">Sector 2 (Industrial)</option>
                <option value="Sector 3 (Metro Core)">Sector 3 (Metro Core)</option>
                <option value="Sector 4 (Highland)">Sector 4 (Highland)</option>
                <option value="Sector 5 (Mission Ridge)">Sector 5 (Mission Ridge)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Quantity Available:
              </label>
              <input
                type="number"
                min="1"
                max="5000"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Unit of Measure:
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. blankets, liters, kits"
                className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Donor / Volunteer Organization Name:
            </label>
            <input
              type="text"
              required
              value={offeredBy}
              onChange={(e) => setOfferedBy(e.target.value)}
              placeholder="e.g. Sector 4 Volunteer Guild"
              className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Pickup Instructions:
            </label>
            <textarea
              required
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Where should recipients go, what should they bring?"
              className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg p-3 text-xs sm:text-sm text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgent"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="urgent" className="text-xs text-slate-300 font-semibold cursor-pointer">
              Mark as High Priority Need / Rapid Distribution
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1a2030] hover:bg-[#232b40] text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-950/50 hover:scale-102 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Publish to Mesh Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
