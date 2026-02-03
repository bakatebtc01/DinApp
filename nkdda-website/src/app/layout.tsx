import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'NKDDA - Nipa-Kutubu District Development Authority',
  description: 'Official website of the Nipa-Kutubu District Development Authority – transparency, development updates, and community engagement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
