import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';
import { TourProvider } from '@/components/TourProvider';

import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata: Metadata = {
  title: { default: 'NOGALSS – National Apex Cooperative Society', template: '%s | NOGALSS' },
  description: 'NOGALSS National Apex Cooperative Society Limited — Uniting Nigeria\'s Skilled Workforce Through Cooperative Power. Join thousands of members accessing savings, loans, and empowerment programs.',
  keywords: ['cooperative', 'Nigeria', 'NOGALSS', 'savings', 'loans', 'empowerment', 'skilled workers'],
  authors: [{ name: 'NOGALSS' }],
  openGraph: {
    type: 'website',
    siteName: 'NOGALSS National Apex Cooperative Society',
    title: 'NOGALSS – Uniting Nigeria\'s Skilled Workforce',
    description: 'Join Nigeria\'s premier national apex cooperative — savings, loans, and empowerment for skilled workers nationwide.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
        <Navbar />
        <main style={{ paddingTop: 'var(--navbar-height)' }}>
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
              <TourProvider>
                {children}
              </TourProvider>
            </GoogleOAuthProvider>
          ) : (
            <TourProvider>
              {children}
            </TourProvider>
          )}
        </main>
        <Footer />
      </body>
    </html>
  );
}
