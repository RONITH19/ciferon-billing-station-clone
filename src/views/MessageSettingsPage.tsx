import React, { useState } from 'react';
import { useStore, MessageAlertRow } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { ArrowLeft, Save, Upload, Image as ImageIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const settingsSidebarSections = [
  {
    label: 'Outlet Settings',
    items: [
      { label: 'Terminals', href: '/settings/terminals', locked: true },
      { label: 'Sections & Tables', href: '/settings/sections-tables', locked: true },
      { label: 'Session Timings', href: '/settings/sessions', locked: true },
      { label: 'Invoice Setting', href: '/settings/invoice', locked: true },
      { label: 'Message Setting', href: '/settings/message-setting' },
      { label: 'Card Settings', href: '/settings/cards', locked: true },
      { label: 'Bank Details', href: '/settings/bank', locked: true },
      { label: 'Expense Types', href: '/settings/expense-types', locked: true },
      { label: 'Reset Bill Number', href: '/settings/reset-bill', locked: true },
      { label: 'POS Setting', href: '/settings/pos-setting' },
      { label: 'KDS Setting', href: '/settings/kds', locked: true },
      { label: 'Store Timing', href: '/settings/store-timing', locked: true },
    ],
  },
  {
    label: 'Order Actions',
    items: [
      { label: 'Cancel', href: '/settings/order-cancel' },
    ],
  },
  {
    label: 'Integration',
    items: [
      { label: 'Paytm Payment Gateway', href: '/settings/paytm-gw', locked: true },
      { label: 'Pinelabs', href: '/settings/pinelabs', locked: true },
      { label: 'Upsale', href: '/settings/upsale', locked: true },
      { label: 'Reelo', href: '/settings/reelo', locked: true },
      { label: 'Paytm EDC', href: '/settings/paytm-edc', locked: true },
      { label: 'Timewatch Turnstile Key', href: '/settings/timewatchturnstilekey' },
    ],
  },
];

export const MessageSettingsPage: React.FC = () => {
  const {
    messageAlerts,
    updateMessageAlert,
    ereceptImage,
    setEreceptImage,
    ereceptMessage,
    setEreceptMessage,
    addToast
  } = useStore();

  const [localMessage, setLocalMessage] = useState(ereceptMessage);
  const [dragActive, setDragActive] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEreceptMessage(localMessage);
    addToast('Message settings updated successfully', 'success');
  };

  // Image upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 1024 * 1024) {
        addToast('File exceeds maximum limit of 1 MB', 'warning');
        return;
      }
      const url = URL.createObjectURL(file);
      setEreceptImage(url);
      addToast('E-Receipt logo uploaded', 'success');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) {
        addToast('File exceeds maximum limit of 1 MB', 'warning');
        return;
      }
      const url = URL.createObjectURL(file);
      setEreceptImage(url);
      addToast('E-Receipt logo uploaded', 'success');
    }
  };

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={settingsSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <form onSubmit={handleSave}>
          <PageHeader title="Message Settings" subtitle="Configure customer alert channels and e-receipt branding">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Panel: Alerts for Customer table (col-span 2) */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-150 bg-gray-50/50">
                <h3 className="text-base font-bold text-gray-900">Alerts for Customer</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/70 select-none">
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Alert Type</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-20">Off</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-24">WhatsApp</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-20">SMS</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-36">E-Receipt with Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {messageAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-xs font-bold text-gray-700">{alert.name}</td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="radio"
                            name={`alert-${alert.id}`}
                            checked={alert.channel === 'off'}
                            onChange={() => updateMessageAlert(alert.id, 'off')}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="radio"
                            name={`alert-${alert.id}`}
                            checked={alert.channel === 'whatsapp'}
                            onChange={() => updateMessageAlert(alert.id, 'whatsapp')}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="radio"
                            name={`alert-${alert.id}`}
                            checked={alert.channel === 'sms'}
                            onChange={() => updateMessageAlert(alert.id, 'sms')}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          {alert.id === 'ereceipt' ? (
                            <input
                              type="radio"
                              name={`alert-${alert.id}`}
                              checked={alert.channel === 'ereceipt_feedback'}
                              onChange={() => updateMessageAlert(alert.id, 'ereceipt_feedback')}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel: Upload Image for Ereceipt + Message */}
            <div className="flex flex-col gap-6">
              
              {/* Upload Image Card */}
              <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                  Upload Image for Ereceipt
                </h3>

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 bg-gray-50/50'
                  }`}
                >
                  {ereceptImage ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white mb-3">
                        <img src={ereceptImage} alt="E-Receipt Logo" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setEreceptImage(null)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-gray-500">Logo Uploaded</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer select-none">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 border border-blue-100">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Drag & Drop Image here</span>
                      <span className="text-[10px] text-gray-400 font-semibold mt-1">or browse files to upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 font-semibold mt-3 text-center leading-normal">
                  Recommended size 512 x 512 px in JPG or PNG format upto max size of 1 MB
                </p>
              </div>

              {/* Ereceipt Message Card */}
              <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                  Ereceipt Message
                </h3>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Enter Message
                  </label>
                  <textarea
                    value={localMessage}
                    onChange={(e) => setLocalMessage(e.target.value)}
                    rows={4}
                    placeholder="Enter receipt header message..."
                    className="w-full px-4.5 py-3 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all scrollbar-thin resize-none"
                  />
                </div>
              </div>

            </div>

          </div>
        </form>
      </main>
    </div>
  );
};
