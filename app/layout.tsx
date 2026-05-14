import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'ASCEND — Élève-toi chaque jour',
  description: 'Missions personnalisées, discipline, XP et progression. Commence ton ascension.',
  manifest: '/depo-test/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'ASCEND',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/depo-test/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/depo-test/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/depo-test/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/depo-test/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ASCEND" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className="bg-black text-white antialiased min-h-screen overflow-x-hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
