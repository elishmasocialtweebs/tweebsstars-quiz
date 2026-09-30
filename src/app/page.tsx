'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { ROUTES } from '@/config/site';
import { BlurReveal } from '@/components/ui/blur-reveal';
import SlideButton from '@/components/ui/slide-button';
import BlackBackdrop from '@/components/ui/black-backdrop';
import { motion } from 'motion/react';
import RevealsBadge from '@/components/ui/reveals-badge';

// The three things the quiz does. Each card has a picture on the left (image), the likes badge on the right (badge), or nothing.
const POINTERS: { badge?: boolean; image?: string; imageClass?: string; slotClass?: string; title: string; sub?: string }[] = [
  { image: '/icons/guess.png', imageClass: 'absolute -left-3 -top-9 h-28 w-auto max-w-none', title: 'Explore your audience & content insights' },
  { badge: true, title: 'Discover what’s working on your profile' },
  // black-background picture on a dark card: screen blend makes the black vanish, the white stays
  { image: '/icons/grow.jpg', imageClass: 'absolute -left-3 -top-4 h-20 w-20 max-w-none mix-blend-screen', slotClass: 'h-12 w-14', title: 'Find opportunities to grow & improve' },
];

export default function WelcomePage() {
  const router = useRouter();
  // Opening the site with ?start throws the saved progress away.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('start')) { useQuizStore.getState().resetQuiz(); router.replace(ROUTES.welcome); }
  }, [router]);
  // The button is shown only once the intro line has finished writing itself.
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="w-full py-8">
      {/* This page stays plain black; the grain background is for the pages after it */}
      <BlackBackdrop />
      <div className="desktop-card flex flex-col items-center gap-10">
        {/* Intro, centred */}
        <div className="w-full max-w-2xl text-center space-y-6">
          <p className="font-poppins text-2xl md:text-3xl font-bold text-ink/90 leading-snug">Hey, I&apos;m Tweebie, your quiz host</p>
          <BlurReveal as="h2" className="font-poppins text-base md:text-lg font-semibold text-ink/90 leading-snug">
            How Well Do You Know Your Insta Profile?
          </BlurReveal>

          {/* Three pointer cards, appearing one after another. The last one releases the button. */}
          <div className="mx-auto w-full max-w-md space-y-7 pt-10 text-left">
            {POINTERS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.35, ease: 'easeOut' }}
                onAnimationComplete={i === POINTERS.length - 1 ? () => setIntroDone(true) : undefined}
                className={`relative flex items-center gap-4 overflow-visible rounded-2xl border-[0.5px] border-[#2a2a2a] bg-[#0f0f0f] p-3 ${c.badge ? 'pl-5 pr-40' : 'pr-4'}`}
              >
                {c.badge && <RevealsBadge className="absolute right-4 top-1/2 h-11 w-auto -translate-y-1/2" />}
                {c.image && (
                  <span className={`relative shrink-0 ${c.slotClass || 'h-12 w-14'}`}>
                    <Image src={c.image} alt="" width={320} height={320} className={c.imageClass} />
                  </span>
                )}
                <span className="flex-1">
                  <span className="block font-poppins text-[15px] font-normal text-ink/90">{c.title}</span>
                  {c.sub && <span className="block font-poppins text-[13px] text-muted">{c.sub}</span>}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next step: the sign-up page */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
          animate={introDone ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 16, filter: 'blur(12px)' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ pointerEvents: introDone ? 'auto' : 'none' }}
        >
          <SlideButton label="Let's Begin" onClick={() => router.push(ROUTES.signUp)} />
        </motion.div>
      </div>
    </div>
  );
}
