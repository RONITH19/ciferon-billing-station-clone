import React, { useState, useEffect } from 'react';
import { EmptyState } from './EmptyState';
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T;
  onNew?: () => void;
  newButtonText?: string;
  isLoading?: boolean;
  itemsPerPage?: number;
}

export function DataTable<T extends { id?: string | number; [key: string]: any }>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search records...",
  searchKey,
  onNew,
  newButtonText = "New",
  isLoading = false,
  itemsPerPage = 5,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [localLoading, setLocalLoading] = useState(isLoading);

  // Sync external loading state
  useEffect(() => {
    setLocalLoading(isLoading);
  }, [isLoading]);

  // Handle Search Query changes and reset pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter data
  const filteredData = data.filter((row) => {
    if (!searchQuery) return true;
    
    if (searchKey) {
      const val = row[searchKey as string];
      return String(val ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    // Search across all accessors if no specific key
    return columns.some((col) => {
      if (col.accessor) {
        const val = row[col.accessor as string];
        return String(val ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
  });

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-300">
      
      {/* Header controls */}
      {(searchable || onNew) && (
        <div className="p-4 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/50">
          {searchable ? (
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
              />
            </div>
          ) : (
            <div />
          )}

          {onNew && (
            <button
              onClick={onNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-blue-600 hover:bg-blue-50 text-blue-600 hover:text-blue-700 text-sm font-semibold rounded-xl shadow-sm transition-all duration-150 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              {newButtonText}
            </button>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[220px] relative">
        {localLoading ? (
          /* Green Spinner Loading State */
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-4 border-green-100" />
                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
              </div>
              <span className="text-xs font-semibold text-green-600 tracking-wider">Loading details...</span>
            </div>
          </div>
        ) : null}

        {totalItems === 0 && !localLoading ? (
          <div className="p-8">
            <EmptyState />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 select-none">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id ?? rowIdx}
                  className="hover:bg-gray-50/55 transition-colors duration-150"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-sm text-gray-700">
                      {col.render
                        ? col.render(row, startIndex + rowIdx)
                        : col.accessor
                        ? String(row[col.accessor as string] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && !localLoading && (
        <div className="p-4 border-t border-gray-150 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
          <div className="text-xs font-medium text-gray-500 text-center sm:text-left">
            Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{' '}
            of <span className="font-semibold text-gray-700">{totalItems}</span> entries
          </div>

          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white text-gray-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
