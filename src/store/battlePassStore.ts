import { useSyncExternalStore } from 'react';
import { userStorage } from '../utils/userStorage';

export interface BattlePassReward {
  id: string;
  level: number;
  type: 'skin' | 'emote' | 'currency' | 'trap' | 'weapon';
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  claimed: boolean;
  isPremium: boolean;
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly' | 'season';
  title: string;
  description: string;
  goal: number;
  progress: number;
  reward: {
    type: 'xp' | 'gold' | 'gems' | 'tokens';
    amount: number;
  };
  completed: boolean;
  expiresAt?: number;
}

export interface BattlePassData {
  season: number;
  seasonName: string;
  level: number;
  xp: number;
  xpToNext: number;
  isPremium: boolean;
  rewards: BattlePassReward[];
  quests: Quest[];
}

const SEASON_1_REWARDS: BattlePassReward[] = [
  // Niveau 1-10 (Gratuit)
  { id: 'bp-1', level: 1, type: 'currency', name: '100 Or', image: '💰', rarity: 'common', claimed: false, isPremium: false },
  { id: 'bp-2', level: 2, type: 'trap', name: 'Piège Basique', image: '⚙️', rarity: 'common', claimed: false, isPremium: false },
  { id: 'bp-3', level: 3, type: 'currency', name: '5 Gemmes', image: '💎', rarity: 'common', claimed: false, isPremium: false },
  { id: 'bp-4', level: 4, type: 'skin', name: 'Skin Débutant', image: '🎭', rarity: 'common', claimed: false, isPremium: false },
  { id: 'bp-5', level: 5, type: 'currency', name: '200 Or', image: '💰', rarity: 'common', claimed: false, isPremium: false },
  { id: 'bp-6', level: 6, type: 'weapon', name: 'Épée Simple', image: '🗡️', rarity: 'rare', claimed: false, isPremium: false },
  { id: 'bp-7', level: 7, type: 'currency', name: '10 Gemmes', image: '💎', rarity: 'rare', claimed: false, isPremium: false },
  { id: 'bp-8', level: 8, type: 'emote', name: 'Danse Victoire', image: '💃', rarity: 'rare', claimed: false, isPremium: false },
  { id: 'bp-9', level: 9, type: 'currency', name: '300 Or', image: '💰', rarity: 'common', claimed: false, isPremium: false },
  { id: 'bp-10', level: 10, type: 'skin', name: 'Skin Guerrier', image: '⚔️', rarity: 'rare', claimed: false, isPremium: false },
  
  // Niveau 11-20 (Premium)
  { id: 'bp-11', level: 11, type: 'currency', name: '500 Or', image: '💰', rarity: 'common', claimed: false, isPremium: true },
  { id: 'bp-12', level: 12, type: 'trap', name: 'Piège Toxique', image: '☠️', rarity: 'rare', claimed: false, isPremium: true },
  { id: 'bp-13', level: 13, type: 'currency', name: '20 Gemmes', image: '💎', rarity: 'rare', claimed: false, isPremium: true },
  { id: 'bp-14', level: 14, type: 'skin', name: 'Skin Ninja', image: '🥷', rarity: 'epic', claimed: false, isPremium: true },
  { id: 'bp-15', level: 15, type: 'currency', name: '2 Tokens', image: '🎟️', rarity: 'epic', claimed: false, isPremium: true },
  { id: 'bp-16', level: 16, type: 'weapon', name: 'Arc Mystique', image: '🏹', rarity: 'epic', claimed: false, isPremium: true },
  { id: 'bp-17', level: 17, type: 'currency', name: '30 Gemmes', image: '💎', rarity: 'epic', claimed: false, isPremium: true },
  { id: 'bp-18', level: 18, type: 'emote', name: 'Danse Épique', image: '🕺', rarity: 'epic', claimed: false, isPremium: true },
  { id: 'bp-19', level: 19, type: 'currency', name: '1000 Or', image: '💰', rarity: 'epic', claimed: false, isPremium: true },
  { id: 'bp-20', level: 20, type: 'skin', name: 'Skin Légendaire', image: '👑', rarity: 'legendary', claimed: false, isPremium: true },
  
  // Niveau 21-30 (Premium)
  { id: 'bp-21', level: 21, type: 'currency', name: '800 Or', image: '💰', rarity: 'rare', claimed: false, isPremium: true },
  { id: 'bp-22', level: 22, type: 'trap', name: 'Portail Dimensionnel', image: '🌀', rarity: 'epic', claimed: false, isPremium: true },
  { id: 'bp-23', level: 23, type: 'currency', name: '50 Gemmes', image: '💎', rarity: 'epic', claimed: false, isPremium: true },
  { id: 'bp-24', level: 24, type: 'skin', name: 'Skin Dragon', image: '🐉', rarity: 'legendary', claimed: false, isPremium: true },
  { id: 'bp-25', level: 25, type: 'currency', name: '5 Tokens', image: '🎟️', rarity: 'legendary', claimed: false, isPremium: true },
  { id: 'bp-26', level: 26, type: 'weapon', name: 'Bâton Arcanique', image: '🪄', rarity: 'legendary', claimed: false, isPremium: true },
  { id: 'bp-27', level: 27, type: 'currency', name: '100 Gemmes', image: '💎', rarity: 'legendary', claimed: false, isPremium: true },
  { id: 'bp-28', level: 28, type: 'emote', name: 'Danse Légendaire', image: '✨', rarity: 'legendary', claimed: false, isPremium: true },
  { id: 'bp-29', level: 29, type: 'currency', name: '2000 Or', image: '💰', rarity: 'legendary', claimed: false, isPremium: true },
  { id: 'bp-30', level: 30, type: 'skin', name: 'Skin Ultime', image: '🌟', rarity: 'legendary', claimed: false, isPremium: true },
];

