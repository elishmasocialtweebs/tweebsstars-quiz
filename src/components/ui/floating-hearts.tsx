'use client';

import React from 'react';

// A burst of "like" hearts, in the same pink-circle style as the ones inside the clips. Each heart starts
// near the right edge of the video frame and floats up and outward, past the frame, then fades.
export interface Heart {
  id: number;
  y: number;      // px from the top of the frame
  delay: number;  // ms
  size: number;   // px
  drift: number;  // px it travels to the right, beyond the frame edge
}

export default function FloatingHearts({ hearts }: { hearts: Heart[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-pop absolute"
          style={{
            top: h.y,
            right: 24,
            width: h.size,
            height: h.size,
            animationDelay: `${h.delay}ms`,
            ['--drift' as string]: `${h.drift}px`,
          }}
        >
          <svg viewBox="0 0 40 40" width={h.size} height={h.size} aria-hidden="true">
            <circle cx="20" cy="20" r="20" fill="#e0505c" />
            <path
              d="M20 29.5c-.4 0-.8-.15-1.1-.4C14.3 25 11 22.1 11 18.2 11 15.6 13 13.6 15.6 13.6c1.6 0 3.1.8 4.4 2.3 1.3-1.5 2.8-2.3 4.4-2.3 2.6 0 4.6 2 4.6 4.6 0 3.9-3.3 6.8-7.9 10.9-.3.25-.7.4-1.1.4z"
              fill="#fff"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
