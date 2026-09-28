'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Instagram, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useQuizStore } from '@/store/useQuizStore';
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
  handle: z
    .string()
    .min(2, 'Instagram handle must be at least 2 characters')
    .max(30, 'Handle is too long')
    .refine((val) => !/\s/.test(val), 'Handle cannot contain spaces'),
});

type FormValues = z.infer<typeof formSchema>;

export default function WelcomeScreen() {
  const { setHandle, setStep, setInsights, setLoadingInsights } = useQuizStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: '',
    },
  });

  const currentHandle = watch('handle');

  const { refetch } = useQuery({
    queryKey: ['insights', currentHandle],
    queryFn: async () => {
      if (!currentHandle) return null;
      const res = await fetch(`/api/insights?handle=${encodeURIComponent(currentHandle)}`);
      return res.json();
    },
    enabled: false, // Trigger manually on submission
  });

  const onSubmit = async (values: FormValues) => {
    const cleanHandle = values.handle.startsWith('@') ? values.handle : `@${values.handle}`;
    setHandle(cleanHandle);
    setLoadingInsights(true);

    try {
      const result = await refetch();
      if (result.data?.data) {
        setInsights(result.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInsights(false);
      setStep('quiz');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-between min-h-[calc(100vh-32px)]"
    >
      <div className="card text-center relative overflow-hidden">
        {/* Top Decorative Sparkle */}
        <div className="absolute top-4 right-4 text-purple opacity-40">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        {/* Animated Avatar Icon */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="avatar mx-auto cursor-pointer"
        >
          🔮
        </motion.div>

        <h1 className="text-3xl font-black text-ink tracking-tight mt-2 mb-2">
          Tweeb<span className="brand-gradient-text">Stars</span>
        </h1>
        <h2 className="text-xl font-bold text-ink mb-2">
          How Well Do You Know Your Insta?
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-6">
          Test your Instagram profile intuition against your actual account metrics powered by <strong className="text-purple">TweebTech Insights</strong>.
        </p>

        {/* Form Input */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5 ml-1">
              Enter Your Instagram Handle
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                <Instagram className="w-5 h-5 text-pink" />
              </div>
              <input
                {...register('handle')}
                type="text"
                placeholder="@yourhandle"
                className={`w-full pl-11 pr-4 py-3.5 border rounded-2xl text-sm font-medium bg-white transition-all outline-none ${
                  errors.handle
                    ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                    : 'border-purple-line focus:border-purple focus:ring-2 focus:ring-purple-200'
                }`}
              />
            </div>
            {errors.handle && (
              <p className="text-xs text-red-500 font-semibold mt-1.5 ml-1">
                {errors.handle.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="brand-button w-full rounded-2xl py-4 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-purple/20 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Connecting TweebTech...</span>
            ) : (
              <>
                <span>Start TweebStars Quiz</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Privacy Note */}
        <div className="privacy mt-5 flex items-start gap-2.5 text-xs text-muted">
          <ShieldCheck className="w-4 h-4 text-purple shrink-0 mt-0.5" />
          <p>
            No password or private login required. We compare public engagement signals using TweebTech API.
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-muted mt-4 mb-2">
        Powered by <strong className="text-dark">TweebIQ Stack</strong> & TweebTech Insights
      </div>
    </motion.div>
  );
}
