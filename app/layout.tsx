'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { PrivateRoute } from '@/components/PrivateRoute';
import { Header } from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {isPublicRoute ? (
          children
        ) : (
          <PrivateRoute>
    
              {children}
          </PrivateRoute>
        )}
      </body>
    </html>
  );
}