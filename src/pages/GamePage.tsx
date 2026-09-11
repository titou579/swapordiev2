import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore, actions, Player, Resource, Trap as TrapType } from '../store/gameStore';
import { getMapById } from '../data/maps';
import Character from '../components/Character';
import MapRenderer from '../components/MapRenderer';
import { motion, AnimatePresence } from 'framer-motion';

// Ground Component
function Ground({ color }: { color: string }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.7}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>
      <gridHelper args={[60, 30, '#6b21a8', '#3b0764']} position={[0, 0.02, 0]} />
    </group>
  );
}

// Boundary walls with glow
function Boundaries() {
  return (
    <group>
      {[
        { pos: [0, 2, -30] as [number, number, number], size: [60, 4, 0.3] as [number, number, number] },
        { pos: [0, 2, 30] as [number, number, number], size: [60, 4, 0.3] as [number, number, number] },
        { pos: [-30, 2, 0] as [number, number, number], size: [0.3, 4, 60] as [number, number, number] },
        { pos: [30, 2, 0] as [number, number, number], size: [0.3, 4, 60] as [number, number, number] },
      ].map((wall, i) => (
        <group key={i}>
          <mesh position={wall.pos}>
            <boxGeometry args={wall.size} />
            <meshStandardMaterial 
              color="#4c1d95" 
              transparent 
              opacity={0.6} 
              metalness={0.7} 
              roughness={0.3}
              emissive="#7c3aed"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[wall.pos[0], 0.1, wall.pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[wall.size[0] || wall.size[2], 1]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Resource 3D Component
function ResourceMesh({ resource, onCollect }: { resource: Resource; onCollect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const localPlayer = useGameStore(s => s.localPlayer);
  const collectedRef = useRef(false);

  useFrame((state) => {
    if (meshRef.current && !resource.collected) {
      meshRef.current.position.y = resource.position[1] + Math.sin(state.clock.elapsedTime * 3 + resource.position[0]) * 0.25 + 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
    }
  });

  useEffect(() => {
    if (!localPlayer || resource.collected || collectedRef.current) return;
    const dx = localPlayer.position[0] - resource.position[0];
    const dz = localPlayer.position[2] - resource.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 1.8) {
      collectedRef.current = true;
      onCollect();
    }
  }, [localPlayer?.position, resource.collected]);

  if (resource.collected) return null;

  const colors: Record<string, string> = {
    gold: '#ffd700',
    wood: '#8b4513',
    stone: '#a0a0a0',
    gem: '#00ffff',
  };

  const emissiveColors: Record<string, string> = {
    gold: '#aa8800',
    wood: '#442200',
    stone: '#555555',
    gem: '#008888',
  };

  return (
    <group>
      <mesh ref={meshRef} position={[resource.position[0], resource.position[1], resource.position[2]]} castShadow>
        <octahedronGeometry args={[0.25]} />
        <meshStandardMaterial
          color={colors[resource.type]}
          emissive={emissiveColors[resource.type]}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <pointLight
        position={[resource.position[0], resource.position[1] + 0.5, resource.position[2]]}
        color={colors[resource.type]}
        intensity={1}
        distance={2}
      />
    </group>
  );
}

// Trap 3D Component
function TrapMesh({ trap }: { trap: TrapType }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 4;
      meshRef.current.position.y = 0.4 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    }
  });

  if (!trap.isActive) return null;

  return (
    <group position={[trap.position[0], 0, trap.position[2]]}>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.5, 0.08, 8, 24]} />
        <meshStandardMaterial
          color="#ff0066"
          emissive="#ff0033"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.7, 1.0, 32]} />
        <meshBasicMaterial color="#ff0066" transparent opacity={0.15} />
      </mesh>
      <pointLight color="#ff0066" intensity={4} distance={4} />
    </group>
  );
}

