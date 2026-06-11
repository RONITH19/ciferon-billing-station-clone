import React, { useState } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { inventorySidebarSections } from './InventoryLandingPage';
import { useStore, InventoryOverride } from '../store';
import { Edit, X, Search } from 'lucide-react';

export const InventoryOverridesPage: React.FC = () => {
  const { inventoryOverrides, updateInventoryOverrideMinStock, addToast } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchItem, setSearchItem] = useState('');
  const [selectedOverride, setSelectedOverride] = useState<InventoryOverride | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [minStockVal, setMinStockVal] = useState('');

  // Extract unique categories for the dropdown filter
  const categories = ['All', 'Tea And Snacks', 'Mandhi', 'Bar & Brewery', 'Favorite Pizza'];

  const filteredData = inventoryOverrides.filter((row) => {
    const matchesCategory = selectedCategory === 'All' || row.category === selectedCategory;
    const matchesSearch = !searchItem || row.name.toLowerCase().includes(searchItem.toLowerCase()) || row.code.toLowerCase().includes(searchItem.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openEditModal = (row: InventoryOverride) => {
    setSelectedOverride(row);
    setMinStockVal(row.minStock === '--' ? '' : row.minStock);
    setIsEditOpen(true);
  };

  const handleSaveMinStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOverride) return;

    const finalVal = minStockVal.trim() === '' ? '--' : minStockVal.trim();
    updateInventoryOverrideMinStock(selectedOverride.id, finalVal);
    addToast(`Updated Min Stock for ${selectedOverride.name}`, 'success');
    setIsEditOpen(false);
  };

  const columns: Column<InventoryOverride>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Min Stock',
      render: (row) => (
        <span className={`font-semibold ${row.minStock !== '--' ? 'text-blue-600' : 'text-gray-400'}`}>
          {row.minStock}
        </span>
      )
    },
    {
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => openEditModal(row)}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </button>
      )
    }
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <PageHeader
          title="Inventory Overrides"
          subtitle="Set warning limits and trigger automatic indents/purchase orders"
        />

        {/* Dropdown Filters Selector Row */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 flex flex-col md:flex-row items-end gap-4 shadow-sm bg-gray-50/20">
          <div className="flex flex-col gap-1.5 w-full md:w-64">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 w-full md:w-72">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Item
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                placeholder="Search item name or code..."
                className="w-full pl-9 pr-3 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Overrides Table */}
        <DataTable
          columns={columns}
          data={filteredData}
          searchable={false} // Custom filter above is more granular
          itemsPerPage={10}
        />

        {/* Edit Min Stock Modal */}
        {isEditOpen && selectedOverride && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden border border-gray-100 animate-scale-up">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-150 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm">
                  Override Min Stock Limit
                </h3>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1.5 hover:bg-gray-150/70 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveMinStock} className="p-5 flex flex-col gap-4">
                <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 leading-relaxed mb-1">
                  Item: <span className="font-bold">{selectedOverride.name}</span><br />
                  Category: <span className="font-semibold">{selectedOverride.category}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Min Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={minStockVal}
                    onChange={(e) => setMinStockVal(e.target.value)}
                    placeholder="Enter min stock count (e.g. 10)"
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-800"
                  />
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">
                    Leave blank or clear to reset to default/no override threshold.
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-3 justify-end mt-2 pt-4 border-t border-gray-150">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
                  >
                    Save limit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
