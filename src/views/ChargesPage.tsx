import React, { useState, useEffect } from 'react';
import { useStore, Charge } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Edit2, Trash2, X, ArrowLeft, Save, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AssignedItem {
  id: string;
  name: string;
}

export const ChargesPage: React.FC = () => {
  const { charges, addCharge, updateCharge, deleteCharge, addToast } = useStore();
  
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'create'>('list');
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [tax, setTax] = useState('GST 0%');
  const [applyAutomatically, setApplyAutomatically] = useState(false);
  const [applicableOn, setApplicableOn] = useState<'Item' | 'Order'>('Item');
  
  // Order types checkboxes (Delivery, Pickup, Dine In)
  const [orderTypes, setOrderTypes] = useState<string[]>(['Delivery', 'Pickup']);
  
  // Conditions
  const [isActive, setIsActive] = useState(true);
  const [enableInPOS, setEnableInPOS] = useState(false);
  const [enableZomato, setEnableZomato] = useState(true);
  const [enableSwiggy, setEnableSwiggy] = useState(true);
  const [enableContactless, setEnableContactless] = useState(false);

  // Assigned items mapping table
  const [assignedItems, setAssignedItems] = useState<AssignedItem[]>([
    { id: 'item-1', name: 'Yum Yum Meal - Sushi & Soup' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  // Dropdown list options
  const categoriesList = ['Tea And Snacks', 'Bar & Brewery', 'Mandhi', 'Favorite Pizza'];
  const itemsListMap: Record<string, string[]> = {
    'Tea And Snacks': ['AMUL PROCESSED CHEESE', 'Atta', 'Capsicum', 'Chicken 65', 'KIM JUMBO BREAD', 'Noodles', 'Pepsi Bottle', 'Potato'],
    'Bar & Brewery': ['Jack Daniels Bottle', 'JHONY WALKER WHISKY 90ML', 'Jim Beam Bottle', 'Jw Red Label Bottle', 'Teacher Highland Bottle'],
    'Mandhi': ['Chicken Mandhi'],
    'Favorite Pizza': ['Peppy Paneer Pizza Large 14 Inch']
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const menuSidebarSections = [
    {
      label: 'Outlet Settings',
      items: [
        { label: 'Charges', href: '/catalogue/charges' },
        { label: 'Kitchens', href: '/catalogue/kitchens' },
      ],
    },
  ];

  const handleOpenAdd = () => {
    setSelectedCharge(null);
    setName('');
    setTax('GST 0%');
    setApplyAutomatically(false);
    setApplicableOn('Item');
    setOrderTypes(['Delivery', 'Pickup']);
    setIsActive(true);
    setEnableInPOS(false);
    setEnableZomato(true);
    setEnableSwiggy(true);
    setEnableContactless(false);
    setAssignedItems([{ id: 'item-1', name: 'Yum Yum Meal - Sushi & Soup' }]);
    setViewMode('create');
  };

  const handleOpenEdit = (charge: Charge) => {
    setSelectedCharge(charge);
    setName(charge.name);
    setTax('GST 0%');
    setApplyAutomatically(false);
    setApplicableOn('Item');
    setOrderTypes(['Delivery', 'Pickup']);
    setIsActive(true);
    setEnableInPOS(false);
    setEnableZomato(true);
    setEnableSwiggy(true);
    setEnableContactless(false);
    setAssignedItems([{ id: 'item-1', name: 'Yum Yum Meal - Sushi & Soup' }]);
    setViewMode('edit');
  };

  const handleSaveCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter a charge name', 'warning');
      return;
    }

    if (viewMode === 'edit' && selectedCharge) {
      updateCharge(selectedCharge.id, name.trim());
      addToast('Charge settings updated successfully', 'success');
    } else {
      const newCharge: Charge = {
        id: Math.random().toString(36).substring(2, 9),
        name: name.trim(),
      };
      addCharge(newCharge);
      addToast('New charge created successfully', 'success');
    }
    setViewMode('list');
  };

  const handleOpenDelete = (id: string) => {
    setSelectedChargeId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedChargeId) {
      deleteCharge(selectedChargeId);
      addToast('Charge deleted successfully', 'success');
    }
    setIsDeleteOpen(false);
    setSelectedChargeId(null);
  };

  // Toggle order type tag
  const toggleOrderType = (type: string) => {
    setOrderTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Map Category/Item
  const handleAddMappedItem = () => {
    if (!selectedItem) {
      addToast('Please select an item first', 'warning');
      return;
    }
    if (assignedItems.some((i) => i.name === selectedItem)) {
      addToast('Item is already assigned to this charge', 'info');
      return;
    }
    const newItem = {
      id: 'item-' + Math.random().toString(36).substring(2, 5),
      name: selectedItem
    };
    setAssignedItems([...assignedItems, newItem]);
    addToast(`Mapped "${selectedItem}" to charge`, 'success');
  };

  const handleAddAllItems = () => {
    if (!selectedCategory) {
      addToast('Please select a category first', 'warning');
      return;
    }
    const items = itemsListMap[selectedCategory] || [];
    const newItems = items
      .filter((name) => !assignedItems.some((i) => i.name === name))
      .map((name) => ({
        id: 'item-' + Math.random().toString(36).substring(2, 5),
        name
      }));

    if (newItems.length === 0) {
      addToast('All items in this category are already mapped', 'info');
      return;
    }
    setAssignedItems([...assignedItems, ...newItems]);
    addToast(`Mapped all items from "${selectedCategory}"`, 'success');
  };

  const handleDeleteMappedItem = (id: string, itemName: string) => {
    setAssignedItems(assignedItems.filter((i) => i.id !== id));
    addToast(`Unmapped "${itemName}"`, 'info');
  };

  const columns: Column<Charge>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => <span className="font-bold text-gray-800 text-sm">{row.name}</span>,
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5 text-gray-400" />
            Edit
          </button>
          <button
            onClick={() => handleOpenDelete(row.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-100 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition-all"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={menuSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        {viewMode === 'list' ? (
          /* List Mode */
          <>
            <PageHeader title="Charges">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </PageHeader>

            <DataTable
              columns={columns}
              data={charges}
              isLoading={isLoading}
              searchPlaceholder="Search charges..."
              searchKey="name"
              itemsPerPage={10}
            />
          </>
        ) : (
          /* Create / Edit Mode (aligned with "Edit Charge" screenshot) */
          <form onSubmit={handleSaveCharge} className="flex flex-col gap-6">
            <PageHeader title={viewMode === 'edit' ? 'Edit Charge' : 'New Charge'}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-750 text-sm font-semibold rounded-xl transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </PageHeader>

            {/* Three Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Card 1: Basic Details */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4 min-h-[260px]">
                <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2">
                  Basic Details
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Packaging Charges Platter"
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-750"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Tax
                  </label>
                  <select
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700"
                  >
                    <option value="GST 0%">GST 0%</option>
                    <option value="GST 5%">GST 5%</option>
                    <option value="GST 12%">GST 12%</option>
                    <option value="GST 18%">GST 18%</option>
                  </select>
                </div>

                <div className="flex items-center justify-between px-4 py-2 border border-gray-150 hover:bg-gray-50 rounded-xl cursor-pointer select-none mt-1"
                     onClick={() => setApplyAutomatically(!applyAutomatically)}>
                  <span className="text-xs font-semibold text-gray-700">Apply this charge automatically</span>
                  <input
                    type="checkbox"
                    checked={applyAutomatically}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Card 2: Order Type */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4 min-h-[260px]">
                <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2">
                  Order Type
                </h3>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Applicable on
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="applicableOn"
                        checked={applicableOn === 'Item'}
                        onChange={() => setApplicableOn('Item')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      Item
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="applicableOn"
                        checked={applicableOn === 'Order'}
                        onChange={() => setApplicableOn('Order')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      Order
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Order type
                  </label>
                  <div className="border border-gray-250 rounded-xl p-3 bg-white flex flex-wrap gap-2 min-h-[60px] items-center">
                    {['Delivery', 'Pickup', 'Dine In'].map((type) => {
                      const isSelected = orderTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleOrderType(type)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-650'
                          }`}
                        >
                          {type}
                          {isSelected && <span className="text-[10px]">×</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Click order type tags to toggle them on or off for this charge.
                  </p>
                </div>
              </div>

              {/* Card 3: Conditions */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3 min-h-[260px]">
                <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2">
                  Conditions
                </h3>

                {[
                  { label: 'Mark this Active', val: isActive, set: setIsActive },
                  { label: 'Enable in POS', val: enableInPOS, set: setEnableInPOS },
                  { label: 'Enable this charge for Zomato', val: enableZomato, set: setEnableZomato },
                  { label: 'Enable this charge for Swiggy', val: enableSwiggy, set: setEnableSwiggy },
                  { label: 'Enable this charge for Contactless', val: enableContactless, set: setEnableContactless },
                ].map((cond, idx) => (
                  <div
                    key={idx}
                    onClick={() => cond.set(!cond.val)}
                    className="flex items-center justify-between px-3.5 py-1.5 border border-gray-150 hover:bg-gray-50 rounded-xl cursor-pointer select-none transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-700">{cond.label}</span>
                    <input
                      type="checkbox"
                      checked={cond.val}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Section: Select Item or Category Mapping Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-6">
              <div className="p-5 border-b border-gray-150 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-sm">
                  Select Item or Category
                </h3>
              </div>

              <div className="p-5 flex flex-col gap-5">
                {/* Dropdowns row */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 bg-gray-50/40 p-4 border border-gray-150 rounded-2xl">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Select Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedItem('');
                      }}
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-xs font-semibold focus:outline-none text-gray-700"
                    >
                      <option value="">Search here</option>
                      {categoriesList.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Select Item
                    </label>
                    <select
                      value={selectedItem}
                      disabled={!selectedCategory}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-xs font-semibold focus:outline-none text-gray-700 disabled:opacity-50"
                    >
                      <option value="">Search here</option>
                      {(itemsListMap[selectedCategory] || []).map((itm) => (
                        <option key={itm} value={itm}>
                          {itm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      disabled={!selectedItem}
                      onClick={handleAddMappedItem}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                    >
                      Add Item
                    </button>
                    <button
                      type="button"
                      disabled={!selectedCategory}
                      onClick={handleAddAllItems}
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 text-xs font-semibold rounded-xl transition-all"
                    >
                      All
                    </button>
                  </div>
                </div>

                {/* Mapping list table */}
                <table className="w-full text-left border-collapse border border-gray-150 rounded-xl overflow-hidden text-xs mt-2">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-150">
                      <th className="px-5 py-3 w-20 text-center">Sr. No.</th>
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3 w-32 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {assignedItems.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-gray-400 font-bold">
                          No items mapped to this charge yet. Select a category/item to add.
                        </td>
                      </tr>
                    ) : (
                      assignedItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-gray-50/20">
                          <td className="px-5 py-3 text-center text-gray-500 font-bold">{idx + 1}</td>
                          <td className="px-5 py-3 font-bold text-gray-800">{item.name}</td>
                          <td className="px-5 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteMappedItem(item.id, item.name)}
                              className="px-3 py-1.5 border border-red-100 hover:bg-red-50 text-red-600 font-bold rounded-lg transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </form>
        )}

        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      </main>
    </div>
  );
};
