'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { COUNTRIES, type Country } from '@/data/countries';

// Country-code picker for the phone field: shows the code when closed; when open, a search box and the full
// list drop down beneath. Type a country name or a code to filter, click or press Enter to pick, Escape to close.
export default function CountryPicker({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const wrap = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.iso === value) || COUNTRIES[0];
  const matches = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^\+/, '');
    if (!s) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(s) || c.dial.replace('+', '').startsWith(s) || c.iso.toLowerCase() === s);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    setQ('');
    setTimeout(() => search.current?.focus(), 0);
    const onDoc = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const pick = (c: Country) => { onChange(c.iso); setOpen(false); };

  return (
    <div ref={wrap} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code ${selected.dial}, ${selected.name}`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-full items-center gap-1.5 border-r border-[#e5e5e5] py-2.5 pl-4 pr-3 text-base font-medium text-black outline-none"
      >
        <span>{selected.dial}</span>
        <span className="text-[10px] text-[#6b6b6b]">▼</span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-72 overflow-hidden rounded-xl border-[0.5px] border-[#2a2a2a] bg-white shadow-2xl">
          <div className="border-b border-[#eeeeee] p-2">
            <input
              ref={search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && matches[0]) { e.preventDefault(); pick(matches[0]); } }}
              placeholder="Search country or code"
              className="w-full rounded-lg bg-[#f4f4f4] px-3 py-2 text-sm text-black outline-none placeholder:text-[#8a8a8a]"
            />
          </div>
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {matches.length === 0 && <li className="px-3 py-2 text-sm text-[#8a8a8a]">No match</li>}
            {matches.map((c) => (
              <li key={c.iso} role="option" aria-selected={c.iso === value}>
                <button
                  type="button"
                  onClick={() => pick(c)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm text-black hover:bg-[#f4f4f4] ${c.iso === value ? 'bg-[#f7e014]/40' : ''}`}
                >
                  <span>{c.name}</span>
                  <span className="text-[#6b6b6b]">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
