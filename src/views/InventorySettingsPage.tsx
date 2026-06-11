import React, { useState } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { inventorySidebarSections } from './InventoryLandingPage';
import { useStore } from '../store';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export const InventorySettingsPage: React.FC = () => {
  const { addToast } = useStore();

  // Pricing & Pricebook state
  const [selectedPricebook, setSelectedPricebook] = useState('Standard Pricebook');

  // Checklist setting states
  const [refNumMandatory, setRefNumMandatory] = useState(false);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [ewayBill, setEwayBill] = useState(false);
  const [manualReceive, setManualReceive] = useState(true);
  const [deptRequired, setDeptRequired] = useState(false);
  const [cutOffTime, setCutOffTime] = useState('Search here');
  const [cutOffHours, setCutOffHours] = useState('IndentCutOffhours');
  const [additionalCC, setAdditionalCC] = useState('');

  // Approval flows state
  const [indentFlow, setIndentFlow] = useState({ lvl1: 'Search here', lvl2: 'Search here', lvl3: 'Search here' });
  const [poFlow, setPoFlow] = useState({ lvl1: 'Search here', lvl2: 'Search here', lvl3: 'Search here' });
  const [piFlow, setPiFlow] = useState({ lvl1: 'Search here', lvl2: 'Search here', lvl3: 'Search here' });

  const handleSavePricebooks = () => {
    addToast('Pricebook mappings saved successfully', 'success');
  };

  const handleSaveSettings = () => {
    addToast('Inventory configuration settings updated', 'success');
  };

  const handleSaveFlows = () => {
    addToast('Approval flow configurations saved', 'success');
  };

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <PageHeader title="Inventory Settings" subtitle="Configure pricebooks, global flags, and approval routing">
          <Link
            to="/inventory/landing"
            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </PageHeader>

        {/* 2-Column Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Block - Assign Pricebook (col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="p-5 border-b border-gray-150 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-sm">
                  Assign Pricebook to Outlets for Indent
                </h3>
              </div>

              <div className="p-5">
                <table className="w-full text-left border-collapse border border-gray-150 rounded-xl overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-150">
                      <th className="px-4 py-3 text-center w-16">Sr. No.</th>
                      <th className="px-4 py-3">Outlet</th>
                      <th className="px-4 py-3">Pricebook</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50/20">
                      <td className="px-4 py-3 text-center text-gray-500 font-bold">1</td>
                      <td className="px-4 py-3 text-gray-800 font-bold">Warehouse - Trial</td>
                      <td className="px-4 py-3">
                        <select
                          value={selectedPricebook}
                          onChange={(e) => setSelectedPricebook(e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-250 bg-white rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                        >
                          <option value="Search here">Search here</option>
                          <option value="Standard Pricebook">Standard Pricebook</option>
                          <option value="Main Pricebook">Main Pricebook</option>
                          <option value="Outlet Custom Book">Outlet Custom Book</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-5 border-t border-gray-150 flex justify-end bg-gray-50/20">
              <button
                onClick={handleSavePricebooks}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>

          {/* Right Block - Checklist Settings (col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="p-5 border-b border-gray-150 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-sm">Settings</h3>
              </div>

              <div className="p-5 flex flex-col gap-3">
                {/* Checkbox Rows */}
                {[
                  { label: 'Reference Number Mandatory (PI)', val: refNumMandatory, set: setRefNumMandatory },
                  { label: 'Enable Low Stock Alert', val: lowStockAlert, set: setLowStockAlert },
                  { label: 'Enable Eway Bill', val: ewayBill, set: setEwayBill },
                  { label: 'Manually receive Material Transfer', val: manualReceive, set: setManualReceive },
                  { label: 'Department Required', val: deptRequired, set: setDeptRequired },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => item.set(!item.val)}
                    className="flex items-center justify-between px-4 py-2.5 border border-gray-150 hover:bg-gray-50 rounded-xl cursor-pointer select-none transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.val}
                      onChange={() => {}} // handled by div click
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                ))}

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Indent Cut Off Time
                    </label>
                    <select
                      value={cutOffTime}
                      onChange={(e) => setCutOffTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-700"
                    >
                      <option value="Search here">Search here</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Indent Cut Off Hours
                    </label>
                    <input
                      type="text"
                      value={cutOffHours}
                      onChange={(e) => setCutOffHours(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-semibold text-gray-700"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Additional PO Email in CC
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Additional PO Email in CC"
                      value={additionalCC}
                      onChange={(e) => setAdditionalCC(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-150 flex justify-end bg-gray-50/20">
              <button
                onClick={handleSaveSettings}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Approval Flows Section (Full Width Bottom) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="p-5 border-b border-gray-150 bg-gray-50/50">
            <h3 className="font-bold text-gray-800 text-sm">Approval Flows Setup</h3>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Indent Approval Flow */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Indent Approval Flow
              </h4>
              <table className="w-full border border-gray-150 rounded-xl overflow-hidden text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-150">
                    <th className="px-4 py-2 w-20">Level</th>
                    <th className="px-4 py-2">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {['Level 1', 'Level 2', 'Level 3'].map((lvl, index) => {
                    const key = index === 0 ? 'lvl1' : index === 1 ? 'lvl2' : 'lvl3';
                    return (
                      <tr key={lvl}>
                        <td className="px-4 py-2.5 font-bold text-gray-650">{lvl}</td>
                        <td className="px-4 py-2.5">
                          <select
                            value={(indentFlow as any)[key]}
                            onChange={(e) => setIndentFlow({ ...indentFlow, [key]: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg text-xs"
                          >
                            <option value="Search here">Search here</option>
                            <option value="Amit">Amit</option>
                            <option value="Direct Client">Direct Client</option>
                            <option value="Zomato">Zomato</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PO Approval Flow */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Purchase Order Approval Flow
              </h4>
              <table className="w-full border border-gray-150 rounded-xl overflow-hidden text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-150">
                    <th className="px-4 py-2 w-20">Level</th>
                    <th className="px-4 py-2">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {['Level 1', 'Level 2', 'Level 3'].map((lvl, index) => {
                    const key = index === 0 ? 'lvl1' : index === 1 ? 'lvl2' : 'lvl3';
                    return (
                      <tr key={lvl}>
                        <td className="px-4 py-2.5 font-bold text-gray-650">{lvl}</td>
                        <td className="px-4 py-2.5">
                          <select
                            value={(poFlow as any)[key]}
                            onChange={(e) => setPoFlow({ ...poFlow, [key]: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg text-xs"
                          >
                            <option value="Search here">Search here</option>
                            <option value="Amit">Amit</option>
                            <option value="Direct Client">Direct Client</option>
                            <option value="Zomato">Zomato</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PI Approval Flow */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Purchase Invoice Approval Flow
              </h4>
              <table className="w-full border border-gray-150 rounded-xl overflow-hidden text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-150">
                    <th className="px-4 py-2 w-20">Level</th>
                    <th className="px-4 py-2">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {['Level 1', 'Level 2', 'Level 3'].map((lvl, index) => {
                    const key = index === 0 ? 'lvl1' : index === 1 ? 'lvl2' : 'lvl3';
                    return (
                      <tr key={lvl}>
                        <td className="px-4 py-2.5 font-bold text-gray-650">{lvl}</td>
                        <td className="px-4 py-2.5">
                          <select
                            value={(piFlow as any)[key]}
                            onChange={(e) => setPiFlow({ ...piFlow, [key]: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg text-xs"
                          >
                            <option value="Search here">Search here</option>
                            <option value="Amit">Amit</option>
                            <option value="Direct Client">Direct Client</option>
                            <option value="Zomato">Zomato</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

          {/* Bottom Save bar */}
          <div className="p-5 border-t border-gray-150 flex justify-end bg-gray-50/20">
            <button
              onClick={handleSaveFlows}
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-100 transition-all animate-pulse-subtle"
            >
              <Save className="w-3.5 h-3.5" />
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