const DAILY_QUESTS: Quest[] = [
  {
    id: 'daily-1',
    type: 'daily',
    title: 'Premier Swap',
    description: 'Survivre à 3 swaps',
    goal: 3,
    progress: 0,
    reward: { type: 'xp', amount: 50 },
    completed: false,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  },
  {
    id: 'daily-2',
    type: 'daily',
    title: 'Collecteur',
    description: 'Collecter 10 ressources',
    goal: 10,
    progress: 0,
    reward: { type: 'gold', amount: 100 },
    completed: false,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  },
  {
    id: 'daily-3',
    type: 'daily',
    title: 'Piégeur',
    description: 'Placer 5 pièges',
    goal: 5,
    progress: 0,
    reward: { type: 'xp', amount: 75 },
    completed: false,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  },
];

const WEEKLY_QUESTS: Quest[] = [
  {
    id: 'weekly-1',
    type: 'weekly',
    title: 'Guerrier',
    description: 'Éliminer 20 adversaires',
    goal: 20,
    progress: 0,
    reward: { type: 'gems', amount: 50 },
    completed: false,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'weekly-2',
    type: 'weekly',
    title: 'Survivant',
    description: 'Gagner 5 parties',
    goal: 5,
    progress: 0,
    reward: { type: 'tokens', amount: 3 },
    completed: false,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'weekly-3',
    type: 'weekly',
    title: 'Explorateur',
    description: 'Jouer sur 3 maps différentes',
    goal: 3,
    progress: 0,
    reward: { type: 'xp', amount: 200 },
    completed: false,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
];

const SEASON_QUESTS: Quest[] = [
  {
    id: 'season-1',
    type: 'season',
    title: 'Maître du Swap',
    description: 'Atteindre le niveau 20 du Battle Pass',
    goal: 20,
    progress: 0,
    reward: { type: 'tokens', amount: 10 },
    completed: false,
  },
  {
    id: 'season-2',
    type: 'season',
    title: 'Légende',
    description: 'Gagner 50 parties',
    goal: 50,
    progress: 0,
    reward: { type: 'gems', amount: 500 },
    completed: false,
  },
];

interface BattlePassState {
  battlePass: BattlePassData;
}

const initialBattlePassState: BattlePassState = {
  battlePass: {
    season: 1,
    seasonName: 'Saison des Ténèbres',
    level: 1,
    xp: 0,
    xpToNext: 100,
    isPremium: false,
    rewards: SEASON_1_REWARDS,
    quests: [...DAILY_QUESTS, ...WEEKLY_QUESTS, ...SEASON_QUESTS],
  },
};

type Listener = () => void;
let bpState: BattlePassState = { ...initialBattlePassState };
const listeners: Set<Listener> = new Set();

function setState(partial: Partial<BattlePassState> | ((s: BattlePassState) => Partial<BattlePassState>)) {
  const updates = typeof partial === 'function' ? partial(bpState) : partial;
  bpState = { ...bpState, ...updates };
  listeners.forEach(l => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBattlePass<T>(selector: (s: BattlePassState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(bpState), () => selector(bpState));
}

export const battlePassActions = {
  addXP(amount: number) {
    const bp = bpState.battlePass;
    let newXP = bp.xp + amount;
    let newLevel = bp.level;
    let xpToNext = bp.xpToNext;

    // Level up logic
    while (newXP >= xpToNext && newLevel < 30) {
      newXP -= xpToNext;
      newLevel++;
      xpToNext = Math.floor(xpToNext * 1.2); // 20% more XP needed each level
    }

    setState({
      battlePass: {
        ...bp,
        xp: newXP,
        level: newLevel,
        xpToNext,
      },
    });
  },

  claimReward(rewardId: string) {
    const bp = bpState.battlePass;
    const reward = bp.rewards.find(r => r.id === rewardId);
    
    if (!reward || reward.claimed || bp.level < reward.level) return;
    if (reward.isPremium && !bp.isPremium) return;

    // Give reward to player
    const user = userStorage.getCurrentUser();
    if (!user) return;

    if (reward.type === 'currency') {
      if (reward.name.includes('Or')) {
        const amount = parseInt(reward.name.match(/\d+/)?.[0] || '0');
        userStorage.updateCurrency(user.gold + amount);
      } else if (reward.name.includes('Gemmes')) {
        const amount = parseInt(reward.name.match(/\d+/)?.[0] || '0');
        userStorage.updateCurrency(undefined, user.gems + amount);
      } else if (reward.name.includes('Tokens')) {
        const amount = parseInt(reward.name.match(/\d+/)?.[0] || '0');
        userStorage.updateCurrency(undefined, undefined, user.tokens + amount);
      }
    }

    // Mark as claimed
    const newRewards = bp.rewards.map(r => 
      r.id === rewardId ? { ...r, claimed: true } : r
    );

    setState({
      battlePass: {
        ...bp,
        rewards: newRewards,
      },
    });
  },

  updateQuestProgress(questId: string, amount: number) {
    const bp = bpState.battlePass;
    const quest = bp.quests.find(q => q.id === questId);
    
    if (!quest || quest.completed) return;

    const newProgress = Math.min(quest.progress + amount, quest.goal);
    const completed = newProgress >= quest.goal;

    const newQuests = bp.quests.map(q => 
      q.id === questId ? { ...q, progress: newProgress, completed } : q
    );

    setState({
      battlePass: {
        ...bp,
        quests: newQuests,
      },
    });

    // Auto-claim reward if completed
    if (completed) {
      this.claimQuestReward(questId);
    }
  },

  claimQuestReward(questId: string) {
    const bp = bpState.battlePass;
    const quest = bp.quests.find(q => q.id === questId);
    
    if (!quest || !quest.completed) return;

    const user = userStorage.getCurrentUser();
    if (!user) return;

    // Give quest reward
    if (quest.reward.type === 'xp') {
      this.addXP(quest.reward.amount);
    } else if (quest.reward.type === 'gold') {
      userStorage.updateCurrency(user.gold + quest.reward.amount);
    } else if (quest.reward.type === 'gems') {
      userStorage.updateCurrency(undefined, user.gems + quest.reward.amount);
    } else if (quest.reward.type === 'tokens') {
      userStorage.updateCurrency(undefined, undefined, user.tokens + quest.reward.amount);
    }
  },

  purchasePremium() {
    const user = userStorage.getCurrentUser();
    if (!user || user.gems < 1000) return false;

    userStorage.updateCurrency(undefined, user.gems - 1000);

    setState({
      battlePass: {
        ...bpState.battlePass,
        isPremium: true,
      },
    });

    return true;
  },
};
