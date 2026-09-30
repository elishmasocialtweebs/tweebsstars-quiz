// The Instagram-style notification bubble on the "Get instant reveals" card, drawn as a vector so it stays crisp at
// any size: a red pill with a pointer on top, and a comment, a heart and a follower, each with a count.
export default function RevealsBadge({ className }: { className?: string }) {
  const W = '#ffffff';
  return (
    <svg viewBox="0 0 228 62" className={className} aria-hidden="true">
      {/* pill with the little pointer on top */}
      <path
        d="M20 12h82l8-9a5 5 0 0 1 8 0l8 9h82a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14H20A14 14 0 0 1 6 48V26a14 14 0 0 1 14-14z"
        fill="#e0505c"
      />
      {/* comment */}
      <path d="M31 22.5a11 11 0 0 1 11 10.5c0 6-4.9 10.5-11 10.5-1.3 0-2.6-.2-3.8-.6L22 46l1.3-5.6A10.3 10.3 0 0 1 20 33c0-5.8 4.9-10.5 11-10.5z" fill={W} />
      <text x="46" y="41" fill={W} fontSize="21" fontWeight="500" fontFamily="var(--font-poppins), Poppins, sans-serif">54</text>
      {/* heart */}
      <path d="M96 43.5c-1.6-1.3-13-9.4-13-17.7 0-4 3.1-7 7-7 2.5 0 4.6 1.3 6 3.3a7.3 7.3 0 0 1 6-3.3c3.9 0 7 3 7 7 0 8.3-11.4 16.4-13 17.7z" fill={W} />
      <text x="113" y="41" fill={W} fontSize="21" fontWeight="500" fontFamily="var(--font-poppins), Poppins, sans-serif">229</text>
      {/* follower */}
      <circle cx="165" cy="27" r="5.6" fill={W} />
      <path d="M154 44c0-6.2 4.9-10 11-10s11 3.8 11 10z" fill={W} />
      <text x="179" y="41" fill={W} fontSize="21" fontWeight="500" fontFamily="var(--font-poppins), Poppins, sans-serif">415</text>
    </svg>
  );
}
