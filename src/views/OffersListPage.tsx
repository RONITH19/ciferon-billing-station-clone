import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { offersSidebarSections } from './BookletsPage';
import { ArrowLeft, Plus, Calendar, Send, Check } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  promocode: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
}

// STANDALONE CUSTOM CALENDAR COMPONENT
const CalendarPicker: React.FC<{
  selectedDate: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}> = ({ selectedDate, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentYear, currentMonth, i));
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-[1050] select-none"
    >
      <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors text-xs font-bold"
        >
          &larr;
        </button>
        <span className="text-xs font-bold text-gray-800">
          {months[currentMonth]} {currentYear}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors text-xs font-bold"
        >
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[9px] font-bold text-gray-400 mb-1.5">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="w-8 h-8" />;
          const isSelected =
            day.getDate() === selectedDate.getDate() &&
            day.getMonth() === selectedDate.getMonth() &&
            day.getFullYear() === selectedDate.getFullYear();
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(day);
                onClose();
              }}
              className={`w-7 h-7 text-xs flex items-center justify-center rounded-lg transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-200'
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const OffersListPage: React.FC = () => {
  const { addToast } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Summer general discount',
      promocode: 'SUMMER20',
      type: 'GENERAL DISCOUNT',
      startDate: '10-Jun-2026',
      endDate: '30-Jun-2026',
      status: 'Active'
    },
    {
      id: '2',
      name: 'BOGO Buy 1 Get 1 Pizzas',
      promocode: 'BOGOPZ',
      type: 'BOGO',
      startDate: '01-Jun-2026',
      endDate: '15-Jun-2026',
      status: 'Active'
    }
  ]);

  // Form State
  const [schemeName, setSchemeName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [description, setDescription] = useState('');
  const [campaignType, setCampaignType] = useState('BOGO');

  // Dates (Initial dates set to 11-Jun-2026 to match Screenshot 1)
  const [startDate, setStartDate] = useState(new Date(2026, 5, 11)); // June 11, 2026
  const [endDate, setEndDate] = useState(new Date(2026, 5, 11)); // June 11, 2026
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  // Applicable days selection
  const [activeDays, setActiveDays] = useState<string[]>(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

  // Checkboxes
  const [isClubbed, setIsClubbed] = useState(false);
  const [isMultiApply, setIsMultiApply] = useState(false);
  const [isVisiblePromo, setIsVisiblePromo] = useState(false);
  const [isBooklet, setIsBooklet] = useState(false);
  const [isVisibleBday, setIsVisibleBday] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Conditions Limits
  const [redeemLimit, setRedeemLimit] = useState('');
  const [customerLimit, setCustomerLimit] = useState('');
  const [limits, setLimits] = useState({
    month: '',
    week: '',
    day: '',
    hour: '',
    lifetime: ''
  });

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // e.g. 11-Jun-2026
  };

  const formatDateSummary = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // e.g. 11/06/2026
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeName.trim()) {
      addToast('Scheme name is required', 'warning');
      return;
    }

    const newCampaign: Campaign = {
      id: Math.random().toString(36).substring(2, 9),
      name: schemeName.trim(),
      promocode: promoCode.trim() || 'NONE',
      type: campaignType,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      status: isActive ? 'Active' : 'Inactive'
    };

    setCampaigns([newCampaign, ...campaigns]);
    addToast(`Campaign "${newCampaign.name}" saved successfully`, 'success');
    setIsCreating(false);

    // Reset Form
    setSchemeName('');
    setPromoCode('');
    setDescription('');
    setCampaignType('BOGO');
    setStartDate(new Date(2026, 5, 11));
    setEndDate(new Date(2026, 5, 11));
    setIsClubbed(false);
    setIsMultiApply(false);
    setIsBooklet(false);
    setIsActive(true);
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

  const columns: Column<Campaign>[] = [
    {
      header: 'Campaign Name',
      accessor: 'name',
      render: (row) => <span className="font-bold text-gray-800">{row.name}</span>
    },
    {
      header: 'Promo Code',
      accessor: 'promocode',
      render: (row) => <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded font-mono text-xs">{row.promocode}</span>
    },
    {
      header: 'Campaign Type',
      accessor: 'type',
      render: (row) => <span className="text-gray-500 font-medium text-xs">{row.type}</span>
    },
    {
      header: 'Validity',
      render: (row) => <span className="text-gray-500 text-xs">{row.startDate} to {row.endDate}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            row.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}
        >
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="flex h-full animate-fade-in select-none">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-slate-50 h-[calc(100vh-60px)]">
        {!isCreating ? (
          <>
            <PageHeader title="Offers">
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Campaign
              </button>
            </PageHeader>
            <DataTable
              columns={columns}
              data={campaigns}
              searchPlaceholder="Search campaigns..."
              searchKey="name"
            />
          </>
        ) : (
          <form onSubmit={handleSaveCampaign} className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Header with back/save actions */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h1 className="text-lg font-bold text-gray-800">Create New Offer</h1>
                <p className="text-xs text-gray-500">Create New Campaign</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-md shadow-blue-100 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Form layout structure */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Left Column: General Details & Conditions */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* General Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">General Details</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      Name of Scheme<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={schemeName}
                      onChange={(e) => setSchemeName(e.target.value)}
                      placeholder="Name"
                      required
                      className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Promocode</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promocode"
                      className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Offer Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Offer Description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* Conditions */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Conditions</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      No of times offer can be redeemed(Leave empty if no limit)
                    </label>
                    <input
                      type="number"
                      value={redeemLimit}
                      onChange={(e) => setRedeemLimit(e.target.value)}
                      placeholder="No of times offer can be redeemed"
                      className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      No of times a customer can redeem offer
                    </label>
                    <input
                      type="number"
                      value={customerLimit}
                      onChange={(e) => setCustomerLimit(e.target.value)}
                      placeholder="No of times a customer can redeem offer"
                      className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  {/* Reset Frequency table */}
                  <div className="mt-2">
                    <div className="grid grid-cols-2 text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-1.5">
                      <span>RESET FREQUENCY</span>
                      <span>REDEMPTION LIMIT IN RESET PERIOD</span>
                    </div>
                    {[
                      { key: 'month', label: 'MONTH' },
                      { key: 'week', label: 'WEEK' },
                      { key: 'day', label: 'DAY' },
                      { key: 'hour', label: 'HOUR' },
                      { key: 'lifetime', label: 'LIFETIME' }
                    ].map((freq) => (
                      <div key={freq.key} className="grid grid-cols-2 items-center py-2 border-b border-gray-50 last:border-0">
                        <span className="text-xs font-bold text-gray-500 uppercase">{freq.label}</span>
                        <input
                          type="number"
                          value={limits[freq.key as keyof typeof limits]}
                          onChange={(e) => setLimits({ ...limits, [freq.key]: e.target.value })}
                          className="w-full max-w-[200px] px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column: Offer Duration & General Flags */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Offer Duration */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm relative">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Offer Duration</h3>
                  
                  {/* Start Date / End Date with Custom Calendars */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Start Date</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsStartOpen(!isStartOpen);
                          setIsEndOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-250 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <span>{formatDate(startDate)}</span>
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </button>
                      {isStartOpen && (
                        <CalendarPicker
                          selectedDate={startDate}
                          onChange={(date) => setStartDate(date)}
                          onClose={() => setIsStartOpen(false)}
                        />
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-bold text-gray-600 mb-1">End Date</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEndOpen(!isEndOpen);
                          setIsStartOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-250 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <span>{formatDate(endDate)}</span>
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </button>
                      {isEndOpen && (
                        <CalendarPicker
                          selectedDate={endDate}
                          onChange={(date) => setEndDate(date)}
                          onClose={() => setIsEndOpen(false)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Starting From / Ending At hour selectors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Starting From</label>
                      <select className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-500 font-semibold cursor-pointer">
                        <option>Search here</option>
                        <option>12:00 AM</option>
                        <option>08:00 AM</option>
                        <option>12:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Ending At</label>
                      <select className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-500 font-semibold cursor-pointer">
                        <option>Search here</option>
                        <option>11:59 PM</option>
                        <option>04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Days checklist */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-2">Applicable on days</label>
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

                {/* Flags Checkboxes */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">General Details</h3>
                  {[
                    { label: 'Is this offer can be clubbed with other offers?', value: isClubbed, setValue: setIsClubbed },
                    { label: 'Is this offer can be applied multiple times on same order?', value: isMultiApply, setValue: setIsMultiApply },
                    { label: 'Is this offer will be visible after entering promocode', value: isVisiblePromo, setValue: setIsVisiblePromo },
                    { label: 'This is Booklet Offer', value: isBooklet, setValue: setIsBooklet },
                    { label: 'Visible only on Birthday / Anniversary', value: isVisibleBday, setValue: setIsVisibleBday }
                  ].map((flag, idx) => (
                    <label
                      key={idx}
                      className="flex items-center justify-between p-3 border border-gray-150 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-gray-700 max-w-[85%]">{flag.label}</span>
                      <input
                        type="checkbox"
                        checked={flag.value}
                        onChange={(e) => flag.setValue(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Campaign type selector & active status row */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Select campaign type</h3>
              <div className="flex flex-wrap gap-6 items-center">
                {[
                  { key: 'BOGO', label: 'BOGO' },
                  { key: 'BUY N & GET N', label: 'BUY N & GET N' },
                  { key: 'PRODUCT DISCOUNT', label: 'PRODUCT DISCOUNT' },
                  { key: 'GENERAL DISCOUNT', label: 'GENERAL DISCOUNT' },
                  { key: 'BUY & GET OFFER ON OTHER', label: 'BUY & GET OFFER ON OTHER' },
                  { key: 'Clubbed Pricing', label: 'Clubbed Pricing' }
                ].map((type) => (
                  <label key={type.key} className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="campaign_type"
                      checked={campaignType === type.key}
                      onChange={() => setCampaignType(type.key)}
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Active checkbox */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-xs">
              <input
                type="checkbox"
                id="active_status"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="active_status" className="text-xs font-bold text-gray-700 cursor-pointer">
                Active
              </label>
            </div>

            {/* Side summary panel rendered floating on large screens */}
            <div className="fixed right-6 bottom-6 lg:bottom-auto lg:top-24 w-80 bg-blue-50 border border-blue-150 rounded-xl p-5 shadow-lg select-none hidden xl:block">
              <h4 className="text-sm font-bold text-blue-800 border-b border-blue-200 pb-2 mb-4">Campaign Summary</h4>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Campaign Name</span>
                  <span className="text-sm font-bold text-gray-800 truncate block">
                    {schemeName || '--'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Duration</span>
                  <span className="text-sm font-extrabold text-blue-900 block">
                    {formatDateSummary(startDate)}
                  </span>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
