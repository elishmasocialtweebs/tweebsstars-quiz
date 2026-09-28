'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/useQuizStore';
import WelcomeScreen from '@/components/WelcomeScreen';
import QuizScreen from '@/components/QuizScreen';
import ScoreScreen from '@/components/ScoreScreen';

export default function Home() {
  const { step } = useQuizStore();

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
