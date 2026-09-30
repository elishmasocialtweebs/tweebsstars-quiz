// The quiz questions, one page each. Two are multiple choice, the last one is a typed amount.
// The answers are stored per question id in the store (userAnswers) and go to the report later.
export interface Question {
  id: number;
  title: string;
  kind: 'choice' | 'amount';
  options?: { id: string; label: string }[];
  placeholder?: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What's the most views you've achieved on a single post so far?",
    kind: 'choice',
    options: [
      { id: 'A', label: 'Under 1K' },
      { id: 'B', label: '1K to 10K' },
      { id: 'C', label: '10K to 50K' },
      { id: 'D', label: '50K to 100K' },
      { id: 'E', label: '100K+' },
    ],
  },
  {
    id: 2,
    title: "What's the best engagement rate you've achieved on a post?",
    kind: 'choice',
    options: [
      { id: 'A', label: 'Below 2%' },
      { id: 'B', label: '2% to 5%' },
      { id: 'C', label: '5% to 10%' },
      { id: 'D', label: 'Above 10%' },
      { id: 'E', label: "I'm not sure yet" },
    ],
  },
  {
    id: 3,
    title: 'If a brand approached you today, what would you charge for one collab post?',
    kind: 'amount',
    placeholder: '5,000',
  },
];
