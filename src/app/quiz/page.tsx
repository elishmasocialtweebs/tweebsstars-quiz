'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuizStore, useHydrated } from '@/store/useQuizStore';
import { QUIZ_QUESTIONS } from '@/data/questions';
import { ROUTES, AMOUNT } from '@/config/site';

// Comes right after the sign-up page. One white card per question, with two more cards fanned out behind it:
// dashes for progress, "QUESTION 01", the question, radio options (or the amount box), then Back / Next.
// Back returns to the sign-up page from any question; the last Next goes to the results page.
// Question 3's slider: how much for one collab post

export default function QuizPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { name, currentIndex, userAnswers, setAnswer, nextQuestion, goToQuestion } = useQuizStore();
  // No sign-up yet: go and do that first
  useEffect(() => { if (hydrated && !name) router.replace(ROUTES.signUp); }, [hydrated, name, router]);

  const q = QUIZ_QUESTIONS[currentIndex];
  const total = QUIZ_QUESTIONS.length;
  const value = userAnswers[q.id] ?? '';
  const canContinue = q.kind === 'amount' ? true : value !== '';   // the slider always has a value
  // The slider's number: the saved answer ("15,000") or the starting point if nothing is saved yet
  const amount = q.kind === 'amount' ? (Number(value.replace(/\D/g, '')) || AMOUNT.start) : 0;

  // Deck motion: on Next the old card tips back and slides behind while the new one rises from the pile;
  // on Back the same in reverse.
  const dir = useRef<1 | -1>(1);
  // Who is on top. The leaving card keeps z 3 for its whole exit; the new card sits at z 1 under it while the
  // old one swings out, then jumps to z 4 so the old card comes back in behind it. (z-index cannot be tweened
  // by the animation library, so it is switched here, on a timer.)
  const [newOnTop, setNewOnTop] = useState(true);
  const handOver = useRef<number>();
  const startShuffle = (d: 1 | -1) => {
    dir.current = d;
    setNewOnTop(false);
    window.clearTimeout(handOver.current);
    handOver.current = window.setTimeout(() => setNewOnTop(true), 420);
  };
  useEffect(() => () => window.clearTimeout(handOver.current), []);
  const onNext = () => {
    if (!canContinue) return;
    if (q.kind === 'amount' && !value) setAnswer(q.id, AMOUNT.start.toLocaleString('en-IN'));   // untouched slider = the starting amount
    startShuffle(1);
    if (nextQuestion(total)) router.push(ROUTES.results);
  };
  // Back on any question lands on the sign-up page (answers picked so far are kept).
  const onBack = () => {
    startShuffle(-1);
    goToQuestion(0);
    router.push(ROUTES.signUp);
  };
  // Shuffle, no fading. The two grey cards behind sit at fixed spots (left-tilted and right-tilted). On Next the
  // top card lifts, swings out to the right and lands exactly on the left-tilted spot, turning grey as it goes;
  // when it is removed the static grey card is already there, so nothing blinks. The next card, already white
  // with its question on it, starts from the right-tilted spot and comes forward to the top. Back mirrors it.
  const LEFT = { x: -12, y: 8, rotate: -5, backgroundColor: '#7f7f7f' };
  const RIGHT = { x: 8, y: -4, rotate: 3, backgroundColor: '#b5b5b5' };
  const deck: Variants = {
    enter: (d: 1 | -1) => ({ ...(d === 1 ? RIGHT : LEFT), backgroundColor: '#ffffff', scale: 1, opacity: 1 }),
    center: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: '#ffffff', transition: { duration: 0.45, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] } },
    exit: (d: 1 | -1) => {
      const to = d === 1 ? LEFT : RIGHT;
      return {
        x: [0, d * 300, to.x],
        y: [0, -30, to.y],
        rotate: [0, d * 14, to.rotate],
        scale: [1, 1.02, 1],
        opacity: 1,
        backgroundColor: ['#ffffff', '#ffffff', to.backgroundColor],
        zIndex: 3,
        transition: { duration: 0.75, times: [0, 0.45, 1], ease: 'easeInOut' },
      };
    },
  };
  // The writing on a card fades out fast while it leaves; the incoming card shows its question from the start.
  const inner: Variants = {
    enter: { opacity: 1 },
    center: { opacity: 1 },
    exit: { opacity: 0, transition: { delay: 0.35, duration: 0.2 } },   // writing stays during the swing, goes as the card dips behind
  };

  if (!hydrated || !name) return <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true" />;

  return (
    <div className="flex w-full items-center justify-center py-2 md:min-h-[calc(100vh-80px)] md:py-0">
      {/* The question pages stay plain black, like the welcome page */}
      <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true" />

      <div className="relative w-full max-w-[520px]">
        {/* The two cards fanned out behind */}
        <div aria-hidden="true" className="absolute inset-0 -translate-x-3 translate-y-2 -rotate-[5deg] rounded-[28px] bg-[#e6e6e6]/55" />
        <div aria-hidden="true" className="absolute inset-0 translate-x-2 -translate-y-1 rotate-[3deg] rounded-[28px] bg-[#f2f2f2]/75" />

        <AnimatePresence mode="popLayout" custom={dir.current} initial={false}>
        <motion.div
          key={q.id}
          custom={dir.current}
          variants={deck}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ zIndex: newOnTop ? 4 : 1 }}
          className="relative flex min-h-[560px] flex-col rounded-[28px] bg-[#ffffff] px-8 pb-8 pt-9 text-black shadow-[0_30px_80px_rgba(0,0,0,0.6)] md:px-11"
        >
        <motion.div variants={inner} className="flex flex-1 flex-col">
          {/* Progress dashes and the close button (back to the very start) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {QUIZ_QUESTIONS.map((_, i) => (
                <span key={i} className={`h-[3px] w-8 rounded-full ${i <= currentIndex ? 'bg-black' : 'bg-[#dcdcdc]'}`} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => router.push(`${ROUTES.welcome}?start`)}
              aria-label="Start over"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#bdbdbd] text-white transition-colors hover:bg-black"
            >
              <X className="h-3.5 w-3.5" strokeWidth={3} />
            </button>
          </div>

          <p className="card-label mt-12">Question {String(currentIndex + 1).padStart(2, '0')}</p>
          <h2 className="card-title mt-3">{q.title}</h2>

          {q.kind === 'choice' ? (
            <>
              <div className="mt-9 space-y-1" role="radiogroup">
                {q.options!.map((o) => {
                  const selected = value === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setAnswer(q.id, o.id)}
                      className="card-option group flex w-full items-center gap-3.5 rounded-lg py-2.5 text-left"
                    >
                      <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-black transition-colors ${selected ? 'bg-black' : 'bg-transparent group-hover:bg-[#f0f0f0]'}`}>
                        {selected && <span className="h-[7px] w-[7px] rounded-full bg-white" />}
                      </span>
                      <span>{o.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* A slider instead of typing: ₹500 to ₹1,00,000 in steps of ₹500, the amount shown above the dot */}
              <p className="card-label mt-9">Amount in rupees</p>
              <p className="mt-3 font-poppins text-xl font-semibold text-black">
                ₹{amount.toLocaleString('en-IN')}{amount >= AMOUNT.max ? '+' : ''}
              </p>
              <input
                id="quiz-amount"
                type="range"
                min={AMOUNT.min}
                max={AMOUNT.max}
                step={AMOUNT.step}
                value={amount}
                onChange={(e) => setAnswer(q.id, Number(e.target.value).toLocaleString('en-IN'))}
                onKeyDown={(e) => { if (e.key === 'Enter') onNext(); }}
                aria-label="Amount in rupees"
                className="amount-slider mt-5 w-full"
                style={{ ['--fill' as string]: `${((amount - AMOUNT.min) / (AMOUNT.max - AMOUNT.min)) * 100}%` }}
              />
              <div className="mt-2 flex justify-between font-poppins text-xs text-[#9a9a9a]">
                <span>₹{AMOUNT.min.toLocaleString('en-IN')}</span>
                <span>₹{AMOUNT.max.toLocaleString('en-IN')}+</span>
              </div>
            </>
          )}

          {/* Back / Next, pinned to the bottom right */}
          <div className="mt-auto flex items-center justify-end gap-8 pt-12">
            <button type="button" onClick={onBack} className="card-action font-normal hover:underline underline-offset-4">
              Back
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canContinue}
              className="card-action group relative overflow-hidden rounded-xl bg-[#f7e014] px-8 py-3.5 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true" className="absolute inset-0 translate-y-full bg-[#e12669] transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative z-10">{currentIndex < total - 1 ? 'Next' : 'Finish'}</span>
            </button>
          </div>
        </motion.div>
        </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
