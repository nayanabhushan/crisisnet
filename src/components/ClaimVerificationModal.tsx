import React from 'react';
import { 
  X, 
  QrCode, 
  CheckCircle, 
  MapPin, 
  ShieldCheck, 
  Share2, 
  Copy, 
  Download,
  AlertCircle
} from 'lucide-react';
import { MutualAidItem } from '../types';
import { generateQRMatrix, generateVerificationHash } from '../utils/qrGenerator';

interface ClaimVerificationModalProps {
  item: MutualAidItem | null;
  onClose: () => void;
  onConfirmClaim: (item: MutualAidItem) => void;
  soundEnabled: boolean;
}

export const ClaimVerificationModal: React.FC<ClaimVerificationModalProps> = ({
  item,
  onClose,
  onConfirmClaim,
}) => {
  if (!item) return null;

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const verificationHash = generateVerificationHash(item.id, 'NODE-LOCAL-001', nowTime);
  const qrMatrix = generateQRMatrix(`${item.id}:${verificationHash}:NODE-LOCAL-001`);

  const handleConfirm = () => {
    onConfirmClaim(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e111a] border border-[#2b354d] rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#141926] border-b border-[#242e45] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-950 border border-blue-600/50 text-blue-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Relief Package Trust Token
              </h3>
              <p className="text-xs text-slate-400">
                Offline P2P Verification (Prevents Double-Claiming)
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

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Claimed Item Summary */}
          <div className="p-3.5 rounded-xl bg-[#131724] border border-[#20293d]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">
                {item.category} • {item.sector}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {item.distanceKm} km away
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-emerald-400 font-semibold">
              <span>Quantity Reserved: {item.quantity} {item.unit}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              <span className="font-semibold text-slate-300">Offered By:</span> {item.offeredBy}
            </p>
          </div>

          {/* QR Code Container with High-Contrast Scanning Matrix */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#08090f] border border-[#1b2234]">
            <div className="bg-white p-3 rounded-xl shadow-lg border-2 border-slate-300">
              {/* Render 21x21 QR Grid */}
              <div 
                className="grid gap-[2px]" 
                style={{ 
                  gridTemplateColumns: `repeat(${qrMatrix.length}, minmax(0, 1fr))`,
                  width: '168px',
                  height: '168px',
                }}
              >
                {qrMatrix.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`${cell ? 'bg-black' : 'bg-white'} rounded-[0.5px]`}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Cryptographic Hash Badge */}
            <div className="mt-3 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">
                Offline Mesh Verification Token
              </span>
              <div className="mt-0.5 px-3 py-1 rounded bg-[#161c2c] border border-cyan-800/60 font-mono font-black text-sm text-cyan-300 tracking-wider">
                {verificationHash}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-2 max-w-xs">
              Present this token to the volunteer at pickup. Inventory counter decrements locally via BLE sync.
            </p>
          </div>

          {/* Instructions and Pickup Protocol */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Pickup Protocol:</span>
              <p className="text-[11px] text-amber-300/90 mt-0.5">
                {item.instructions}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#121622] border-t border-[#1e263a] px-5 py-3.5 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1b2030] hover:bg-[#252c42] text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 transition-all hover:scale-102 active:scale-95"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm &amp; Save QR Token</span>
          </button>
        </div>
      </div>
    </div>
  );
};
