// Keeps a page plain black behind its content. The body carries the grain texture (for the sign-up page);
// pages that should stay flat black drop this in.
export default function BlackBackdrop() {
  return <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true" />;
}
