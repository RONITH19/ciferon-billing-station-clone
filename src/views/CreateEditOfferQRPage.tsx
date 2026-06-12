import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { offersSidebarSections } from './BookletsPage';
import { ArrowLeft } from 'lucide-react';

export const CreateEditOfferQRPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { offerQRs, campaigns, addOfferQR, updateOfferQR, addToast } = useStore();

  const isEdit = !!id;

  const [name, setName] = useState('');
  const [type, setType] = useState<'With Offer' | 'Without Offer'>('With Offer');
  const [selectedOffer, setSelectedOffer] = useState('');
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [homeScreenMessage, setHomeScreenMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [printPos, setPrintPos] = useState(false);
  const [printOnline, setPrintOnline] = useState(false);

  // Load existing data if edit mode
  useEffect(() => {
    if (isEdit) {
      const qr = offerQRs.find((q) => q.id === id);
      if (qr) {
        setName(qr.name);
        setType(qr.type);
        setSelectedOffer(qr.offer);
        setThankYouMessage(qr.thankYouMessage);
        setHomeScreenMessage(qr.homeScreenMessage);
        setIsActive(qr.isActive);
        setPrintPos(qr.printPos);
        setPrintOnline(qr.printOnline);
      } else {
        addToast('Offer QR code not found', 'error');
        navigate('/offers/qr');
      }
    }
  }, [isEdit, id, offerQRs, navigate, addToast]);

  const offersList = campaigns.filter((c) => c.campaignCategory === 'offer');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name is required', 'warning');
      return;
    }
    if (type === 'With Offer' && !selectedOffer) {
      addToast('Please select an offer', 'warning');
      return;
    }

    const qrData = {
      name: name.trim(),
      type,
      offer: type === 'With Offer' ? selectedOffer : '',
      thankYouMessage: thankYouMessage.trim(),
      homeScreenMessage: homeScreenMessage.trim(),
      isActive,
      printPos,
      printOnline,
    };

    try {
      if (isEdit && id) {
        await updateOfferQR(id, qrData);
        addToast(`Offer QR "${name}" updated successfully`, 'success');
      } else {
        await addOfferQR(qrData);
        addToast(`Offer QR "${name}" created successfully`, 'success');
      }
      navigate('/offers/qr');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save Offer QR', 'error');
    }
  };

  const handleDownloadQR = async () => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://ciferon.com/menu/${encodeURIComponent(name)}`;
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_${name.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      addToast('QR Code downloaded successfully', 'success');
    } catch (err) {
      addToast('Failed to download QR code', 'error');
    }
  };

  return (
    <div className="flex h-full animate-fade-in select-none">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-slate-50 h-[calc(100vh-60px)]">
        {/* Header with back/save actions */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Offers</h1>
            <p className="text-xs text-gray-500">
              {isEdit ? 'Edit Offer QR' : 'Create New Offer QR'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/offers/qr"
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

        {/* Form Details */}
        <form onSubmit={handleSave} className="max-w-7xl flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Basic Details Form */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-750 border-b border-gray-100 pb-2.5">
                Basic Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Name<span className="text-red-500">*</span>
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

              {/* Type Radio Group */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Type</label>
                <div className="flex gap-6 items-center">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="qr_type"
                      checked={type === 'With Offer'}
                      onChange={() => setType('With Offer')}
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <span>With Offer</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="qr_type"
                      checked={type === 'Without Offer'}
                      onChange={() => setType('Without Offer')}
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <span>Without Offer</span>
                  </label>
                </div>
              </div>

              {/* Offer selection dropdown */}
              {type === 'With Offer' && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Offer<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedOffer}
                      onChange={(e) => setSelectedOffer(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-800 cursor-pointer"
                    >
                      <option value="">Select an option...</option>
                      {offersList.map((off) => (
                        <option key={off.id} value={off.name}>
                          {off.name}
                        </option>
                      ))}
                    </select>
                    {selectedOffer && (
                      <button
                        type="button"
                        onClick={() => setSelectedOffer('')}
                        className="absolute right-8 top-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        &#x2715;
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Thank you Message
                </label>
                <textarea
                  value={thankYouMessage}
                  onChange={(e) => setThankYouMessage(e.target.value)}
                  placeholder="Enter Message"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all font-medium text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Home Screen Message
                </label>
                <textarea
                  value={homeScreenMessage}
                  onChange={(e) => setHomeScreenMessage(e.target.value)}
                  placeholder="Enter Message"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 transition-all font-medium text-gray-800"
                />
              </div>

              {/* Flags Switch/Checkboxes */}
              <div className="flex flex-col gap-3 mt-2">
                {[
                  { label: 'Active', value: isActive, setValue: setIsActive },
                  { label: 'Print on Pos Bills', value: printPos, setValue: setPrintPos },
                  { label: 'Print on Online Bills', value: printOnline, setValue: setPrintOnline },
                ].map((flag, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between p-3.5 border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-gray-700">{flag.label}</span>
                    <input
                      type="checkbox"
                      checked={flag.value}
                      onChange={(e) => flag.setValue(e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer border-gray-300"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Right Column: QR Code Preview (Only shown when editing/existing QR code is loaded) */}
            {isEdit && name && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4 items-center">
                <h3 className="w-full text-left text-sm font-bold text-gray-750 border-b border-gray-100 pb-2.5">
                  URL
                </h3>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  QR Code
                </span>
                <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-inner flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ciferon.com/menu/${encodeURIComponent(name)}`}
                    alt="QR Code Preview"
                    width={150}
                    height={150}
                    className="select-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="w-full mt-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Download QR
                </button>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};
