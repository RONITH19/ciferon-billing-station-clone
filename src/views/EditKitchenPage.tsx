import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore, Kitchen, KitchenMenuItem } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { ArrowLeft, Save, Trash2, Printer } from 'lucide-react';

export const EditKitchenPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { kitchens, updateKitchen, addToast } = useStore();

  const isEditMode = !!id;
  const kitchen = isEditMode ? (kitchens.find((k) => k.id === id) || kitchens[0]) : null;

  // Form local state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [disablePrints, setDisablePrints] = useState(false);
  const [mainPrinterName, setMainPrinterName] = useState('');
  const [mainPrinterType, setMainPrinterType] = useState('USB');
  const [altPrinterName, setAltPrinterName] = useState('');
  const [altPrinterType, setAltPrinterType] = useState('USB');
  const [dineInTokenPrinter, setDineInTokenPrinter] = useState('');
  const [pickupPrinterName, setPickupPrinterName] = useState('');
  const [deliveryPrinterName, setDeliveryPrinterName] = useState('');

  // Assigned items mapping table
  const [menuItems, setMenuItems] = useState<KitchenMenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  // Dropdown list options
  const categoriesList = ['Tea And Snacks', 'Bar & Brewery', 'Mandhi', 'Favorite Pizza'];
  const itemsListMap: Record<string, string[]> = {
    'Tea And Snacks': ['1 Coke (Reg) - DM', '1 French Fries - DM', 'AMUL PROCESSED CHEESE', 'Atta', 'Capsicum', 'Chicken 65', 'KIM JUMBO BREAD', 'Noodles', 'Pepsi Bottle', 'Potato'],
    'Bar & Brewery': ['Jack Daniels Bottle', 'JHONY WALKER WHISKY 90ML', 'Jim Beam Bottle', 'Jw Red Label Bottle', 'Teacher Highland Bottle'],
    'Mandhi': ['Chicken Mandhi'],
    'Favorite Pizza': ['Peppy Paneer Pizza Large 14 Inch']
  };

  // Sync state with store on load
  useEffect(() => {
    if (isEditMode && kitchen) {
      setName(kitchen.name);
      setDescription(kitchen.description);
      setDisablePrints(kitchen.disablePrints);
      setMainPrinterName(kitchen.mainPrinterName);
      setMainPrinterType(kitchen.mainPrinterType);
      setAltPrinterName(kitchen.altPrinterName);
      setAltPrinterType(kitchen.altPrinterType);
      setDineInTokenPrinter(kitchen.dineInTokenPrinter);
      setPickupPrinterName(kitchen.pickupPrinterName);
      setDeliveryPrinterName(kitchen.deliveryPrinterName);
      setMenuItems(kitchen.menuItems || []);
    } else {
      setName('');
      setDescription('');
      setDisablePrints(false);
      setMainPrinterName('');
      setMainPrinterType('USB');
      setAltPrinterName('');
      setAltPrinterType('USB');
      setDineInTokenPrinter('');
      setPickupPrinterName('');
      setDeliveryPrinterName('');
      setMenuItems([
        { id: '1', name: '1 Coke (Reg) - DM' },
        { id: '2', name: '1 French Fries - DM' }
      ]);
    }
  }, [kitchen, isEditMode]);

  const menuSidebarSections = [
    {
      label: 'Outlet Settings',
      items: [
        { label: 'Charges', href: '/catalogue/charges' },
        { label: 'Kitchens', href: '/catalogue/kitchens' },
      ],
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Kitchen Name is required', 'warning');
      return;
    }
    if (!mainPrinterName.trim()) {
      addToast('Main Printer Name is required', 'warning');
      return;
    }

    if (isEditMode && kitchen) {
      // Edit
      updateKitchen(kitchen.id, {
        name: name.trim(),
        description: description.trim(),
        disablePrints,
        mainPrinterName: mainPrinterName.trim(),
        mainPrinterType,
        altPrinterName: altPrinterName.trim(),
        altPrinterType,
        dineInTokenPrinter: dineInTokenPrinter.trim(),
        pickupPrinterName: pickupPrinterName.trim(),
        deliveryPrinterName: deliveryPrinterName.trim(),
        menuItems
      });
      addToast('Kitchen configuration saved successfully', 'success');
    } else {
      // Add
      const newKitchen: Kitchen = {
        id: 'kot-' + Math.random().toString(36).substring(2, 5),
        name: name.trim(),
        description: description.trim(),
        disablePrints,
        mainPrinterName: mainPrinterName.trim(),
        mainPrinterType,
        altPrinterName: altPrinterName.trim(),
        altPrinterType,
        dineInTokenPrinter: dineInTokenPrinter.trim(),
        pickupPrinterName: pickupPrinterName.trim(),
        deliveryPrinterName: deliveryPrinterName.trim(),
        menuItems
      };
      // For demonstration we push it to state
      useStore.setState((state) => ({
        kitchens: [...state.kitchens, newKitchen]
      }));
      addToast('New kitchen group added successfully', 'success');
    }

    navigate('/catalogue/kitchens');
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    setMenuItems(menuItems.filter((i) => i.id !== itemId));
    addToast(`Removed item "${itemName}" from kitchen mapping`, 'info');
  };

  const handleDeleteAllItems = () => {
    setMenuItems([]);
    addToast('Cleared all mapped menu items', 'info');
  };

  const handleAddMappedItem = () => {
    if (!selectedItem) {
      addToast('Please select an item first', 'warning');
      return;
    }
    if (menuItems.some((i) => i.name === selectedItem)) {
      addToast('Item is already assigned to this kitchen', 'info');
      return;
    }
    const newItem = {
      id: 'menu-' + Math.random().toString(36).substring(2, 5),
      name: selectedItem
    };
    setMenuItems([...menuItems, newItem]);
    addToast(`Mapped "${selectedItem}" to kitchen`, 'success');
  };

  const handleAddAllItems = () => {
    if (!selectedCategory) {
      addToast('Please select a category first', 'warning');
      return;
    }
    const items = itemsListMap[selectedCategory] || [];
    const newItems = items
      .filter((name) => !menuItems.some((i) => i.name === name))
      .map((name) => ({
        id: 'menu-' + Math.random().toString(36).substring(2, 5),
        name
      }));

    if (newItems.length === 0) {
      addToast('All items in this category are already mapped', 'info');
      return;
    }
    setMenuItems([...menuItems, ...newItems]);
    addToast(`Mapped all items from "${selectedCategory}"`, 'success');
  };

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={menuSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <PageHeader title={isEditMode ? 'Edit Kitchen' : 'Add New Kitchen'}>
            <Link
              to="/catalogue/kitchens"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </PageHeader>

          {/* Form fields row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Block: Basic Information */}
            <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4 min-h-[360px]">
              <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Kitchen Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. KOT"
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-750"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Printer group for KOTs"
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-750"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 border border-gray-150 hover:bg-gray-50 rounded-xl cursor-pointer select-none mt-2"
                   onClick={() => setDisablePrints(!disablePrints)}>
                <span className="text-xs font-semibold text-gray-700">Disable Prints from this Printer</span>
                <input
                  type="checkbox"
                  checked={disablePrints}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Right Block: Printer Config */}
            <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-4 min-h-[360px]">
              <h3 className="text-sm font-extrabold text-gray-800 border-b pb-2">
                Printer Config
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Main Printer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={mainPrinterName}
                    onChange={(e) => setMainPrinterName(e.target.value)}
                    placeholder="e.g. KITCHEN"
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Main Printer Type
                  </label>
                  <select
                    value={mainPrinterType}
                    onChange={(e) => setMainPrinterType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none font-semibold text-gray-700"
                  >
                    <option value="Network">Network</option>
                    <option value="USB">USB</option>
                    <option value="Bluetooth">Bluetooth</option>
                    <option value="Wi-Fi">Wi-Fi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Alternate Printer Name
                  </label>
                  <input
                    type="text"
                    value={altPrinterName}
                    onChange={(e) => setAltPrinterName(e.target.value)}
                    placeholder="e.g. KITCHEN_ALT"
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Alternate Printer Type
                  </label>
                  <select
                    value={altPrinterType}
                    onChange={(e) => setAltPrinterType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none font-semibold text-gray-700"
                  >
                    <option value="Network">Network</option>
                    <option value="USB">USB</option>
                    <option value="Bluetooth">Bluetooth</option>
                    <option value="Wi-Fi">Wi-Fi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">
                    DineIn/Token Printer
                  </label>
                  <input
                    type="text"
                    value={dineInTokenPrinter}
                    onChange={(e) => setDineInTokenPrinter(e.target.value)}
                    placeholder="DineIn Printer Name"
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">
                    Pickup Printer
                  </label>
                  <input
                    type="text"
                    value={pickupPrinterName}
                    onChange={(e) => setPickupPrinterName(e.target.value)}
                    placeholder="Pickup Printer Name"
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">
                    Delivery Printer
                  </label>
                  <input
                    type="text"
                    value={deliveryPrinterName}
                    onChange={(e) => setDeliveryPrinterName(e.target.value)}
                    placeholder="Delivery Printer Name"
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Area: Select Item or Category Mapping Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-6">
            <div className="p-5 border-b border-gray-150 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm">
                Select Item or Category
              </h3>
              {menuItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteAllItems}
                  className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-650 text-xs font-bold rounded-xl transition-all"
                >
                  Delete All
                </button>
              )}
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
                  {menuItems.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-gray-400 font-bold">
                        No menu items mapped to this kitchen yet. Select a category/item to add.
                      </td>
                    </tr>
                  ) : (
                    menuItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-gray-50/20">
                        <td className="px-5 py-3 text-center text-gray-500 font-bold">{idx + 1}</td>
                        <td className="px-5 py-3 font-bold text-gray-800">{item.name}</td>
                        <td className="px-5 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="px-3 py-1.5 border border-red-100 hover:bg-red-50 text-red-650 font-bold rounded-lg transition-all"
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
      </main>
    </div>
  );
};
