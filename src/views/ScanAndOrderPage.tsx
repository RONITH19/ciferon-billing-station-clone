import React, { useState } from 'react';
import { useStore } from '../store';
import { Info, Download, QrCode, UploadCloud, Save } from 'lucide-react';

export const ScanAndOrderPage: React.FC = () => {
  const { addToast } = useStore();

  // Settings State
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [launchMode, setLaunchMode] = useState<'WHATSAPP' | 'LINK'>('LINK');

  // Order types
  const [delivery, setDelivery] = useState(true);
  const [pickup, setPickup] = useState(true);
  const [dining, setDining] = useState(true);
  const [tableSelect, setTableSelect] = useState(false);
  const [customSetting, setCustomSetting] = useState(false);
  const [categoryView, setCategoryView] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(false);

  // Submenu notes
  const [submenu, setSubmenu] = useState('Search here');
  const [exposeOutlets, setExposeOutlets] = useState(false);
  const [notes, setNotes] = useState('');

  // Notifications
  const [showNotification, setShowNotification] = useState(false);
  const [notificationInput, setNotificationInput] = useState('');
  const [notificationsList, setNotificationsList] = useState<string[]>([]);

  // Charges
  const [deliveryCharge, setDeliveryCharge] = useState('0');
  const [minFreeDelivery, setMinFreeDelivery] = useState('0');
  const [enableCash, setEnableCash] = useState(false);
  const [enableOnline, setEnableOnline] = useState(false);
  const [forceToken, setForceToken] = useState(false);

  // URL setup
  const [siteName, setSiteName] = useState('sobostrial2');

  const handleAddNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationInput.trim()) return;
    setNotificationsList([...notificationsList, notificationInput.trim()]);
    setNotificationInput('');
    addToast('Notification trigger added', 'success');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Scan and Order Setup saved successfully', 'success');
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen select-none animate-fade-in pb-12">
      {/* Topbar page actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-8 py-4 bg-white shadow-sm sticky top-0 z-[100]">
        <h1 className="text-lg font-bold text-gray-800">Scan and Order Setup</h1>
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-blue-100"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* COLUMN 1: Menu Mode, Launch Mode, Order Types, Submenu, Notifications */}
          <div className="flex flex-col gap-6">
            {/* Read-only menu toggle */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700">Do you want to keep Menu for Read-only mode?</h3>
              <label className="flex items-center justify-between p-3 border border-gray-150 rounded-lg bg-gray-50 hover:bg-gray-100/70 transition-colors cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Enable</span>
                <input
                  type="checkbox"
                  checked={isReadOnly}
                  onChange={(e) => setIsReadOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
              <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/80 border border-blue-100 rounded-lg text-blue-700 text-xs">
                <Info className="w-4.5 h-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="leading-normal">
                  Note: If you keep it enable, in that case customers will be only able to see the menu, won't be able to place an order
                </p>
              </div>
            </div>

            {/* Launch Mode */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700">Launch Mode</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { mode: 'WHATSAPP', label: 'WHATSAPP' },
                  { mode: 'LINK', label: 'LINK' }
                ].map((option) => {
                  const isActive = launchMode === option.mode;
                  return (
                    <button
                      key={option.mode}
                      type="button"
                      onClick={() => setLaunchMode(option.mode as any)}
                      className={`py-2 px-4 border text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={isActive}
                        readOnly
                        className="w-3.5 h-3.5 text-blue-600"
                      />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Type Setup */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-3 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700 mb-1">Order type Setup</h3>
              {[
                { label: 'Enable Delivery', value: delivery, setValue: setDelivery },
                { label: 'Enable Pickup', value: pickup, setValue: setPickup },
                { label: 'Enable Dining', value: dining, setValue: setDining },
                { label: 'Enable table selection for Dining Orders', value: tableSelect, setValue: setTableSelect },
                { label: 'Enable Custom Setting', value: customSetting, setValue: setCustomSetting },
                { label: 'Enable Category View', value: categoryView, setValue: setCategoryView },
                { label: 'Enable Loyalty Points', value: loyaltyPoints, setValue: setLoyaltyPoints }
              ].map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-center justify-between p-3 border border-gray-150 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={(e) => item.setValue(e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              ))}
            </div>

            {/* Menu Setup */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700">Menu</h3>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Submenu</label>
                <select
                  value={submenu}
                  onChange={(e) => setSubmenu(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-500 font-semibold cursor-pointer"
                >
                  <option>Search here</option>
                  <option>Main Menu</option>
                  <option>Beverages</option>
                </select>
              </div>
              <label className="flex items-center justify-between p-3 border border-gray-150 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Expose Virtual Outlets</span>
                <input
                  type="checkbox"
                  checked={exposeOutlets}
                  onChange={(e) => setExposeOutlets(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Notes/Remarks</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter Remarks"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-250 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Contactless Notifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700">Contactless Notifications</h3>
              <label className="flex items-center justify-between p-3 border border-gray-150 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Show Notification</span>
                <input
                  type="checkbox"
                  checked={showNotification}
                  onChange={(e) => setShowNotification(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Add Notification</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={notificationInput}
                    onChange={(e) => setNotificationInput(e.target.value)}
                    placeholder="Notifications"
                    className="flex-grow px-3 py-2 border border-gray-250 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNotification}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Charges & Payment Setup, DineIn Portal Settings */}
          <div className="flex flex-col gap-6">
            {/* Charges Setup */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700 border-b border-gray-100 pb-2">Charges & Payment Setup</h3>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Delivery Charge (Fixed)</label>
                <input
                  type="number"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Minimun Order Amount for Free Delivery (Fixed)</label>
                <input
                  type="number"
                  value={minFreeDelivery}
                  onChange={(e) => setMinFreeDelivery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <label className="flex items-center justify-between p-3 border border-gray-150 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Enable Cash</span>
                <input
                  type="checkbox"
                  checked={enableCash}
                  onChange={(e) => setEnableCash(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-150 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Enable Online Transaction</span>
                <input
                  type="checkbox"
                  checked={enableOnline}
                  onChange={(e) => setEnableOnline(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>

            {/* DineIn Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700 border-b border-gray-100 pb-2">DineIn Portal Settings</h3>
              <label className="flex items-center justify-between p-3 border border-gray-150 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Force Token Orders</span>
                <input
                  type="checkbox"
                  checked={forceToken}
                  onChange={(e) => setForceToken(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* COLUMN 3: Scan and Order URL, Banner Upload */}
          <div className="flex flex-col gap-6">
            {/* URL & QR */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700 border-b border-gray-100 pb-2">Scan and Order URL</h3>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Choose your site name</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-250">
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="flex-grow px-3 py-2 text-sm outline-none text-gray-700 font-semibold"
                  />
                  <span className="bg-gray-100 px-3 py-2 text-xs font-bold text-gray-400 border-l border-gray-200 flex items-center justify-center">
                    .sobos.com
                  </span>
                </div>
              </div>

              {/* Stylized QR Code graphics */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 border border-dashed border-gray-200 rounded-xl mt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">QR Code</span>
                <div className="w-36 h-36 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-3 shadow-inner">
                  <QrCode className="w-full h-full text-gray-800" />
                </div>
                <span className="text-xs font-bold text-blue-600 mt-2 select-all">
                  https://{siteName || 'sobostrial2'}.sobos.com
                </span>
                <button
                  type="button"
                  onClick={() => addToast('QR code downloading...', 'success')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download QR
                </button>
              </div>
            </div>

            {/* Banner Image upload */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700 border-b border-gray-100 pb-2">Banner Image</h3>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Add Image</label>
                <div
                  onClick={() => addToast('Upload dialog opened', 'info')}
                  className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-8 flex flex-col items-center justify-center gap-2.5 bg-slate-50 hover:bg-blue-50/20 cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-8 h-8 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500">Drop files here to upload</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50/80 border border-blue-100 rounded-lg text-blue-700 text-[10px]">
                <Info className="w-4.5 h-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="leading-normal font-semibold">
                  Recommended size 512 x 512 px in JPG, GIF or PNG format upto max size of 1 MB
                </p>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
