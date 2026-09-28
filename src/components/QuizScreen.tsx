'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, BarChart2, Info } from 'lucide-react';
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
      className="flex flex-col justify-between min-h-[calc(100vh-32px)]"
    >
      <div className="card space-y-4">
        {/* Top Header & Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs text-muted font-bold mb-2">
            <span className="text-purple uppercase tracking-wider font-extrabold">
              {q.tag}
            </span>
            <span>
              Question <strong className="text-ink">{currentIndex + 1}</strong> / {total}
            </span>
          </div>

          <div className="progress">
            <div
              className="fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Handle Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-soft text-purple text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Testing {handle || '@creator'}</span>
        </div>

        {/* Question Title & Description */}
        <div>
          <h2 className="text-xl font-extrabold text-ink leading-tight">
            {q.title}
          </h2>
          <p className="text-xs text-muted leading-normal mt-1">
            {q.question}
          </p>
        </div>

        {/* Visual Element Box */}
        <div className="bg-purple-soft/50 border border-purple-line rounded-2xl p-3.5 text-center">
          {q.visualType === 'reels' && Array.isArray(q.visual) ? (
            <div className="grid grid-cols-2 gap-2 text-left">
              {q.visual.map((reelTitle, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-purple-line/80 text-xs font-semibold text-ink flex items-center gap-2 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-pink shrink-0" />
                  <span className="truncate">{reelTitle}</span>
                </div>
              ))}
            </div>
          ) : q.visualType === 'chart' ? (
            <div className="flex items-center justify-center gap-3 py-3 text-2xl font-black text-purple">
              <BarChart2 className="w-8 h-8 text-pink" />
              <span>{q.visual}</span>
            </div>
          ) : (
            <div className="text-3xl py-1">{q.visual}</div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-2.5 pt-1">
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
                className={`${cardClass} w-full text-left font-semibold text-sm transition-all`}
              >
                <span className="text-lg">{option.emoji}</span>
                <span className="flex-1 text-ink">{option.label}</span>

                {isAnswered && isSelected && (
                  <span>
                    {isUserCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-greenline" />
                    ) : (
                      <XCircle className="w-5 h-5 text-redline" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Card */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-2.5 pt-2"
            >
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
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
                      <p className="font-extrabold text-sm mb-1">🎉 You got it right!</p>
                      <p>{q.explanation}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-extrabold text-sm mb-1">👀 TweebTech Insights showed a difference:</p>
                      <p>{q.explanation}</p>
                    </div>
                  )
                ) : (
                  <div>
                    <p className="font-extrabold text-sm mb-1">🧠 Interesting choice!</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>

              {q.note && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-purple-soft text-[11px] text-muted">
                  <Info className="w-4 h-4 text-purple shrink-0 mt-0.5" />
                  <p>{q.note}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Question Button */}
        {isAnswered && (
          <motion.button
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => nextQuestion(total)}
            className="brand-button w-full rounded-2xl py-4 font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-purple/20 cursor-pointer mt-4"
          >
            <span>{currentIndex < total - 1 ? 'Next Question' : 'View Your Score'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
