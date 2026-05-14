import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'ASCEND — Level Up Your Life',
  description: 'Futuristic self-improvement app. Build discipline. Complete missions. Ascend.',
  themeColor: '#000000',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased min-h-screen overflow-x-hidden">
        <AppProvider>
          <main className="max-w-lg mx-auto relative">
            {children}
          </main>
          <Navigation />
        </AppProvider>
      </body>
    </html>
  );
}
