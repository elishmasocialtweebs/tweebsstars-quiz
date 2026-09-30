import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// What the quiz remembers about the player: who they are (from the sign-up page), which question they are
// on and what they answered. Pages are real routes now, so the page itself is not stored here.
interface QuizState {
  name: string;          // from the sign-up page
  phone: string;         // from the sign-up page, dial code prefixed
  followers: string;     // follower count typed on the sign-up page, as a plain number
  handle: string;        // Instagram handle, @ prefixed
  currentIndex: number;  // which question card is showing
  userAnswers: Record<number, string>;   // question id -> option id, or the slider amount

  setProfile: (name: string, phone: string, followers: string) => void;
  setHandle: (handle: string) => void;
  setAnswer: (questionId: number, value: string) => void;   // pick or slide, can change until Next
  nextQuestion: (totalQuestions: number) => boolean;        // returns true when the quiz is finished
  goToQuestion: (index: number) => void;
  resetQuiz: () => void;
}

// Saved in the browser (localStorage) so a refresh keeps the profile and the answers.
export const useQuizStore = create<QuizState>()(persist((set, get) => ({
  name: '',
  phone: '',
  followers: '',
  handle: '',
  currentIndex: 0,
  userAnswers: {},

  setProfile: (name, phone, followers) => set({ name, phone, followers }),
  setHandle: (handle) => set({ handle }),

  setAnswer: (questionId, value) =>
    set((state) => ({ userAnswers: { ...state.userAnswers, [questionId]: value } })),

  nextQuestion: (totalQuestions) => {
    const { currentIndex } = get();
    if (currentIndex < totalQuestions - 1) {
      set({ currentIndex: currentIndex + 1 });
      return false;
    }
    return true;
  },

  goToQuestion: (index) => set({ currentIndex: Math.max(0, index) }),

  resetQuiz: () =>
    set({ name: '', phone: '', followers: '', handle: '', currentIndex: 0, userAnswers: {} }),
}), {
  name: 'tweebstars-quiz',
  storage: createJSONStorage(() => localStorage),
}));

// True once the page is on the client and the saved state is available. Pages wait for this before rendering
// anything that depends on the store, so server and client render the same HTML (no hydration errors).
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return hydrated;
}
