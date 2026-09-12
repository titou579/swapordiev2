import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface PowerUp {
  id: string;
  type: 'speed' | 'damage' | 'shield' | 'heal' | 'jump';
  position: [number, number, number];
  collected: boolean;
  duration: number;
}

interface PowerUpMeshProps {
  powerUp: PowerUp;
  onCollect: () => void;
  playerPosition: [number, number, number];
}

const powerUpColors: Record<string, string> = {
  speed: '#00ff00',
  damage: '#ff0000',
  shield: '#0088ff',
  heal: '#ff88ff',
  jump: '#ffff00',
};

const powerUpEmojis: Record<string, string> = {
  speed: '⚡',
  damage: '💥',
  shield: '🛡️',
  heal: '💖',
  jump: '🦘',
};

export default function PowerUpMesh({ powerUp, onCollect, playerPosition }: PowerUpMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const collectedRef = useRef(false);

  useFrame((state) => {
    if (meshRef.current && !powerUp.collected) {
      // Floating animation
      meshRef.current.position.y = powerUp.position[1] + Math.sin(state.clock.elapsedTime * 4 + powerUp.position[0]) * 0.3 + 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 3;
      meshRef.current.rotation.x = state.clock.elapsedTime * 1.5;
      
      // Scale pulse
      const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.15;
      meshRef.current.scale.setScalar(scale);
    }
    
    if (glowRef.current && !powerUp.collected) {
      glowRef.current.position.y = powerUp.position[1] + Math.sin(state.clock.elapsedTime * 4 + powerUp.position[0]) * 0.3 + 0.5;
      const glowScale = 2 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  useEffect(() => {
    if (!powerUp.collected && !collectedRef.current) {
      const dx = playerPosition[0] - powerUp.position[0];
      const dz = playerPosition[2] - powerUp.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist < 2) {
        collectedRef.current = true;
        onCollect();
      }
    }
  }, [playerPosition, powerUp.collected]);

  if (powerUp.collected) return null;

  const color = powerUpColors[powerUp.type];

  return (
    <group>
      {/* Glow effect */}
      <mesh ref={glowRef} position={[powerUp.position[0], powerUp.position[1] + 0.5, powerUp.position[2]]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Main power-up */}
      <mesh ref={meshRef} position={[powerUp.position[0], powerUp.position[1], powerUp.position[2]]} castShadow>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Enhanced lighting */}
      <pointLight
        position={[powerUp.position[0], powerUp.position[1] + 0.5, powerUp.position[2]]}
        color={color}
        intensity={3}
        distance={4}
      />
      
      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[powerUp.position[0], 0.02, powerUp.position[2]]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export { powerUpEmojis };
