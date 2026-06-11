import React from 'react';
import { Link } from 'react-router-dom';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { offersSidebarSections } from './BookletsPage';
import { Send, Percent, ShieldCheck, MessageSquare } from 'lucide-react';

export const OffersLandingPage: React.FC = () => {
  return (
    <div className="flex h-full animate-fade-in select-none">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-slate-50 h-[calc(100vh-60px)]">
        {/* Page Header */}
        <PageHeader title="Offers" subtitle="Campaigns & CRM Dashboard" />

        <div className="flex flex-col gap-8 mt-4 max-w-5xl">
          {/* Section: Offers */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-blue-500" />
              Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Offers', href: '/offers/list' },
                { title: 'Booklets', href: '/offers/bookletlist' },
                { title: 'Offer QR', href: '/offers/qr' }
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white border border-gray-200 rounded-sm p-5 min-h-[120px] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  <h3 className="text-base font-bold text-gray-800">{card.title}</h3>
                  <div className="flex justify-end">
                    <Link
                      to={card.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-750 transition-colors"
                    >
                      <span>Manage</span>
                      <Send className="w-3.5 h-3.5 text-blue-500" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Loyalty */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Loyalty
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Plans', href: '/loyalty/plans' },
                { title: 'Redemption', href: '/loyalty/redemption' },
                { title: 'Settings', href: '/loyalty/setting' }
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white border border-gray-200 rounded-sm p-5 min-h-[120px] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  <h3 className="text-base font-bold text-gray-800">{card.title}</h3>
                  <div className="flex justify-end">
                    <Link
                      to={card.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-750 transition-colors"
                    >
                      <span>Manage</span>
                      <Send className="w-3.5 h-3.5 text-blue-500" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Feedback */}
          <div className="flex flex-col gap-3 pb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              Feedback
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Insights', href: '/feedback/insights' },
                { title: 'Settings', href: '/feedback/setting' },
                { title: 'Responses', href: '/feedback/responses' },
                { title: 'Comments', href: '/feedback/comments' },
                { title: 'Item Rating Report', href: '/feedback/ratings' }
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white border border-gray-200 rounded-sm p-5 min-h-[120px] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  <h3 className="text-base font-bold text-gray-800">{card.title}</h3>
                  <div className="flex justify-end">
                    <Link
                      to={card.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-750 transition-colors"
                    >
                      <span>Manage</span>
                      <Send className="w-3.5 h-3.5 text-blue-500" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
