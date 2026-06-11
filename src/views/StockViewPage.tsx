import React, { useState } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { inventorySidebarSections } from './InventoryLandingPage';
import { useStore, StockItem } from '../store';
import { Search, Info } from 'lucide-react';

export const StockViewPage: React.FC = () => {
  const { stockItems, addToast } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchItem, setSearchItem] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Dropdown list options
  const categories = ['All', 'Tea And Snacks', 'Mandhi', 'Bar & Brewery', 'Favorite Pizza'];
  const departments = ['All', 'Kitchen', 'Bar', 'Store', 'Grocery'];

  // Filter stock data dynamically
  const filteredData = stockItems.filter((row) => {
    const matchesCategory = selectedCategory === 'All' || row.category === selectedCategory;
    const matchesSearch = !searchItem || row.name.toLowerCase().includes(searchItem.toLowerCase());
    const matchesDept = selectedDept === 'All' || (selectedDept === 'Bar' && row.category === 'Bar & Brewery') || (selectedDept === 'Kitchen' && row.category === 'Tea And Snacks');
    return matchesCategory && matchesSearch && matchesDept;
  });

  const handleViewItem = (item: StockItem) => {
    addToast(`Viewing stock details for ${item.name}`, 'info');
  };

  const columns: Column<StockItem>[] = [
    { header: 'Material Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Avg. Cost/Unit',
      render: (row) => (
        <span className="font-semibold text-gray-700">
          ₹{row.avgCostUnit.toFixed(2)}
        </span>
      )
    },
    { header: 'Available (P)', accessor: 'availableP' },
    { header: 'Available (S)', accessor: 'availableS' },
    { header: 'Alert', accessor: 'alert' },
    {
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => handleViewItem(row)}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-250 hover:bg-gray-50 text-gray-750 text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          <Info className="w-3.5 h-3.5 text-gray-400" />
          View
        </button>
      )
    }
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <PageHeader title="Stock view" subtitle="Check real-time stock balances and cost details" />

        {/* Main Split Layout */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Area - Filters and Table */}
          <div className="flex-grow xl:max-w-[calc(100%-300px)] flex flex-col gap-5">
            {/* Filter controls row */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm bg-gray-50/20">
              <div className="flex flex-col gap-1.5 flex-1">
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

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Item
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    placeholder="Search here"
                    className="w-full pl-9 pr-3 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <DataTable
              columns={columns}
              data={filteredData}
              searchable={false}
              itemsPerPage={10}
            />
          </div>

          {/* Right Area - Stock Dashboard Cards */}
          <div className="w-full xl:w-64 flex flex-col gap-4 flex-shrink-0">
            <h3 className="text-sm font-bold text-gray-800 tracking-wide select-none">
              Stock Dashboard
            </h3>

            {/* Total Low Stock Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-blue-600 tracking-tight">
                  5
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Low Stock Items
                </span>
              </div>
            </div>

            {/* Total Material Items Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-indigo-600 tracking-tight">
                  16
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  TOTAL MATERIAL ITEMS
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
