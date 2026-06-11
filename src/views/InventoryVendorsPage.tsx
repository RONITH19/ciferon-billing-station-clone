import React, { useState } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { inventorySidebarSections } from './InventoryLandingPage';
import { useStore, InventoryVendor } from '../store';
import { Edit2, Trash2, X, Plus } from 'lucide-react';

export const InventoryVendorsPage: React.FC = () => {
  const { inventoryVendors, addInventoryVendor, updateInventoryVendor, deleteInventoryVendor, addToast } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<InventoryVendor | null>(null);
  
  // Form States
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [balance, setBalance] = useState(0);
  const [department, setDepartment] = useState('');

  const openAddModal = () => {
    setSelectedVendor(null);
    setName('');
    setMobile('');
    setEmail('');
    setGstNo('');
    setBalance(0);
    setDepartment('');
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: InventoryVendor) => {
    setSelectedVendor(vendor);
    setName(vendor.name);
    setMobile(vendor.mobile);
    setEmail(vendor.email);
    setGstNo(vendor.gstNo);
    setBalance(vendor.balance);
    setDepartment(vendor.department);
    setIsModalOpen(true);
  };

  const openDeleteModal = (vendor: InventoryVendor) => {
    setSelectedVendor(vendor);
    setIsDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      addToast('Name is required', 'warning');
      return;
    }

    if (selectedVendor) {
      // Edit
      updateInventoryVendor(selectedVendor.id, {
        name,
        mobile: mobile || '--',
        email: email || '--',
        gstNo: gstNo || '--',
        balance: Number(balance) || 0,
        department: department || '--',
      });
      addToast('Vendor details updated successfully', 'success');
    } else {
      // Add
      const newVendor: InventoryVendor = {
        id: 'v-' + Math.random().toString(36).substring(2, 9),
        name,
        mobile: mobile || '--',
        email: email || '--',
        gstNo: gstNo || '--',
        balance: Number(balance) || 0,
        department: department || '--',
      };
      addInventoryVendor(newVendor);
      addToast('New vendor added successfully', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedVendor) {
      deleteInventoryVendor(selectedVendor.id);
      addToast('Vendor removed successfully', 'success');
    }
    setIsDeleteOpen(false);
  };

  const columns: Column<InventoryVendor>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Email ID', accessor: 'email' },
    { header: 'GST No.', accessor: 'gstNo' },
    {
      header: 'Balance',
      render: (row) => (
        <span className="font-semibold text-gray-800">
          ₹{row.balance.toLocaleString()}
        </span>
      )
    },
    { header: 'Department', accessor: 'department' },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-200 hover:bg-red-50/50 text-red-600 text-xs font-semibold rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <PageHeader title="Vendors" subtitle="Manage your suppliers, balances, and departments">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </PageHeader>

        {/* Vendors DataTable */}
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={inventoryVendors}
            searchable={true}
            searchPlaceholder="Search vendors..."
            itemsPerPage={10}
          />
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-100 animate-scale-up">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-150 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-base">
                  {selectedVendor ? 'Edit Vendor Details' : 'Add New Vendor'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-gray-150/70 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Vendor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Laxmi Stores"
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. 9999999999"
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. vendor@shop.com"
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={gstNo}
                      onChange={(e) => setGstNo(e.target.value)}
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Opening Balance (₹)
                    </label>
                    <input
                      type="number"
                      value={balance}
                      onChange={(e) => setBalance(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Associated Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Vegetables, Grocery, Kitchen"
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-3 justify-end mt-2 pt-4 border-t border-gray-150">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteOpen(false)}
          title={`Delete Vendor "${selectedVendor?.name}"?`}
          subtext="Warning: Removing this vendor will delete their profile and balance information permanently."
        />
      </main>
    </div>
  );
};
