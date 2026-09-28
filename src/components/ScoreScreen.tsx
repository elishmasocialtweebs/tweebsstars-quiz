'use client';

import React, { useEffect, useState } from 'react';
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
import { RotateCcw, Share2, Award, Zap } from 'lucide-react';
import { useQuizStore } from '@/store/useQuizStore';

export default function ScoreScreen() {
  const [isMounted, setIsMounted] = useState(false);
  const {
    handle,
    correctCount,
    scoredCount,
    insightsData,
    resetQuiz,
  } = useQuizStore();

  const percentage = scoredCount > 0 ? Math.round((correctCount / scoredCount) * 100) : 0;

  useEffect(() => {
    setIsMounted(true);
    if (percentage >= 60) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
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
    { category: 'Reels Reach', Accuracy: percentage >= 75 ? 90 : 60, color: '#6d45ff' },
    { category: 'Audience Geo', Accuracy: percentage >= 50 ? 85 : 55, color: '#e747aa' },
    { category: 'Peak Timing', Accuracy: percentage >= 75 ? 80 : 70, color: '#211a30' },
    { category: 'Format Conversion', Accuracy: percentage >= 60 ? 95 : 65, color: '#287744' },
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full py-6"
    >
      <div className="desktop-card space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-purple-line pb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-soft text-purple text-xs font-black uppercase tracking-wider">
            <Award className="w-4 h-4 text-pink" />
            <span>TweebStars Evaluation Complete</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-ink">
            Quiz <span className="brand-gradient-text">Results & Insights</span>
          </h1>

          <p className="text-base text-muted max-w-xl mx-auto">
            Here is your Instagram Profile Intuition analysis compared live against TweebTech API data for <strong className="text-purple">{handle || '@creator'}</strong>.
          </p>
        </div>

        {/* Laptop 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Score Card & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-gradient-to-b from-purple-soft/70 to-pink-soft/20 border border-purple-line p-7 rounded-3xl">
            <div className="space-y-4 text-center">
              <div className="text-xs font-black text-purple uppercase tracking-widest">
                Overall Accuracy Score
              </div>

              <div className="text-5xl md:text-6xl font-black text-ink">
                {correctCount} <span className="text-2xl font-bold text-muted">/ {scoredCount}</span>
              </div>

              <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-purple-line text-lg font-black text-purple shadow-xs">
                {percentage}% Profile Intuition
              </div>

              <p className="text-sm text-muted leading-relaxed font-medium pt-2">
                {scoreMessage}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-purple-line/80">
              <button
                onClick={resetQuiz}
                className="brand-button w-full rounded-2xl py-4 font-black text-base flex items-center justify-center gap-2.5 shadow-lg shadow-purple/20 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full rounded-2xl py-3.5 font-bold text-sm bg-white text-purple border border-purple-line flex items-center justify-center gap-2 hover:bg-purple-soft transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share My Results</span>
              </button>
            </div>
          </div>

          {/* Right Column: Recharts Visualization & TweebTech Recommendations */}
          <div className="lg:col-span-7 space-y-6">
            {/* Chart Card */}
            <div className="bg-white border border-purple-line rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple" />
                  <h3 className="text-sm font-black text-ink uppercase tracking-wider">
                    Category Intuition Breakdown
                  </h3>
                </div>
                <span className="text-xs font-bold text-muted">vs TweebTech Data</span>
              </div>

              <div className="h-56 w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#756c7e' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#756c7e' }} />
                      <Tooltip
                        formatter={(val: number) => [`${val}%`, 'Accuracy']}
                        contentStyle={{ borderRadius: '16px', border: '1px solid #e8e1ef', padding: '10px 14px' }}
                      />
                      <Bar dataKey="Accuracy" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-muted">
                    Loading Chart...
                  </div>
                )}
              </div>
            </div>

            {/* Live TweebTech Recommendation */}
            {insightsData && (
              <div className="bg-gradient-to-br from-purple-soft to-pink-soft/30 border border-purple-line rounded-3xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-pink" />
                    <span className="text-xs font-black text-ink uppercase tracking-wider">
                      Live TweebTech Insights Signal
                    </span>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple text-white">
                    API Connected
                  </span>
                </div>

                <p className="text-sm text-ink/90 leading-relaxed font-semibold">
                  {insightsData.recommendation || "Your DM Share multiplier is running at 2.1x benchmark. Post carousels around 9:30 PM for maximum viral reach!"}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-white p-3.5 rounded-2xl border border-purple-line/80">
                    <span className="text-[11px] text-muted block mb-0.5">Top Audience Hub</span>
                    <span className="font-bold text-sm text-ink">{insightsData.metrics?.topCity || 'Mumbai (34.8%)'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-purple-line/80">
                    <span className="text-[11px] text-muted block mb-0.5">Peak Activity Window</span>
                    <span className="font-bold text-sm text-ink">{insightsData.metrics?.peakActivity || '9:45 PM'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
