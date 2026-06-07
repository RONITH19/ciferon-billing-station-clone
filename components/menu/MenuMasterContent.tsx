'use client';

import {
  ADDONS_DATA,
  CATEGORIES_DATA,
  ITEMS_DATA,
  SUB_CATEGORIES_DATA,
  VARIANTS_DATA,
} from '@/lib/menu-data';
import {
  EmptyState,
  LoadingState,
  Pagination,
  RowActions,
  SearchBox,
  SortIcon,
  useSearchFilter,
} from './MenuTableParts';

function SuperCategoriesPanel() {
  return (
    <section className="data-panel">
      <div className="data-panel-toolbar">
        <h2 className="data-panel-title">Super Categories</h2>
        <button type="button" className="btn-new">
          New
        </button>
      </div>
      <div className="data-panel-card">
        <SearchBox />
        <div className="data-table">
          <div className="data-table-head cols-super">
            <div className="data-col data-col-name">
              Name <SortIcon />
            </div>
            <div className="data-col data-col-order">DisplayOrder</div>
            <div className="data-col data-col-action">Action</div>
          </div>
          <EmptyState />
        </div>
      </div>
    </section>
  );
}

function CategoriesPanel() {
  const { setQuery, filtered } = useSearchFilter(CATEGORIES_DATA, (row) => row.name);

  return (
    <section className="data-panel">
      <div className="data-panel-toolbar">
        <h2 className="data-panel-title">Categories</h2>
        <button type="button" className="btn-new">
          New
        </button>
      </div>
      <div className="data-panel-card">
        <SearchBox onSearch={setQuery} />
        <div className="data-table">
          <div className="data-table-head cols-categories">
            <div className="data-col">
              Name <SortIcon />
            </div>
            <div className="data-col">
              Online Display Name <SortIcon />
            </div>
            <div className="data-col data-col-center">
              No. Of Items <SortIcon />
            </div>
            <div className="data-col data-col-action">Action</div>
          </div>
          <div className="data-table-body">
            {filtered.map((row) => (
              <div key={row.name} className="data-table-row cols-categories">
                <div className="data-col">{row.name}</div>
                <div className="data-col data-col-muted">{row.onlineDisplayName}</div>
                <div className="data-col data-col-center">{row.itemCount}</div>
                <div className="data-col data-col-actions">
                  <RowActions />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SubCategoriesPanel() {
  const { setQuery, filtered } = useSearchFilter(SUB_CATEGORIES_DATA, (row) => `${row.name} ${row.category}`);

  return (
    <section className="data-panel">
      <div className="data-panel-toolbar">
        <h2 className="data-panel-title">Sub-Categories</h2>
        <button type="button" className="btn-new">
          New
        </button>
      </div>
      <div className="data-panel-card">
        <SearchBox onSearch={setQuery} />
        <div className="data-table">
          <div className="data-table-head cols-sub">
            <div className="data-col">
              Name <SortIcon />
            </div>
            <div className="data-col">
              Category <SortIcon />
            </div>
            <div className="data-col data-col-action">Action</div>
          </div>
          <div className="data-table-body">
            {filtered.map((row) => (
              <div key={`${row.name}-${row.category}`} className="data-table-row cols-sub">
                <div className="data-col">{row.name}</div>
                <div className="data-col data-col-muted">{row.category}</div>
                <div className="data-col data-col-actions">
                  <RowActions />
                </div>
              </div>
            ))}
          </div>
          <Pagination />
        </div>
      </div>
    </section>
  );
}

function ItemsPanel() {
  const { setQuery, filtered } = useSearchFilter(
    ITEMS_DATA,
    (row) => `${row.name} ${row.displayName} ${row.category} ${row.shortCode}`,
  );

  return (
    <section className="data-panel">
      <div className="data-panel-toolbar">
        <h2 className="data-panel-title">Items</h2>
        <div className="toolbar-actions">
          <button type="button" className="btn-new">
            New
          </button>
          <button type="button" className="btn-export">
            Export{' '}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
      <div className="data-panel-card">
        <SearchBox onSearch={setQuery} />
        <div className="data-table data-table-scroll">
          <div className="data-table-head cols-items">
            <div className="data-col">
              Name <SortIcon />
            </div>
            <div className="data-col">
              Online Display Name <SortIcon />
            </div>
            <div className="data-col">
              Category <SortIcon />
            </div>
            <div className="data-col">
              Short Code <SortIcon />
            </div>
            <div className="data-col data-col-center">
              Base Price <SortIcon />
            </div>
            <div className="data-col data-col-center">
              Tax <SortIcon />
            </div>
            <div className="data-col data-col-center">
              MRP <SortIcon />
            </div>
            <div className="data-col data-col-action">Action</div>
          </div>
          <div className="data-table-body">
            {filtered.map((row) => (
              <div key={row.name} className="data-table-row cols-items">
                <div className="data-col">{row.name}</div>
                <div className="data-col">{row.displayName}</div>
                <div className="data-col data-col-muted">{row.category}</div>
                <div className="data-col data-col-muted">{row.shortCode}</div>
                <div className="data-col data-col-center">{row.basePrice}</div>
                <div className="data-col data-col-center">{row.tax}</div>
                <div className="data-col data-col-center">{row.mrp}</div>
                <div className="data-col data-col-actions">
                  <RowActions showClone />
                </div>
              </div>
            ))}
          </div>
          <Pagination />
        </div>
      </div>
    </section>
  );
}

function AddonsPanel() {
  return (
    <section className="data-panel">
      <div className="data-panel-toolbar">
        <h2 className="data-panel-title">Addons</h2>
        <div className="toolbar-actions">
          <button type="button" className="btn-export">
            Export{' '}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button type="button" className="btn-new">
            New
          </button>
        </div>
      </div>
      <div className="data-panel-card">
        <div className="data-table">
          <div className="data-table-head cols-addons">
            <div className="data-col">
              Name <SortIcon />
            </div>
            <div className="data-col">
              Display Name <SortIcon />
            </div>
            <div className="data-col">
              Items <SortIcon />
            </div>
            <div className="data-col data-col-action">Action</div>
          </div>
          <div className="data-table-body">
            {ADDONS_DATA.map((row) => (
              <div key={row.name} className="data-table-row cols-addons">
                <div className="data-col">{row.name}</div>
                <div className="data-col">{row.displayName}</div>
                <div className="data-col data-col-muted">
                  {row.readMore ? (
                    <>
                      {row.items.split(', ').slice(0, 2).join(', ')}...{' '}
                      <a href="#" className="read-more-link">
                        Read more
                      </a>
                    </>
                  ) : (
                    row.items
                  )}
                </div>
                <div className="data-col data-col-actions">
                  <RowActions />
                </div>
              </div>
            ))}
          </div>
          <Pagination />
        </div>
      </div>
    </section>
  );
}

function VariantsPanel() {
  const { setQuery, filtered } = useSearchFilter(VARIANTS_DATA, (name) => name);

  return (
    <section className="data-panel">
      <div className="data-panel-toolbar">
        <h2 className="data-panel-title">Variants</h2>
        <button type="button" className="btn-new">
          New
        </button>
      </div>
      <div className="data-panel-card">
        <SearchBox onSearch={setQuery} />
        <div className="data-table">
          <div className="data-table-head cols-variants">
            <div className="data-col">
              Name <SortIcon />
            </div>
            <div className="data-col data-col-action">Action</div>
          </div>
          <div className="data-table-body">
            {filtered.map((name) => (
              <div key={name} className="data-table-row cols-variants">
                <div className="data-col">{name}</div>
                <div className="data-col data-col-actions">
                  <RowActions />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmenuPanel() {
  return (
    <section className="data-panel">
      <div className="data-panel-toolbar">
        <h2 className="data-panel-title">Submenu</h2>
        <button type="button" className="btn-new">
          New
        </button>
      </div>
      <div className="data-panel-card">
        <div className="search-toolbar">
          <SearchBox />
          <label className="inactive-toggle">
            <input type="checkbox" /> Show Inactive Submenu
          </label>
        </div>
        <div className="data-table">
          <LoadingState />
        </div>
      </div>
    </section>
  );
}

const PANELS: Record<string, () => React.ReactNode> = {
  'super-categories': SuperCategoriesPanel,
  categories: CategoriesPanel,
  'sub-categories': SubCategoriesPanel,
  items: ItemsPanel,
  addons: AddonsPanel,
  variants: VariantsPanel,
  submenu: SubmenuPanel,
};

export default function MenuMasterContent({ slug }: { slug: string }) {
  const Panel = PANELS[slug];
  if (!Panel) return null;
  return <Panel />;
}
