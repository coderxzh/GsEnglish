import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Gamepad2, 
  User, 
  Settings, 
  Trophy, 
  Coins, 
  Clock,
  ChevronRight,
  Mic,
  Volume2,
  Star,
  Search,
  BarChart3,
  ShieldCheck,
  Share2,
  PlayCircle,
  Ticket,
  Sword,
  Library,
  Globe,
  Trash2,
  Lightbulb,
  Sparkles,
  ClipboardCheck,
  X,
  Minus,
  Plus
} from 'lucide-react';
import { cn } from './lib/utils';
import { UserState, INITIAL_WORDS } from './types';

// --- Context ---
const AppContext = createContext<{
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPhonetic: string | null;
  setSelectedPhonetic: (s: string | null) => void;
} | null>(null);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// --- Components ---

const Onboarding = ({ onComplete }: { onComplete: (grade: string) => void }) => {
  const [grade, setGrade] = useState('');

  const sections = [
    {
      title: '小学',
      items: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      cols: 3
    },
    {
      title: '初中',
      items: ['初一', '初二', '初三'],
      cols: 3
    },
    {
      title: '高中',
      items: ['高一', '高二', '高三'],
      cols: 3
    },
    {
      title: '大学',
      items: ['大一', '大二', '大三', '大四', '硕士生', '博士生'],
      cols: 3
    },
    {
      title: '成人',
      items: ['工作党', '其他'],
      cols: 2
    }
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="flex justify-end">
        <button 
          onClick={() => onComplete('未设置')} 
          className="text-slate-400 font-bold py-2 px-4 hover:bg-slate-50 rounded-full transition-colors"
        >
          跳过
        </button>
      </div>

      <header className="max-w-md w-full mx-auto mt-4 mb-12 space-y-2">
        <h1 className="text-4xl font-black text-slate-900 font-display">你现在是</h1>
        <p className="text-slate-400 font-bold text-lg">我们将为你推荐适合的学习内容</p>
      </header>

      <div className="max-w-md w-full mx-auto flex-1 space-y-10 pb-32">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-300 px-1">{section.title}</h2>
            <div className={cn(
              "grid gap-3",
              section.cols === 3 ? "grid-cols-3" : "grid-cols-2"
            )}>
              {section.items.map((item) => (
                <button
                  key={item}
                  onClick={() => setGrade(item)}
                  className={cn(
                    "py-4 rounded-xl transition-all font-bold text-base",
                    grade === item 
                      ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105 z-10" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 max-w-md mx-auto">
        <button
          disabled={!grade}
          onClick={() => onComplete(grade)}
          className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-xl shadow-2xl shadow-brand-primary/20 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95"
        >
          开启探险之旅
        </button>
      </div>
    </div>
  );
};

const Header = () => {
  const { user } = useApp();
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-slate-100/50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-900 font-display leading-none">{user.name}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">LV.{user.level}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-100">
          <div className="w-4 h-4 bg-brand-secondary rounded-full flex items-center justify-center">
            <Coins className="w-2.5 h-2.5 text-white fill-white" />
          </div>
          <span className="text-xs font-black text-slate-600">{user.coins}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-100">
          <Trophy className="w-4 h-4 text-brand-primary" />
          <span className="text-xs font-black text-slate-600">12</span>
        </div>
        <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-primary transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

const HomeView = () => {
  const { user, setUser, setActiveTab, selectedPhonetic, setSelectedPhonetic } = useApp();
  const currentBook = user.books.find(b => b.id === user.currentBookId) || user.books[0];

  const handleCheckIn = () => {
    if (user.hasCheckedInToday) return;
    setUser(prev => ({
      ...prev,
      checkInDays: prev.checkInDays + 1,
      coins: prev.coins + 50,
      hasCheckedInToday: true
    }));
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto pb-28">
      {/* Check-in Section */}
      <section className="app-card p-6 bg-white flex items-center justify-between border-brand-primary/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Star className={cn("w-8 h-8", user.hasCheckedInToday && "fill-brand-primary")} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 font-display">连续打卡 {user.checkInDays} 天</h3>
            <p className="text-xs font-bold text-slate-400">每日打卡奖励 50 积分</p>
          </div>
        </div>
        <button
          onClick={handleCheckIn}
          disabled={user.hasCheckedInToday}
          className={cn(
            "px-6 py-3 rounded-xl font-black text-sm transition-all active:scale-95",
            user.hasCheckedInToday 
              ? "bg-slate-100 text-slate-400 cursor-default" 
              : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-105"
          )}
        >
          {user.hasCheckedInToday ? '今日已打卡' : '立即打卡'}
        </button>
      </section>

      {/* Current Book Card */}
      <section 
        onClick={() => setActiveTab('library')}
        className="app-card p-4 flex gap-4 items-center cursor-pointer hover:border-brand-primary/30 transition-all group"
      >
        <div className={cn("w-20 h-28 rounded-lg shadow-md flex-shrink-0 relative overflow-hidden flex items-center justify-center text-4xl", currentBook.color)}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          {currentBook.cover}
          <BookOpen className="absolute top-2 right-2 w-4 h-4 text-slate-400 opacity-50" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-slate-900 font-display group-hover:text-brand-primary transition-colors">{currentBook.title}</h2>
            <button className="text-xs font-bold text-slate-400 flex items-center gap-1">
              修改 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-brand-primary" style={{ width: `${currentBook.progress}%` }} />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span>学习进度 {currentBook.progress}%</span>
          </div>
        </div>
      </section>

      {/* Today's Plan */}
      <section className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-slate-900 font-display">今日计划</h3>
          <span className="text-xs font-bold text-brand-primary">和大家一起开启学习...</span>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="text-center">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">需新学</div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-slate-900 font-display">10</span>
              <span className="text-sm font-bold text-slate-400">音标</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">需复习</div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-slate-900 font-display">2</span>
              <span className="text-sm font-bold text-slate-400">音标</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Clock className="w-4 h-4" />
            预计用时 4 分钟
          </div>
          <button 
            onClick={() => setActiveTab('reader')}
            className="btn-primary w-full text-xl"
          >
            开始学习吧！
          </button>
        </div>
      </section>

      {/* Quick Tools Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { 
            icon: BookOpen, 
            label: '音标学习', 
            badge: 'NEW', 
            onClick: () => setActiveTab('phonetics')
          },
          { icon: Mic, label: '跟读训练', badge: 'HOT', onClick: () => setActiveTab('reader') },
          { icon: Sword, label: '音标对战', badge: '', onClick: () => setActiveTab('game') },
          { icon: Library, label: '生词本', badge: '', onClick: () => setActiveTab('wordbank') },
        ].map((tool, i) => (
          <button 
            key={i} 
            onClick={tool.onClick}
            className="app-card p-4 flex flex-col items-center gap-2 bg-white hover:bg-slate-50 transition-colors relative"
          >
            {tool.badge && (
              <span className={cn(
                "absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-[8px] font-black text-white",
                tool.badge === 'NEW' ? 'bg-rose-500' : 'bg-orange-500'
              )}>
                {tool.badge}
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-primary">
              <tool.icon className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black text-slate-600 whitespace-nowrap">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Weekly Leaderboard */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-black text-slate-900 font-display">本周排行榜</h3>
          </div>
          <button className="text-xs font-bold text-slate-400">查看全部</button>
        </div>
        
        <div className="app-card bg-white overflow-hidden">
          {[
            { rank: 1, name: '探险家小王', xp: 2840, initial: '王', color: 'text-orange-500' },
            { rank: 2, name: '英语达人', xp: 2650, initial: '英', color: 'text-slate-400' },
            { rank: 3, name: '单词王', xp: 2420, initial: '单', color: 'text-slate-400' },
          ].map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-center justify-between p-5",
                i !== 2 && "border-b border-slate-50"
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn("w-6 text-center font-black italic text-lg", item.color)}>
                  {item.rank}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                  {item.initial}
                </div>
                <span className="font-black text-slate-700">{item.name}</span>
              </div>
              <span className="font-black text-brand-primary">{item.xp} XP</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

const IPA_CATEGORIES = [
  {
    title: '20个元音 (Vowels)',
    subCategories: [
      {
        title: '单元音 (Monophthongs)',
        color: 'text-blue-600',
        groups: [
          { name: '前元音', symbols: ['i:', 'ɪ', 'e', 'æ'] },
          { name: '中元音', symbols: ['ɜ:', 'ə', 'ʌ'] },
          { name: '后元音', symbols: ['u:', 'ʊ', 'ɔ:', 'ɒ', 'ɑ:'] },
        ]
      },
      {
        title: '双元音 (Diphthongs)',
        color: 'text-indigo-600',
        groups: [
          { name: '开合双元音', symbols: ['eɪ', 'aɪ', 'ɔɪ', 'aʊ', 'əʊ'] },
          { name: '集中双元音', symbols: ['ɪə', 'eə', 'ʊə'] },
        ]
      }
    ]
  },
  {
    title: '28个辅音 (Consonants)',
    subCategories: [
      {
        title: '爆破音',
        color: 'text-emerald-600',
        groups: [
          { name: '清', symbols: ['p', 't', 'k'] },
          { name: '浊', symbols: ['b', 'd', 'ɡ'] },
        ]
      },
      {
        title: '摩擦音',
        color: 'text-amber-600',
        groups: [
          { name: '清', symbols: ['f', 's', 'ʃ', 'θ', 'h'] },
          { name: '浊', symbols: ['v', 'z', 'ʒ', 'ð', 'r'] },
        ]
      },
      {
        title: '破擦音',
        color: 'text-rose-600',
        groups: [
          { name: '清', symbols: ['tʃ', 'tr', 'ts'] },
          { name: '浊', symbols: ['dʒ', 'dr', 'dz'] },
        ]
      },
      {
        title: '鼻辅音 (浊)',
        color: 'text-violet-600',
        groups: [
          { name: '', symbols: ['m', 'n', 'ŋ'] }
        ]
      },
      {
        title: '舌边音 (浊)',
        color: 'text-cyan-600',
        groups: [
          { name: '', symbols: ['l'] }
        ]
      },
      {
        title: '半元音 (浊)',
        color: 'text-orange-600',
        groups: [
          { name: '', symbols: ['j', 'w'] }
        ]
      }
    ]
  }
];

const ALL_IPA_SYMBOLS = IPA_CATEGORIES.flatMap(cat => 
  cat.subCategories.flatMap(sub => 
    sub.groups.flatMap(group => group.symbols)
  )
);

const getPhoneticCategory = (symbol: string) => {
  for (const cat of IPA_CATEGORIES) {
    for (const sub of cat.subCategories) {
      for (const group of sub.groups) {
        if (group.symbols.includes(symbol)) {
          const mainCat = cat.title.includes('元音') ? '元音' : '辅音';
          const subCat = sub.title.replace(/^\d+\.\s*/, '').split(' (')[0];
          const groupName = group.name ? ` | ${group.name}` : '';
          return `${mainCat} | ${subCat}${groupName}`;
        }
      }
    }
  }
  return '音标';
};

const PhoneticsView = () => {
  const { setActiveTab, setSelectedPhonetic } = useApp();

  return (
    <div className="p-4 space-y-8 max-w-4xl mx-auto pb-28">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setActiveTab('home')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-2xl font-black text-slate-900">音标库</h2>
      </div>

      {/* IPA Banner */}
      <section className="rounded-2xl p-6 bg-brand-primary text-white relative overflow-hidden shadow-sm border border-blue-600/20">
        <div className="relative z-10">
          <h2 className="text-2xl font-black font-display mb-2">国际音标 (IPA)</h2>
          <p className="text-white/80 text-sm font-bold">掌握 48 个标准发音，开启地道口语之旅</p>
        </div>
        <BookOpen className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
      </section>

      {IPA_CATEGORIES.map((cat, idx) => (
        <section key={idx} className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 font-display flex items-center gap-2 px-2">
            <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
            {cat.title}
          </h3>
          
          <div className="space-y-8">
            {cat.subCategories.map((sub, sIdx) => (
              <div key={sIdx} className="space-y-4">
                <h4 className="text-md font-bold text-slate-600 px-4 flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  {sub.title}
                </h4>
                
                <div className="space-y-6">
                  {sub.groups.map((group, gIdx) => (
                    <div key={gIdx} className="px-4">
                      {group.name && (
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                          {group.name}
                        </div>
                      )}
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {group.symbols.map((symbol) => (
                          <button
                            key={symbol}
                            onClick={() => {
                              setSelectedPhonetic(symbol);
                              setActiveTab('phoneticDetail');
                            }}
                            className={cn(
                              "app-card aspect-square flex items-center justify-center text-xl font-black transition-all group",
                              sub.color,
                              "hover:border-brand-primary/30 hover:bg-brand-primary/5"
                            )}
                          >
                            <span className="group-hover:scale-110 transition-transform">{symbol}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

const PhoneticDetailView = () => {
  const { selectedPhonetic, setSelectedPhonetic, setActiveTab } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      setScore(Math.floor(Math.random() * 30) + 70);
    }
  };

  const getPhoneticDetail = (symbol: string) => {
    const defaultDetail = {
      techniques: [
        '1. 张开你的嘴巴，好像你在微笑，露出你的牙齿，嘴唇向两边伸开，成扁平形。',
        '2. 将舌前部向硬腭尽量抬起。舌头轻微接触下齿背部。',
        '3. 嘴唇绷紧，舌头肌肉保持紧张，震动声带，发出音。',
      ],
      examples: [
        { word: 'bee', phonetic: '/bi:/', translation: 'n. 蜜蜂' },
        { word: 'we', phonetic: '/wi:/', translation: 'pron. 我们' },
        { word: 'read', phonetic: '/ri:d/', translation: 'vt. 阅读' },
      ]
    };

    const data: Record<string, any> = {
      'i:': defaultDetail,
      'ɪ': {
        techniques: [
          '1. 嘴唇微微张开，向两边伸开，成扁平形。',
          '2. 舌尖抵下齿，舌前部向硬腭抬起，但比/i:/低。',
          '3. 震动声带，发出短促的/ɪ/音。',
        ],
        examples: [
          { word: 'big', phonetic: '/bɪɡ/', translation: 'adj. 大的' },
          { word: 'it', phonetic: '/ɪt/', translation: 'pron. 它' },
          { word: 'city', phonetic: '/ˈsɪti/', translation: 'n. 城市' },
        ]
      },
      'e': {
        techniques: [
          '1. 嘴唇向两边伸开，成扁平形，张开程度比/ɪ/稍大。',
          '2. 舌尖抵下齿，舌前部向硬腭抬起。',
          '3. 震动声带，发出短促的/e/音。',
        ],
        examples: [
          { word: 'bed', phonetic: '/bed/', translation: 'n. 床' },
          { word: 'get', phonetic: '/ɡet/', translation: 'vt. 得到' },
          { word: 'pen', phonetic: '/pen/', translation: 'n. 钢笔' },
        ]
      }
    };

    return data[symbol] || defaultDetail;
  };

  const phoneticData = getPhoneticDetail(selectedPhonetic || 'i:');

  const detail = {
    symbol: selectedPhonetic || 'i:',
    category: getPhoneticCategory(selectedPhonetic || 'i:'),
    breakdown: selectedPhonetic === 'i:' ? 'i + :' : selectedPhonetic,
    techniques: phoneticData.techniques,
    examples: phoneticData.examples
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Top Bar */}
      <div className="px-4 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100">
        <button 
          onClick={() => setActiveTab('phonetics')} 
          className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <div className="flex items-center gap-4 text-xs font-black text-slate-600 uppercase tracking-widest">
          <span>需新学 10</span>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>需复习 2</span>
        </div>
        <button 
          onClick={() => setActiveTab('phonetics')}
          className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Library className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* AI Reader Style Header */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-bold shadow-lg shadow-brand-primary/20">AI</div>
            <div>
              <div className="font-bold text-slate-900">AI 领读员</div>
              <div className="text-xs text-slate-500">正在练习音标 /{detail.symbol}/</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <motion.div 
              key={detail.symbol}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-9xl font-black text-brand-primary font-display mb-6 drop-shadow-sm"
            >
              {detail.symbol}
            </motion.div>
            <div className="text-sm font-bold text-slate-400 bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
              {detail.category} • {detail.breakdown}
            </div>
          </div>

          {score !== null && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8 flex flex-col items-center gap-2"
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white shadow-xl",
                score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-brand-primary" : "bg-amber-500"
              )}>
                {score}
              </div>
              <span className="text-sm font-bold text-slate-600">
                {score >= 90 ? "完美发音！" : "很棒，继续保持"}
              </span>
            </motion.div>
          )}
        </section>

        {/* Example Words - Reader Style */}
        <section className="app-card p-6 space-y-6 bg-white">
          <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            跟读例词
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {detail.examples.map((ex, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:border-brand-primary/30 transition-all">
                <div className="flex items-center gap-5">
                  <button className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Volume2 className="w-6 h-6" />
                  </button>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-slate-900">{ex.word}</span>
                      <span className="text-sm font-bold text-emerald-600">{ex.phonetic}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-1">{ex.translation}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pronunciation Techniques */}
        <section className="app-card p-6 space-y-6 bg-white">
          <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
            发音要领
          </h3>
          
          {/* Mouth/Tongue Position Diagram */}
          <div className="aspect-video rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative group">
            <img 
              src={`https://picsum.photos/seed/${detail.symbol}_mouth/800/450`} 
              alt="发音图解" 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 p-4"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-[10px] font-black text-slate-400 border border-slate-100">
              发音图解
            </div>
          </div>

          <div className="space-y-4">
            {detail.techniques.map((t, i) => (
              <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-black flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Actions - Reader Style */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 flex items-center gap-4 max-w-4xl mx-auto z-40">
        <button 
          onClick={() => {
            const currentIndex = ALL_IPA_SYMBOLS.indexOf(selectedPhonetic || 'i:');
            const prevIndex = (currentIndex - 1 + ALL_IPA_SYMBOLS.length) % ALL_IPA_SYMBOLS.length;
            setSelectedPhonetic(ALL_IPA_SYMBOLS[prevIndex]);
            setScore(null);
          }}
          className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <button 
          onClick={handleRecord}
          className={cn(
            "flex-1 h-16 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95",
            isRecording 
              ? "bg-rose-500 text-white animate-pulse shadow-rose-200" 
              : "bg-brand-primary text-white shadow-brand-primary/20"
          )}
        >
          <Mic className="w-6 h-6" />
          {isRecording ? '正在录音...' : '点击跟读'}
        </button>
        <button 
          onClick={() => {
            const currentIndex = ALL_IPA_SYMBOLS.indexOf(selectedPhonetic || 'i:');
            const nextIndex = (currentIndex + 1) % ALL_IPA_SYMBOLS.length;
            setSelectedPhonetic(ALL_IPA_SYMBOLS[nextIndex]);
            setScore(null);
          }}
          className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const WordBankView = () => {
  const { user } = useApp();
  const [filter, setFilter] = useState('all');

  const filteredWords = user.wordBank.filter(w => {
    if (filter === 'mastered') return w.proficiency >= 80;
    if (filter === 'learning') return w.proficiency < 80;
    return true;
  });

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto pb-32">
      {/* Header & Search */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-slate-900 font-display">我的生词本</h2>
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
            <Search className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: '全部' },
            { id: 'learning', label: '需复习' },
            { id: 'mastered', label: '已掌握' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "flex-1 py-2 text-xs font-black rounded-lg transition-all",
                filter === tab.id ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Word List */}
      <section className="space-y-3">
        {filteredWords.map((word, i) => (
          <div key={i} className="app-card p-4 flex items-center justify-between group hover:border-brand-primary/30 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 font-display">{word.text}</h3>
                <button className="text-slate-300 hover:text-brand-primary transition-colors">
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-400">{word.phonetic}</p>
              <p className="text-sm font-medium text-slate-600">{word.translation}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={cn(
                "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                word.proficiency >= 80 ? "bg-emerald-50 text-emerald-500" : "bg-orange-50 text-orange-500"
              )}>
                {word.proficiency >= 80 ? '已掌握' : '复习中'}
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((star) => (
                  <Star key={star} className={cn("w-3 h-3", star <= (word.proficiency / 33) ? "fill-amber-400 text-amber-400" : "text-slate-100")} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30">
        <button className="bg-brand-primary text-white px-8 py-4 rounded-full font-black shadow-xl shadow-brand-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
          <PlayCircle className="w-5 h-5" />
          立即复习
        </button>
      </div>
    </div>
  );
};

const ParentCenter = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400"
        >
          <ChevronRight className="w-5 h-5 rotate-90" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-3xl">
            🛡️
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">家长中心</h2>
            <p className="text-slate-500">管理孩子的学习进度与时长</p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              时长管控
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[30, 60, 90].map((m) => (
                <button key={m} className="py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all">
                  {m} 分钟
                </button>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              强力学习模式
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 pr-8">开启后，必须完成今日阅读任务才能进入游戏模块。</p>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </section>

          <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all">
            生成本周学习报告
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReaderView = () => {
  const { user } = useApp();
  const currentBook = user.books.find(b => b.id === user.currentBookId) || user.books[0];
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Simulate scoring
      setScore(Math.floor(Math.random() * 40) + 60);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 pb-48 space-y-8">
        {/* Video Area */}
        <div className="flex justify-center">
          <div className="w-full max-w-md aspect-video bg-slate-200 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50 border border-white relative group">
            <video 
              className="w-full h-full object-cover pointer-events-none"
              autoPlay 
              muted 
              loop 
              playsInline
              src="https://assets.mixkit.co/videos/preview/mixkit-mother-reading-a-story-to-her-little-daughter-39744-large.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100 relative group">
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-wrap justify-center items-end gap-x-6 gap-y-10">
              {[
                { word: 'Once', ipa: '/wʌns/' },
                { word: 'upon', ipa: '/əˈpɒn/' },
                { word: 'a', ipa: '/ə/' },
                { word: 'time...', ipa: '/taɪm/' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-emerald-600 mb-1 leading-none tracking-wide">
                    {item.ipa}
                  </span>
                  <h3 className="text-4xl font-black text-slate-900 leading-none tracking-tight">
                    {item.word}
                  </h3>
                </div>
              ))}
            </div>
            
            <p className="text-slate-400 text-base font-medium">很久很久以前...</p>
          </div>

          {/* Card Play Button */}
          <button className="absolute bottom-6 right-6 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all shadow-sm border border-slate-100 active:scale-95">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {score !== null && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg",
              score >= 90 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500"
            )}>
              {score}
            </div>
            <span className="font-bold text-slate-600">
              {score >= 90 ? "太棒了！" : score >= 60 ? "还不错，再接再厉" : "加油，再试一次"}
            </span>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Actions for Reader - Positioned above TabBar */}
      <div className="fixed bottom-[64px] left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-center gap-6 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
        <button 
          onClick={handleRecord}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90",
            isRecording ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
          )}
        >
          <Mic className="w-7 h-7" />
        </button>
        <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const LibraryView = () => {
  const { user, setUser, setActiveTab } = useApp();

  const handleSelectBook = (bookId: number) => {
    setUser(prev => ({ ...prev, currentBookId: bookId }));
    setActiveTab('home');
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-2xl font-black text-slate-900">书籍图书馆</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {user.books.map((book) => (
          <motion.button
            key={book.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleSelectBook(book.id)}
            className={cn(
              "bg-white rounded-[32px] p-6 border-b-4 text-left flex flex-col gap-4 group transition-all",
              user.currentBookId === book.id ? "border-brand-primary ring-2 ring-brand-primary/10" : "border-slate-100"
            )}
          >
            <div className={cn("aspect-[3/4] rounded-2xl flex items-center justify-center text-6xl shadow-inner", book.color)}>
              {book.cover}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{book.title}</h3>
              <p className="text-xs text-slate-400">{book.author}</p>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>进度</span>
                <span>{book.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary" style={{ width: `${book.progress}%` }} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const GameView = () => {
  const { user } = useApp();
  const isEnabled = user.parentalControl.battleModeEnabled;

  return (
    <div className="p-4 space-y-8 max-w-4xl mx-auto pb-28 flex flex-col items-center justify-center min-h-[60vh]">
      <div className={cn(
        "w-20 h-20 rounded-3xl flex items-center justify-center mb-4 transition-colors",
        isEnabled ? "bg-brand-primary/10 text-brand-primary" : "bg-slate-100 text-slate-300"
      )}>
        {isEnabled ? <Sword className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
      </div>
      <h2 className="text-2xl font-black text-slate-900 font-display">
        {isEnabled ? '对战模式' : '对战已禁用'}
      </h2>
      <p className="text-slate-400 font-bold text-center max-w-xs">
        {isEnabled 
          ? '对战功能正在紧急开发中，敬请期待！' 
          : '该功能已被家长监督模式禁用。如需开启，请前往“我的”页面进行设置。'}
      </p>
      {isEnabled && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-black text-slate-500">今日剩余时长: {user.parentalControl.battleDurationLimit} 分钟</span>
        </div>
      )}
    </div>
  );
};

const ProfileView = () => {
  const { user, setUser, setActiveTab } = useApp();
  const [showParentalModal, setShowParentalModal] = useState(false);
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  const updateParentalControl = (updates: Partial<UserState['parentalControl']>) => {
    setUser(prev => ({
      ...prev,
      parentalControl: {
        ...prev.parentalControl,
        ...updates
      }
    }));
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto pb-28">
      {/* Parental Control Modal */}
      <AnimatePresence>
        {showParentalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowParentalModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 font-display">家长监督设置</h3>
                  <button 
                    onClick={() => setShowParentalModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Battle Mode Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="space-y-1">
                      <p className="font-black text-slate-900 text-sm">对战模式</p>
                      <p className="text-[10px] font-bold text-slate-400">开启或关闭对战功能</p>
                    </div>
                    <button 
                      onClick={() => updateParentalControl({ battleModeEnabled: !user.parentalControl.battleModeEnabled })}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        user.parentalControl.battleModeEnabled ? "bg-brand-primary" : "bg-slate-200"
                      )}
                    >
                      <motion.div 
                        animate={{ x: user.parentalControl.battleModeEnabled ? 24 : 4 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>

                  {/* Duration Setting */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <p className="font-black text-slate-900 text-sm">对战时长限制</p>
                      <span className="text-sm font-black text-brand-primary font-display">{user.parentalControl.battleDurationLimit} 分钟</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <button 
                        onClick={() => updateParentalControl({ battleDurationLimit: Math.max(5, user.parentalControl.battleDurationLimit - 5) })}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 active:scale-90 transition-transform"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="flex-1 relative flex items-center">
                        <input 
                          type="range"
                          min="5"
                          max="120"
                          step="5"
                          value={user.parentalControl.battleDurationLimit}
                          onChange={(e) => updateParentalControl({ battleDurationLimit: parseInt(e.target.value) })}
                          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-primary"
                        />
                      </div>
                      <button 
                        onClick={() => updateParentalControl({ battleDurationLimit: Math.min(120, user.parentalControl.battleDurationLimit + 5) })}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 active:scale-90 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 text-center italic">设置每日对战模式的最大使用时长</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowParentalModal(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all"
                >
                  保存设置
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* User Info Header */}
      <section className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display flex items-center gap-2">
              {user.name}
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">BczID: 1885457166</span>
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">{user.grade}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
            <Settings className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Stats Card */}
      <section className="app-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-slate-400">累计已学</span>
            <span className="text-xl font-black text-slate-900 font-display">507</span>
            <span className="text-sm font-bold text-slate-400">，坚持</span>
            <span className="text-xl font-black text-slate-900 font-display">7</span>
            <span className="text-sm font-bold text-slate-400">天</span>
          </div>
        </div>
      </section>

      {/* Currency Card */}
      <section className="app-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
            <Coins className="w-5 h-5 fill-white" />
          </div>
          <span className="text-lg font-black text-slate-900 font-display">{user.coins} 积分</span>
        </div>
        <button className="text-xs font-bold text-slate-400 flex items-center gap-1">
          去兑换 <ChevronRight className="w-3 h-3" />
        </button>
      </section>

      {/* Skins Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-5 h-5 bg-purple-500 rounded-md flex items-center justify-center text-white">
            <Sparkles className="w-3 h-3" />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-display">我的皮肤</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
          {[
            { name: '角色皮肤Lite', color: 'bg-slate-100' },
            { name: '角色皮肤Max', color: 'bg-blue-100' },
            { name: '限定皮肤', color: 'bg-indigo-100' },
            { name: '超级角色皮肤', color: 'bg-emerald-100' },
          ].map((device, i) => (
            <div key={i} className="flex-shrink-0 w-32 space-y-2">
              <div className={cn("aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden", device.color)}>
                <div className="absolute top-1 right-1 bg-rose-500 text-[8px] font-black text-white px-1 py-0.5 rounded">NEW</div>
                <Sparkles className="w-12 h-12 text-slate-400/30" />
              </div>
              <p className="text-[11px] font-black text-slate-600 text-center">{device.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu List */}
      <section className="app-card divide-y divide-slate-50">
        {[
          { icon: ShieldCheck, label: '家长监督', onClick: () => setShowParentalModal(true) },
          { icon: BarChart3, label: '学习报告' },
          { icon: ClipboardCheck, label: '测试报告' },
          { icon: Library, label: '生词本', onClick: () => setActiveTab('wordbank') },
          { icon: Star, label: '我的收藏' },
          { icon: BookOpen, label: '我的图书' },
          { icon: Gamepad2, label: '积分商城', onClick: () => setActiveTab('wordbank') },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={item.onClick}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-5 h-5 text-brand-primary" />
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </section>
    </div>
  );
};

const Navigation = () => {
  const { activeTab, setActiveTab } = useApp();
  
  const tabs = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'reader', icon: PlayCircle, label: '学习' },
    { id: 'game', icon: Sword, label: '对战' },
    { id: 'profile', icon: User, label: '我的' },
  ];

  if (activeTab === 'phoneticDetail') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-white border-t border-slate-100 flex items-center justify-between px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={cn(
            "tab-item group",
            activeTab === tab.id ? "text-brand-primary" : "text-slate-400"
          )}
        >
          <div className="relative">
            <tab.icon className={cn(
              "w-6 h-6 transition-all duration-300",
              activeTab === tab.id ? "scale-110 stroke-[2.5px]" : "group-hover:scale-110"
            )} />
          </div>
          <span className={cn(
            "text-[10px] font-black mt-1 transition-all duration-300",
            activeTab === tab.id ? "opacity-100" : "opacity-60"
          )}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserState>({
    name: '探险家小明',
    level: 1,
    exp: 25,
    coins: 500,
    grade: '',
    studyTimeToday: 12,
    onboardingComplete: false,
    wordBank: INITIAL_WORDS,
    checkInDays: 1,
    gameTickets: 3,
    currentBookId: 1,
    hasCheckedInToday: false,
    books: [
      { id: 1, title: '小王子', author: '圣埃克苏佩里', cover: '👑', color: 'bg-amber-100', progress: 15 },
      { id: 2, title: '查理九世', author: '雷欧幻像', cover: '🔍', color: 'bg-blue-100', progress: 5 },
      { id: 3, title: '爱丽丝梦游仙境', author: '刘易斯·卡罗尔', cover: '🐇', color: 'bg-pink-100', progress: 0 },
      { id: 4, title: '鲁滨逊漂流记', author: '丹尼尔·笛福', cover: '🏝️', color: 'bg-emerald-100', progress: 0 },
      { id: 5, title: '格列佛游记', author: '乔纳森·斯威夫特', cover: '⛵', color: 'bg-indigo-100', progress: 0 },
    ],
    parentalControl: {
      battleModeEnabled: true,
      battleDurationLimit: 30,
    }
  });

  const [activeTab, setActiveTab] = useState('home');
  const [selectedPhonetic, setSelectedPhonetic] = useState<string | null>(null);

  const handleOnboardingComplete = (grade: string) => {
    setUser(prev => ({ ...prev, grade, onboardingComplete: true }));
  };

  if (!user.onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <AppContext.Provider value={{ user, setUser, activeTab, setActiveTab, selectedPhonetic, setSelectedPhonetic }}>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100">
        {activeTab === 'home' && <Header />}
        <main className={cn("pb-20", activeTab !== 'home' && "pt-0")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'home' && <HomeView />}
              {activeTab === 'phonetics' && <PhoneticsView />}
              {activeTab === 'reader' && <ReaderView />}
              {activeTab === 'game' && <GameView />}
              {activeTab === 'profile' && <ProfileView />}
              {activeTab === 'wordbank' && <WordBankView />}
              {activeTab === 'library' && <LibraryView />}
              {activeTab === 'phoneticDetail' && <PhoneticDetailView />}
            </motion.div>
          </AnimatePresence>
        </main>
        <Navigation />
      </div>
    </AppContext.Provider>
  );
}
