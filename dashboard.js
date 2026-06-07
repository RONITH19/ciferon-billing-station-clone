const AUTH_KEY = 'ciferon_logged_in';
const SIDEBAR_KEY = 'ciferon_sidebar_collapsed';
const NAV_ACTIVE_KEY = 'ciferon_nav_active';

function isLoggedIn() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

function setActiveNavItem(item) {
  document.querySelectorAll('.sidebar-item').forEach((el) => {
    el.classList.remove('active');
    el.removeAttribute('aria-current');
  });

  if (item) {
    item.classList.add('active');
    item.setAttribute('aria-current', 'page');
  }
}

function collapseSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  sidebar.classList.add('collapsed');
  localStorage.setItem(SIDEBAR_KEY, 'true');
}

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const menuItem = document.querySelector('[data-nav="menu"]');
  const outletItem = document.querySelector('[data-nav="outlet"]');
  const currentPage = document.body.dataset.page;

  if (!sidebar) return;

  if (currentPage === 'menu') {
    sidebar.classList.add('collapsed');
    setActiveNavItem(menuItem);
    localStorage.setItem(NAV_ACTIVE_KEY, 'menu');
  } else {
    const isCollapsed = localStorage.getItem(SIDEBAR_KEY) !== 'false';
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }
    setActiveNavItem(outletItem);
    localStorage.setItem(NAV_ACTIVE_KEY, 'outlet');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      collapseSidebar();
      if (currentPage !== 'menu') {
        setActiveNavItem(outletItem);
        localStorage.setItem(NAV_ACTIVE_KEY, 'outlet');
      }
    });
  }

  if (menuItem && currentPage !== 'menu') {
    menuItem.addEventListener('click', () => {
      localStorage.setItem(NAV_ACTIVE_KEY, 'menu');
    });
  }

  if (outletItem) {
    outletItem.addEventListener('click', () => {
      localStorage.setItem(NAV_ACTIVE_KEY, 'outlet');
    });
  }
}

requireAuth();
initSidebar();
