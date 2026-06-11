import React, { useState, useEffect } from 'react';
import { useStore, Employee } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { accountingSidebarSections } from './AccountingLandingPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Edit2, Trash2, X, Check, ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountingEmployeesPage: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Form modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeEmpId, setActiveEmpId] = useState<string | null>(null);

  // Input states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setName('');
    setMobile('');
    setDesignation('--');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditMode(true);
    setActiveEmpId(emp.id);
    setName(emp.name);
    setMobile(emp.mobile);
    setDesignation(emp.designation);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Employee Name is required', 'warning');
      return;
    }

    if (editMode && activeEmpId) {
      updateEmployee(activeEmpId, {
        name: name.trim(),
        mobile: mobile.trim(),
        designation: designation.trim(),
      });
      addToast('Employee details updated successfully', 'success');
    } else {
      const newEmp: Employee = {
        id: Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        mobile: mobile.trim(),
        designation: designation.trim(),
      };
      addEmployee(newEmp);
      addToast(`Employee "${newEmp.name}" added successfully`, 'success');
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setSelectedEmployeeId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEmployeeId) {
      deleteEmployee(selectedEmployeeId);
      addToast('Employee record deleted', 'success');
    }
    setIsDeleteOpen(false);
    setSelectedEmployeeId(null);
  };

  const columns: Column<Employee>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => <span className="font-bold text-gray-800">{row.name}</span>,
    },
    { header: 'Mobile', accessor: 'mobile' },
    {
      header: 'Designation',
      accessor: 'designation',
      render: (row) => <span className="text-gray-500 font-semibold">{row.designation}</span>,
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Edit2 className="w-3 h-3 text-gray-400" />
            Edit
          </button>
          <button
            onClick={() => handleOpenDelete(row.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-red-600 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={accountingSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto h-[calc(100vh-56px)] scrollbar-thin">
        {/* Header container styled matching screenshot 4 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 mb-5 gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
              Employees
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to="/accounts/landing"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1 px-4 py-2 border border-blue-600 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden p-6 animate-scale-up"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  {editMode ? 'Edit Employee Details' : 'New Employee'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amit"
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                    Mobile / Phone
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9877788888"
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Captain, Delivery Boy"
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all text-xs"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        <DataTable
          columns={columns}
          data={employees}
          isLoading={isLoading}
          searchPlaceholder="Search employees..."
          searchKey="name"
          itemsPerPage={10}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      </main>
    </div>
  );
};
