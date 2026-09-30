'use client';

import React, { useMemo, useRef, useState } from 'react';
import FloatingHearts, { type Heart } from '@/components/ui/floating-hearts';
import PhoneFrame from '@/components/ui/phone-frame';
import SlideButton from '@/components/ui/slide-button';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { useQuizStore } from '@/store/useQuizStore';
import { COUNTRIES } from '@/data/countries';
import CountryPicker from '@/components/ui/country-picker';
import { useRouter } from 'next/navigation';
import { SITE, ROUTES, SIDE_VIDEOS } from '@/config/site';

// Who is playing: name, phone number and Instagram handle, then straight into the quiz. Split layout: a statement panel on the left with the
// logo colours glowing at its foot, the form on the right. Follows the welcome page.
const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name')
    .max(60, 'That name is too long')
    // letters only (any script), with spaces, apostrophes, hyphens and dots between them
    .refine((v) => /^[\p{L}][\p{L}'.\- ]*$/u.test(v), 'Names can only have letters')
    // at least one word of two or more letters
    .refine((v) => v.split(/[\s\-]+/).some((w) => w.replace(/[^\p{L}]/gu, '').length >= 2), 'Please enter your real name')
    // no keyboard mashing: the same letter four times in a row, or a Latin word with no vowel at all
    .refine((v) => !/(.)\1{3,}/i.test(v), 'That does not look like a name')
    .refine((v) => !/^[a-z'.\- ]+$/i.test(v) || /[aeiouy]/i.test(v), 'That does not look like a name')
    .refine((v) => !/[bcdfghjklmnpqrstvwxz]{5,}/i.test(v), 'That does not look like a name')
    // keyboard-row runs (qwer, asdf, zxcv, hjkl and the like)
    .refine((v) => !/(qwer|wert|erty|rtyu|tyui|yuio|uiop|asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm|1234|abcd)/i.test(v), 'That does not look like a name'),
  country: z.string().min(2),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ''))
    .refine((v) => /^\d{4,15}$/.test(v), 'Enter a valid mobile number'),
  handle: z
    .string()
    .trim()
    .min(2, 'Instagram handle missing')
    .max(30, 'Handle is too long')
    .refine((val) => !/\s/.test(val), 'Handle cannot contain spaces'),
  followers: z
    .string()
    .trim()
    .transform((v) => v.replace(/,/g, '').toLowerCase())
    // 10k, 1.2m, 25000 all work: k = thousand, m = million
    .refine((v) => /^\d+(\.\d+)?\s*[km]?$/.test(v) && parseFollowers(v) > 0, 'Enter your followers, like 10k, 1.2m or 25000'),
});


type FormValues = z.infer<typeof formSchema>;
const schemaWithCountryRule = formSchema.superRefine((v, ctx) => {
  if (v.country === 'IN' && !/^[6-9]\d{9}$/.test(v.phone)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: 'Enter a valid 10-digit mobile number' });
  }
});

// "10k" -> 10000, "1.2m" -> 1200000, "25000" -> 25000
function parseFollowers(v: string): number {
  const m = v.replace(/,/g, '').toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([km]?)$/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  return Math.round(n * (m[2] === 'k' ? 1_000 : m[2] === 'm' ? 1_000_000 : 1));
}

const fieldClass = (bad: boolean) =>
  `w-full rounded-xl border-[0.5px] bg-white px-4 py-2.5 text-base font-normal outline-none transition-all caret-black placeholder:text-sm placeholder:font-normal ${
    bad ? 'border-red-400 focus:border-red-400' : 'border-[#2a2a2a] focus:border-white'
  }`;


