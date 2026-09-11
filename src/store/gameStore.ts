import { useState, useCallback, useSyncExternalStore } from 'react';

export interface Player {
  id: string;
  name: string;
  position: [number, number, number];
  health: number;
  maxHealth: number;
  gold: number;
  gems: number;
  tokens: number;
  inventory: InventoryItem[];
  skin: string;
  kills: number;
  deaths: number;
  isAlive: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'trap' | 'resource' | 'consumable';
  quantity: number;
  damage?: number;
  effect?: string;
}

export interface Trap {
  id: string;
  type: string;
  position: [number, number, number];
  damage: number;
  ownerId: string;
  isActive: boolean;
  triggered: boolean;
}

export interface Resource {
  id: string;
  type: 'gold' | 'wood' | 'stone' | 'gem';
  position: [number, number, number];
  amount: number;
  collected: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'gold' | 'gems' | 'tokens';
  category: 'skin' | 'trap' | 'weapon' | 'consumable' | 'background';
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned: boolean;
}

interface GameState {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string; avatar: string; provider: string } | null;
  isAdmin: boolean;
  currentPage: 'login' | 'menu' | 'game' | 'shop' | 'admin' | 'profile';
  players: Player[];
  localPlayer: Player | null;
  traps: Trap[];
  resources: Resource[];
  swapTimer: number;
  gameStatus: 'lobby' | 'playing' | 'swapping' | 'ended';
  roundNumber: number;
  killFeed: { killer: string; victim: string; method: string; time: number }[];
  shopItems: ShopItem[];
}

const generateShopItems = (): ShopItem[] => [
  { id: 'skin-fire', name: 'Flammes Infernales', description: 'Un skin enflammé qui brûle vos ennemis du regard', price: 500, currency: 'gold', category: 'skin', image: '🔥', rarity: 'rare', owned: false },
  { id: 'skin-ice', name: 'Givre Éternel', description: 'Un skin glacé qui gèle tout sur son passage', price: 500, currency: 'gold', category: 'skin', image: '❄️', rarity: 'rare', owned: false },
  { id: 'skin-shadow', name: 'Ombre Nocturne', description: 'Devenez invisible dans les ténèbres', price: 1200, currency: 'gold', category: 'skin', image: '🌑', rarity: 'epic', owned: false },
  { id: 'skin-galaxy', name: 'Nébuleuse Cosmique', description: 'Portez les étoiles sur vous', price: 2500, currency: 'gems', category: 'skin', image: '🌌', rarity: 'legendary', owned: false },
  { id: 'skin-phoenix', name: 'Phénix Reborn', description: 'Renaître de vos cendres avec style', price: 3000, currency: 'gems', category: 'skin', image: '🦅', rarity: 'legendary', owned: false },
  { id: 'skin-dragon', name: 'Écailles de Dragon', description: 'La puissance ancestrale des dragons', price: 4000, currency: 'gems', category: 'skin', image: '🐉', rarity: 'legendary', owned: false },
  { id: 'trap-spike', name: 'Piège à Pointes', description: 'Inflige 30 dégâts aux ennemis', price: 100, currency: 'gold', category: 'trap', image: '⚔️', rarity: 'common', owned: false },
  { id: 'trap-poison', name: 'Nuage Toxique', description: 'Empoisonne les ennemis pendant 5s', price: 250, currency: 'gold', category: 'trap', image: '☠️', rarity: 'rare', owned: false },
  { id: 'trap-teleport', name: 'Portail Dimensionnel', description: 'Téléporte vos ennemis dans un piège', price: 800, currency: 'gold', category: 'trap', image: '🌀', rarity: 'epic', owned: false },
  { id: 'trap-blackhole', name: 'Singularité', description: 'Aspire tout ce qui est proche', price: 1500, currency: 'gems', category: 'trap', image: '🕳️', rarity: 'legendary', owned: false },
  { id: 'trap-lava', name: 'Fontaine de Lave', description: 'Brûle tout sur son passage', price: 600, currency: 'gold', category: 'trap', image: '🌋', rarity: 'epic', owned: false },
  { id: 'weapon-sword', name: 'Épée du Chaos', description: '+15 dégâts au corps à corps', price: 300, currency: 'gold', category: 'weapon', image: '🗡️', rarity: 'common', owned: false },
  { id: 'weapon-bow', name: 'Arc du Vent', description: 'Tir à distance rapide', price: 450, currency: 'gold', category: 'weapon', image: '🏹', rarity: 'rare', owned: false },
  { id: 'weapon-staff', name: 'Bâton Arcanique', description: 'Sorts dévastateurs', price: 1000, currency: 'gems', category: 'weapon', image: '🪄', rarity: 'epic', owned: false },
  { id: 'weapon-hammer', name: 'Marteau du Tonnerre', description: 'Écrasez vos ennemis', price: 2000, currency: 'gems', category: 'weapon', image: '🔨', rarity: 'legendary', owned: false },
  { id: 'bg-volcano', name: 'Fond Volcan', description: 'Un fond volcanique épique', price: 200, currency: 'gold', category: 'background', image: '🌋', rarity: 'common', owned: false },
  { id: 'bg-ocean', name: 'Fond Abyssal', description: 'Les profondeurs de l\'océan', price: 400, currency: 'gold', category: 'background', image: '🌊', rarity: 'rare', owned: false },
  { id: 'bg-space', name: 'Fond Spatial', description: 'L\'espace infini', price: 800, currency: 'gems', category: 'background', image: '🚀', rarity: 'epic', owned: false },
  { id: 'bg-neon', name: 'Fond Néon', description: 'Cyberpunk vibes', price: 1200, currency: 'gems', category: 'background', image: '💜', rarity: 'legendary', owned: false },
];

