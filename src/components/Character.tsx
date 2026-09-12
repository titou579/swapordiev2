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
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];
      // Bobbing animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }

    // Head subtle movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Walking animation
    if (isMoving) {
      const swing = Math.sin(state.clock.elapsedTime * 8) * 0.6;
      const armSwing = Math.sin(state.clock.elapsedTime * 8) * 0.4;
      if (leftArmRef.current) leftArmRef.current.rotation.x = armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -armSwing;
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
      {/* Character glow ring - animated */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.6, 0.8, 32]} />
        <meshBasicMaterial
          color={isLocal ? '#00ff88' : '#ff4444'}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Point light for character */}
      <pointLight
        position={[0, 1.5, 0]}
        color={isLocal ? '#00ff88' : '#ff6666'}
        intensity={isLocal ? 2.5 : 1.2}
        distance={5}
      />

      {/* === BODY === */}
      {/* Torso - more detailed */}
      <group position={[0, 1.1, 0]}>
        {/* Main torso */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.65, 0.35]} />
          <meshStandardMaterial
            color={outfitColor}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
        {/* Chest detail */}
        <mesh position={[0, 0.1, 0.18]} castShadow>
          <boxGeometry args={[0.4, 0.3, 0.05]} />
          <meshStandardMaterial
            color={outfitColor}
            metalness={0.5}
            roughness={0.5}
            emissive={outfitColor}
            emissiveIntensity={0.1}
          />
        </mesh>
        {/* Collar */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.18, 0.08, 8]} />
          <meshStandardMaterial color={outfitColor} metalness={0.3} roughness={0.7} />
        </mesh>
      </group>

      {/* Belt with buckle */}
      <group position={[0, 0.82, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.57, 0.1, 0.37]} />
          <meshStandardMaterial color="#2c1810" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Belt buckle */}
        <mesh position={[0, 0, 0.19]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* === HEAD === */}
      <group ref={headRef} position={[0, 1.7, 0]}>
        {/* Head - more detailed */}
        <mesh castShadow>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} metalness={0.1} />
        </mesh>

        {/* Hair - more complex */}
        <mesh position={[0, 0.12, -0.03]} castShadow>
          <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        {/* Hair sides */}
        <mesh position={[-0.2, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>

        {/* Eyes - more detailed */}
        <group position={[-0.09, 0.02, 0.2]}>
          {/* Eye white */}
          <mesh>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Iris */}
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#4a90e2" />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.03]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
        <group position={[0.09, 0.02, 0.2]}>
          <mesh>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#4a90e2" />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>

        {/* Nose */}
        <mesh position={[0, -0.02, 0.22]} castShadow>
          <coneGeometry args={[0.02, 0.04, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>

        {/* Mouth */}
        <mesh position={[0, -0.08, 0.2]} castShadow>
          <boxGeometry args={[0.06, 0.015, 0.01]} />
          <meshStandardMaterial color="#cc6666" roughness={0.9} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.22, 0, 0]} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.22, 0, 0]} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
      </group>

      {/* === ARMS === */}
      {/* Left Arm - more detailed */}
      <group ref={leftArmRef} position={[-0.38, 1.35, 0]}>
        {/* Shoulder */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={outfitColor} roughness={0.6} />
        </mesh>
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.2, 6, 12]} />
          <meshStandardMaterial color={outfitColor} roughness={0.6} />
        </mesh>
        {/* Elbow */}
        <mesh position={[0, -0.28, 0]} castShadow>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color={outfitColor} roughness={0.6} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.18, 6, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.55, 0]} castShadow>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Fingers */}
        <mesh position={[-0.03, -0.6, 0.02]} castShadow>
          <capsuleGeometry args={[0.015, 0.04, 4, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, 0.02]} castShadow>
          <capsuleGeometry args={[0.015, 0.04, 4, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.03, -0.6, 0.02]} castShadow>
          <capsuleGeometry args={[0.015, 0.04, 4, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* Right Arm - more detailed */}
      <group ref={rightArmRef} position={[0.38, 1.35, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={outfitColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.2, 6, 12]} />
          <meshStandardMaterial color={outfitColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.28, 0]} castShadow>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color={outfitColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.18, 6, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.55, 0]} castShadow>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        <mesh position={[-0.03, -0.6, 0.02]} castShadow>
          <capsuleGeometry args={[0.015, 0.04, 4, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, 0.02]} castShadow>
          <capsuleGeometry args={[0.015, 0.04, 4, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.03, -0.6, 0.02]} castShadow>
          <capsuleGeometry args={[0.015, 0.04, 4, 6]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* === LEGS === */}
      {/* Left Leg - more detailed */}
      <group ref={leftLegRef} position={[-0.13, 0.78, 0]}>
        {/* Hip joint */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        {/* Upper leg */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.25, 6, 12]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.35, 0]} castShadow>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.25, 6, 12]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        {/* Ankle */}
        <mesh position={[0, -0.65, 0]} castShadow>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
        {/* Shoe - more detailed */}
        <group position={[0, -0.72, 0.03]}>
          <mesh castShadow>
            <boxGeometry args={[0.13, 0.09, 0.22]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Shoe sole */}
          <mesh position={[0, -0.04, 0]} castShadow>
            <boxGeometry args={[0.14, 0.02, 0.23]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Right Leg - more detailed */}
      <group ref={rightLegRef} position={[0.13, 0.78, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.25, 6, 12]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.35, 0]} castShadow>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.5, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.25, 6, 12]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.65, 0]} castShadow>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
        <group position={[0, -0.72, 0.03]}>
          <mesh castShadow>
            <boxGeometry args={[0.13, 0.09, 0.22]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0, -0.04, 0]} castShadow>
            <boxGeometry args={[0.14, 0.02, 0.23]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>
        </group>
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
