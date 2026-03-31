import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Campus Billing Admin',
  description: 'Inventory & Order Control System for Campus Outlets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-50 text-gray-800 antialiased">
        <AppProvider>
          <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}