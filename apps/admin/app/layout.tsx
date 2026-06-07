import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashlytics Admin',
  description: 'Manage metrics snapshots',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}