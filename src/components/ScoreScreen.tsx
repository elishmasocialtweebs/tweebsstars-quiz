'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { RotateCcw, Share2, Award, Zap, CheckCircle2 } from 'lucide-react';
import { useQuizStore } from '@/store/useQuizStore';

export default function ScoreScreen() {
  const {
    handle,
    correctCount,
    scoredCount,
    insightsData,
    resetQuiz,
  } = useQuizStore();

  const percentage = scoredCount > 0 ? Math.round((correctCount / scoredCount) * 100) : 0;

  useEffect(() => {
    if (percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [percentage]);

  const scoreMessage =
    percentage >= 75
      ? "You know your Instagram remarkably well — but your data still holds a few secret surprises. 👀"
      : percentage >= 50
      ? "You've got great profile intuition! TweebStars found a few intriguing insight gaps."
      : "Your Instagram algorithm knows you better than you think! 😏";

  const chartData = [
    { category: 'Reels', Accuracy: percentage >= 75 ? 90 : 60, color: '#6d45ff' },
    { category: 'Audience', Accuracy: percentage >= 50 ? 85 : 55, color: '#e747aa' },
    { category: 'Timing', Accuracy: percentage >= 75 ? 80 : 70, color: '#211a30' },
    { category: 'Format', Accuracy: percentage >= 60 ? 95 : 65, color: '#287744' },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TweebStars Instagram Quiz Result',
        text: `I scored ${correctCount}/${scoredCount} (${percentage}%) on TweebStars Instagram Quiz for ${handle}! Test your Insta profile intuition:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`I scored ${correctCount}/${scoredCount} (${percentage}%) on TweebStars for ${handle}!`);
      alert('Score result copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-between min-h-[calc(100vh-32px)]"
    >
      <div className="card space-y-5 text-center">
        {/* Badge Avatar */}
        <div className="avatar mx-auto mb-2">
          {percentage >= 75 ? '🏆' : percentage >= 50 ? '🌟' : '💡'}
        </div>

        <h1 className="text-3xl font-black text-ink">
          Quiz <span className="brand-gradient-text">Complete!</span>
        </h1>

        {/* Score Box */}
        <div className="bg-purple-soft border border-purple-line rounded-3xl p-5 shadow-sm">
          <div className="text-xs font-extrabold text-purple tracking-wider uppercase mb-1">
            Accuracy Score for {handle || '@creator'}
          </div>
          <div className="text-4xl font-black text-ink">
            {correctCount} <span className="text-xl font-bold text-muted">/ {scoredCount}</span>
          </div>
          <div className="text-sm font-bold text-purple mt-1">
            {percentage}% Profile Intuition
          </div>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            {scoreMessage}
          </p>
        </div>

        {/* Recharts Performance Summary */}
        <div className="bg-white border border-purple-line rounded-2xl p-4 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-purple" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              Intuition vs TweebTech Data
            </h3>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#756c7e' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#756c7e' }} />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Accuracy']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e8e1ef' }}
                />
                <Bar dataKey="Accuracy" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TweebTech Insights Summary Card */}
        {insightsData && (
          <div className="bg-gradient-to-br from-purple-soft to-pink-soft/30 border border-purple-line rounded-2xl p-4 text-left space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-pink" />
                <span className="text-xs font-extrabold text-ink uppercase tracking-wider">
                  TweebTech Growth Insight
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple text-white">
                Live Signal
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed font-medium">
              {insightsData.recommendation || "Your DM Share multiplier is running high! Keep publishing interactive carousels for optimal algorithm reach."}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="bg-white p-2 rounded-xl border border-purple-line/60">
                <span className="text-[10px] text-muted block">Top City</span>
                <span className="font-bold text-ink">{insightsData.metrics?.topCity || 'Mumbai (34.8%)'}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-purple-line/60">
                <span className="text-[10px] text-muted block">Peak Activity</span>
                <span className="font-bold text-ink">{insightsData.metrics?.peakActivity || '9:45 PM'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={resetQuiz}
            className="brand-button w-full rounded-2xl py-4 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-purple/20 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full rounded-2xl py-3.5 font-bold text-sm bg-white text-purple border border-purple-line flex items-center justify-center gap-2 hover:bg-purple-soft/50 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share My Results</span>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-muted mt-4 mb-2">
        Connected to <strong className="text-purple">tweebtech.socialtweebs.com/insights</strong>
      </div>
    </motion.div>
  );
}
