'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { ROUTES } from '@/config/site';
import { BlurReveal } from '@/components/ui/blur-reveal';
import MotionButton from '@/components/ui/motion-button';
import { motion } from 'motion/react';
import { Eye, Sparkles, Target } from 'lucide-react';
import RevealsBadge from '@/components/ui/reveals-badge';

// The three things the quiz does, in the TweebStars logo colours (yellow, pink, teal).
const POINTERS: { badge?: boolean; star?: boolean; none?: boolean; image?: string; rightImage?: string; imageClass?: string; slotClass?: string; side?: 'left' | 'right'; Icon: React.ComponentType<{ className?: string }>; tint: string; title: string; sub: string }[] = [
  { image: '/icons/guess.png', imageClass: 'absolute -left-3 -top-9 h-28 w-auto max-w-none', Icon: Target, tint: '#f7e014', title: 'Explore your audience & content insights', sub: '' },
  { badge: true, side: 'right', Icon: Eye, tint: '#e12669', title: 'Discover what’s working on your profile', sub: '' },
  { image: '/icons/grow.jpg', imageClass: 'absolute -left-3 -top-4 h-20 w-20 max-w-none mix-blend-screen', slotClass: 'h-12 w-14', Icon: Sparkles, tint: '#2ed3d3', title: 'Find opportunities to grow & improve', sub: '' },
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
      <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true" />
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
                className={`relative flex items-center gap-4 overflow-visible rounded-2xl border-[0.5px] border-[#2a2a2a] bg-[#0f0f0f] p-3 ${c.badge ? 'pl-5 pr-40' : c.rightImage ? 'pl-5 pr-24' : 'pr-4'}`}
              >
                {c.none ? null : c.rightImage ? (
                  // black-background picture on a dark card: screen blend makes the black vanish, the white stays
                  <Image src={c.rightImage} alt="" width={736} height={736} className="absolute right-1 top-1/2 h-14 w-14 -translate-y-1/2 mix-blend-screen" />
                ) : c.badge ? (
                  <RevealsBadge className="absolute right-4 top-1/2 h-11 w-auto -translate-y-1/2" />
                ) : c.star ? (
                  <span className="relative h-12 w-14 shrink-0">
                    <Image src="/icons/score.png" alt="" width={180} height={180} className="absolute -left-3 -top-8 h-24 w-24 max-w-none" />
                  </span>
                ) : c.image ? (
                  <span className={`relative shrink-0 ${c.slotClass || "h-12 w-14"}`}>
                    <Image src={c.image} alt="" width={320} height={320} className={c.imageClass} />
                  </span>
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: c.tint }}>
                    <c.Icon className="h-6 w-6 text-black" />
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
          <MotionButton label="Let's Begin" type="button" onClick={() => router.push(ROUTES.signUp)} />
        </motion.div>
      </div>
    </div>
  );
}
