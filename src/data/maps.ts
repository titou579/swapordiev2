export interface MapData {
  id: string;
  name: string;
  description: string;
  emoji: string;
  theme: {
    groundColor: string;
    skyColor: string;
    fogColor: string;
    ambientLight: number;
    fogNear: number;
    fogFar: number;
  };
  structures: MapStructure[];
  resources: { type: string; count: number }[];
  difficulty: 'facile' | 'moyen' | 'difficile';
  players: string;
}

export interface MapStructure {
  type: 'building' | 'tower' | 'wall' | 'ramp' | 'platform' | 'tree' | 'rock' | 'crystal' | 'crate';
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}

export const MAPS: MapData[] = [
  {
    id: 'neon-city',
    name: 'Neo Tokyo',
    description: 'Une ville cyberpunk néon avec des gratte-ciels et des ruelles sombres',
    emoji: '🌃',
    theme: {
      groundColor: '#0a0a1a',
      skyColor: '#1a0033',
      fogColor: '#0a0020',
      ambientLight: 0.2,
      fogNear: 15,
      fogFar: 55,
    },
    structures: [
      // Gratte-ciels principaux - beaucoup plus détaillés
      { type: 'building', position: [12, 4, 12], size: [3, 8, 3], color: '#1a1a3a' },
      { type: 'building', position: [-12, 6, -10], size: [4, 12, 4], color: '#0f0f2a' },
      { type: 'building', position: [15, 3, -15], size: [3, 6, 5], color: '#1a0a2a' },
      { type: 'building', position: [-18, 5, 15], size: [5, 10, 3], color: '#0a0a2a' },
      { type: 'building', position: [0, 7, -20], size: [6, 14, 4], color: '#150a30' },
      { type: 'building', position: [-20, 4, -5], size: [3, 8, 3], color: '#1a1a3a' },
      { type: 'building', position: [18, 5, 8], size: [4, 10, 3], color: '#0f0f2a' },
      
      // Gratte-ciels secondaires
      { type: 'building', position: [8, 3, -18], size: [2.5, 6, 2.5], color: '#1a1a3a' },
      { type: 'building', position: [-8, 4, 18], size: [3, 8, 3], color: '#0f0f2a' },
      { type: 'building', position: [22, 3, -8], size: [2, 6, 3], color: '#1a0a2a' },
      { type: 'building', position: [-22, 3, 8], size: [2.5, 6, 2.5], color: '#0a0a2a' },
      
      // Petits bâtiments et kiosques
      { type: 'building', position: [5, 1.5, -5], size: [2, 3, 2], color: '#2a1a3a' },
      { type: 'building', position: [-8, 2, 5], size: [3, 4, 2], color: '#1a2a3a' },
      { type: 'building', position: [20, 2, 5], size: [2, 4, 3], color: '#2a0a3a' },
      { type: 'building', position: [-5, 1, 10], size: [2, 2, 2], color: '#2a1a3a' },
      { type: 'building', position: [8, 1.5, 18], size: [2.5, 3, 2.5], color: '#1a2a3a' },
      { type: 'building', position: [-15, 1.5, -18], size: [2, 3, 2], color: '#2a1a3a' },
      { type: 'building', position: [15, 1.5, 20], size: [2.5, 3, 2.5], color: '#1a2a3a' },
      
      // Tours de communication
      { type: 'tower', position: [25, 4, 0], size: [1.5, 8, 1.5], color: '#2a2a4a' },
      { type: 'tower', position: [-25, 4, 0], size: [1.5, 8, 1.5], color: '#2a2a4a' },
      { type: 'tower', position: [0, 3, 25], size: [1.2, 6, 1.2], color: '#2a2a4a' },
      { type: 'tower', position: [0, 3, -25], size: [1.2, 6, 1.2], color: '#2a2a4a' },
      
      // Murs néon lumineux - beaucoup plus nombreux
      { type: 'wall', position: [0, 1, 8], size: [8, 2, 0.3], color: '#ff00ff' },
      { type: 'wall', position: [-5, 1, -8], size: [0.3, 2, 6], color: '#00ffff' },
      { type: 'wall', position: [10, 1, 0], size: [0.3, 2, 8], color: '#ff00ff' },
      { type: 'wall', position: [-10, 1, -15], size: [6, 2, 0.3], color: '#00ffff' },
      { type: 'wall', position: [5, 1, 20], size: [6, 2, 0.3], color: '#ff00ff' },
      { type: 'wall', position: [-20, 1, 10], size: [0.3, 2, 8], color: '#00ffff' },
      { type: 'wall', position: [20, 1, -10], size: [0.3, 2, 8], color: '#ff00ff' },
      { type: 'wall', position: [-15, 1, 20], size: [6, 2, 0.3], color: '#00ffff' },
      
      // Rampes pour accès en hauteur - plus nombreuses
      { type: 'ramp', position: [8, 0.5, 0], size: [3, 1, 4], color: '#330066' },
      { type: 'ramp', position: [-15, 0.5, 0], size: [3, 1, 4], color: '#330066' },
      { type: 'ramp', position: [0, 0.5, 15], size: [4, 1, 3], color: '#330066' },
      { type: 'ramp', position: [-8, 1, -12], size: [3, 2, 4], color: '#330066' },
      { type: 'ramp', position: [12, 0.5, 8], size: [3, 1, 4], color: '#330066' },
      { type: 'ramp', position: [-12, 0.5, -8], size: [3, 1, 4], color: '#330066' },
      { type: 'ramp', position: [18, 1, -5], size: [3, 2, 4], color: '#330066' },
      { type: 'ramp', position: [-18, 1, 5], size: [3, 2, 4], color: '#330066' },
      
      // Plateformes surélevées - plus nombreuses
      { type: 'platform', position: [0, 3, 0], size: [4, 0.3, 4], color: '#4a0080' },
      { type: 'platform', position: [10, 2, -10], size: [3, 0.3, 3], color: '#4a0080' },
      { type: 'platform', position: [-15, 2.5, 8], size: [3.5, 0.3, 3.5], color: '#4a0080' },
      { type: 'platform', position: [15, 1.5, 15], size: [3, 0.3, 3], color: '#4a0080' },
      { type: 'platform', position: [-10, 2, -15], size: [3, 0.3, 3], color: '#4a0080' },
      { type: 'platform', position: [20, 1.5, 10], size: [2.5, 0.3, 2.5], color: '#4a0080' },
      { type: 'platform', position: [-20, 1.5, -10], size: [2.5, 0.3, 2.5], color: '#4a0080' },
      { type: 'platform', position: [5, 2, 22], size: [3, 0.3, 3], color: '#4a0080' },
      
      // Cristaux néon - pour l'ambiance cyberpunk
      { type: 'crystal', position: [6, 1, 6], size: [1.5, 2, 1.5], color: '#ff00ff' },
      { type: 'crystal', position: [-6, 1, -6], size: [1.5, 2, 1.5], color: '#00ffff' },
      { type: 'crystal', position: [14, 1, -14], size: [1.2, 1.8, 1.2], color: '#ff00ff' },
      { type: 'crystal', position: [-14, 1, 14], size: [1.2, 1.8, 1.2], color: '#00ffff' },
      
      // Rochers décoratifs
      { type: 'rock', position: [3, 0.5, 10], size: [1.5, 1, 1.5], color: '#2a2a4a' },
      { type: 'rock', position: [-3, 0.5, -10], size: [1.5, 1, 1.5], color: '#2a2a4a' },
      { type: 'rock', position: [10, 0.5, 3], size: [1.2, 0.8, 1.2], color: '#2a2a4a' },
      { type: 'rock', position: [-10, 0.5, -3], size: [1.2, 0.8, 1.2], color: '#2a2a4a' },
      
      // Caisses et objets - beaucoup plus nombreux
      { type: 'crate', position: [3, 0.4, 3], size: [0.8, 0.8, 0.8], color: '#ff6600' },
      { type: 'crate', position: [-3, 0.4, -3], size: [0.8, 0.8, 0.8], color: '#ff6600' },
      { type: 'crate', position: [7, 0.4, -7], size: [0.8, 0.8, 0.8], color: '#ff6600' },
      { type: 'crate', position: [-12, 0.4, 12], size: [0.8, 0.8, 0.8], color: '#ff6600' },
      { type: 'crate', position: [18, 0.4, -8], size: [0.8, 0.8, 0.8], color: '#ff6600' },
      { type: 'crate', position: [-18, 0.4, 8], size: [0.8, 0.8, 0.8], color: '#ff6600' },
      { type: 'crate', position: [10, 0.4, 15], size: [0.8, 0.8, 0.8], color: '#ff6600' },
      { type: 'crate', position: [-10, 0.4, -15], size: [0.8, 0.8, 0.8], color: '#ff6600' },
      { type: 'crate', position: [22, 0.4, 5], size: [0.8, 0.8, 0.8], color: '#ff6600' },
      { type: 'crate', position: [-22, 0.4, -5], size: [0.8, 0.8, 0.8], color: '#ff6600' },
    ],
    resources: [
      { type: 'gold', count: 15 },
      { type: 'gem', count: 6 },
      { type: 'wood', count: 10 },
      { type: 'stone', count: 8 },
    ],
    difficulty: 'moyen',
    players: '2-9',
  },
  {
    id: 'volcanic-island',
    name: 'Île Volcanique',
    description: 'Une île volcanique avec de la lave, des rochers et des ponts de pierre',
    emoji: '🌋',
    theme: {
      groundColor: '#1a0a00',
      skyColor: '#330a00',
      fogColor: '#1a0500',
      ambientLight: 0.3,
      fogNear: 12,
      fogFar: 50,
    },
    structures: [
      // Volcan central massif avec plusieurs couches
      { type: 'tower', position: [0, 3, 0], size: [6, 6, 6], color: '#3d1a00' },
      { type: 'tower', position: [0, 6, 0], size: [4, 4, 4], color: '#4a2000' },
      { type: 'tower', position: [0, 8, 0], size: [2.5, 3, 2.5], color: '#5a2a00' },
      
      // Volcans secondaires
      { type: 'tower', position: [18, 2, 18], size: [3, 4, 3], color: '#3d1a00' },
      { type: 'tower', position: [-18, 2, -18], size: [3, 4, 3], color: '#3d1a00' },
      { type: 'tower', position: [18, 2.5, -15], size: [2.5, 5, 2.5], color: '#4a2000' },
      { type: 'tower', position: [-15, 2.5, 18], size: [2.5, 5, 2.5], color: '#4a2000' },
      
      // Gros rochers volcaniques - beaucoup plus nombreux
      { type: 'rock', position: [10, 1, 10], size: [3, 2, 3], color: '#4a2a00' },
      { type: 'rock', position: [-12, 1.5, -8], size: [4, 3, 4], color: '#3d1a00' },
      { type: 'rock', position: [15, 0.8, -12], size: [2, 1.5, 2], color: '#4a2a00' },
      { type: 'rock', position: [-8, 1, 15], size: [3, 2, 3], color: '#3d1a00' },
      { type: 'rock', position: [20, 1.2, 0], size: [2.5, 2.5, 2.5], color: '#4a2a00' },
      { type: 'rock', position: [-20, 0.8, 5], size: [2, 1.5, 2], color: '#3d1a00' },
      { type: 'rock', position: [8, 1.5, -18], size: [3.5, 3, 3.5], color: '#4a2a00' },
      { type: 'rock', position: [-15, 1, 18], size: [2.5, 2, 2.5], color: '#3d1a00' },
      { type: 'rock', position: [18, 0.8, 15], size: [2, 1.5, 2], color: '#4a2a00' },
      { type: 'rock', position: [-10, 1.2, -20], size: [2.5, 2.5, 2.5], color: '#3d1a00' },
      { type: 'rock', position: [22, 1, 8], size: [2, 2, 2], color: '#4a2a00' },
      { type: 'rock', position: [-22, 1, -8], size: [2, 2, 2], color: '#3d1a00' },
      { type: 'rock', position: [5, 0.8, 22], size: [1.8, 1.5, 1.8], color: '#4a2a00' },
      { type: 'rock', position: [-5, 0.8, -22], size: [1.8, 1.5, 1.8], color: '#3d1a00' },
      
      // Rochers de lave incandescente
      { type: 'crystal', position: [12, 0.5, 5], size: [1.5, 1, 1.5], color: '#ff4400' },
      { type: 'crystal', position: [-12, 0.5, -5], size: [1.5, 1, 1.5], color: '#ff4400' },
      { type: 'crystal', position: [5, 0.5, 15], size: [1.2, 0.8, 1.2], color: '#ff6600' },
      { type: 'crystal', position: [-5, 0.5, -15], size: [1.2, 0.8, 1.2], color: '#ff6600' },
      
      // Ponts de pierre reliant les zones - réseau complet
      { type: 'wall', position: [5, 0.5, 0], size: [10, 0.5, 1.5], color: '#5a3a00' },
      { type: 'wall', position: [0, 0.5, 5], size: [1.5, 0.5, 10], color: '#5a3a00' },
      { type: 'wall', position: [-5, 0.5, 0], size: [10, 0.5, 1.5], color: '#5a3a00' },
      { type: 'wall', position: [0, 0.5, -5], size: [1.5, 0.5, 10], color: '#5a3a00' },
      { type: 'wall', position: [10, 0.5, 10], size: [8, 0.5, 1.5], color: '#5a3a00' },
      { type: 'wall', position: [-10, 0.5, -10], size: [8, 0.5, 1.5], color: '#5a3a00' },
      { type: 'wall', position: [10, 0.5, -10], size: [1.5, 0.5, 8], color: '#5a3a00' },
      { type: 'wall', position: [-10, 0.5, 10], size: [1.5, 0.5, 8], color: '#5a3a00' },
      
      // Plateformes de lave brûlantes - plus nombreuses
      { type: 'platform', position: [8, 0.3, -8], size: [3, 0.3, 3], color: '#ff3300' },
      { type: 'platform', position: [-8, 0.3, 8], size: [3, 0.3, 3], color: '#ff3300' },
      { type: 'platform', position: [12, 0.3, 12], size: [2.5, 0.3, 2.5], color: '#ff4400' },
      { type: 'platform', position: [-12, 0.3, -12], size: [2.5, 0.3, 2.5], color: '#ff4400' },
      { type: 'platform', position: [15, 0.3, 0], size: [2, 0.3, 2], color: '#ff5500' },
      { type: 'platform', position: [-15, 0.3, 0], size: [2, 0.3, 2], color: '#ff5500' },
      { type: 'platform', position: [0, 0.3, 15], size: [2, 0.3, 2], color: '#ff5500' },
      { type: 'platform', position: [0, 0.3, -15], size: [2, 0.3, 2], color: '#ff5500' },
      
      // Rampes pour accéder aux hauteurs - plus nombreuses
      { type: 'ramp', position: [-5, 1, -5], size: [3, 2, 4], color: '#4a2a00' },
      { type: 'ramp', position: [5, 1, 5], size: [3, 2, 4], color: '#4a2a00' },
      { type: 'ramp', position: [-8, 0.5, 12], size: [3, 1, 4], color: '#4a2a00' },
      { type: 'ramp', position: [8, 0.5, -12], size: [3, 1, 4], color: '#4a2a00' },
      { type: 'ramp', position: [12, 0.5, 8], size: [3, 1, 4], color: '#4a2a00' },
      { type: 'ramp', position: [-12, 0.5, -8], size: [3, 1, 4], color: '#4a2a00' },
      { type: 'ramp', position: [15, 1, -5], size: [3, 2, 4], color: '#4a2a00' },
      { type: 'ramp', position: [-15, 1, 5], size: [3, 2, 4], color: '#4a2a00' },
      
      // Colonnes de pierre volcanique
      { type: 'tower', position: [15, 1.5, 8], size: [1.5, 3, 1.5], color: '#5a3a00' },
      { type: 'tower', position: [-15, 1.5, -8], size: [1.5, 3, 1.5], color: '#5a3a00' },
      { type: 'tower', position: [10, 1, 18], size: [1.2, 2, 1.2], color: '#5a3a00' },
      { type: 'tower', position: [-10, 1, -18], size: [1.2, 2, 1.2], color: '#5a3a00' },
      { type: 'tower', position: [20, 1.5, 15], size: [1.3, 3, 1.3], color: '#5a3a00' },
      { type: 'tower', position: [-20, 1.5, -15], size: [1.3, 3, 1.3], color: '#5a3a00' },
      
      // Murs de lave solidifiée
      { type: 'wall', position: [8, 1, 0], size: [0.5, 2, 6], color: '#6a3a00' },
      { type: 'wall', position: [-8, 1, 0], size: [0.5, 2, 6], color: '#6a3a00' },
      { type: 'wall', position: [0, 1, 8], size: [6, 2, 0.5], color: '#6a3a00' },
      { type: 'wall', position: [0, 1, -8], size: [6, 2, 0.5], color: '#6a3a00' },
      
      // Caisses et ressources - beaucoup plus nombreuses
      { type: 'crate', position: [3, 0.4, 8], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [-6, 0.4, -4], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [12, 0.4, -5], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [-10, 0.4, 10], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [18, 0.4, 5], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [-18, 0.4, -5], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [5, 0.4, 18], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [-5, 0.4, -18], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [22, 0.4, 12], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [-22, 0.4, -12], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [15, 0.4, 20], size: [0.8, 0.8, 0.8], color: '#8b4513' },
      { type: 'crate', position: [-15, 0.4, -20], size: [0.8, 0.8, 0.8], color: '#8b4513' },
    ],
    resources: [
      { type: 'gold', count: 12 },
      { type: 'gem', count: 10 },
      { type: 'stone', count: 15 },
    ],
    difficulty: 'difficile',
    players: '2-9',
  },
  {
    id: 'frozen-tundra',
    name: 'Toundra Gelée',
    description: 'Un paysage glacé avec des icebergs, des igloos et des cristaux de glace',
    emoji: '❄️',
    theme: {
      groundColor: '#e8f4f8',
      skyColor: '#87ceeb',
      fogColor: '#c8e8f0',
      ambientLight: 0.5,
      fogNear: 20,
      fogFar: 60,
    },
    structures: [
      // Grands icebergs - beaucoup plus nombreux et variés
      { type: 'crystal', position: [10, 2, 10], size: [3, 4, 3], color: '#a8d8ea' },
      { type: 'crystal', position: [-15, 3, -12], size: [4, 6, 4], color: '#87ceeb' },
      { type: 'crystal', position: [18, 1.5, -8], size: [2, 3, 2], color: '#a8d8ea' },
      { type: 'crystal', position: [-10, 2, 18], size: [3, 4, 3], color: '#87ceeb' },
      { type: 'crystal', position: [20, 2.5, 15], size: [3.5, 5, 3.5], color: '#a8d8ea' },
      { type: 'crystal', position: [-18, 2, -18], size: [3, 4, 3], color: '#87ceeb' },
      { type: 'crystal', position: [8, 1.5, -20], size: [2.5, 3, 2.5], color: '#a8d8ea' },
      { type: 'crystal', position: [-20, 2, 8], size: [2.5, 4, 2.5], color: '#87ceeb' },
      { type: 'crystal', position: [22, 1.8, -15], size: [2, 3.5, 2], color: '#a8d8ea' },
      { type: 'crystal', position: [-22, 2.2, 15], size: [2.8, 4.5, 2.8], color: '#87ceeb' },
      
      // Icebergs secondaires plus petits
      { type: 'crystal', position: [5, 1, 15], size: [1.5, 2, 1.5], color: '#b8e8fa' },
      { type: 'crystal', position: [-5, 1, -15], size: [1.5, 2, 1.5], color: '#b8e8fa' },
      { type: 'crystal', position: [15, 1, 5], size: [1.8, 2.5, 1.8], color: '#b8e8fa' },
      { type: 'crystal', position: [-15, 1, -5], size: [1.8, 2.5, 1.8], color: '#b8e8fa' },
      
      // Igloos habitables - plus nombreux
      { type: 'building', position: [5, 1.5, -5], size: [3, 3, 3], color: '#f0f8ff' },
      { type: 'building', position: [-8, 1.5, 8], size: [3, 3, 3], color: '#f0f8ff' },
      { type: 'building', position: [12, 1.5, 12], size: [2.5, 2.5, 2.5], color: '#f0f8ff' },
      { type: 'building', position: [-15, 1.5, -5], size: [2.5, 2.5, 2.5], color: '#f0f8ff' },
      { type: 'building', position: [18, 1.5, -12], size: [2, 2, 2], color: '#f0f8ff' },
      { type: 'building', position: [-18, 1.5, 12], size: [2, 2, 2], color: '#f0f8ff' },
      { type: 'building', position: [0, 1.5, 20], size: [2.5, 2.5, 2.5], color: '#f0f8ff' },
      { type: 'building', position: [0, 1.5, -20], size: [2.5, 2.5, 2.5], color: '#f0f8ff' },
      
      // Murs de glace défensifs - réseau complet
      { type: 'wall', position: [0, 1.5, 12], size: [8, 3, 0.5], color: '#b8e0f0' },
      { type: 'wall', position: [-12, 1.5, 0], size: [0.5, 3, 8], color: '#b8e0f0' },
      { type: 'wall', position: [8, 1.5, -10], size: [6, 3, 0.5], color: '#b8e0f0' },
      { type: 'wall', position: [-8, 1.5, 15], size: [0.5, 3, 6], color: '#b8e0f0' },
      { type: 'wall', position: [10, 1.5, 10], size: [6, 3, 0.5], color: '#b8e0f0' },
      { type: 'wall', position: [-10, 1.5, -10], size: [6, 3, 0.5], color: '#b8e0f0' },
      { type: 'wall', position: [10, 1.5, -10], size: [0.5, 3, 6], color: '#b8e0f0' },
      { type: 'wall', position: [-10, 1.5, 10], size: [0.5, 3, 6], color: '#b8e0f0' },
      
      // Plateformes gelées surélevées - plus nombreuses
      { type: 'platform', position: [0, 2, 0], size: [5, 0.4, 5], color: '#d0f0ff' },
      { type: 'platform', position: [12, 1, -12], size: [3, 0.4, 3], color: '#d0f0ff' },
      { type: 'platform', position: [-12, 1.5, 12], size: [3.5, 0.4, 3.5], color: '#d0f0ff' },
      { type: 'platform', position: [15, 0.8, 8], size: [2.5, 0.4, 2.5], color: '#d0f0ff' },
      { type: 'platform', position: [-15, 1, -8], size: [2.5, 0.4, 2.5], color: '#d0f0ff' },
      { type: 'platform', position: [8, 1.2, 18], size: [3, 0.4, 3], color: '#d0f0ff' },
      { type: 'platform', position: [-8, 1.2, -18], size: [3, 0.4, 3], color: '#d0f0ff' },
      { type: 'platform', position: [20, 0.8, 0], size: [2, 0.4, 2], color: '#d0f0ff' },
      { type: 'platform', position: [-20, 0.8, 0], size: [2, 0.4, 2], color: '#d0f0ff' },
      
      // Rochers enneigés - beaucoup plus nombreux
      { type: 'rock', position: [-5, 0.8, -15], size: [2, 1.5, 2], color: '#6b7b8a' },
      { type: 'rock', position: [15, 0.6, 5], size: [1.5, 1.2, 1.5], color: '#6b7b8a' },
      { type: 'rock', position: [-20, 1, 10], size: [2.5, 2, 2.5], color: '#6b7b8a' },
      { type: 'rock', position: [8, 0.8, -18], size: [2, 1.5, 2], color: '#6b7b8a' },
      { type: 'rock', position: [12, 0.7, 15], size: [1.8, 1.3, 1.8], color: '#6b7b8a' },
      { type: 'rock', position: [-12, 0.7, -15], size: [1.8, 1.3, 1.8], color: '#6b7b8a' },
      { type: 'rock', position: [22, 0.9, 8], size: [2.2, 1.6, 2.2], color: '#6b7b8a' },
      { type: 'rock', position: [-22, 0.9, -8], size: [2.2, 1.6, 2.2], color: '#6b7b8a' },
      { type: 'rock', position: [5, 0.6, 22], size: [1.5, 1, 1.5], color: '#6b7b8a' },
      { type: 'rock', position: [-5, 0.6, -22], size: [1.5, 1, 1.5], color: '#6b7b8a' },
      
      // Rampes de glace - plus nombreuses
      { type: 'ramp', position: [7, 0.5, 7], size: [3, 1, 4], color: '#c0e8f8' },
      { type: 'ramp', position: [-7, 0.5, -7], size: [3, 1, 4], color: '#c0e8f8' },
      { type: 'ramp', position: [10, 0.5, -5], size: [3, 1, 4], color: '#c0e8f8' },
      { type: 'ramp', position: [-10, 0.5, 5], size: [3, 1, 4], color: '#c0e8f8' },
      { type: 'ramp', position: [15, 0.5, 12], size: [3, 1, 4], color: '#c0e8f8' },
      { type: 'ramp', position: [-15, 0.5, -12], size: [3, 1, 4], color: '#c0e8f8' },
      { type: 'ramp', position: [5, 0.5, 18], size: [3, 1, 4], color: '#c0e8f8' },
      { type: 'ramp', position: [-5, 0.5, -18], size: [3, 1, 4], color: '#c0e8f8' },
      
      // Arbres gelés - plus nombreux
      { type: 'tree', position: [-18, 1.5, 8], size: [1.5, 3, 1.5], color: '#4a6fa5' },
      { type: 'tree', position: [18, 1.5, -15], size: [1.5, 3, 1.5], color: '#4a6fa5' },
      { type: 'tree', position: [-5, 1.5, 20], size: [1.2, 2.5, 1.2], color: '#4a6fa5' },
      { type: 'tree', position: [5, 1.5, -20], size: [1.2, 2.5, 1.2], color: '#4a6fa5' },
      { type: 'tree', position: [-22, 1.5, -5], size: [1.3, 2.8, 1.3], color: '#4a6fa5' },
      { type: 'tree', position: [22, 1.5, 5], size: [1.3, 2.8, 1.3], color: '#4a6fa5' },
      { type: 'tree', position: [-10, 1.5, 22], size: [1.4, 3, 1.4], color: '#4a6fa5' },
      { type: 'tree', position: [10, 1.5, -22], size: [1.4, 3, 1.4], color: '#4a6fa5' },
      
      // Caisses gelées - beaucoup plus nombreuses
      { type: 'crate', position: [2, 0.4, -2], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [-3, 0.4, 3], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [10, 0.4, 5], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [-10, 0.4, -8], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [15, 0.4, 10], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [-15, 0.4, -10], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [8, 0.4, 18], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [-8, 0.4, -18], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [20, 0.4, 5], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [-20, 0.4, -5], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [5, 0.4, 22], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
      { type: 'crate', position: [-5, 0.4, -22], size: [0.8, 0.8, 0.8], color: '#4a6fa5' },
    ],
    resources: [
      { type: 'gold', count: 12 },
      { type: 'gem', count: 15 },
      { type: 'wood', count: 18 },
      { type: 'stone', count: 10 },
    ],
    difficulty: 'facile',
    players: '2-9',
  },
  {
    id: 'jungle-temple',
    name: 'Temple Jungle',
    description: 'Un temple ancien perdu dans la jungle avec des ruines et de la végétation',
    emoji: '🏛️',
    theme: {
      groundColor: '#1a3a1a',
      skyColor: '#2a5a2a',
      fogColor: '#0a2a0a',
      ambientLight: 0.35,
      fogNear: 15,
      fogFar: 50,
    },
    structures: [
      // Temple central imposant
      { type: 'building', position: [0, 3, 0], size: [6, 6, 6], color: '#8b7355' },
      { type: 'building', position: [0, 6, 0], size: [4, 2, 4], color: '#7a6245' },
      
      // Colonnes du temple
      { type: 'tower', position: [8, 2, 8], size: [1, 4, 1], color: '#a0826d' },
      { type: 'tower', position: [-8, 2, 8], size: [1, 4, 1], color: '#a0826d' },
      { type: 'tower', position: [8, 2, -8], size: [1, 4, 1], color: '#a0826d' },
      { type: 'tower', position: [-8, 2, -8], size: [1, 4, 1], color: '#a0826d' },
      { type: 'tower', position: [12, 2, 0], size: [1, 4, 1], color: '#a0826d' },
      { type: 'tower', position: [-12, 2, 0], size: [1, 4, 1], color: '#a0826d' },
      { type: 'tower', position: [0, 2, 12], size: [1, 4, 1], color: '#a0826d' },
      { type: 'tower', position: [0, 2, -12], size: [1, 4, 1], color: '#a0826d' },
      
      // Arbres de la jungle
      { type: 'tree', position: [15, 2, 5], size: [1, 4, 1], color: '#2d5a27' },
      { type: 'tree', position: [-12, 2.5, -15], size: [1.2, 5, 1.2], color: '#2d5a27' },
      { type: 'tree', position: [18, 1.8, -10], size: [0.8, 3.5, 0.8], color: '#2d5a27' },
      { type: 'tree', position: [-18, 2, 12], size: [1, 4, 1], color: '#2d5a27' },
      { type: 'tree', position: [5, 1.5, 18], size: [0.9, 3, 0.9], color: '#2d5a27' },
      { type: 'tree', position: [-15, 2, 15], size: [1.1, 4, 1.1], color: '#2d5a27' },
      { type: 'tree', position: [20, 2, -15], size: [1, 4, 1], color: '#2d5a27' },
      { type: 'tree', position: [-20, 2, -5], size: [1.2, 4.5, 1.2], color: '#2d5a27' },
      
      // Rochers moussus
      { type: 'rock', position: [12, 0.8, -5], size: [2, 1.5, 2], color: '#4a6a3a' },
      { type: 'rock', position: [-5, 1, 12], size: [2.5, 2, 2.5], color: '#3a5a2a' },
      { type: 'rock', position: [10, 1, 15], size: [2, 1.5, 2], color: '#4a6a3a' },
      { type: 'rock', position: [-15, 0.8, -10], size: [2.5, 1.5, 2.5], color: '#3a5a2a' },
      { type: 'rock', position: [18, 0.8, 10], size: [1.8, 1.5, 1.8], color: '#4a6a3a' },
      
      // Murs en ruine
      { type: 'wall', position: [0, 1, 10], size: [6, 2, 0.5], color: '#8b7355' },
      { type: 'wall', position: [-10, 1, 0], size: [0.5, 2, 6], color: '#8b7355' },
      { type: 'wall', position: [10, 1, 0], size: [0.5, 2, 6], color: '#8b7355' },
      { type: 'wall', position: [0, 1, -10], size: [6, 2, 0.5], color: '#8b7355' },
      
      // Rampes d'accès
      { type: 'ramp', position: [5, 0.5, -5], size: [3, 1, 4], color: '#6b5a3a' },
      { type: 'ramp', position: [-5, 0.5, 5], size: [3, 1, 4], color: '#6b5a3a' },
      { type: 'ramp', position: [5, 0.5, 5], size: [3, 1, 4], color: '#6b5a3a' },
      { type: 'ramp', position: [-5, 0.5, -5], size: [3, 1, 4], color: '#6b5a3a' },
      
      // Plateformes surélevées
      { type: 'platform', position: [-5, 1.5, -5], size: [3, 0.3, 3], color: '#8b7355' },
      { type: 'platform', position: [5, 1.5, 5], size: [3, 0.3, 3], color: '#8b7355' },
      { type: 'platform', position: [15, 1, 10], size: [2.5, 0.3, 2.5], color: '#8b7355' },
      { type: 'platform', position: [-15, 1, -10], size: [2.5, 0.3, 2.5], color: '#8b7355' },
      
      // Caisses de trésor - beaucoup plus nombreuses
      { type: 'crate', position: [3, 0.4, 5], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [-4, 0.4, -3], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [12, 0.4, 8], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [-12, 0.4, -8], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [18, 0.4, 5], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [-18, 0.4, -5], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [5, 0.4, 18], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [-5, 0.4, -18], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [22, 0.4, 12], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [-22, 0.4, -12], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [15, 0.4, 20], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      { type: 'crate', position: [-15, 0.4, -20], size: [0.8, 0.8, 0.8], color: '#8b6914' },
      
      // Arbres supplémentaires
      { type: 'tree', position: [8, 1.8, -18], size: [1, 3.5, 1], color: '#2d5a27' },
      { type: 'tree', position: [-8, 1.8, 18], size: [1, 3.5, 1], color: '#2d5a27' },
      { type: 'tree', position: [22, 2, 0], size: [1.1, 4, 1.1], color: '#2d5a27' },
      { type: 'tree', position: [-22, 2, 0], size: [1.1, 4, 1.1], color: '#2d5a27' },
      
      // Rochers supplémentaires
      { type: 'rock', position: [20, 0.9, -8], size: [2, 1.6, 2], color: '#4a6a3a' },
      { type: 'rock', position: [-20, 0.9, 8], size: [2, 1.6, 2], color: '#3a5a2a' },
      { type: 'rock', position: [8, 0.7, 22], size: [1.7, 1.4, 1.7], color: '#4a6a3a' },
      { type: 'rock', position: [-8, 0.7, -22], size: [1.7, 1.4, 1.7], color: '#3a5a2a' },
      
      // Rampes supplémentaires
      { type: 'ramp', position: [10, 0.5, -10], size: [3, 1, 4], color: '#6b5a3a' },
      { type: 'ramp', position: [-10, 0.5, 10], size: [3, 1, 4], color: '#6b5a3a' },
      { type: 'ramp', position: [15, 0.5, 15], size: [3, 1, 4], color: '#6b5a3a' },
      { type: 'ramp', position: [-15, 0.5, -15], size: [3, 1, 4], color: '#6b5a3a' },
      
      // Plateformes supplémentaires
      { type: 'platform', position: [18, 1.2, -12], size: [2.5, 0.3, 2.5], color: '#8b7355' },
      { type: 'platform', position: [-18, 1.2, 12], size: [2.5, 0.3, 2.5], color: '#8b7355' },
      { type: 'platform', position: [0, 1.5, 18], size: [3, 0.3, 3], color: '#8b7355' },
      { type: 'platform', position: [0, 1.5, -18], size: [3, 0.3, 3], color: '#8b7355' },
    ],
    resources: [
      { type: 'gold', count: 20 },
      { type: 'gem', count: 10 },
      { type: 'wood', count: 15 },
      { type: 'stone', count: 12 },
    ],
    difficulty: 'moyen',
    players: '2-9',
  },
  {
    id: 'space-station',
    name: 'Station Spatiale',
    description: 'Une station spatiale orbitale avec vue sur les étoiles et gravité réduite',
    emoji: '🚀',
    theme: {
      groundColor: '#0a0a1a',
      skyColor: '#000011',
      fogColor: '#000005',
      ambientLight: 0.15,
      fogNear: 25,
      fogFar: 70,
    },
    structures: [
      // Module central principal
      { type: 'building', position: [0, 2, 0], size: [4, 4, 4], color: '#2a2a4a' },
      { type: 'building', position: [0, 4, 0], size: [2, 2, 2], color: '#3a3a5a' },
      
      // Modules latéraux
      { type: 'building', position: [12, 1.5, 0], size: [3, 3, 6], color: '#1a1a3a' },
      { type: 'building', position: [-12, 1.5, 0], size: [3, 3, 6], color: '#1a1a3a' },
      { type: 'building', position: [0, 1.5, 12], size: [6, 3, 3], color: '#1a1a3a' },
      { type: 'building', position: [0, 1.5, -12], size: [6, 3, 3], color: '#1a1a3a' },
      
      // Modules secondaires
      { type: 'building', position: [18, 1, 8], size: [2, 2, 4], color: '#2a2a4a' },
      { type: 'building', position: [-18, 1, -8], size: [2, 2, 4], color: '#2a2a4a' },
      { type: 'building', position: [8, 1, 18], size: [4, 2, 2], color: '#2a2a4a' },
      { type: 'building', position: [-8, 1, -18], size: [4, 2, 2], color: '#2a2a4a' },
      
      // Tours de communication
      { type: 'tower', position: [18, 3, 18], size: [1, 6, 1], color: '#3a3a5a' },
      { type: 'tower', position: [-18, 3, -18], size: [1, 6, 1], color: '#3a3a5a' },
      { type: 'tower', position: [18, 3, -18], size: [1, 6, 1], color: '#3a3a5a' },
      { type: 'tower', position: [-18, 3, 18], size: [1, 6, 1], color: '#3a3a5a' },
      
      // Passerelles principales
      { type: 'wall', position: [6, 0.5, 0], size: [8, 0.3, 2], color: '#4a4a6a' },
      { type: 'wall', position: [-6, 0.5, 0], size: [8, 0.3, 2], color: '#4a4a6a' },
      { type: 'wall', position: [0, 0.5, 6], size: [2, 0.3, 8], color: '#4a4a6a' },
      { type: 'wall', position: [0, 0.5, -6], size: [2, 0.3, 8], color: '#4a4a6a' },
      
      // Passerelles secondaires
      { type: 'wall', position: [15, 0.5, 4], size: [6, 0.3, 1.5], color: '#4a4a6a' },
      { type: 'wall', position: [-15, 0.5, -4], size: [6, 0.3, 1.5], color: '#4a4a6a' },
      { type: 'wall', position: [4, 0.5, 15], size: [1.5, 0.3, 6], color: '#4a4a6a' },
      { type: 'wall', position: [-4, 0.5, -15], size: [1.5, 0.3, 6], color: '#4a4a6a' },
      
      // Cristaux d'énergie
      { type: 'crystal', position: [8, 1.5, 8], size: [1.5, 3, 1.5], color: '#00ffff' },
      { type: 'crystal', position: [-8, 1.5, -8], size: [1.5, 3, 1.5], color: '#ff00ff' },
      { type: 'crystal', position: [8, 1.5, -8], size: [1.5, 3, 1.5], color: '#ffff00' },
      { type: 'crystal', position: [-8, 1.5, 8], size: [1.5, 3, 1.5], color: '#00ff00' },
      { type: 'crystal', position: [15, 1.5, 15], size: [1.2, 2.5, 1.2], color: '#ff8800' },
      { type: 'crystal', position: [-15, 1.5, -15], size: [1.2, 2.5, 1.2], color: '#8800ff' },
      
      // Plateformes surélevées
      { type: 'platform', position: [15, 2, 15], size: [3, 0.3, 3], color: '#3a3a6a' },
      { type: 'platform', position: [-15, 2, -15], size: [3, 0.3, 3], color: '#3a3a6a' },
      { type: 'platform', position: [15, 2, -15], size: [3, 0.3, 3], color: '#3a3a6a' },
      { type: 'platform', position: [-15, 2, 15], size: [3, 0.3, 3], color: '#3a3a6a' },
      { type: 'platform', position: [20, 1.5, 0], size: [2.5, 0.3, 2.5], color: '#3a3a6a' },
      { type: 'platform', position: [-20, 1.5, 0], size: [2.5, 0.3, 2.5], color: '#3a3a6a' },
      
      // Rampes d'accès
      { type: 'ramp', position: [10, 0.5, 10], size: [2, 1, 3], color: '#4a4a6a' },
      { type: 'ramp', position: [-10, 0.5, -10], size: [2, 1, 3], color: '#4a4a6a' },
      { type: 'ramp', position: [10, 0.5, -10], size: [2, 1, 3], color: '#4a4a6a' },
      { type: 'ramp', position: [-10, 0.5, 10], size: [2, 1, 3], color: '#4a4a6a' },
      
      // Caisses de ravitaillement - beaucoup plus nombreuses
      { type: 'crate', position: [4, 0.4, 4], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [-4, 0.4, -4], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [12, 0.4, 12], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [-12, 0.4, -12], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [18, 0.4, 5], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [-18, 0.4, -5], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [5, 0.4, 18], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [-5, 0.4, -18], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [22, 0.4, 12], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [-22, 0.4, -12], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [15, 0.4, 20], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      { type: 'crate', position: [-15, 0.4, -20], size: [0.8, 0.8, 0.8], color: '#6a6a8a' },
      
      // Modules supplémentaires
      { type: 'building', position: [22, 1, 0], size: [2, 2, 2], color: '#2a2a4a' },
      { type: 'building', position: [-22, 1, 0], size: [2, 2, 2], color: '#2a2a4a' },
      { type: 'building', position: [0, 1, 22], size: [2, 2, 2], color: '#2a2a4a' },
      { type: 'building', position: [0, 1, -22], size: [2, 2, 2], color: '#2a2a4a' },
      
      // Tours supplémentaires
      { type: 'tower', position: [22, 2, 8], size: [0.8, 4, 0.8], color: '#3a3a5a' },
      { type: 'tower', position: [-22, 2, -8], size: [0.8, 4, 0.8], color: '#3a3a5a' },
      { type: 'tower', position: [8, 2, 22], size: [0.8, 4, 0.8], color: '#3a3a5a' },
      { type: 'tower', position: [-8, 2, -22], size: [0.8, 4, 0.8], color: '#3a3a5a' },
      
      // Cristaux d'énergie supplémentaires
      { type: 'crystal', position: [20, 1.5, 10], size: [1, 2, 1], color: '#00ffff' },
      { type: 'crystal', position: [-20, 1.5, -10], size: [1, 2, 1], color: '#ff00ff' },
      { type: 'crystal', position: [10, 1.5, 20], size: [1, 2, 1], color: '#ffff00' },
      { type: 'crystal', position: [-10, 1.5, -20], size: [1, 2, 1], color: '#00ff00' },
      
      // Plateformes supplémentaires
      { type: 'platform', position: [0, 2, 20], size: [2.5, 0.3, 2.5], color: '#3a3a6a' },
      { type: 'platform', position: [0, 2, -20], size: [2.5, 0.3, 2.5], color: '#3a3a6a' },
      { type: 'platform', position: [20, 2, 0], size: [2.5, 0.3, 2.5], color: '#3a3a6a' },
      { type: 'platform', position: [-20, 2, 0], size: [2.5, 0.3, 2.5], color: '#3a3a6a' },
      
      // Rampes supplémentaires
      { type: 'ramp', position: [15, 0.5, 15], size: [2, 1, 3], color: '#4a4a6a' },
      { type: 'ramp', position: [-15, 0.5, -15], size: [2, 1, 3], color: '#4a4a6a' },
      { type: 'ramp', position: [15, 0.5, -15], size: [2, 1, 3], color: '#4a4a6a' },
      { type: 'ramp', position: [-15, 0.5, 15], size: [2, 1, 3], color: '#4a4a6a' },
      
      // Passerelles supplémentaires
      { type: 'wall', position: [10, 0.5, 10], size: [6, 0.3, 1.5], color: '#4a4a6a' },
      { type: 'wall', position: [-10, 0.5, -10], size: [6, 0.3, 1.5], color: '#4a4a6a' },
      { type: 'wall', position: [10, 0.5, -10], size: [1.5, 0.3, 6], color: '#4a4a6a' },
      { type: 'wall', position: [-10, 0.5, 10], size: [1.5, 0.3, 6], color: '#4a4a6a' },
    ],
    resources: [
      { type: 'gold', count: 10 },
      { type: 'gem', count: 18 },
      { type: 'stone', count: 12 },
    ],
    difficulty: 'difficile',
    players: '2-9',
  },
];

export const getMapById = (id: string): MapData | undefined => {
  return MAPS.find(m => m.id === id);
};
