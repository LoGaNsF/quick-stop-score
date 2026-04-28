import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quick Stop Score',
  description: 'Contador de puntuación para Quick Stop',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='es'>
      <body>{children}</body>
    </html>
  );
}
