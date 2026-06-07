export default function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="dashboard-header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <button type="button" className="header-icon-btn" title="Quick actions" aria-label="Quick actions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 16.5 12 14l7.5 2.5" />
            <path d="M12 14V4" />
            <path d="M9 6l3-2 3 2" />
            <path d="M7 20h10" />
          </svg>
        </button>
        <a href="#" className="header-support">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 11a9 9 0 1 1 18 0" />
            <path d="M7 11a5 5 0 0 1 10 0v1a2 2 0 0 1-2 2h-1" />
            <path d="M10 18h4" />
          </svg>
          Support
        </a>
        <div className="header-avatar" title="User profile">
          C
        </div>
      </div>
    </header>
  );
}
