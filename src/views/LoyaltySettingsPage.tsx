import React, { useState, useEffect } from 'react';
import { useStore, LoyaltySetting } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { offersSidebarSections } from './BookletsPage';
import { PageHeader } from '../components/PageHeader';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LoyaltySettingsPage: React.FC = () => {
  const { loyaltySetting, updateLoyaltySetting, addToast } = useStore();
  const navigate = useNavigate();

  // Form local state
  const [programName, setProgramName] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [pointsPerRupee, setPointsPerRupee] = useState(0);
  const [pointsPerRupeeBirthday, setPointsPerRupeeBirthday] = useState(0);
  const [pointsPerRupeeAnniversary, setPointsPerRupeeAnniversary] = useState(0);
  const [rupeesPerPoint, setRupeesPerPoint] = useState(0);
  const [minPointsForReward, setMinPointsForReward] = useState(0);
  const [maxPointsRedeemPercent, setMaxPointsRedeemPercent] = useState(0);
  const [expiryDays, setExpiryDays] = useState(0);
  const [askOtpOnRedemption, setAskOtpOnRedemption] = useState(false);
  const [enablePointsOnOrderTotal, setEnablePointsOnOrderTotal] = useState(false);
  const [allowOfferLoyaltyTogether, setAllowOfferLoyaltyTogether] = useState(false);

  // Sync state on load
  useEffect(() => {
    if (loyaltySetting) {
      setProgramName(loyaltySetting.programName);
      setEnabled(loyaltySetting.enabled);
      setPointsPerRupee(loyaltySetting.pointsPerRupee);
      setPointsPerRupeeBirthday(loyaltySetting.pointsPerRupeeBirthday);
      setPointsPerRupeeAnniversary(loyaltySetting.pointsPerRupeeAnniversary);
      setRupeesPerPoint(loyaltySetting.rupeesPerPoint);
      setMinPointsForReward(loyaltySetting.minPointsForReward);
      setMaxPointsRedeemPercent(loyaltySetting.maxPointsRedeemPercent);
      setExpiryDays(loyaltySetting.expiryDays);
      setAskOtpOnRedemption(loyaltySetting.askOtpOnRedemption);
      setEnablePointsOnOrderTotal(loyaltySetting.enablePointsOnOrderTotal);
      setAllowOfferLoyaltyTogether(loyaltySetting.allowOfferLoyaltyTogether);
    }
  }, [loyaltySetting]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programName.trim()) {
      addToast('Program Name is required', 'warning');
      return;
    }

    updateLoyaltySetting({
      programName: programName.trim(),
      enabled,
      pointsPerRupee,
      pointsPerRupeeBirthday,
      pointsPerRupeeAnniversary,
      rupeesPerPoint,
      minPointsForReward,
      maxPointsRedeemPercent,
      expiryDays,
      askOtpOnRedemption,
      enablePointsOnOrderTotal,
      allowOfferLoyaltyTogether,
    });

    addToast('Loyalty settings saved successfully', 'success');
  };

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <form onSubmit={handleSave}>
          <PageHeader title="Loyalty Setting" subtitle="Configure loyalty multiplier levels and rewards">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </PageHeader>

          {/* 4-column card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            {/* Card 1: Basic details */}
            <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
                Basic Details
              </h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Program Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="enabled" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                  Enable Program
                </label>
              </div>
            </div>

            {/* Card 2: Points Multiplier */}
            <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
                Basic Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Points per Rupee
                </label>
                <input
                  type="number"
                  value={pointsPerRupee || ''}
                  onChange={(e) => setPointsPerRupee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                  Example: 1 Rupees = 10 points
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Points per Rupee (Birthday)
                </label>
                <input
                  type="number"
                  value={pointsPerRupeeBirthday || ''}
                  onChange={(e) => setPointsPerRupeeBirthday(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Points per Rupee (Anniversary)
                </label>
                <input
                  type="number"
                  value={pointsPerRupeeAnniversary || ''}
                  onChange={(e) => setPointsPerRupeeAnniversary(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Card 3: Redemption parameters */}
            <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
                Basic Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Discount per Point (Rupees)
                </label>
                <input
                  type="number"
                  value={rupeesPerPoint || ''}
                  onChange={(e) => setRupeesPerPoint(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                  Example: 1 Point = 10 Rupees
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Min Points for Redemption
                </label>
                <input
                  type="number"
                  value={minPointsForReward || ''}
                  onChange={(e) => setMinPointsForReward(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Max Points Redeemable (%)
                </label>
                <input
                  type="number"
                  value={maxPointsRedeemPercent || ''}
                  onChange={(e) => setMaxPointsRedeemPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Card 4: Validity & Controls */}
            <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
                Basic Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Expiry In Days
                </label>
                <input
                  type="number"
                  value={expiryDays || ''}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                  Example: Customer points expire in 365 days
                </span>
              </div>

              <div className="flex flex-col gap-3 mt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="askOtpOnRedemption"
                    checked={askOtpOnRedemption}
                    onChange={(e) => setAskOtpOnRedemption(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="askOtpOnRedemption" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                    Ask for OTP on redemption
                  </label>
                </div>

                {/* Highlighted Blue Card Checkbox */}
                <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                  <input
                    type="checkbox"
                    id="enablePointsOnOrderTotal"
                    checked={enablePointsOnOrderTotal}
                    onChange={(e) => setEnablePointsOnOrderTotal(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-600 border-blue-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="enablePointsOnOrderTotal" className="text-xs font-bold text-blue-700 cursor-pointer select-none">
                    Enable points on order total
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowOfferLoyaltyTogether"
                    checked={allowOfferLoyaltyTogether}
                    onChange={(e) => setAllowOfferLoyaltyTogether(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="allowOfferLoyaltyTogether" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                    Allow Offer Loyalty Together
                  </label>
                </div>
              </div>
            </div>

          </div>
        </form>
      </main>
    </div>
  );
};
