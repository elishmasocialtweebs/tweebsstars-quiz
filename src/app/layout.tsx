import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

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
    <html lang="en">
      <body>
        <Providers>
          <div className="app-container">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
