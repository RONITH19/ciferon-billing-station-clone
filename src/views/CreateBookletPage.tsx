import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { offersSidebarSections } from './BookletsPage';
import { ArrowLeft } from 'lucide-react';

export const CreateBookletPage: React.FC = () => {
  const { campaigns, addBooklet, addToast } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [redemptionInterval, setRedemptionInterval] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState('');
  const [amount, setAmount] = useState(0);

  // Filter campaigns that are of type 'offer'
  const offersList = campaigns.filter((c) => c.campaignCategory === 'offer');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name is required', 'warning');
      return;
    }
    if (!selectedOffer) {
      addToast('Please select an offer', 'warning');
      return;
    }

    try {
      await addBooklet({
        name: name.trim(),
        redemptionInterval,
        isActive,
        offers: selectedOffer,
        amount,
      });
      addToast(`Offer group "${name}" created successfully`, 'success');
      navigate('/offers/bookletlist');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to create offer group', 'error');
    }
  };

  return (
    <div className="flex h-full animate-fade-in select-none">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-slate-50 h-[calc(100vh-60px)]">
        {/* Header with back/save actions */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Offers</h1>
            <p className="text-xs text-gray-500">Create New Offer Group</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/offers/bookletlist"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Link>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-md shadow-blue-100 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="max-w-5xl flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-750 border-b border-gray-100 pb-2.5">
              Offer details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Left Group */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                    className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all font-medium text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Offers<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedOffer}
                    onChange={(e) => setSelectedOffer(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-800 cursor-pointer"
                  >
                    <option value="">Select an option...</option>
                    {offersList.map((off) => (
                      <option key={off.id} value={off.name}>
                        {off.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Group */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Offer Redemption Interval
                  </label>
                  <input
                    type="number"
                    value={redemptionInterval}
                    onChange={(e) => setRedemptionInterval(Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all font-medium text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Amount<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all font-medium text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Active Checkbox Card */}
            <div className="mt-2 border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <span className="text-sm font-bold text-gray-700">Active</span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer border-gray-300"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
