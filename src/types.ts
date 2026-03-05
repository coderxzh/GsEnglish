export interface Word {
  id: string;
  text: string;
  phonetic: string;
  translation: string;
  root?: string;
  proficiency: number; // 0-100
  lastPracticed?: string;
}

export interface PhoneticSymbol {
  symbol: string;
  type: 'vowel' | 'consonant';
  description: string;
  examples: string[];
}

export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  color: string;
  progress: number;
}

export interface UserState {
  name: string;
  level: number;
  exp: number;
  coins: number;
  grade: string;
  studyTimeToday: number; // minutes
  onboardingComplete: boolean;
  wordBank: Word[];
  checkInDays: number;
  gameTickets: number;
  currentBookId: number;
  books: Book[];
  hasCheckedInToday: boolean;
  parentalControl: {
    battleModeEnabled: boolean;
    battleDurationLimit: number; // in minutes
  };
}

export const PHONETIC_SYMBOLS: PhoneticSymbol[] = [
  // Vowels
  { symbol: 'i:', type: 'vowel', description: '舌尖抵下齿，舌前部抬高，嘴角向两边张开。', examples: ['bee', 'see', 'tea'] },
  { symbol: 'ɪ', type: 'vowel', description: '舌前部抬高，舌位比/i:/低，牙床半开。', examples: ['it', 'big', 'six'] },
  { symbol: 'e', type: 'vowel', description: '舌前部抬高，舌位比/ɪ/低，牙床半开。', examples: ['egg', 'bed', 'pen'] },
  { symbol: 'æ', type: 'vowel', description: '舌前部抬高，舌位最低，牙床全开。', examples: ['cat', 'bag', 'apple'] },
  // ... more will be added in the component
];

export const INITIAL_WORDS: Word[] = [
  { id: '1', text: 'apple', phonetic: '/ˈæpl/', translation: '苹果', proficiency: 0 },
  { id: '2', text: 'banana', phonetic: '/bəˈnɑːnə/', translation: '香蕉', proficiency: 0 },
  { id: '3', text: 'cat', phonetic: '/kæt/', translation: '猫', proficiency: 0 },
  { id: '4', text: 'dog', phonetic: '/dɒɡ/', translation: '狗', proficiency: 0 },
];
