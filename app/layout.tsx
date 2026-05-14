import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'ASCEND — Élève-toi chaque jour',
  description: 'Missions personnalisées, discipline, XP et progression. Commence ton ascension.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-black text-white antialiased min-h-screen overflow-x-hidden">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
