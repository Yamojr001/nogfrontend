'use client';
import { usePathname } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { TourProvider } from '@/components/TourProvider';

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthRoute = ['/dashboard', '/member', '/admin', '/partner', '/group', '/sub-org', '/wallet', '/transactions'].some(
    prefix => pathname.startsWith(prefix)
  );

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const content = (
    <TourProvider>
      {children}
    </TourProvider>
  );

  return (
    <main style={{ paddingTop: isAuthRoute ? 0 : 'var(--navbar-height)' }}>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          {content}
        </GoogleOAuthProvider>
      ) : (
        content
      )}
    </main>
  );
}
