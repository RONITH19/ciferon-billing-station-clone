import React, { useState } from 'react';
import { useStore } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { offersSidebarSections } from './BookletsPage';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Trash2 } from 'lucide-react';

export const LoyaltyRedemptionPage: React.FC = () => {
  const { campaigns, deleteCampaign, addToast } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter campaigns of category 'redemption'
  const redemptions = campaigns.filter(
    (c) =>
      c.campaignCategory === 'redemption' &&
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Loyalty Reward/Redemption "${name}"?`)) {
      try {
        await deleteCampaign(id);
        addToast(`Loyalty Reward "${name}" deleted successfully`, 'success');
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to delete reward', 'error');
      }
    }
  };

  return (
    <div className="flex h-full animate-fade-in select-none">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-slate-50 h-[calc(100vh-60px)]">
        {/* Header with New Action */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Loyalty</h1>
            <p className="text-xs text-gray-500">Redemption</p>
          </div>
          <div>
            <Link
              to="/loyalty/redemption/new"
              className="inline-flex items-center gap-1 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New
            </Link>
          </div>
        </div>

        {redemptions.length > 0 ? (
          <>
            {/* Search Bar */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5 shadow-sm">
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-450" />
                <input
                  type="text"
                  placeholder="Search rewards"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-700"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Name</th>
                    <th className="px-6 py-3.5">Start Date</th>
                    <th className="px-6 py-3.5">End Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-850 font-medium">
                  {redemptions.map((red) => (
                    <tr key={red.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{red.name}</td>
                      <td className="px-6 py-4 text-gray-500">{red.startDate}</td>
                      <td className="px-6 py-4 text-gray-500">{red.endDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            red.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {red.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(red.id, red.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-250 text-gray-650 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="bg-white border border-gray-200 rounded-lg p-12 shadow-sm flex flex-col items-center justify-center text-center mt-6 min-h-[350px]">
            <div className="relative mb-6">
              <svg
                width="160"
                height="120"
                viewBox="0 0 160 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-100"
              >
                <rect x="35" y="45" width="90" height="65" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M35 55H125" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M55 45V38C55 35 58 32 62 32H98C102 32 105 35 105 38V45" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="108" cy="56" r="5" fill="#1e293b" />
                <path d="M106 61C102 65 96 72 96 79L108 92M108 61C112 65 116 75 116 83L114 92" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                <path d="M102 68C98 71 90 73 85 71" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <rect x="50" y="60" width="16" height="20" rx="2" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
                <rect x="75" y="65" width="16" height="20" rx="2" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
                <text x="58" y="75" fill="#3b82f6" fontSize="11" fontWeight="bold" fontFamily="sans-serif">X</text>
                <text x="83" y="80" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">?</text>
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-gray-800 mb-1.5">No records found.</h3>
            <p className="text-xs font-semibold text-gray-400 max-w-xs leading-relaxed">
              Check your filters or try creating a new record.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
