import type { Metadata } from 'next';
import './globals.css';
import CornerLogo from '@/components/ui/corner-logo';
import { Poppins } from 'next/font/google';

// The site typeface: Poppins everywhere, loaded by Next and served from our own domain.
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  title: 'TweebStars — How Well Do You Know Your Insta?',
  description: 'Test your Instagram profile intuition against real metrics powered by TweebTech Insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        {/* Brand mark, top-left corner (welcome page only) */}
        <CornerLogo />
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
