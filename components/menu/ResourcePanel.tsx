'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  apiClone,
  apiCreate,
  apiDelete,
  apiList,
  apiUpdate,
} from '@/lib/api-client';
import { EmptyState, LoadingState, RowActions, SearchBox, SortIcon } from './MenuTableParts';
import { ConfirmModal, FormModal, type FormFieldDef } from './FormModal';

export interface ColumnDef {
  header: string;
  key: string;
  center?: boolean;
  muted?: boolean;
  sortable?: boolean;
  render?: (row: Row) => React.ReactNode;
}

export type Row = Record<string, unknown> & { id: number };

export interface PanelConfig {
  title: string;
  resource: string;
  colsClass: string;
  columns: ColumnDef[];
  formFields: FormFieldDef[];
  searchable?: boolean;
  showClone?: boolean;
  showExport?: boolean;
  exportFirst?: boolean;
  scroll?: boolean;
  pageSize?: number;
}

function toCsv(columns: ColumnDef[], rows: Row[]): string {
  const head = columns.map((c) => `"${c.header}"`).join(',');
  const body = rows
    .map((r) => columns.map((c) => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  return `${head}\n${body}`;
}

export default function ResourcePanel({ config }: { config: PanelConfig }) {
  const {
    title,
    resource,
    colsClass,
    columns,
    formFields,
    searchable = true,
    showClone = false,
    showExport = false,
    exportFirst = false,
    scroll = false,
    pageSize,
  } = config;

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);

  const load = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        const data = await apiList<Row>(resource, q);
        setRows(data);
      } finally {
        setLoading(false);
      }
    },
    [resource],
  );

  useEffect(() => {
    const t = setTimeout(() => load(query), query ? 250 : 0);
    return () => clearTimeout(t);
  }, [query, load]);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages);
  const visible = pageSize
    ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sorted;

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const handleCreate = async (values: Record<string, string>) => {
    await apiCreate(resource, values);
    await load(query);
  };
  const handleUpdate = async (values: Record<string, string>) => {
    if (!editing) return;
    await apiUpdate(resource, editing.id, values);
    await load(query);
  };
  const handleDelete = async () => {
    if (!deleting) return;
    await apiDelete(resource, deleting.id);
    setDeleting(null);
    await load(query);
  };
  const handleClone = async (row: Row) => {
    await apiClone(resource, row.id);
    await load(query);
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(columns, sorted)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const newBtn = (
    <button type="button" className="btn-new" onClick={() => setCreating(true)}>
      New
    </button>
  );
  const exportBtn = showExport && (
    <button type="button" className="btn-export" onClick={exportCsv}>
      Export{' '}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );

  return (
    <section className="data-panel">
      <div className="data-panel-toolbar">
        <h2 className="data-panel-title">{title}</h2>
        <div className="toolbar-actions">
          {exportFirst ? (
            <>
              {exportBtn}
              {newBtn}
            </>
          ) : (
            <>
              {newBtn}
              {exportBtn}
            </>
          )}
        </div>
      </div>

      <div className="data-panel-card">
        {searchable && (
          <SearchBox
            onSearch={(q) => {
              setQuery(q);
              setPage(1);
            }}
          />
        )}

        <div className={`data-table${scroll ? ' data-table-scroll' : ''}`}>
          <div className={`data-table-head ${colsClass}`}>
            {columns.map((c) => (
              <div
                key={c.key}
                className={`data-col${c.center ? ' data-col-center' : ''}`}
                onClick={c.sortable === false ? undefined : () => toggleSort(c.key)}
                style={c.sortable === false ? undefined : { cursor: 'pointer' }}
              >
                {c.header} {c.sortable === false ? null : <SortIcon />}
              </div>
            ))}
            <div className="data-col data-col-action">Action</div>
          </div>

          {loading ? (
            <LoadingState />
          ) : visible.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="data-table-body">
              {visible.map((row) => (
                <div key={row.id} className={`data-table-row ${colsClass}`}>
                  {columns.map((c) => (
                    <div
                      key={c.key}
                      className={`data-col${c.center ? ' data-col-center' : ''}${
                        c.muted ? ' data-col-muted' : ''
                      }`}
                    >
                      {c.render ? c.render(row) : String(row[c.key] ?? '')}
                    </div>
                  ))}
                  <div className="data-col data-col-actions">
                    <RowActions
                      showClone={showClone}
                      onEdit={() => setEditing(row)}
                      onDelete={() => setDeleting(row)}
                      onClone={() => handleClone(row)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {pageSize && totalPages > 1 && (
            <div className="table-pagination">
              <button
                type="button"
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &lsaquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - currentPage) < 3 || p === 1 || p === totalPages)
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`page-btn${p === currentPage ? ' active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
              <button
                type="button"
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                &rsaquo;
              </button>
            </div>
          )}
        </div>
      </div>

      {creating && (
        <FormModal
          title={`New ${title}`}
          fields={formFields}
          initial={{}}
          onClose={() => setCreating(false)}
          onSubmit={handleCreate}
        />
      )}
      {editing && (
        <FormModal
          title={`Edit ${title}`}
          fields={formFields}
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={handleUpdate}
        />
      )}
      {deleting && (
        <ConfirmModal
          message={`Delete "${String(deleting[columns[0].key])}"? This cannot be undone.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
}
