'use client';

import Image from 'next/image';
import { useState } from 'react';

export function SortIcon() {
  return (
    <span className="sort-icons" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 6l-4 4h8l-4-4z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 18l4-4H8l4 4z" />
      </svg>
    </span>
  );
}

export function RowActions({
  showClone = false,
  onEdit,
  onDelete,
  onClone,
}: {
  showClone?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClone?: () => void;
}) {
  return (
    <>
      <button type="button" className="row-action-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        View Log
      </button>
      <button type="button" className="row-action-btn" onClick={onEdit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>
      <button type="button" className="row-action-btn row-action-delete" onClick={onDelete}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Delete
      </button>
      {showClone && (
        <button type="button" className="row-action-btn" onClick={onClone}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Clone
        </button>
      )}
    </>
  );
}

export function SearchBox({ placeholder = 'Search', onSearch }: { placeholder?: string; onSearch?: (query: string) => void }) {
  return (
    <div className="search-box">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
      <input
        type="search"
        className="search-input table-search"
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onSearch?.(e.target.value.trim().toLowerCase())}
      />
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="empty-state">
      <Image src="/assets/empty-records.svg" alt="" width={180} height={140} />
      <h3 className="empty-state-title">No records found.</h3>
      <p className="empty-state-text">Check your filters or try creating a new record.</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner" aria-label="Loading" />
    </div>
  );
}

export function Pagination() {
  return (
    <div className="table-pagination">
      <button type="button" className="page-btn" disabled>
        &lsaquo;
      </button>
      {[1, 2, 3, 4, 5].map((page) => (
        <button key={page} type="button" className={`page-btn${page === 1 ? ' active' : ''}`}>
          {page}
        </button>
      ))}
      <button type="button" className="page-btn">
        &rsaquo;
      </button>
    </div>
  );
}

export function useSearchFilter<T>(data: T[], getText: (row: T) => string) {
  const [query, setQuery] = useState('');
  const filtered = query
    ? data.filter((row) => getText(row).toLowerCase().includes(query))
    : data;
  return { query, setQuery, filtered };
}
