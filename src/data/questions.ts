export interface Question {
  id: number;
  category: string;
  tag: string;
  title: string;
  question: string;
  visualType: 'emoji' | 'reels' | 'chart' | 'stat';
  visual: string | string[];
  options: {
    id: string;
    emoji: string;
    label: string;
  }[];
  scored: boolean;
  answer: string;
  explanation: string;
  note?: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    category: "REELS PERFORMANCE",
    tag: "MOST VIRAL REEL",
    title: "Which of these reels got you the highest views?",
    question: "Select the Reel you think outperformed all others in reach.",
    visualType: "reels",
    visual: [
      "Holi Me Machaadi Dhoom 🎉",
      "Is Your Jeth Also Like This? 🤪",
      "New Added 🔥",
      "GT Fans Right Now 🏏"
    ],
    options: [
      { id: "A", emoji: "🎨", label: "Holi Me Machaadi Dhoom" },
      { id: "B", emoji: "😂", label: "Is Your Jeth Also Like This?" },
      { id: "C", emoji: "✨", label: "New Added" },
      { id: "D", emoji: "🏏", label: "GT Fans Right Now" }
    ],
    scored: true,
    answer: "B",
    explanation: "'Is Your Jeth Also Like This?' generated 42% higher non-follower reach and 3.2x more shares on Instagram.",
    note: "Relatable comedy content frequently receives 3x higher re-share rates than seasonal posts."
  },
  {
    id: 2,
    category: "AUDIENCE DEMOGRAPHICS",
    tag: "TOP CITY HUB",
    title: "Where is your biggest audience cluster located?",
    question: "Which city hosts the highest percentage of your total followers?",
    visualType: "emoji",
    visual: "🏙️📍",
    options: [
      { id: "A", emoji: "🌆", label: "Mumbai" },
      { id: "B", emoji: "🏛️", label: "Delhi NCR" },
      { id: "C", emoji: "🌴", label: "Bengaluru" },
      { id: "D", emoji: "🕌", label: "Ahmedabad" }
    ],
    scored: true,
    answer: "A",
    explanation: "Mumbai accounts for 34.8% of your active audience, closely followed by Delhi at 22.1%.",
    note: "TweebTech Insights automatically analyzes audience geographic density from engagement data."
  },
  {
    id: 3,
    category: "PEAK ENGAGEMENT",
    tag: "BEST TIME TO POST",
    title: "What time are your followers most active on Instagram?",
    question: "Pick the hour block with highest peak online activity.",
    visualType: "stat",
    visual: "⏰ 📈",
    options: [
      { id: "A", emoji: "🌅", label: "Morning (8:00 AM - 10:00 AM)" },
      { id: "B", emoji: "☀️", label: "Afternoon (1:00 PM - 3:00 PM)" },
      { id: "C", emoji: "🌆", label: "Evening (6:00 PM - 8:00 PM)" },
      { id: "D", emoji: "🌙", label: "Night (9:30 PM - 11:30 PM)" }
    ],
    scored: true,
    answer: "D",
    explanation: "Your profile peak activity spikes around 9:45 PM on weekdays, yielding +68% faster initial impression build.",
    note: "Posting 30 mins prior to peak window boosts feed algorithm priority."
  },
  {
    id: 4,
    category: "CONTENT IMPACT",
    tag: "FOLLOWER MAGNET",
    title: "Which type of post converts the most new followers?",
    question: "What format brought in the most profile visits into new follows?",
    visualType: "emoji",
    visual: "🧲 📈",
    options: [
      { id: "A", emoji: "🎬", label: "Trending Music Reels (< 15s)" },
      { id: "B", emoji: "📚", label: "Educational Carousel Slides" },
      { id: "C", emoji: "📸", label: "Aesthetic Single Photo Posts" },
      { id: "D", emoji: "🎙️", label: "Behind The Scenes Stories" }
    ],
    scored: true,
    answer: "B",
    explanation: "Carousel slides converted 12.4% of non-follower profile visits into followers due to high save rates.",
    note: "Informational slides get saved 4x more than standard single-image posts."
  },
  {
    id: 5,
    category: "ENGAGEMENT RATE",
    tag: "SAVE VS SHARE",
    title: "What action do your viewers take most often?",
    question: "Do your posts receive more Saves or Direct Message Shares?",
    visualType: "chart",
    visual: "📊 💬 🔖",
    options: [
      { id: "A", emoji: "🔖", label: "Bookmark Saves" },
      { id: "B", emoji: "🚀", label: "DM Direct Shares" },
      { id: "C", emoji: "💬", label: "Public Comments" },
      { id: "D", emoji: "❤️", label: "Likes" }
    ],
    scored: true,
    answer: "B",
    explanation: "DM Shares exceed Bookmark Saves by 2.1x! Your content is highly shareable between friends.",
    note: "Direct Shares carry the heaviest weight in Instagram's recommendation engine."
  }
];