export default function SignUpPage() {
  const router = useRouter();
  // Hearts that pop out of the video frame when a clip is on its last seconds (like the likes inside the clip).
  const panelRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef<Record<number, boolean>>({});
  const [hearts, setHearts] = useState<Heart[]>([]);
  const onVideoTime = (i: number, el: HTMLVideoElement) => {
    if (!el.duration) return;
    const left = el.duration - el.currentTime;
    if (left > 2.5) { if (left > el.duration - 1) firedRef.current[i] = false; return; }   // reset once the clip has looped back to its start
    if (firedRef.current[i]) return;
    const panel = panelRef.current?.getBoundingClientRect();
    const v = el.getBoundingClientRect();
    if (!panel) return;
    // Only clips that are actually visible in the frame right now
    const top = Math.max(v.top, panel.top), bottom = Math.min(v.bottom, panel.bottom);
    if (bottom - top < 80) return;
    firedRef.current[i] = true;
    const now = Date.now();
    const burst: Heart[] = Array.from({ length: 8 }, (_, k) => ({
      id: now + k,
      y: (top + bottom) / 2 - panel.top + (Math.random() * 120 - 60),   // around the clip's middle, inside the frame
      delay: k * 110,
      size: 26 + Math.random() * 14,
      drift: 50 + Math.random() * 90,                                     // how far it travels out past the right edge
    }));
    setHearts((h) => [...h, ...burst]);
    window.setTimeout(() => setHearts((h) => h.filter((x) => !burst.some((b) => b.id === x.id))), 3000);
  };

  // Shuffle once; the strip is the shuffled list twice so the loop joins up seamlessly.
  const strip = useMemo(() => {
    const order = [...SIDE_VIDEOS];
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    return [...order, ...order];
  }, []);
  const { setProfile, setHandle, goToQuestion } = useQuizStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schemaWithCountryRule),
    defaultValues: { name: '', phone: '', handle: '', country: 'IN', followers: '' },
  });
  register('country');

  const onSubmit = (values: FormValues) => {
    const dial = (COUNTRIES.find((c) => c.iso === values.country) || COUNTRIES[0]).dial;
    setProfile(values.name, dial + values.phone, String(parseFollowers(values.followers)));
    setHandle(values.handle.startsWith('@') ? values.handle : `@${values.handle}`);
    goToQuestion(0);
    router.push(ROUTES.quiz);
  };

  return (
    // Full-window split: the left half is the video, scrolling top to bottom without end; the right half holds the form.
    <div className="fixed inset-0 z-10 flex">
      {/* Left: the clips stacked (shuffled list, twice) and moved downward on a loop so it never stops */}
      <div className="hidden h-full w-1/2 items-center justify-center p-[1cm] md:flex" aria-hidden="true">
        <div ref={panelRef} className="relative aspect-[0.488] h-full max-h-[860px]">
          <PhoneFrame homeBar>
            <div className="video-marquee flex w-full flex-col">
              {strip.map((src, i) => (
                <video
                  key={i}
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onTimeUpdate={(e) => onVideoTime(i, e.currentTarget)}
                  className="block aspect-[9/16] w-full object-cover"
                />
              ))}
            </div>
          </PhoneFrame>
          {/* Sits over the phone, not clipped by it, so the hearts fly out past the right edge */}
          <FloatingHearts hearts={hearts} />
        </div>
      </div>

      {/* Right: the form, centred in the other half */}
      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex h-full w-full items-center justify-center overflow-y-auto px-6 py-10 md:w-1/2"
      >
        <div className="mx-auto my-auto flex w-full max-w-[360px] flex-col">
          <Image src={SITE.logo} alt={SITE.name} width={796} height={414} priority className="mx-auto" style={{ width: '8.5rem', height: 'auto' }} />
          <h3 className="mt-3 text-center font-poppins text-2xl font-bold text-white whitespace-nowrap">Welcome to TweebStars.</h3>
          <p className="mt-1 text-center font-poppins text-[15px] text-[#9a9a9a]">Let&apos;s get started</p>
          <div className="my-8 h-px w-full bg-[#2a2a2a]" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="auth-name" className="mb-1.5 block font-poppins text-sm text-[#9a9a9a]">Your name</label>
              <input id="auth-name" {...register('name', { onChange: (e) => { e.target.value = e.target.value.replace(/[^\p{L}'.\- ]/gu, '').replace(/\s{2,}/g, ' '); } })} type="text" autoFocus autoComplete="name" placeholder="James Carter" className={fieldClass(!!errors.name)} />
              {errors.name && <p className="mt-1 text-xs font-light text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="auth-phone" className="mb-1.5 block font-poppins text-sm text-[#9a9a9a]">Your phone number</label>
              <div className={`relative flex items-stretch rounded-xl border-[0.5px] bg-white transition-all ${errors.phone ? 'border-red-400' : 'border-[#2a2a2a] focus-within:border-white'}`}>
                <CountryPicker value={watch('country')} onChange={(iso) => setValue('country', iso, { shouldValidate: true })} />
                <input
                  id="auth-phone"
                  {...register('phone', { onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 15); } })}
                  type="tel"
                  pattern="[0-9]*"
                  maxLength={15}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="98765 43210"
                  className="w-full bg-transparent px-4 py-2.5 text-base font-normal outline-none caret-black placeholder:text-sm placeholder:font-normal"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs font-light text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="auth-handle" className="mb-1.5 block font-poppins text-sm text-[#9a9a9a]">Your Instagram handle</label>
              <input
                id="auth-handle"
                {...register('handle')}
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="@yourhandle"
                className={fieldClass(!!errors.handle)}
              />
              {errors.handle && <p className="mt-1 text-xs font-light text-red-500">{errors.handle.message}</p>}
            </div>

            <div>
              <label htmlFor="auth-followers" className="mb-1.5 block font-poppins text-sm text-[#9a9a9a]">No. of followers</label>
              <input
                id="auth-followers"
                {...register('followers', { onChange: (e) => { e.target.value = e.target.value.replace(/[^0-9.,kKmM]/g, '').slice(0, 12); } })}
                type="text"
                placeholder="10K"
                className={fieldClass(!!errors.followers)}
              />
              {errors.followers && <p className="mt-1 text-xs font-light text-red-500">{errors.followers.message}</p>}
            </div>

            <SlideButton type="submit" disabled={isSubmitting} label="Continue" className="mt-3 w-full rounded-xl py-3.5 text-base" />

            <p className="text-center font-poppins text-xs leading-relaxed text-[#9a9a9a]">
              By continuing, you agree to our
              <br />
              <a href={SITE.termsUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">Terms &amp; Conditions</a>
              {' '}and{' '}
              <a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">Privacy Policy</a>.
            </p>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