const generateBotPlayers = (): Player[] => {
  const names = ['ShadowHunter', 'NightBlade', 'PhoenixRise', 'StormBreaker', 'DarkMage', 'IceQueen', 'FireLord', 'ThunderGod'];
  const skins = ['🔥', '❄️', '🌑', '⚡', '💀', '🦊', '🐉', '👑'];
  return names.map((name, i) => ({
    id: `bot-${i}`,
    name,
    position: [Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20] as [number, number, number],
    health: 100,
    maxHealth: 100,
    gold: Math.floor(Math.random() * 500),
    gems: Math.floor(Math.random() * 50),
    tokens: 0,
    inventory: [],
    skin: skins[i],
    kills: 0,
    deaths: 0,
    isAlive: true,
  }));
};

const generateResources = (): Resource[] => {
  const resources: Resource[] = [];
  const types: Resource['type'][] = ['gold', 'wood', 'stone', 'gem'];
  for (let i = 0; i < 30; i++) {
    resources.push({
      id: `res-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      position: [Math.random() * 50 - 25, 0.3, Math.random() * 50 - 25],
      amount: Math.floor(Math.random() * 50) + 10,
      collected: false,
    });
  }
  return resources;
};

const initialState: GameState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  currentPage: 'login',
  players: [],
  localPlayer: null,
  traps: [],
  resources: [],
  swapTimer: 90,
  gameStatus: 'lobby',
  roundNumber: 1,
  killFeed: [],
  shopItems: generateShopItems(),
};

type Listener = () => void;
let state: GameState = { ...initialState };
const listeners: Set<Listener> = new Set();

function setState(partial: Partial<GameState> | ((s: GameState) => Partial<GameState>)) {
  const updates = typeof partial === 'function' ? partial(state) : partial;
  state = { ...state, ...updates };
  listeners.forEach(l => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getState() {
  return state;
}

// Hook
export function useGameStore<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

// Actions
export const actions = {
  login(provider: string, userData: { name?: string; email?: string; avatar?: string }) {
    setState({
      isAuthenticated: true,
      user: {
        id: `user-${Date.now()}`,
        name: userData.name || 'Joueur',
        email: userData.email || '',
        avatar: userData.avatar || '🎮',
        provider,
      },
      isAdmin: userData.email === 'admin@swapordie.com',
      currentPage: 'menu',
    });
  },

  logout() {
    setState({
      isAuthenticated: false,
      user: null,
      currentPage: 'login',
      gameStatus: 'lobby',
    });
  },

  setPage(page: GameState['currentPage']) {
    setState({ currentPage: page });
  },

  startGame() {
    const bots = generateBotPlayers();
    const localPlayer: Player = {
      id: 'local',
      name: state.user?.name || 'Joueur',
      position: [0, 0.5, 0],
      health: 100,
      maxHealth: 100,
      gold: 200,
      gems: 10,
      tokens: 5,
      inventory: [
        { id: 'sword-1', name: 'Épée Basique', type: 'weapon', quantity: 1, damage: 10 },
        { id: 'trap-basic', name: 'Piège Simple', type: 'trap', quantity: 3, damage: 20 },
      ],
      skin: '⚡',
      kills: 0,
      deaths: 0,
      isAlive: true,
    };
    setState({
      players: [localPlayer, ...bots],
      localPlayer,
      resources: generateResources(),
      traps: [],
      swapTimer: 90,
      gameStatus: 'playing',
      roundNumber: 1,
      killFeed: [],
      currentPage: 'game',
    });
  },

  endGame() {
    setState({ gameStatus: 'ended', currentPage: 'menu' });
  },

  triggerSwap() {
    const alivePlayers = state.players.filter(p => p.isAlive);
    if (alivePlayers.length < 2) return;

    setState({ gameStatus: 'swapping' });

    const positions = alivePlayers.map(p => p.position);
    const shuffled = [...positions].sort(() => Math.random() - 0.5);

    const newPlayers = state.players.map(p => {
      if (!p.isAlive) return p;
      const idx = alivePlayers.findIndex(ap => ap.id === p.id);
      return { ...p, position: shuffled[idx] };
    });

    setTimeout(() => {
      setState({
        players: newPlayers,
        localPlayer: newPlayers.find(p => p.id === 'local') || null,
        swapTimer: 90,
        gameStatus: 'playing',
        roundNumber: state.roundNumber + 1,
      });
    }, 2500);
  },

  updateSwapTimer(delta: number) {
    if (state.gameStatus !== 'playing') return;
    const newTimer = state.swapTimer - delta;
    if (newTimer <= 0) {
      actions.triggerSwap();
    } else {
      setState({ swapTimer: newTimer });
    }
  },

  movePlayer(position: [number, number, number]) {
    const newLocal = state.localPlayer ? { ...state.localPlayer, position } : null;
    const newPlayers = state.players.map(p => p.id === 'local' ? { ...p, position } : p);
    setState({ localPlayer: newLocal, players: newPlayers });
  },

  moveBot(botId: string, position: [number, number, number]) {
    const newPlayers = state.players.map(p => p.id === botId ? { ...p, position } : p);
    setState({ players: newPlayers });
  },

  collectResource(resourceId: string) {
    const resource = state.resources.find(r => r.id === resourceId);
    if (!resource || resource.collected || !state.localPlayer) return;

    const newResources = state.resources.map(r => r.id === resourceId ? { ...r, collected: true } : r);
    const newLocal = { ...state.localPlayer };

    if (resource.type === 'gold') newLocal.gold += resource.amount;
    else if (resource.type === 'gem') newLocal.gems += Math.floor(resource.amount / 10);
    else if (resource.type === 'wood') newLocal.gold += Math.floor(resource.amount / 2);
    else if (resource.type === 'stone') newLocal.gold += Math.floor(resource.amount / 3);

    const newPlayers = state.players.map(p => p.id === 'local' ? newLocal : p);
    setState({ resources: newResources, localPlayer: newLocal, players: newPlayers });
  },

  placeTrap(trapData: Omit<Trap, 'id' | 'isActive' | 'triggered'>) {
    const newTrap: Trap = { ...trapData, id: `trap-${Date.now()}`, isActive: true, triggered: false };
    setState({ traps: [...state.traps, newTrap] });
  },

  damagePlayer(playerId: string, damage: number, method: string) {
    const newPlayers = state.players.map(p => {
      if (p.id !== playerId) return p;
      const newHealth = Math.max(0, p.health - damage);
      return { ...p, health: newHealth, isAlive: newHealth > 0, deaths: newHealth <= 0 ? p.deaths + 1 : p.deaths };
    });

    const killedPlayer = newPlayers.find(p => p.id === playerId);
    if (killedPlayer && killedPlayer.health === 0) {
      const killer = state.localPlayer?.id === playerId ? 'Trap' : (state.localPlayer?.name || 'Trap');
      setState({
        killFeed: [{ killer, victim: killedPlayer.name, method, time: Date.now() }, ...state.killFeed].slice(0, 10),
      });
    }

    setState({
      players: newPlayers,
      localPlayer: newPlayers.find(p => p.id === 'local') || null,
    });
  },

  buyItem(itemId: string) {
    const item = state.shopItems.find(i => i.id === itemId);
    if (!item || item.owned || !state.localPlayer) return;

    const player = state.localPlayer;
    let canBuy = false;
    const newPlayer = { ...player };

    if (item.currency === 'gold' && player.gold >= item.price) {
      newPlayer.gold -= item.price;
      canBuy = true;
    } else if (item.currency === 'gems' && player.gems >= item.price) {
      newPlayer.gems -= item.price;
      canBuy = true;
    } else if (item.currency === 'tokens' && player.tokens >= item.price) {
      newPlayer.tokens -= item.price;
      canBuy = true;
    }

    if (!canBuy) return;

    const newItems = state.shopItems.map(i => i.id === itemId ? { ...i, owned: true } : i);
    const newPlayers = state.players.map(p => p.id === 'local' ? newPlayer : p);
    setState({ shopItems: newItems, localPlayer: newPlayer, players: newPlayers });
  },

  addKillFeed(killer: string, victim: string, method: string) {
    setState({
      killFeed: [{ killer, victim, method, time: Date.now() }, ...state.killFeed].slice(0, 10),
    });
  },

  // Admin actions
  banPlayer(playerId: string) {
    setState({
      players: state.players.map(p => p.id === playerId ? { ...p, isAlive: false } : p),
    });
  },

  resetGame() {
    setState({ ...initialState, isAuthenticated: true, user: state.user, isAdmin: state.isAdmin, currentPage: 'menu' });
  },
};
