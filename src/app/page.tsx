'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/useQuizStore';
import WelcomeScreen from '@/components/WelcomeScreen';
import QuizScreen from '@/components/QuizScreen';
import ScoreScreen from '@/components/ScoreScreen';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { step } = useQuizStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin" />
        <div className="text-purple font-black text-xl tracking-tight">
          Loading TweebStars...
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
      <AnimatePresence mode="wait">
        {step === 'welcome' && <WelcomeScreen key="welcome" />}
        {step === 'quiz' && <QuizScreen key="quiz" />}
        {step === 'score' && <ScoreScreen key="score" />}
      </AnimatePresence>
    </main>
  );
}
