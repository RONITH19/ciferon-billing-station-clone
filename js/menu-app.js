const SORT_ICON = `<span class="sort-icons" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6l-4 4h8l-4-4z"></path></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 18l4-4H8l4 4z"></path></svg></span>`;

const ACTION_VIEW = `<button type="button" class="row-action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>View Log</button>`;
const ACTION_EDIT = `<button type="button" class="row-action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>Edit</button>`;
const ACTION_DELETE = `<button type="button" class="row-action-btn row-action-delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>Delete</button>`;
const ACTION_CLONE = `<button type="button" class="row-action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Clone</button>`;

function renderMenuMastersNav(activeId) {
  const nav = document.getElementById('menu-masters-nav');
  if (!nav) return;

  nav.innerHTML = MENU_MASTERS.map((item) => {
    const active = activeId && item.id === activeId ? ' active' : '';
    const current = activeId && item.id === activeId ? ' aria-current="page"' : '';
    return `<a href="${item.href}" class="menu-sidebar-link${active}"${current}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg>
      ${item.label}
    </a>`;
  }).join('');
}

function renderSearchBox(placeholder = 'Search') {
  return `<div class="search-box">
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
    <input type="search" class="search-input table-search" placeholder="${placeholder}" aria-label="${placeholder}" />
  </div>`;
}

function renderEmptyState() {
  return `<div class="empty-state">
    <img src="assets/empty-records.svg" alt="" width="180" height="140" />
    <h3 class="empty-state-title">No records found.</h3>
    <p class="empty-state-text">Check your filters or try creating a new record.</p>
  </div>`;
}

function renderLoadingState() {
  return `<div class="loading-state"><div class="loading-spinner" aria-label="Loading"></div></div>`;
}

function renderPagination() {
  return `<div class="table-pagination"><button type="button" class="page-btn" disabled>&lsaquo;</button><button type="button" class="page-btn active">1</button><button type="button" class="page-btn">2</button><button type="button" class="page-btn">3</button><button type="button" class="page-btn">4</button><button type="button" class="page-btn">5</button><button type="button" class="page-btn">&rsaquo;</button></div>`;
}

function bindSearch(inputSelector, rowSelector) {
  const input = document.querySelector(inputSelector);
  if (!input) return;
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    document.querySelectorAll(rowSelector).forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.hidden = query && !text.includes(query);
    });
  });
}

function renderSuperCategories() {
  const root = document.getElementById('menu-page-root');
  root.innerHTML = `
    <section class="data-panel">
      <div class="data-panel-toolbar">
        <h2 class="data-panel-title">Super Categories</h2>
        <button type="button" class="btn-new">New</button>
      </div>
      <div class="data-panel-card">
        ${renderSearchBox()}
        <div class="data-table">
          <div class="data-table-head cols-super">
            <div class="data-col data-col-name">Name ${SORT_ICON}</div>
            <div class="data-col data-col-order">DisplayOrder</div>
            <div class="data-col data-col-action">Action</div>
          </div>
          ${renderEmptyState()}
        </div>
      </div>
    </section>`;
  bindSearch('.table-search', '.data-table-row');
}

function renderCategories() {
  const rows = CATEGORIES_DATA.map((row) => `
    <div class="data-table-row cols-categories">
      <div class="data-col">${row.name}</div>
      <div class="data-col data-col-muted">${row.onlineDisplayName}</div>
      <div class="data-col data-col-center">${row.itemCount}</div>
      <div class="data-col data-col-actions">${ACTION_VIEW}${ACTION_EDIT}${ACTION_DELETE}</div>
    </div>`).join('');

  document.getElementById('menu-page-root').innerHTML = `
    <section class="data-panel">
      <div class="data-panel-toolbar">
        <h2 class="data-panel-title">Categories</h2>
        <button type="button" class="btn-new">New</button>
      </div>
      <div class="data-panel-card">
        ${renderSearchBox()}
        <div class="data-table">
          <div class="data-table-head cols-categories">
            <div class="data-col">Name ${SORT_ICON}</div>
            <div class="data-col">Online Display Name ${SORT_ICON}</div>
            <div class="data-col data-col-center">No. Of Items ${SORT_ICON}</div>
            <div class="data-col data-col-action">Action</div>
          </div>
          <div class="data-table-body">${rows}</div>
        </div>
      </div>
    </section>`;
  bindSearch('.table-search', '.data-table-row');
}

function renderSubCategories() {
  const rows = SUB_CATEGORIES_DATA.map((row) => `
    <div class="data-table-row cols-sub">
      <div class="data-col">${row.name}</div>
      <div class="data-col data-col-muted">${row.category}</div>
      <div class="data-col data-col-actions">${ACTION_EDIT}${ACTION_DELETE}</div>
    </div>`).join('');

  document.getElementById('menu-page-root').innerHTML = `
    <section class="data-panel">
      <div class="data-panel-toolbar">
        <h2 class="data-panel-title">Sub-Categories</h2>
        <button type="button" class="btn-new">New</button>
      </div>
      <div class="data-panel-card">
        ${renderSearchBox()}
        <div class="data-table">
          <div class="data-table-head cols-sub">
            <div class="data-col">Name ${SORT_ICON}</div>
            <div class="data-col">Category ${SORT_ICON}</div>
            <div class="data-col data-col-action">Action</div>
          </div>
          <div class="data-table-body">${rows}</div>
          ${renderPagination()}
        </div>
      </div>
    </section>`;
  bindSearch('.table-search', '.data-table-row');
}

