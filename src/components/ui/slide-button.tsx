'use client';

import React from 'react';

// The one TweebStars button: a solid yellow box (the logo's yellow); on hover a solid pink layer (the logo's
// pink) slides up from the bottom over it. Renders a link when given an href, otherwise a button.
interface Props {
  label: React.ReactNode;
  href?: string;
  newTab?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;   // size and shape: padding, radius, width, text size
}

const base = 'group relative inline-flex cursor-pointer items-center justify-center overflow-hidden bg-[#f7e014] font-poppins font-semibold text-black outline-none transition-opacity disabled:cursor-not-allowed disabled:opacity-40';

export default function SlideButton({ label, href, newTab, type = 'button', disabled, onClick, className = 'rounded-lg px-7 py-3.5 text-base' }: Props) {
  const inner = (
    <>
      <span aria-hidden="true" className="absolute inset-0 translate-y-full bg-[#e12669] transition-transform duration-500 ease-out group-hover:translate-y-0" />
      <span className="relative z-10 whitespace-nowrap">{label}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} onClick={onClick} className={`${base} ${className}`} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${className}`}>
      {inner}
    </button>
  );
}
