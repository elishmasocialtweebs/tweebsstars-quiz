'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Gauge } from 'lucide-react';

// Foot of the results page: a phone peeking up from the bottom showing the report, with two floating cards,
// and the Get access button under it.
import { SITE } from '@/config/site';
export default function EarlyAccess() {
  return (
    <motion.section
      id="early-access"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="w-full max-w-[640px] pt-6 text-center"
    >
      {/* The phone, cut off at the bottom, with two floating cards */}
      <div className="relative mx-auto h-[340px] w-full max-w-[560px] overflow-hidden">
        <div className="absolute left-1/2 top-0 aspect-[0.488] w-[300px] -translate-x-1/2 md:w-[320px]">
          <div className="absolute inset-0 rounded-[13.5%/6.6%] bg-[#2b2b2d] shadow-[0_30px_80px_rgba(0,0,0,0.7),inset_0_0_0_1.5px_#55555a,inset_0_0_0_4px_#141416]">
            <span className="absolute -left-[3px] top-[17%] h-[3.5%] w-[3px] rounded-l-sm bg-[#4a4a4e]" />
            <span className="absolute -left-[3px] top-[24%] h-[7%] w-[3px] rounded-l-sm bg-[#4a4a4e]" />
            <span className="absolute -left-[3px] top-[33%] h-[7%] w-[3px] rounded-l-sm bg-[#4a4a4e]" />
            <span className="absolute -right-[3px] top-[27%] h-[10%] w-[3px] rounded-r-sm bg-[#4a4a4e]" />
          </div>
          <div className="absolute inset-[3.2%_3.2%] overflow-hidden rounded-[11.5%/5.6%] bg-[#ffffff] px-5 pt-14 text-left">
            <span className="absolute left-1/2 top-[2.2%] h-[3.6%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
            <p className="font-poppins text-lg font-bold text-black">Your report</p>
            <p className="mt-3 font-poppins text-[10px] uppercase tracking-[0.14em] text-[#9a9a9a]">Top insight</p>
            <div className="mt-2 rounded-xl border-[0.5px] border-[#e5e5e5] bg-[#ffffff] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-poppins text-[13px] font-semibold text-black"><CheckCircle2 className="h-4 w-4 text-[#2ed3d3]" /> Audience DNA</span>
                <span className="rounded-md bg-[#f4f4f4] px-1.5 py-0.5 font-poppins text-[10px] text-[#6b6b6b]">Ready</span>
              </div>
              <p className="mt-1 pl-6 font-poppins text-[11px] text-[#6b6b6b]">Who really follows you</p>
              <span className="ml-6 mt-2 inline-block rounded-full bg-[#fde8ef] px-2 py-0.5 font-poppins text-[10px] text-[#e12669]">● High signal</span>
            </div>
            <div className="mt-3 rounded-xl border-[0.5px] border-[#e5e5e5] p-3 opacity-50">
              <span className="flex items-center gap-2 font-poppins text-[13px] font-semibold text-black"><CheckCircle2 className="h-4 w-4 text-[#f7e014]" /> Content Power</span>
              <p className="mt-1 pl-6 font-poppins text-[11px] text-[#6b6b6b]">What content works best</p>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute left-0 top-9 flex items-center gap-3 rounded-2xl bg-[#ffffff] px-4 py-3 text-left shadow-[0_16px_40px_rgba(0,0,0,0.5)] md:left-6"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f4f4]"><Gauge className="h-4 w-4 text-black" /></span>
          <span>
            <span className="block font-poppins text-[11px] text-[#6b6b6b]">Creator Score</span>
            <span className="block font-poppins text-lg font-semibold text-black">84 / 100</span>
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="absolute right-0 top-[150px] flex items-center gap-2 rounded-2xl bg-[#ffffff] px-3 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] md:right-6"
        >
          <div className="flex -space-x-2">
            {['#f7e014', '#e12669', '#2ed3d3'].map((c) => (
              <span key={c} className="h-7 w-7 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="font-poppins text-[11px] font-medium text-black">+1,000 creators</span>
        </motion.div>

        {/* Fade the phone out at the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* The real Get access button, under the phone */}
      <a
        href={SITE.accessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mx-auto mt-2 inline-block overflow-hidden rounded-xl bg-[#f7e014] px-10 py-3.5 font-poppins text-base font-semibold text-black"
      >
        <span aria-hidden="true" className="absolute inset-0 translate-y-full bg-[#e12669] transition-transform duration-500 ease-out group-hover:translate-y-0" />
        <span className="relative z-10">Get access now →</span>
      </a>
    </motion.section>
  );
}