function renderItems() {
  const rows = ITEMS_DATA.map((row) => `
    <div class="data-table-row cols-items">
      <div class="data-col">${row.name}</div>
      <div class="data-col">${row.displayName}</div>
      <div class="data-col data-col-muted">${row.category}</div>
      <div class="data-col data-col-muted">${row.shortCode}</div>
      <div class="data-col data-col-center">${row.basePrice}</div>
      <div class="data-col data-col-center">${row.tax}</div>
      <div class="data-col data-col-center">${row.mrp}</div>
      <div class="data-col data-col-actions">${ACTION_VIEW}${ACTION_EDIT}${ACTION_DELETE}${ACTION_CLONE}</div>
    </div>`).join('');

  document.getElementById('menu-page-root').innerHTML = `
    <section class="data-panel">
      <div class="data-panel-toolbar">
        <h2 class="data-panel-title">Items</h2>
        <div class="toolbar-actions">
          <button type="button" class="btn-new">New</button>
          <button type="button" class="btn-export">Export <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
        </div>
      </div>
      <div class="data-panel-card">
        ${renderSearchBox()}
        <div class="data-table data-table-scroll">
          <div class="data-table-head cols-items">
            <div class="data-col">Name ${SORT_ICON}</div>
            <div class="data-col">Online Display Name ${SORT_ICON}</div>
            <div class="data-col">Category ${SORT_ICON}</div>
            <div class="data-col">Short Code ${SORT_ICON}</div>
            <div class="data-col data-col-center">Base Price ${SORT_ICON}</div>
            <div class="data-col data-col-center">Tax ${SORT_ICON}</div>
            <div class="data-col data-col-center">MRP ${SORT_ICON}</div>
            <div class="data-col data-col-action">Action</div>
          </div>
          <div class="data-table-body">${rows}</div>
          ${renderPagination()}
        </div>
      </div>
    </section>`;
  bindSearch('.table-search', '.data-table-row');
}

function renderAddons() {
  const rows = ADDONS_DATA.map((row) => {
    const items = row.readMore
      ? `${row.items.split(', ').slice(0, 2).join(', ')}... <a href="#" class="read-more-link">Read more</a>`
      : row.items;
    return `<div class="data-table-row cols-addons">
      <div class="data-col">${row.name}</div>
      <div class="data-col">${row.displayName}</div>
      <div class="data-col data-col-muted">${items}</div>
      <div class="data-col data-col-actions">${ACTION_VIEW}${ACTION_EDIT}${ACTION_DELETE}</div>
    </div>`;
  }).join('');

  document.getElementById('menu-page-root').innerHTML = `
    <section class="data-panel">
      <div class="data-panel-toolbar">
        <h2 class="data-panel-title">Addons</h2>
        <div class="toolbar-actions">
          <button type="button" class="btn-export">Export <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
          <button type="button" class="btn-new">New</button>
        </div>
      </div>
      <div class="data-panel-card">
        <div class="data-table">
          <div class="data-table-head cols-addons">
            <div class="data-col">Name ${SORT_ICON}</div>
            <div class="data-col">Display Name ${SORT_ICON}</div>
            <div class="data-col">Items ${SORT_ICON}</div>
            <div class="data-col data-col-action">Action</div>
          </div>
          <div class="data-table-body">${rows}</div>
          ${renderPagination()}
        </div>
      </div>
    </section>`;
}

function renderVariants() {
  const rows = VARIANTS_DATA.map((name) => `
    <div class="data-table-row cols-variants">
      <div class="data-col">${name}</div>
      <div class="data-col data-col-actions">${ACTION_VIEW}${ACTION_EDIT}${ACTION_DELETE}</div>
    </div>`).join('');

  document.getElementById('menu-page-root').innerHTML = `
    <section class="data-panel">
      <div class="data-panel-toolbar">
        <h2 class="data-panel-title">Variants</h2>
        <button type="button" class="btn-new">New</button>
      </div>
      <div class="data-panel-card">
        ${renderSearchBox()}
        <div class="data-table">
          <div class="data-table-head cols-variants">
            <div class="data-col">Name ${SORT_ICON}</div>
            <div class="data-col data-col-action">Action</div>
          </div>
          <div class="data-table-body">${rows}</div>
        </div>
      </div>
    </section>`;
  bindSearch('.table-search', '.data-table-row');
}

function renderSubmenu() {
  document.getElementById('menu-page-root').innerHTML = `
    <section class="data-panel">
      <div class="data-panel-toolbar">
        <h2 class="data-panel-title">Submenu</h2>
        <button type="button" class="btn-new">New</button>
      </div>
      <div class="data-panel-card">
        <div class="search-toolbar">
          ${renderSearchBox()}
          <label class="inactive-toggle"><input type="checkbox" /> Show Inactive Submenu</label>
        </div>
        <div class="data-table">
          ${renderLoadingState()}
        </div>
      </div>
    </section>`;
  bindSearch('.table-search', '.data-table-row');
}

const PAGE_RENDERERS = {
  'super-categories': renderSuperCategories,
  categories: renderCategories,
  'sub-categories': renderSubCategories,
  items: renderItems,
  addons: renderAddons,
  variants: renderVariants,
  submenu: renderSubmenu,
};

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('menu-masters-nav');
  if (!nav) return;
  const master = document.body.dataset.menuMaster || null;
  renderMenuMastersNav(master);
  if (master) PAGE_RENDERERS[master]?.();
});
