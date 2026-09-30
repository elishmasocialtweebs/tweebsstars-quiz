// Site-wide settings in one place. Links, assets and the few numbers the pages need.

export const SITE = {
  name: 'TweebStars',
  logo: '/logo.png',
  // Where "Get access now" sends people. Replace with the report / payment link when it exists.
  accessUrl: 'https://tweebstars.in',
  termsUrl: 'https://tweebstars.in/terms',
  privacyUrl: 'https://tweebstars.in/privacy',
} as const;

// Routes, so pages never spell a path twice
export const ROUTES = {
  welcome: '/',
  signUp: '/sign-up',
  quiz: '/quiz',
  results: '/results',
} as const;

// Clips on the sign-up page phone, played in a random order. Drop another file in /public/videos and add it here.
export const SIDE_VIDEOS = ['/videos/video-1.mp4', '/videos/video-2.mp4'] as const;

// Question 3's slider: how much for one collab post (rupees)
export const AMOUNT = { min: 500, max: 100_000, step: 500, start: 5_000 } as const;
