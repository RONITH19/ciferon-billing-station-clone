import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { settingsSidebarSections } from './MessageSettingsPage';
import { PageHeader } from '../components/PageHeader';
import { ArrowLeft, Key, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TimewatchKeyPage: React.FC = () => {
  const { timewatchKey, updateTimewatchKey, addToast } = useStore();

  const [apiKey, setApiKey] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (timewatchKey) {
      setApiKey(timewatchKey.apiKey);
      setIpAddress(timewatchKey.ipAddress);
      setIsActive(timewatchKey.isActive);
    }
  }, [timewatchKey]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTimewatchKey({ apiKey, ipAddress, isActive });
    addToast('Timewatch integration config saved', 'success');
  };

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={settingsSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <PageHeader title="Timewatch Integration" subtitle="Configure hardware gates and turnstile API bindings">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Left Area: About card (col-span 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                  About Timewatch Turnstile
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  Timewatch Turnstile integration enables real-time synchronization between your staff attendance locks, visitor access gates, and your Sobos dashboard.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-start gap-2 text-xs text-gray-500 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    Automatically log employee check-ins at turnstile locks.
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-500 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    Audit visitor flows and guest counts on live dashboards.
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-500 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    Block turnstiles automatically if terminal registers offline.
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 text-[10px] text-gray-400 font-semibold">
                Status: Connected to local gateway
              </div>
            </div>
          </div>

          {/* Right Card: Timewatch Turnstile Key (col-span 5) */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-gray-500" />
                Timewatch Turnstile Key
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Api Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="ApiKey"
                  className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  IP Address
                </label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="IpAddress"
                  className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                  Mark this Active
                </label>
              </div>

              {/* Red warning text */}
              <div className="flex gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                <p className="text-[10px] leading-relaxed font-bold">
                  Please make sure keys are correct. Invalid keys will cause integration to fail. Please reach out to Sobos Support if you're unsure how this works
                </p>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 text-xs font-bold rounded-xl shadow-md transition-all select-none ${
                  isActive
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-100'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'
                }`}
              >
                {isActive ? 'Active' : 'Save Configuration'}
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};