// Floating particles
function Particles({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
        if (posArray[i * 3 + 1] > 10) posArray[i * 3 + 1] = 0;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color={color} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();
  const localPlayer = useGameStore(s => s.localPlayer);

  useFrame(() => {
    if (localPlayer) {
      const targetX = localPlayer.position[0];
      const targetZ = localPlayer.position[2];
      
      // Vue 3ème personne rapprochée style Fortnite
      // Caméra à 5 unités derrière et 3.5 unités au-dessus du joueur
      camera.position.x += (targetX - camera.position.x) * 0.08;
      camera.position.z += (targetZ + 5 - camera.position.z) * 0.08;
      camera.position.y += (3.5 - camera.position.y) * 0.08;
      
      // Regarder légèrement au-dessus du joueur (au niveau de la tête)
      camera.lookAt(targetX, 1.5, targetZ);
    }
  });

  return null;
}

// Bot AI movement
function BotAI() {
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPlayers = useGameStore(s => s.players);
      currentPlayers.forEach((player: Player) => {
        if (player.id === 'local' || !player.isAlive || !player.isBot) return;
        const dx = (Math.random() - 0.5) * 3;
        const dz = (Math.random() - 0.5) * 3;
        const newX = Math.max(-28, Math.min(28, player.position[0] + dx));
        const newZ = Math.max(-28, Math.min(28, player.position[2] + dz));
        actions.moveBot(player.id, [newX, 0.5, newZ]);
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return null;
}

// Game Scene
function GameScene() {
  const players = useGameStore(s => s.players);
  const resources = useGameStore(s => s.resources);
  const traps = useGameStore(s => s.traps);
  const selectedMap = useGameStore(s => s.selectedMap);
  const localPlayer = useGameStore(s => s.localPlayer);

  const mapData = selectedMap ? getMapById(selectedMap) : getMapById('neon-city');
  if (!mapData) return null;

  return (
    <>
      {/* Éclairage amélioré pour mieux voir les structures */}
      <ambientLight intensity={Math.max(0.5, mapData.theme.ambientLight + 0.3)} />
      <directionalLight
        position={[15, 25, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <directionalLight
        position={[-10, 15, -10]}
        intensity={0.4}
        color="#ffffff"
      />
      <pointLight position={[0, 8, 0]} intensity={1} color="#7c3aed" distance={40} />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#ffffff" distance={20} />
      <hemisphereLight args={[mapData.theme.skyColor, mapData.theme.groundColor, 0.5]} />

      <fog attach="fog" args={[mapData.theme.fogColor, mapData.theme.fogNear, mapData.theme.fogFar]} />

      <Ground color={mapData.theme.groundColor} />
      <MapRenderer map={mapData} />
      <Boundaries />
      <Particles color={mapData.id === 'frozen-tundra' ? '#ffffff' : '#a855f7'} />

      {/* Players as humanoid characters */}
      {players.map((player: Player) => (
        player.isAlive && (
          <group key={player.id}>
            <Character
              position={player.position}
              skinColor={player.skinColor || '#ffdbac'}
              outfitColor={player.outfitColor || (player.id === 'local' ? '#00cc66' : '#e74c3c')}
              hairColor={player.hairColor || '#3d2314'}
              name={player.name}
              isLocal={player.id === 'local'}
              health={player.health}
              maxHealth={player.maxHealth}
              skin={player.skin}
              isMoving={player.id === 'local' ? true : player.isBot}
            />
            {/* Name tag using Text */}
            <Text
              position={[player.position[0], 2.5, player.position[2]]}
              fontSize={0.2}
              color={player.id === 'local' ? '#00ff88' : '#ff6666'}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {player.name}
            </Text>
          </group>
        )
      ))}

      {resources.map((resource: Resource) => (
        <ResourceMesh
          key={resource.id}
          resource={resource}
          onCollect={() => actions.collectResource(resource.id)}
        />
      ))}

      {traps.map((trap: TrapType) => (
        <TrapMesh key={trap.id} trap={trap} />
      ))}

      <CameraController />
      <BotAI />
    </>
  );
}

// Mobile Controls
function MobileControls() {
  const handleMove = (dx: number, dz: number) => {
    const currentLocal = useGameStore(s => s.localPlayer);
    if (!currentLocal) return;
    const [x, y, z] = currentLocal.position;
    const newX = Math.max(-28, Math.min(28, x + dx));
    const newZ = Math.max(-28, Math.min(28, z + dz));
    actions.movePlayer([newX, y, newZ]);
  };

  return (
    <div className="grid grid-cols-3 gap-1 w-32 h-32">
      <div></div>
      <button
        onTouchStart={() => handleMove(0, -1)}
        className="bg-gray-800/80 rounded-xl flex items-center justify-center text-white text-xl active:bg-purple-600/80 border border-gray-600/50"
      >
        ↑
      </button>
      <div></div>
      <button
        onTouchStart={() => handleMove(-1, 0)}
        className="bg-gray-800/80 rounded-xl flex items-center justify-center text-white text-xl active:bg-purple-600/80 border border-gray-600/50"
      >
        ←
      </button>
      <div className="bg-gray-900/50 rounded-xl border border-gray-700/30"></div>
      <button
        onTouchStart={() => handleMove(1, 0)}
        className="bg-gray-800/80 rounded-xl flex items-center justify-center text-white text-xl active:bg-purple-600/80 border border-gray-600/50"
      >
        →
      </button>
      <div></div>
      <button
        onTouchStart={() => handleMove(0, 1)}
        className="bg-gray-800/80 rounded-xl flex items-center justify-center text-white text-xl active:bg-purple-600/80 border border-gray-600/50"
      >
        ↓
      </button>
      <div></div>
    </div>
  );
}

// HUD Component
function GameHUD() {
  const localPlayer = useGameStore(s => s.localPlayer);
  const swapTimer = useGameStore(s => s.swapTimer);
  const gameStatus = useGameStore(s => s.gameStatus);
  const roundNumber = useGameStore(s => s.roundNumber);
  const killFeed = useGameStore(s => s.killFeed);
  const players = useGameStore(s => s.players);
  const selectedMap = useGameStore(s => s.selectedMap);
  const [showInventory, setShowInventory] = useState(false);
  const [placingTrap, setPlacingTrap] = useState(false);

  const aliveCount = players.filter(p => p.isAlive).length;
  const mapData = selectedMap ? getMapById(selectedMap) : null;

  // Swap timer
  useEffect(() => {
    const interval = setInterval(() => {
      actions.updateSwapTimer(1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e') setPlacingTrap(p => !p);
      if (e.key.toLowerCase() === 'i') setShowInventory(p => !p);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    const moveInterval = setInterval(() => {
      const currentLocal = useGameStore(s => s.localPlayer);
      const currentStatus = useGameStore(s => s.gameStatus);
      if (!currentLocal || currentStatus !== 'playing') return;
      let [x, y, z] = currentLocal.position;
      const speed = 0.25;
      if (keys['z'] || keys['w'] || keys['arrowup']) z -= speed;
      if (keys['s'] || keys['arrowdown']) z += speed;
      if (keys['q'] || keys['a'] || keys['arrowleft']) x -= speed;
      if (keys['d'] || keys['arrowright']) x += speed;
      x = Math.max(-28, Math.min(28, x));
      z = Math.max(-28, Math.min(28, z));
      if (keys['z'] || keys['w'] || keys['s'] || keys['q'] || keys['a'] || keys['d'] || keys['arrowup'] || keys['arrowdown'] || keys['arrowleft'] || keys['arrowright']) {
        actions.movePlayer([x, y, z]);
      }
    }, 16);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveInterval);
    };
  }, []);

  const handlePlaceTrap = () => {
    const currentLocal = useGameStore(s => s.localPlayer);
    if (currentLocal && placingTrap) {
      actions.placeTrap({
        type: 'spike',
        position: [currentLocal.position[0], 0, currentLocal.position[2]],
        damage: 25,
        ownerId: 'local',
      });
      setPlacingTrap(false);
    }
  };

  const timerPercent = (swapTimer / 90) * 100;
  const timerColor = swapTimer <= 10 ? 'text-red-400' : swapTimer <= 30 ? 'text-yellow-400' : 'text-emerald-400';
  const timerBarColor = swapTimer <= 10 ? 'from-red-500 to-red-600' : swapTimer <= 30 ? 'from-yellow-500 to-orange-500' : 'from-emerald-500 to-green-500';

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
        <motion.div
          className={`h-full bg-gradient-to-r ${timerBarColor}`}
          style={{ width: `${timerPercent}%` }}
          animate={swapTimer <= 10 ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.5, repeat: swapTimer <= 10 ? Infinity : 0 }}
        />
      </div>

      {/* Map name */}
      {mapData && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className="text-gray-400 text-xs bg-gray-900/60 px-3 py-1 rounded-full backdrop-blur-sm">
            {mapData.emoji} {mapData.name}
          </span>
        </div>
      )}

      {/* Top HUD */}
      <div className="absolute top-8 left-4 right-4 flex justify-between items-start">
        {/* Player Stats */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 border border-gray-700/50 pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-2xl shadow-lg shadow-green-500/20">
              {localPlayer?.skin}
            </div>
            <div>
              <p className="text-white font-bold">{localPlayer?.name}</p>
              <div className="flex gap-3 text-xs mt-0.5">
                <span className="text-yellow-400 font-medium">💰 {localPlayer?.gold}</span>
                <span className="text-blue-400 font-medium">💎 {localPlayer?.gems}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 w-44">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">HP</span>
              <span className="text-white font-medium">{localPlayer?.health}/{localPlayer?.maxHealth}</span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                animate={{ width: `${localPlayer?.health || 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Swap Timer */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 border border-gray-700/50 text-center min-w-[140px]"
        >
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Prochain Swap</p>
          <motion.p
            className={`text-4xl font-black ${timerColor}`}
            animate={swapTimer <= 10 ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.5, repeat: swapTimer <= 10 ? Infinity : 0 }}
          >
            {Math.ceil(swapTimer)}
          </motion.p>
          <p className="text-gray-500 text-[10px] mt-1">Round {roundNumber}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xs text-gray-400">👥</span>
            <span className="text-xs text-white font-medium">{aliveCount} en vie</span>
          </div>
        </motion.div>

        {/* Kill Feed */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-3 border border-gray-700/50 w-52"
        >
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2 font-bold">⚔️ Kill Feed</p>
          <AnimatePresence>
            {killFeed.slice(0, 5).map((kill) => (
              <motion.div
                key={kill.time}
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs mb-1.5 py-1 px-2 bg-gray-800/50 rounded-lg"
              >
                <span className="text-red-400 font-medium">{kill.killer}</span>
                <span className="text-gray-500 mx-1">→</span>
                <span className="text-yellow-400 font-medium">{kill.victim}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {killFeed.length === 0 && <p className="text-gray-600 text-xs italic">Aucun kill...</p>}
        </motion.div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        {/* Mobile controls */}
        <div className="md:hidden pointer-events-auto">
          <MobileControls />
        </div>

        {/* Controls hint (desktop) */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden md:block bg-gray-900/70 backdrop-blur-md rounded-xl p-3 border border-gray-700/50"
        >
          <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1.5">Contrôles</p>
          <div className="space-y-0.5">
            <p className="text-gray-300 text-[11px]"><kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">ZQSD</kbd> Déplacer</p>
            <p className="text-gray-300 text-[11px]"><kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">E</kbd> Poser piège</p>
            <p className="text-gray-300 text-[11px]"><kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">I</kbd> Inventaire</p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 pointer-events-auto"
        >
          <button
            onClick={handlePlaceTrap}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              placingTrap
                ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/30 animate-pulse'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-600/50 hover:border-red-500/50'
            }`}
          >
            ⚔️ Piège {placingTrap ? '(cliquez!)' : '(E)'}
          </button>
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 rounded-xl text-gray-300 font-bold text-sm transition-all"
          >
            🎒 Sac
          </button>
          <button
            onClick={() => actions.endGame()}
            className="px-4 py-2.5 bg-red-900/40 hover:bg-red-800/50 border border-red-700/40 rounded-xl text-red-300 font-bold text-sm transition-all"
          >
            🚪 Quitter
          </button>
        </motion.div>
      </div>

      {/* Swap Warning */}
      <AnimatePresence>
        {gameStatus === 'swapping' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              className="bg-gray-900/95 rounded-3xl p-10 border-2 border-purple-500 shadow-2xl shadow-purple-500/30"
            >
              <motion.p
                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🔄 SWAP ! 🔄
              </motion.p>
              <p className="text-gray-400 text-center mt-3 text-lg">Les positions sont échangées...</p>
              <p className="text-purple-400 text-center mt-1 text-sm">Gardez votre stuff et vos PV !</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Modal */}
      <AnimatePresence>
        {showInventory && localPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => setShowInventory(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 border border-gray-700 max-w-lg w-full mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🎒 Inventaire
                <button onClick={() => setShowInventory(false)} className="ml-auto text-gray-400 hover:text-white">✕</button>
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {localPlayer.inventory.map(item => (
                  <div key={item.id} className="bg-gray-800/80 rounded-xl p-3 text-center border border-gray-700/50 hover:border-purple-500/50 transition-all">
                    <p className="text-3xl mb-1">{item.type === 'weapon' ? '⚔️' : item.type === 'trap' ? '⚙️' : '📦'}</p>
                    <p className="text-xs text-gray-300 font-medium">{item.name}</p>
                    <p className="text-[10px] text-gray-500">x{item.quantity}</p>
                  </div>
                ))}
                {localPlayer.inventory.length === 0 && (
                  <p className="col-span-4 text-gray-500 text-center py-4">Inventaire vide</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-800/80 rounded-xl p-3 text-center border border-yellow-500/20">
                  <p className="text-yellow-400 font-bold text-lg">{localPlayer.gold}</p>
                  <p className="text-[10px] text-gray-400">Or 💰</p>
                </div>
                <div className="bg-gray-800/80 rounded-xl p-3 text-center border border-blue-500/20">
                  <p className="text-blue-400 font-bold text-lg">{localPlayer.gems}</p>
                  <p className="text-[10px] text-gray-400">Gemmes 💎</p>
                </div>
                <div className="bg-gray-800/80 rounded-xl p-3 text-center border border-purple-500/20">
                  <p className="text-purple-400 font-bold text-lg">{localPlayer.tokens}</p>
                  <p className="text-[10px] text-gray-400">Tokens 🎟️</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Game Page
export default function GamePage() {
  const gameStatus = useGameStore(s => s.gameStatus);
  const localPlayer = useGameStore(s => s.localPlayer);
  const selectedMap = useGameStore(s => s.selectedMap);
  const mapData = selectedMap ? getMapById(selectedMap) : getMapById('neon-city');

  useEffect(() => {
    if (localPlayer && !localPlayer.isAlive && gameStatus === 'playing') {
      setTimeout(() => actions.endGame(), 3000);
    }
  }, [localPlayer?.isAlive, gameStatus]);

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 4, 6], fov: 70 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(mapData?.theme.fogColor || '#050010');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <GameScene />
      </Canvas>
      <GameHUD />

      {/* Death overlay */}
      <AnimatePresence>
        {localPlayer && !localPlayer.isAlive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-900/60 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.p
                className="text-7xl font-black text-white"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                💀
              </motion.p>
              <motion.p
                className="text-3xl font-black text-white mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ÉLIMINÉ
              </motion.p>
              <p className="text-gray-300 mt-2">Retour au menu...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
