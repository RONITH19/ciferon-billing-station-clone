import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { offersSidebarSections } from './BookletsPage';
import { ArrowLeft, Calendar } from 'lucide-react';
import { apiList } from '../../lib/api-client';

export const CreateLoyaltyPlanPage: React.FC = () => {
  const { addCampaign, addToast } = useStore();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);

  const [startDate, setStartDate] = useState('2026-06-12');
  const [endDate, setEndDate] = useState('2026-06-12');
  const [startingFrom, setStartingFrom] = useState('12:00 AM');
  const [endingAt, setEndingAt] = useState('11:59 PM');
  const [activeDays, setActiveDays] = useState<string[]>(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [isAllItems, setIsAllItems] = useState(false);

  // Load categories and items on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await apiList<any>('categories');
        const its = await apiList<any>('items');
        setCategories(cats);
        setItems(its);
      } catch (err) {
        console.error('Failed to fetch categories/items:', err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name is required', 'warning');
      return;
    }

    try {
      await addCampaign({
        campaignCategory: 'loyalty_plan',
        name: name.trim(),
        description: description.trim(),
        promocode: '',
        type: 'Loyalty Plan',
        startDate,
        endDate,
        isActive,
        startingFrom,
        endingAt,
        applicableDays: activeDays.join(','),
        categoryLimit: selectedCategory,
        itemLimit: isAllItems ? 'All' : selectedItem,
      });
      addToast(`Loyalty Plan "${name}" created successfully`, 'success');
      navigate('/loyalty/plans');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to create loyalty plan', 'error');
    }
  };

  const toggleDay = (day: string) => {
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter((d) => d !== day));
    } else {
      setActiveDays([...activeDays, day]);
    }
  };

  const selectAllDays = () => {
    setActiveDays(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  };

  return (
    <div className="flex h-full animate-fade-in select-none">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-slate-50 h-[calc(100vh-60px)]">
        {/* Header with back/save actions */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Loyalty</h1>
            <p className="text-xs text-gray-500">Add New Loyalty Plan</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/loyalty/plans"
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

        <form onSubmit={handleSave} className="max-w-7xl flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left Columns: Form Fields */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <h2 className="text-base font-bold text-gray-800">Add New Campaign</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* General Details Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-750 border-b border-gray-100 pb-2.5">
                    General Details
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      Name of Offer<span className="text-red-500">*</span>
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
                      Offer Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Offer Description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all font-medium text-gray-800"
                    />
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-gray-700">Active</span>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer border-gray-300"
                    />
                  </div>
                </div>

                {/* Offer Duration Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-750 border-b border-gray-100 pb-2.5">
                    Offer Duration
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs outline-none focus:border-blue-500 bg-white font-semibold text-gray-750 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs outline-none focus:border-blue-500 bg-white font-semibold text-gray-750 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">
                        Starting From
                      </label>
                      <select
                        value={startingFrom}
                        onChange={(e) => setStartingFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-500 font-semibold cursor-pointer"
                      >
                        <option value="12:00 AM">12:00 AM</option>
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">
                        Ending At
                      </label>
                      <select
                        value={endingAt}
                        onChange={(e) => setEndingAt(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-500 font-semibold cursor-pointer"
                      >
                        <option value="11:59 PM">11:59 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-2">
                      Applicable on days
                    </label>
                    <div className="flex flex-wrap items-center gap-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                        const isDaySelected = activeDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-2 py-1 text-[10px] font-bold border rounded-md transition-colors cursor-pointer ${
                              isDaySelected
                                ? 'bg-blue-50 text-blue-600 border-blue-300'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={selectAllDays}
                        className="px-2 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors ml-1 cursor-pointer"
                      >
                        Select All
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom selection filters */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Select Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={isAllItems}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-500 font-semibold cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Search here</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Select Item
                  </label>
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    disabled={isAllItems}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-500 font-semibold cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Search here</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.name}>
                        {i.displayName || i.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAllItems(!isAllItems);
                    if (!isAllItems) {
                      setSelectedCategory('');
                      setSelectedItem('');
                    }
                  }}
                  className={`px-4 py-2 border text-xs font-bold rounded-lg transition-colors cursor-pointer h-[38px] ${
                    isAllItems
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-250 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Right Column: Campaign Summary Card */}
            <div className="bg-[#ecf3fa] border border-[#d2e2f3] rounded-lg p-5 shadow-sm flex flex-col gap-4 select-none">
              <h4 className="text-sm font-bold text-blue-800 border-b border-blue-200 pb-2">
                Campaign Summary
              </h4>
              <div className="flex flex-col gap-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-0.5">
                    Campaign Name
                  </span>
                  <span className="font-bold text-gray-800 truncate block">
                    {name || '--'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-0.5">
                    Campaign Promocode
                  </span>
                  <span className="font-bold text-gray-800 truncate block">
                    --
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-0.5">
                    Campaign Description
                  </span>
                  <span className="font-medium text-gray-600 block line-clamp-2">
                    {description || '--'}
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-0.5">
                    Duration
                  </span>
                  <span className="font-extrabold text-blue-900 block">
                    {startDate === endDate ? startDate : `${startDate} to ${endDate}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
