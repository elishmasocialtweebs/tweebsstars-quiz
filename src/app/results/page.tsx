'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EarlyAccess from '@/components/early-access';
import { useQuizStore, useHydrated } from '@/store/useQuizStore';
import { SITE, ROUTES } from '@/config/site';
import BlackBackdrop from '@/components/ui/black-backdrop';

// After the last question: the results page. Heading, the four locked areas in a row, then the phone with
// the Get access button at the foot. Everything stays locked until the full report exists.

// The four locked areas, each washed in its own colour (the logo colours plus a violet for the fourth)
const AREAS = [
  { title: 'Audience DNA', sub: 'Who really follows you?', ring: '#2ed3d3' },
  { title: 'Content Power', sub: 'What content works best?', ring: '#f7e014' },
  { title: 'Growth Signals', sub: 'Where is your profile heading?', ring: '#e12669' },
  { title: 'Brand Readiness', sub: 'How ready are you for brands?', ring: '#7c5cff' },
];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
});

export default function ResultsPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const name = useQuizStore((s) => s.name);
  // No sign-up yet: start from there
  useEffect(() => { if (hydrated && !name) router.replace(ROUTES.signUp); }, [hydrated, name, router]);
  if (!hydrated || !name) return <BlackBackdrop />;

  return (
    <div className="flex w-full flex-col items-center gap-10 py-6 md:py-10">
      <BlackBackdrop />

      {/* Heading */}
      <motion.div {...rise(0)} className="w-full max-w-[640px] text-center">
        <Image src={SITE.logo} alt={SITE.name} width={796} height={414} priority className="mx-auto" style={{ width: '6rem', height: 'auto' }} />
        <h2 className="mt-6 font-poppins text-3xl font-bold text-white md:text-[34px]">Your Instagram has a story.</h2>
        <p className="mx-auto mt-3 max-w-[460px] font-poppins text-sm leading-relaxed text-[#9a9a9a]">
          Get the full TweebStars report to unlock these results and discover what your insight data is really saying.
        </p>
      </motion.div>

      {/* The four locked areas, in one row: colour-washed picture cards with the writing at the foot */}
      <div className="grid w-full max-w-[1040px] grid-cols-2 gap-4 md:grid-cols-4">
        {AREAS.map((a, i) => (
          <motion.div
            key={a.title}
            {...rise(0.15 + i * 0.1)}
            className="relative flex min-h-[280px] flex-col overflow-hidden rounded-[24px] p-4 pb-5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{ background: `radial-gradient(120% 70% at 50% 0%, ${a.ring} 0%, ${a.ring}66 35%, #0a0a0a 78%)` }}
          >
            {/* Foot: darkened so the writing reads */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="relative mt-auto">
              <p className="font-poppins text-[22px] font-bold leading-tight text-white">{a.title}</p>
              <p className="mt-1.5 font-poppins text-[12px] leading-snug text-[#c8c8c8]">{a.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <EarlyAccess />
    </div>
  );
}
