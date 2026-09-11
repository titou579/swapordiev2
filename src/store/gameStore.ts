import { useSyncExternalStore } from 'react';
import { MAPS, getMapById } from '../data/maps';
import { userStorage, UserAccount } from '../utils/userStorage';
import { battlePassActions } from './battlePassStore';

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
  isBot: boolean;
  outfitColor?: string;
  hairColor?: string;
  skinColor?: string;
}

export interface LobbyPlayer {
  id: string;
  name: string;
  avatar: string;
  isBot: boolean;
  isReady: boolean;
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
  user: UserAccount | null;
  isAdmin: boolean;
  currentPage: 'login' | 'menu' | 'mapSelect' | 'lobby' | 'game' | 'shop' | 'admin' | 'profile' | 'battlepass';
  
  // Map & Mode
  selectedMap: string | null;
  gameMode: 'public' | 'private' | null;
  roomCode: string | null;
  
  // Lobby
  lobbyPlayers: LobbyPlayer[];
  lobbyCountdown: number;
  lobbyStatus: 'waiting' | 'countdown';
  
  // Game
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

const BOT_NAMES = ['ShadowHunter', 'NightBlade', 'PhoenixRise', 'StormBreaker', 'DarkMage', 'IceQueen', 'FireLord', 'ThunderGod', 'VoidWalker', 'StarDust'];
const BOT_AVATARS = ['🔥', '❄️', '🌑', '⚡', '💀', '🦊', '🐉', '👑', '🌟', '🎭'];
const BOT_OUTFITS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#c0392b', '#16a085'];
const BOT_HAIRS = ['#3d2314', '#1a1a1a', '#d4a574', '#8b0000', '#ffd700', '#ff69b4', '#4169e1', '#2f4f4f'];
const BOT_SKINS = ['#ffdbac', '#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac'];

const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

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

const generateResources = (mapId: string): Resource[] => {
  const map = getMapById(mapId);
  if (!map) return [];
  
  const resources: Resource[] = [];
  let id = 0;
  
  map.resources.forEach(resConfig => {
    for (let i = 0; i < resConfig.count; i++) {
      resources.push({
        id: `res-${id++}`,
        type: resConfig.type as Resource['type'],
        position: [Math.random() * 50 - 25, 0.3, Math.random() * 50 - 25],
        amount: Math.floor(Math.random() * 50) + 10,
        collected: false,
      });
    }
  });
  
  return resources;
};

const initialState: GameState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  currentPage: 'login',
  selectedMap: null,
  gameMode: null,
  roomCode: null,
  lobbyPlayers: [],
  lobbyCountdown: 10,
  lobbyStatus: 'waiting',
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

export function useGameStore<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export const actions = {
  // Initialize user from localStorage
  initUser() {
    const user = userStorage.getCurrentUser();
    if (user) {
      setState({
        isAuthenticated: true,
        user,
        isAdmin: user.email === 'admin@swapordie.com',
        currentPage: 'menu',
      });
    }
  },

  // Register new account
  register(email: string, password: string, username: string) {
    try {
      const user = userStorage.createUser(email, password, username);
      setState({
        isAuthenticated: true,
        user,
        isAdmin: user.email === 'admin@swapordie.com',
        currentPage: 'menu',
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Login with email/password
  loginWithEmail(email: string, password: string) {
    const user = userStorage.login(email, password);
    if (user) {
      setState({
        isAuthenticated: true,
        user,
        isAdmin: user.email === 'admin@swapordie.com',
        currentPage: 'menu',
      });
      return { success: true };
    }
    return { success: false, error: 'Email ou mot de passe incorrect' };
  },

  // Login with OAuth (simulated)
  loginWithOAuth(provider: 'google' | 'apple' | 'discord') {
    const emails: Record<string, string> = {
      google: 'user@gmail.com',
      apple: 'user@icloud.com',
      discord: 'user@discord.com',
    };
    const usernames: Record<string, string> = {
      google: 'GooglePlayer',
      apple: 'ApplePlayer',
      discord: 'DiscordGamer',
    };
    
    const user = userStorage.loginWithOAuth(provider, emails[provider], usernames[provider]);
    setState({
      isAuthenticated: true,
      user,
      isAdmin: user.email === 'admin@swapordie.com',
      currentPage: 'menu',
    });
  },

  logout() {
    userStorage.logout();
    setState({
      isAuthenticated: false,
      user: null,
      currentPage: 'login',
      gameStatus: 'lobby',
    });
  },

  // Update username
  updateUsername(newUsername: string) {
    userStorage.updateUsername(newUsername);
    const user = userStorage.getCurrentUser();
    if (user) {
      setState({ user });
    }
  },

  // Update avatar
  updateAvatar(newAvatar: string) {
    userStorage.updateAvatar(newAvatar);
    const user = userStorage.getCurrentUser();
    if (user) {
      setState({ user });
    }
  },

  setPage(page: GameState['currentPage']) {
    setState({ currentPage: page });
  },

  setSelectedMap(mapId: string) {
    setState({ selectedMap: mapId });
  },

  setGameMode(mode: 'public' | 'private') {
    setState({ gameMode: mode });
  },

  setRoomCode(code: string) {
    setState({ roomCode: code });
  },

  setLobbyStatus(status: 'waiting' | 'countdown') {
    setState({ lobbyStatus: status });
  },

  setLobbyCountdown(value: number) {
    setState({ lobbyCountdown: value });
  },

  updateLobbyCountdown(delta: number) {
    setState({ lobbyCountdown: Math.max(0, state.lobbyCountdown + delta) });
  },

  addLobbyPlayer() {
    const usedNames = state.lobbyPlayers.map(p => p.name);
    const availableNames = BOT_NAMES.filter(n => !usedNames.includes(n));
    if (availableNames.length === 0) return;
    
    const idx = state.lobbyPlayers.length;
    const newPlayer: LobbyPlayer = {
      id: `lobby-${Date.now()}-${idx}`,
      name: availableNames[Math.floor(Math.random() * availableNames.length)],
      avatar: BOT_AVATARS[idx % BOT_AVATARS.length],
      isBot: true,
      isReady: true,
    };
    setState({ lobbyPlayers: [...state.lobbyPlayers, newPlayer] });
  },

  startLobby(mode: 'public' | 'private') {
    const localPlayer: LobbyPlayer = {
      id: 'local',
      name: state.user?.username || 'Joueur',
      avatar: state.user?.avatar || '🎮',
      isBot: false,
      isReady: true,
    };
    
    // Add initial bots (3-5) to simulate other players
    const botCount = mode === 'private' ? 2 : Math.floor(Math.random() * 3) + 3;
    const bots: LobbyPlayer[] = [];
    for (let i = 0; i < botCount; i++) {
      bots.push({
        id: `lobby-bot-${i}`,
        name: BOT_NAMES[i % BOT_NAMES.length],
        avatar: BOT_AVATARS[i % BOT_AVATARS.length],
        isBot: true,
        isReady: true,
      });
    }
    
    setState({
      lobbyPlayers: [localPlayer, ...bots],
      lobbyCountdown: 10,
      lobbyStatus: 'waiting',
      gameMode: mode,
      roomCode: mode === 'private' ? generateRoomCode() : null,
      currentPage: 'lobby',
    });
  },

  startGameFromLobby() {
    const mapId = state.selectedMap || 'neon-city';
    const map = getMapById(mapId);
    if (!map) return;
    
    // Create game players from lobby
    const gamePlayers: Player[] = state.lobbyPlayers.map((lp, i) => ({
      id: lp.id,
      name: lp.name,
      position: [
        Math.cos(i * (Math.PI * 2 / state.lobbyPlayers.length)) * 15,
        0.5,
        Math.sin(i * (Math.PI * 2 / state.lobbyPlayers.length)) * 15
      ] as [number, number, number],
      health: 100,
      maxHealth: 100,
      gold: lp.id === 'local' ? 200 : Math.floor(Math.random() * 300),
      gems: lp.id === 'local' ? 10 : Math.floor(Math.random() * 30),
      tokens: lp.id === 'local' ? 5 : 0,
      inventory: lp.id === 'local' ? [
        { id: 'sword-1', name: 'Épée Basique', type: 'weapon', quantity: 1, damage: 10 },
        { id: 'trap-basic', name: 'Piège Simple', type: 'trap', quantity: 3, damage: 20 },
      ] : [],
      skin: lp.avatar,
      kills: 0,
      deaths: 0,
      isAlive: true,
      isBot: lp.isBot,
      outfitColor: lp.id === 'local' ? '#00cc66' : BOT_OUTFITS[i % BOT_OUTFITS.length],
      hairColor: BOT_HAIRS[i % BOT_HAIRS.length],
      skinColor: BOT_SKINS[i % BOT_SKINS.length],
    }));
    
    // Fill remaining slots with bots if needed (for public mode)
    if (state.gameMode === 'public' && gamePlayers.length < 9) {
      const needed = 9 - gamePlayers.length;
      for (let i = 0; i < needed; i++) {
        const idx = gamePlayers.length;
        gamePlayers.push({
          id: `bot-${idx}`,
          name: BOT_NAMES[idx % BOT_NAMES.length] + (idx > 9 ? `_${idx}` : ''),
          position: [
            Math.cos(idx * (Math.PI * 2 / 9)) * 15,
            0.5,
            Math.sin(idx * (Math.PI * 2 / 9)) * 15
          ] as [number, number, number],
          health: 100,
          maxHealth: 100,
          gold: Math.floor(Math.random() * 300),
          gems: Math.floor(Math.random() * 30),
          tokens: 0,
          inventory: [],
          skin: BOT_AVATARS[idx % BOT_AVATARS.length],
          kills: 0,
          deaths: 0,
          isAlive: true,
          isBot: true,
          outfitColor: BOT_OUTFITS[idx % BOT_OUTFITS.length],
          hairColor: BOT_HAIRS[idx % BOT_HAIRS.length],
          skinColor: BOT_SKINS[idx % BOT_SKINS.length],
        });
      }
    }
    
    const localPlayer = gamePlayers.find(p => p.id === 'local') || gamePlayers[0];
    
    setState({
      players: gamePlayers,
      localPlayer,
      resources: generateResources(mapId),
      traps: [],
      swapTimer: 90,
      gameStatus: 'playing',
      roundNumber: 1,
      killFeed: [],
      currentPage: 'game',
    });
  },

  endGame() {
    // Award XP based on performance
    const localPlayer = state.localPlayer;
    if (localPlayer) {
      // Base XP for playing
      battlePassActions.addXP(25);
      
      // Bonus XP for kills
      if (localPlayer.kills > 0) {
        battlePassActions.addXP(localPlayer.kills * 10);
      }
      
      // Bonus XP for winning
      if (localPlayer.isAlive) {
        battlePassActions.addXP(100);
        battlePassActions.updateQuestProgress('weekly-2', 1); // Survivant
      }
    }

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

    // Update battle pass quest progress for swaps
    battlePassActions.updateQuestProgress('daily-1', 1); // Premier Swap

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

    // Update battle pass quest progress
    battlePassActions.updateQuestProgress('daily-2', 1); // Collecteur
  },

  placeTrap(trapData: Omit<Trap, 'id' | 'isActive' | 'triggered'>) {
    const newTrap: Trap = { ...trapData, id: `trap-${Date.now()}`, isActive: true, triggered: false };
    setState({ traps: [...state.traps, newTrap] });

    // Update battle pass quest progress
    battlePassActions.updateQuestProgress('daily-3', 1); // Piégeur
  },

  damagePlayer(playerId: string, damage: number, method: string) {
    const newPlayers = state.players.map(p => {
      if (p.id !== playerId) return p;
      const newHealth = Math.max(0, p.health - damage);
      return { ...p, health: newHealth, isAlive: newHealth > 0, deaths: newHealth <= 0 ? p.deaths + 1 : p.deaths };
    });

    const killedPlayer = newPlayers.find(p => p.id === playerId);
    if (killedPlayer && killedPlayer.health === 0) {
      const killer = state.localPlayer?.name || 'Trap';
      setState({
        killFeed: [{ killer, victim: killedPlayer.name, method, time: Date.now() }, ...state.killFeed].slice(0, 10),
      });

      // Update battle pass quest progress for kills
      battlePassActions.updateQuestProgress('weekly-1', 1); // Guerrier
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
