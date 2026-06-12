import React, { useState } from 'react';
import { useStore } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { offersSidebarSections } from './BookletsPage';
import { PageHeader } from '../components/PageHeader';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Edit2, Trash2, Plus } from 'lucide-react';

export const OffersQRListPage: React.FC = () => {
  const { offerQRs, deleteOfferQR, addToast } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQRs = offerQRs.filter((qr) =>
    qr.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Offer QR "${name}"?`)) {
      try {
        await deleteOfferQR(id);
        addToast(`Offer QR "${name}" deleted successfully`, 'success');
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to delete Offer QR', 'error');
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
            <h1 className="text-xl font-bold text-gray-800">Offers</h1>
            <p className="text-xs text-gray-500">Offer QR</p>
          </div>
          <div>
            <Link
              to="/offers/qr/new"
              className="inline-flex items-center gap-1 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-450" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-700"
            />
          </div>
        </div>

        {/* DataTable / Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-850 font-medium">
              {filteredQRs.length > 0 ? (
                filteredQRs.map((qr) => (
                  <tr key={qr.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{qr.name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/offers/qr/edit/${qr.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-250 text-gray-650 hover:bg-gray-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(qr.id, qr.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-250 text-gray-650 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
