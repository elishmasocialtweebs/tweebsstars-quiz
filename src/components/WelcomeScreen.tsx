'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Instagram, ArrowRight, ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';
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
    enabled: false,
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
    <div className="w-full py-8">
      <div className="desktop-card grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Brand Hero Banner */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-soft text-purple text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-pink" />
            <span>TweebTech Analytics Engine</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight leading-tight">
            Tweeb<span className="brand-gradient-text">Stars</span>
          </h1>

          <p className="text-xl md:text-2xl font-bold text-ink/90 leading-snug">
            How Well Do You Know Your Insta Profile?
          </p>

          <p className="text-base text-muted leading-relaxed">
            Put your Instagram profile intuition to the ultimate test! Answer targeted questions about your top reels, audience demographics, peak times, and engagement metrics compared live against <strong className="text-purple">TweebTech Insights</strong>.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-line">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-purple font-bold text-sm">
                <BarChart3 className="w-4 h-4 text-pink" />
                <span>Real Metrics</span>
              </div>
              <p className="text-xs text-muted">Audience & Reach</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-purple font-bold text-sm">
                <Users className="w-4 h-4 text-pink" />
                <span>Live Insights</span>
              </div>
              <p className="text-xs text-muted">Geography & Demographics</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-purple font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-pink" />
                <span>100% Secure</span>
              </div>
              <p className="text-xs text-muted">No Password Required</p>
            </div>
          </div>
        </div>

        {/* Right Column: Handle Form & Start Card */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#fdfbff] to-[#f9f4ff] border border-purple-line p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-ink">Get Started</h3>
            <p className="text-xs text-muted">
              Enter your Instagram handle to connect your profile metrics to the quiz.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-2 ml-1">
                Instagram Handle
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <Instagram className="w-5 h-5 text-pink" />
                </div>
                <input
                  {...register('handle')}
                  type="text"
                  placeholder="@yourhandle"
                  className={`w-full pl-12 pr-4 py-4 border rounded-2xl text-base font-semibold bg-white transition-all outline-none ${
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
              className="brand-button w-full rounded-2xl py-4 font-black text-base flex items-center justify-center gap-3 shadow-lg shadow-purple/20 cursor-pointer disabled:opacity-50"
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

          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-purple-line/80 text-xs text-muted">
            <ShieldCheck className="w-5 h-5 text-purple shrink-0" />
            <p>
              No password or private login needed. Public engagement signals are retrieved via TweebTech Insights API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
