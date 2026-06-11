import React, { useState, useEffect } from 'react';
import { useStore, POSSetting } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { settingsSidebarSections } from './MessageSettingsPage';
import { PageHeader } from '../components/PageHeader';
import { ArrowLeft, Save, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const POSSettingsPage: React.FC = () => {
  const { posSetting, updatePOSSetting, addToast } = useStore();
  const [activeTab, setActiveTab] = useState('Bill Print');

  // Local state for checkboxes
  const [printBrandOnline, setPrintBrandOnline] = useState(false);
  const [printOutletBill, setPrintOutletBill] = useState(false);
  const [enableRegularToken, setEnableRegularToken] = useState(false);
  const [printBillKotTogether, setPrintBillKotTogether] = useState(false);
  const [enableKotToken, setEnableKotToken] = useState(false);
  const [enableKotReprint, setEnableKotReprint] = useState(false);
  const [disableBillToken, setDisableBillToken] = useState(false);
  const [maskCustomerNumber, setMaskCustomerNumber] = useState(false);

  // Sync checkboxes on load
  useEffect(() => {
    if (posSetting) {
      setPrintBrandOnline(posSetting.printBrandOnline);
      setPrintOutletBill(posSetting.printOutletBill);
      setEnableRegularToken(posSetting.enableRegularToken);
      setPrintBillKotTogether(posSetting.printBillKotTogether);
      setEnableKotToken(posSetting.enableKotToken);
      setEnableKotReprint(posSetting.enableKotReprint);
      setDisableBillToken(posSetting.disableBillToken);
      setMaskCustomerNumber(posSetting.maskCustomerNumber);
    }
  }, [posSetting]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePOSSetting({
      printBrandOnline,
      printOutletBill,
      enableRegularToken,
      printBillKotTogether,
      enableKotToken,
      enableKotReprint,
      disableBillToken,
      maskCustomerNumber,
    });
    addToast('POS settings saved successfully', 'success');
  };

  const tabs = [
    'Billing',
    'Bill Print',
    'KOT Print',
    'KOT',
    'Ordering',
    'Online Orders',
    'Tax',
    'KDS',
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={settingsSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <form onSubmit={handleSave}>
          <PageHeader title="POS Setting" subtitle="Configure checkout policies, receipt templates, and ticket logs">
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

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[450px]">
            {/* Left Tab Menu (Vertical List) */}
            <div className="w-full md:w-52 bg-gray-50/50 border-r border-gray-200 p-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible select-none">
              {tabs.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      addToast(`Viewing tab: ${tab}`, 'info');
                    }}
                    className={`px-4 py-2 text-xs font-bold text-left rounded-xl transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-500 rounded-l-none'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Right Tab Content */}
            <div className="flex-1 p-6">
              {activeTab === 'Bill Print' ? (
                <div className="flex flex-col gap-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      Bill Print Settings
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Configure layout preferences and details for physical guest bills.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">
                      <input
                        type="checkbox"
                        id="printBrandOnline"
                        checked={printBrandOnline}
                        onChange={(e) => setPrintBrandOnline(e.target.checked)}
                        className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="printBrandOnline" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        Print brand name on online order bill
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">
                      <input
                        type="checkbox"
                        id="printOutletBill"
                        checked={printOutletBill}
                        onChange={(e) => setPrintOutletBill(e.target.checked)}
                        className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="printOutletBill" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        Print outlet name on bill
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">
                      <input
                        type="checkbox"
                        id="enableRegularToken"
                        checked={enableRegularToken}
                        onChange={(e) => setEnableRegularToken(e.target.checked)}
                        className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="enableRegularToken" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        Enable regular print for token
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">
                      <input
                        type="checkbox"
                        id="printBillKotTogether"
                        checked={printBillKotTogether}
                        onChange={(e) => setPrintBillKotTogether(e.target.checked)}
                        className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="printBillKotTogether" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        Print bill & KOT together for token
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">
                      <input
                        type="checkbox"
                        id="enableKotToken"
                        checked={enableKotToken}
                        onChange={(e) => setEnableKotToken(e.target.checked)}
                        className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="enableKotToken" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        Enable kot print for token
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">
                      <input
                        type="checkbox"
                        id="enableKotReprint"
                        checked={enableKotReprint}
                        onChange={(e) => setEnableKotReprint(e.target.checked)}
                        className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="enableKotReprint" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        Enable kot re-print for token
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">
                      <input
                        type="checkbox"
                        id="disableBillToken"
                        checked={disableBillToken}
                        onChange={(e) => setDisableBillToken(e.target.checked)}
                        className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="disableBillToken" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        Disable bill print for token
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">
                      <input
                        type="checkbox"
                        id="maskCustomerNumber"
                        checked={maskCustomerNumber}
                        onChange={(e) => setMaskCustomerNumber(e.target.checked)}
                        className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="maskCustomerNumber" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        Mask Customer Number on Bill
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 border border-blue-100">
                    <CheckCircle2 className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold text-gray-800 mb-1">Tab: {activeTab}</h4>
                  <p className="text-xs text-gray-500 max-w-sm">
                    Configurations in this tab are preset according to standard trial templates. Review options in the "Bill Print" tab for active fields.
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
