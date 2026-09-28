import { create } from 'zustand';

export type ScreenStep = 'welcome' | 'quiz' | 'score';

interface QuizState {
  step: ScreenStep;
  handle: string;
  currentIndex: number;
  correctCount: number;
  scoredCount: number;
  userAnswers: Record<number, string>;
  isAnswered: boolean;
  selectedOption: string | null;
  insightsData: any | null;
  isLoadingInsights: boolean;

  setHandle: (handle: string) => void;
  setStep: (step: ScreenStep) => void;
  setInsights: (data: any) => void;
  setLoadingInsights: (loading: boolean) => void;
  selectOption: (questionId: number, optionId: string, isCorrect: boolean, isScored: boolean) => void;
  nextQuestion: (totalQuestions: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  step: 'welcome',
  handle: '',
  currentIndex: 0,
  correctCount: 0,
  scoredCount: 0,
  userAnswers: {},
  isAnswered: false,
  selectedOption: null,
  insightsData: null,
  isLoadingInsights: false,

  setHandle: (handle) => set({ handle }),
  setStep: (step) => set({ step }),
  setInsights: (data) => set({ insightsData: data }),
  setLoadingInsights: (loading) => set({ isLoadingInsights: loading }),

  selectOption: (questionId, optionId, isCorrect, isScored) =>
    set((state) => {
      if (state.isAnswered) return state;
      return {
        isAnswered: true,
        selectedOption: optionId,
        userAnswers: { ...state.userAnswers, [questionId]: optionId },
        correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
        scoredCount: isScored ? state.scoredCount + 1 : state.scoredCount,
      };
    }),

  nextQuestion: (totalQuestions) =>
    set((state) => {
      if (state.currentIndex < totalQuestions - 1) {
        return {
          currentIndex: state.currentIndex + 1,
          isAnswered: false,
          selectedOption: null,
        };
      } else {
        return {
          step: 'score',
        };
      }
    }),

  resetQuiz: () =>
    set({
      step: 'welcome',
      currentIndex: 0,
      correctCount: 0,
      scoredCount: 0,
      userAnswers: {},
      isAnswered: false,
      selectedOption: null,
    }),
}));
