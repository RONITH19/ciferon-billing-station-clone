import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import '@/styles/login.css';
import '@/styles/dashboard.css';
import { QueryProvider } from '@/components/providers/query-provider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'RestaurantOS — Billing Station',
  description: 'Premium restaurant operating system',
  icons: {
    icon: '/assets/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
