import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CharacterProps {
  position: [number, number, number];
  skinColor?: string;
  outfitColor?: string;
  hairColor?: string;
  name?: string;
  isLocal?: boolean;
  health?: number;
  maxHealth?: number;
  skin?: string;
  isMoving?: boolean;
}

export default function Character({
  position,
  skinColor = '#ffdbac',
  outfitColor = '#4a90e2',
  hairColor = '#3d2314',
  name,
  isLocal = false,
  health = 100,
  maxHealth = 100,
  skin,
  isMoving = false,
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];
      // Bobbing animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }

    // Walking animation
    if (isMoving) {
      const swing = Math.sin(state.clock.elapsedTime * 8) * 0.5;
      if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing;
    } else {
      // Idle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      if (leftArmRef.current) leftArmRef.current.rotation.x = breathe;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -breathe;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }
  });

  const healthPercent = health / maxHealth;
  const healthColor = healthPercent > 0.6 ? '#22c55e' : healthPercent > 0.3 ? '#eab308' : '#ef4444';

  return (
    <group ref={groupRef} position={position}>
      {/* Character glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshBasicMaterial
          color={isLocal ? '#00ff88' : '#ff4444'}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Point light for character */}
      <pointLight
        position={[0, 1.5, 0]}
        color={isLocal ? '#00ff88' : '#ff6666'}
        intensity={isLocal ? 2 : 1}
        distance={4}
      />

      {/* === BODY === */}
      {/* Torso */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.3]} />
        <meshStandardMaterial
          color={outfitColor}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Belt */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[0.52, 0.08, 0.32]} />
        <meshStandardMaterial color="#2c1810" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* === HEAD === */}
      <group position={[0, 1.65, 0]}>
        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.1, -0.02]} castShadow>
          <sphereGeometry args={[0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.08, 0.02, 0.18]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.08, 0.02, 0.18]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Pupils */}
        <mesh position={[-0.08, 0.02, 0.2]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.08, 0.02, 0.2]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>

        {/* Skin emoji overlay */}
        {skin && (
          <mesh position={[0, 0.35, 0]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}
      </group>

      {/* === ARMS === */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.35, 1.3, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
          <meshStandardMaterial color={outfitColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.35, 1.3, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
          <meshStandardMaterial color={outfitColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
      </group>

      {/* === LEGS === */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.12, 0.75, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.5, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.2]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.12, 0.75, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.5, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.2]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
      </group>

      {/* === NAME TAG & HEALTH BAR === */}
      <group position={[0, 2.2, 0]}>
        {/* Skin emoji */}
        {skin && (
          <mesh position={[0, 0.3, 0]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}

        {/* Health bar background */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1, 0.1]} />
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
        </mesh>
        {/* Health bar fill */}
        <mesh position={[(healthPercent - 1) * 0.5, 0, 0.01]}>
          <planeGeometry args={[healthPercent, 0.1]} />
          <meshBasicMaterial color={healthColor} />
        </mesh>

        {/* Name */}
        {name && (
          <mesh position={[0, 0.2, 0]}>
            <planeGeometry args={[1.2, 0.2]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}
      </group>
    </group>
  );
}
