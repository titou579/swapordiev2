import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MapData, MapStructure } from '../data/maps';

interface MapRendererProps {
  map: MapData;
}

function StructureMesh({ structure }: { structure: MapStructure }) {
  const meshRef = useRef<THREE.Mesh>(null);

  switch (structure.type) {
    case 'building':
      return (
        <mesh
          ref={meshRef}
          position={structure.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={structure.size || [2, 2, 2]} />
          <meshStandardMaterial
            color={structure.color || '#666'}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      );

    case 'tower':
      return (
        <group position={structure.position}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[
              (structure.size?.[0] || 1) * 0.5,
              (structure.size?.[0] || 1) * 0.6,
              structure.size?.[1] || 4,
              8
            ]} />
            <meshStandardMaterial
              color={structure.color || '#888'}
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
        </group>
      );

    case 'wall':
      return (
        <mesh
          position={structure.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={structure.size || [4, 2, 0.3]} />
          <meshStandardMaterial
            color={structure.color || '#888'}
            metalness={0.3}
            roughness={0.7}
            emissive={structure.color || '#000'}
            emissiveIntensity={0.1}
          />
        </mesh>
      );

    case 'ramp':
      return (
        <mesh
          position={structure.position}
          rotation={[0.3, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={structure.size || [3, 0.3, 4]} />
          <meshStandardMaterial
            color={structure.color || '#555'}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      );

    case 'platform':
      return (
        <mesh
          position={structure.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={structure.size || [3, 0.3, 3]} />
          <meshStandardMaterial
            color={structure.color || '#444'}
            metalness={0.6}
            roughness={0.4}
            emissive={structure.color || '#000'}
            emissiveIntensity={0.15}
          />
        </mesh>
      );

    case 'tree':
      return (
        <group position={structure.position}>
          {/* Trunk */}
          <mesh position={[0, -(structure.size?.[1] || 4) * 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, (structure.size?.[1] || 4) * 0.6, 8]} />
            <meshStandardMaterial color="#4a3520" roughness={0.9} />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, (structure.size?.[1] || 4) * 0.2, 0]} castShadow>
            <sphereGeometry args={[(structure.size?.[0] || 1) * 1.2, 8, 8]} />
            <meshStandardMaterial
              color={structure.color || '#2d5a27'}
              roughness={0.9}
            />
          </mesh>
        </group>
      );

    case 'rock':
      return (
        <mesh
          position={structure.position}
          castShadow
          receiveShadow
          rotation={[Math.random() * 0.3, Math.random() * Math.PI, 0]}
        >
          <dodecahedronGeometry args={[(structure.size?.[0] || 2) * 0.5]} />
          <meshStandardMaterial
            color={structure.color || '#666'}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      );

    case 'crystal':
      return (
        <group position={structure.position}>
          <mesh castShadow>
            <octahedronGeometry args={[(structure.size?.[0] || 1) * 0.5]} />
            <meshStandardMaterial
              color={structure.color || '#00ffff'}
              emissive={structure.color || '#008888'}
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.8}
            />
          </mesh>
          <pointLight
            color={structure.color || '#00ffff'}
            intensity={3}
            distance={6}
          />
        </group>
      );

    case 'crate':
      return (
        <mesh
          position={structure.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={structure.size || [0.8, 0.8, 0.8]} />
          <meshStandardMaterial
            color={structure.color || '#8b6914'}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      );

    default:
      return null;
  }
}

export default function MapRenderer({ map }: MapRendererProps) {
  return (
    <group>
      {map.structures.map((structure, index) => (
        <StructureMesh key={index} structure={structure} />
      ))}
    </group>
  );
}
