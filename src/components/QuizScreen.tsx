'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, BarChart2, Info, User } from 'lucide-react';
import { useQuizStore } from '@/store/useQuizStore';
import { QUIZ_QUESTIONS } from '@/data/questions';

export default function QuizScreen() {
  const {
    currentIndex,
    handle,
    isAnswered,
    selectedOption,
    selectOption,
    nextQuestion,
  } = useQuizStore();

  const q = QUIZ_QUESTIONS[currentIndex];
  const total = QUIZ_QUESTIONS.length;
  const progressPct = Math.round(((currentIndex + 1) / total) * 100);

  const handleChoose = (optionId: string) => {
    if (isAnswered) return;
    const isCorrect = optionId === q.answer;
    selectOption(q.id, optionId, isCorrect, q.scored);
  };

  const isUserCorrect = selectedOption === q.answer;

  return (
    <motion.div
      key={q.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full py-6"
    >
      <div className="desktop-card space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-purple-line">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-soft text-purple text-xs font-black uppercase tracking-wider">
              {q.tag}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted bg-white border border-purple-line px-3 py-1 rounded-full">
              <User className="w-3.5 h-3.5 text-pink" />
              <span>Testing {handle || '@creator'}</span>
            </div>
          </div>

          <div className="text-sm font-bold text-muted">
            Question <strong className="text-ink text-base">{currentIndex + 1}</strong> of <strong className="text-ink">{total}</strong>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Laptop 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Left Side: Question Title & Visual Display */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-ink leading-tight">
                {q.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed mt-2">
                {q.question}
              </p>
            </div>

            {/* Visual Box */}
            <div className="bg-gradient-to-br from-purple-soft/60 to-pink-soft/30 border border-purple-line rounded-2xl p-6 text-center shadow-xs">
              {q.visualType === 'reels' && Array.isArray(q.visual) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {q.visual.map((reelTitle, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-xl border border-purple-line text-xs font-bold text-ink flex items-center gap-2.5 shadow-xs"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-pink shrink-0" />
                      <span className="truncate">{reelTitle}</span>
                    </div>
                  ))}
                </div>
              ) : q.visualType === 'chart' ? (
                <div className="flex items-center justify-center gap-4 py-6 text-3xl font-black text-purple">
                  <BarChart2 className="w-10 h-10 text-pink" />
                  <span>{q.visual}</span>
                </div>
              ) : (
                <div className="text-5xl py-4">{q.visual}</div>
              )}
            </div>
          </div>

          {/* Right Side: Choices & Feedback */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted ml-1">
              Select Your Answer:
            </h3>

            <div className="space-y-3">
              {q.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrectOption = option.id === q.answer;

                let cardClass = 'option-card';
                if (isAnswered) {
                  if (isSelected) {
                    cardClass += isUserCorrect ? ' correct' : ' wrong';
                  } else if (isCorrectOption && q.scored) {
                    cardClass += ' correct';
                  }
                } else if (isSelected) {
                  cardClass += ' selected';
                }

                return (
                  <button
                    key={option.id}
                    disabled={isAnswered}
                    onClick={() => handleChoose(option.id)}
                    className={`${cardClass} w-full text-left font-bold text-base transition-all`}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span className="flex-1 text-ink">{option.label}</span>

                    {isAnswered && isSelected && (
                      <span>
                        {isUserCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-greenline" />
                        ) : (
                          <XCircle className="w-6 h-6 text-redline" />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Box */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-3 pt-3"
                >
                  <div
                    className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed font-medium ${
                      q.scored
                        ? isUserCorrect
                          ? 'feedback-good'
                          : 'feedback-bad'
                        : 'feedback-neutral'
                    }`}
                  >
                    {q.scored ? (
                      isUserCorrect ? (
                        <div>
                          <p className="font-extrabold text-base mb-1">🎉 Correct Answer!</p>
                          <p>{q.explanation}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-extrabold text-base mb-1">👀 TweebTech Insights showed:</p>
                          <p>{q.explanation}</p>
                        </div>
                      )
                    ) : (
                      <div>
                        <p className="font-extrabold text-base mb-1">🧠 Insightful Guess!</p>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>

                  {q.note && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-purple-soft text-xs text-muted">
                      <Info className="w-4 h-4 text-purple shrink-0 mt-0.5" />
                      <p>{q.note}</p>
                    </div>
                  )}

                  <motion.button
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => nextQuestion(total)}
                    className="brand-button w-full rounded-2xl py-4 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-purple/20 cursor-pointer mt-2"
                  >
                    <span>{currentIndex < total - 1 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
