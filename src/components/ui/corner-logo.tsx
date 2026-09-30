'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SITE, ROUTES } from '@/config/site';

// The brand mark in the top-left corner, on the welcome page only: sign-up and results carry the logo in
// their own heading, and the question cards show none.
export default function CornerLogo() {
  const pathname = usePathname();
  if (pathname !== ROUTES.welcome) return null;
  return (
    <div className="fixed left-5 top-4 z-50 md:left-8 md:top-6">
      <Image src={SITE.logo} alt={SITE.name} width={796} height={414} priority style={{ width: '7.5rem', height: 'auto' }} />
    </div>
  );
}
