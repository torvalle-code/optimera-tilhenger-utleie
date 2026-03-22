import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthShell } from './auth-shell';

export const metadata: Metadata = {
  title: 'Optimera Tilhengerutleie',
  description: 'Tilhengerutleie-system for Optimera/Monter butikker',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#101920',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <AuthShell>{children}</AuthShell>
      </body>
    </html>
  );
}
