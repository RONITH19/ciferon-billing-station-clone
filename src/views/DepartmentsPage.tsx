import React, { useState, useEffect } from 'react';
import { useStore, Department } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { inventorySidebarSections } from './InventoryLandingPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { Trash2, ArrowLeft, Plus, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DepartmentsPage: React.FC = () => {
  const { departments, addDepartment, deleteDepartment, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deptName, setDeptName] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) {
      addToast('Department name is required', 'warning');
      return;
    }

    const newDept: Department = {
      id: Math.random().toString(36).substring(2, 9),
      name: deptName.trim(),
    };
    addDepartment(newDept);
    addToast(`Department "${newDept.name}" created`, 'success');
    setDeptName('');
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    deleteDepartment(id);
    addToast(`Department "${name}" deleted`, 'success');
  };

  const columns: Column<Department>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => <span className="font-bold text-gray-800">{row.name}</span>,
    },
    {
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id, row.name)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)]">
        <PageHeader title="Departments">
          <Link
            to="/inventory/landing"
            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </PageHeader>

        {isFormOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden p-6 animate-scale-up"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-gray-900">New Department</h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Kitchen Raw Materials"
                  className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
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
          data={departments}
          isLoading={isLoading}
          searchPlaceholder="Search departments..."
          searchKey="name"
        />
      </main>
    </div>
  );
};
