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
      const [width, height, depth] = structure.size || [2, 2, 2];
      return (
        <group position={structure.position}>
          {/* Main building body */}
          <mesh ref={meshRef} castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={structure.color || '#666'}
              metalness={0.3}
              roughness={0.7}
              emissive={structure.color || '#333'}
              emissiveIntensity={0.15}
            />
          </mesh>
          
          {/* Roof */}
          <mesh position={[0, height / 2 + 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.2, 0.3, depth + 0.2]} />
            <meshStandardMaterial
              color="#2a2a2a"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
          
          {/* Windows - front */}
          {height > 2 && Array.from({ length: Math.floor(height / 1.5) }).map((_, i) => (
            <group key={`window-front-${i}`}>
              <mesh position={[-width / 4, -height / 4 + i * 1.5, depth / 2 + 0.01]} castShadow>
                <boxGeometry args={[0.4, 0.5, 0.05]} />
                <meshStandardMaterial
                  color="#4a90e2"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#4a90e2"
                  emissiveIntensity={0.3}
                />
              </mesh>
              <mesh position={[width / 4, -height / 4 + i * 1.5, depth / 2 + 0.01]} castShadow>
                <boxGeometry args={[0.4, 0.5, 0.05]} />
                <meshStandardMaterial
                  color="#4a90e2"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#4a90e2"
                  emissiveIntensity={0.3}
                />
              </mesh>
            </group>
          ))}
          
          {/* Windows - back */}
          {height > 2 && Array.from({ length: Math.floor(height / 1.5) }).map((_, i) => (
            <group key={`window-back-${i}`}>
              <mesh position={[-width / 4, -height / 4 + i * 1.5, -depth / 2 - 0.01]} castShadow>
                <boxGeometry args={[0.4, 0.5, 0.05]} />
                <meshStandardMaterial
                  color="#4a90e2"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#4a90e2"
                  emissiveIntensity={0.3}
                />
              </mesh>
              <mesh position={[width / 4, -height / 4 + i * 1.5, -depth / 2 - 0.01]} castShadow>
                <boxGeometry args={[0.4, 0.5, 0.05]} />
                <meshStandardMaterial
                  color="#4a90e2"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#4a90e2"
                  emissiveIntensity={0.3}
                />
              </mesh>
            </group>
          ))}
          
          {/* Door - front */}
          <mesh position={[0, -height / 2 + 0.5, depth / 2 + 0.01]} castShadow>
            <boxGeometry args={[0.6, 1, 0.05]} />
            <meshStandardMaterial
              color="#3d2314"
              metalness={0.3}
              roughness={0.8}
            />
          </mesh>
          {/* Door handle */}
          <mesh position={[0.2, -height / 2 + 0.5, depth / 2 + 0.06]} castShadow>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#ffd700"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Base/foundation */}
          <mesh position={[0, -height / 2 - 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.3, 0.2, depth + 0.3]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
        </group>
      );

    case 'tower':
      const towerHeight = structure.size?.[1] || 4;
      const towerRadius = (structure.size?.[0] || 1) * 0.5;
      return (
        <group position={structure.position}>
          {/* Main tower body */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[towerRadius * 0.9, towerRadius, towerHeight, 12]} />
            <meshStandardMaterial
              color={structure.color || '#888'}
              metalness={0.4}
              roughness={0.6}
              emissive={structure.color || '#444'}
              emissiveIntensity={0.15}
            />
          </mesh>
          
          {/* Tower top/battlement */}
          <mesh position={[0, towerHeight / 2 + 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[towerRadius * 1.1, towerRadius * 0.9, 0.4, 12]} />
            <meshStandardMaterial
              color={structure.color || '#888'}
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
          
          {/* Tower base */}
          <mesh position={[0, -towerHeight / 2 - 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[towerRadius * 1.2, towerRadius * 1.3, 0.3, 12]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
          
          {/* Windows around tower */}
          {towerHeight > 3 && Array.from({ length: 4 }).map((_, i) => {
            const angle = (i / 4) * Math.PI * 2;
            const x = Math.cos(angle) * towerRadius * 0.95;
            const z = Math.sin(angle) * towerRadius * 0.95;
            return (
              <mesh
                key={`tower-window-${i}`}
                position={[x, 0, z]}
                rotation={[0, -angle, 0]}
                castShadow
              >
                <boxGeometry args={[0.3, 0.4, 0.05]} />
                <meshStandardMaterial
                  color="#4a90e2"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#4a90e2"
                  emissiveIntensity={0.3}
                />
              </mesh>
            );
          })}
        </group>
      );

    case 'wall':
      const [wallWidth, wallHeight, wallDepth] = structure.size || [4, 2, 0.3];
      return (
        <group position={structure.position}>
          {/* Main wall body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[wallWidth, wallHeight, wallDepth]} />
            <meshStandardMaterial
              color={structure.color || '#888'}
              metalness={0.3}
              roughness={0.7}
              emissive={structure.color || '#000'}
              emissiveIntensity={0.15}
            />
          </mesh>
          
          {/* Wall top cap */}
          <mesh position={[0, wallHeight / 2 + 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[wallWidth + 0.1, 0.1, wallDepth + 0.1]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
          
          {/* Wall base */}
          <mesh position={[0, -wallHeight / 2 - 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[wallWidth + 0.1, 0.1, wallDepth + 0.1]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
          
          {/* Brick/panel details - horizontal lines */}
          {wallHeight > 1 && Array.from({ length: Math.floor(wallHeight / 0.5) }).map((_, i) => (
            <mesh
              key={`wall-line-${i}`}
              position={[0, -wallHeight / 2 + 0.5 + i * 0.5, wallDepth / 2 + 0.01]}
              castShadow
            >
              <boxGeometry args={[wallWidth - 0.1, 0.02, 0.02]} />
              <meshStandardMaterial
                color="#2a2a2a"
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          ))}
          
          {/* Vertical supports */}
          {wallWidth > 2 && Array.from({ length: Math.floor(wallWidth / 2) }).map((_, i) => (
            <mesh
              key={`wall-support-${i}`}
              position={[-wallWidth / 2 + 1 + i * 2, 0, wallDepth / 2 + 0.02]}
              castShadow
            >
              <boxGeometry args={[0.1, wallHeight - 0.2, 0.02]} />
              <meshStandardMaterial
                color="#4a4a4a"
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          ))}
        </group>
      );

    case 'ramp':
      const [rampWidth, rampHeight, rampDepth] = structure.size || [3, 0.3, 4];
      return (
        <group position={structure.position} rotation={[0.3, 0, 0]}>
          {/* Main ramp body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[rampWidth, rampHeight, rampDepth]} />
            <meshStandardMaterial
              color={structure.color || '#555'}
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
          
          {/* Ramp surface texture - anti-slip strips */}
          {Array.from({ length: Math.floor(rampDepth / 0.5) }).map((_, i) => (
            <mesh
              key={`ramp-strip-${i}`}
              position={[0, rampHeight / 2 + 0.01, -rampDepth / 2 + 0.25 + i * 0.5]}
              castShadow
            >
              <boxGeometry args={[rampWidth - 0.2, 0.02, 0.05]} />
              <meshStandardMaterial
                color="#ffd700"
                metalness={0.6}
                roughness={0.4}
                emissive="#ffd700"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
          
          {/* Side rails */}
          <mesh position={[rampWidth / 2, rampHeight / 2 + 0.2, 0]} castShadow>
            <boxGeometry args={[0.05, 0.4, rampDepth]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-rampWidth / 2, rampHeight / 2 + 0.2, 0]} castShadow>
            <boxGeometry args={[0.05, 0.4, rampDepth]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          
          {/* Rail supports */}
          {Array.from({ length: 3 }).map((_, i) => (
            <group key={`ramp-support-${i}`}>
              <mesh position={[rampWidth / 2, rampHeight / 4, -rampDepth / 3 + i * (rampDepth / 3)]} castShadow>
                <boxGeometry args={[0.05, rampHeight / 2, 0.05]} />
                <meshStandardMaterial
                  color="#4a4a4a"
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
              <mesh position={[-rampWidth / 2, rampHeight / 4, -rampDepth / 3 + i * (rampDepth / 3)]} castShadow>
                <boxGeometry args={[0.05, rampHeight / 2, 0.05]} />
                <meshStandardMaterial
                  color="#4a4a4a"
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
            </group>
          ))}
        </group>
      );

    case 'platform':
      const [platWidth, platHeight, platDepth] = structure.size || [3, 0.3, 3];
      return (
        <group position={structure.position}>
          {/* Main platform body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[platWidth, platHeight, platDepth]} />
            <meshStandardMaterial
              color={structure.color || '#444'}
              metalness={0.5}
              roughness={0.5}
              emissive={structure.color || '#000'}
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Platform edge trim */}
          <mesh position={[0, platHeight / 2 + 0.02, 0]} castShadow receiveShadow>
            <boxGeometry args={[platWidth + 0.1, 0.04, platDepth + 0.1]} />
            <meshStandardMaterial
              color="#6a6a6a"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          
          {/* Support pillars underneath */}
          <mesh position={[platWidth / 3, -platHeight / 2 - 0.3, platDepth / 3]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.6, 8]} />
            <meshStandardMaterial
              color="#3a3a3a"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[-platWidth / 3, -platHeight / 2 - 0.3, platDepth / 3]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.6, 8]} />
            <meshStandardMaterial
              color="#3a3a3a"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[platWidth / 3, -platHeight / 2 - 0.3, -platDepth / 3]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.6, 8]} />
            <meshStandardMaterial
              color="#3a3a3a"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[-platWidth / 3, -platHeight / 2 - 0.3, -platDepth / 3]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 0.6, 8]} />
            <meshStandardMaterial
              color="#3a3a3a"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          
          {/* Corner lights */}
          <pointLight
            position={[platWidth / 2, platHeight / 2 + 0.2, platDepth / 2]}
            color={structure.color || '#ffffff'}
            intensity={0.5}
            distance={3}
          />
          <pointLight
            position={[-platWidth / 2, platHeight / 2 + 0.2, -platDepth / 2]}
            color={structure.color || '#ffffff'}
            intensity={0.5}
            distance={3}
          />
        </group>
      );

    case 'tree':
      const treeHeight = structure.size?.[1] || 4;
      const treeRadius = (structure.size?.[0] || 1);
      return (
        <group position={structure.position}>
          {/* Trunk - more detailed with texture */}
          <mesh position={[0, -treeHeight * 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.25, treeHeight * 0.7, 12]} />
            <meshStandardMaterial 
              color="#4a3520" 
              roughness={0.95}
              metalness={0.05}
            />
          </mesh>
          
          {/* Trunk base/roots */}
          <mesh position={[0, -treeHeight * 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.35, 0.3, 8]} />
            <meshStandardMaterial 
              color="#3d2817" 
              roughness={0.95}
            />
          </mesh>
          
          {/* Main foliage - multiple layers for volume */}
          <mesh position={[0, treeHeight * 0.25, 0]} castShadow>
            <sphereGeometry args={[treeRadius * 1.3, 12, 12]} />
            <meshStandardMaterial
              color={structure.color || '#2d5a27'}
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
          
          {/* Secondary foliage clusters */}
          <mesh position={[treeRadius * 0.5, treeHeight * 0.15, 0]} castShadow>
            <sphereGeometry args={[treeRadius * 0.8, 10, 10]} />
            <meshStandardMaterial
              color={structure.color || '#2d5a27'}
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[-treeRadius * 0.5, treeHeight * 0.15, 0]} castShadow>
            <sphereGeometry args={[treeRadius * 0.8, 10, 10]} />
            <meshStandardMaterial
              color={structure.color || '#2d5a27'}
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[0, treeHeight * 0.15, treeRadius * 0.5]} castShadow>
            <sphereGeometry args={[treeRadius * 0.8, 10, 10]} />
            <meshStandardMaterial
              color={structure.color || '#2d5a27'}
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[0, treeHeight * 0.15, -treeRadius * 0.5]} castShadow>
            <sphereGeometry args={[treeRadius * 0.8, 10, 10]} />
            <meshStandardMaterial
              color={structure.color || '#2d5a27'}
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
          
          {/* Top foliage */}
          <mesh position={[0, treeHeight * 0.4, 0]} castShadow>
            <sphereGeometry args={[treeRadius * 0.9, 10, 10]} />
            <meshStandardMaterial
              color={structure.color || '#3d6a37'}
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
        </group>
      );

    case 'rock':
      const rockSize = (structure.size?.[0] || 2) * 0.5;
      return (
        <group
          position={structure.position}
          rotation={[Math.random() * 0.3, Math.random() * Math.PI, 0]}
        >
          {/* Main rock body */}
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[rockSize, 0]} />
            <meshStandardMaterial
              color={structure.color || '#666'}
              roughness={0.85}
              metalness={0.15}
              emissive={structure.color || '#333'}
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* Secondary rock cluster */}
          <mesh position={[rockSize * 0.6, -rockSize * 0.2, rockSize * 0.3]} castShadow receiveShadow>
            <dodecahedronGeometry args={[rockSize * 0.5, 0]} />
            <meshStandardMaterial
              color={structure.color || '#666'}
              roughness={0.85}
              metalness={0.15}
            />
          </mesh>
          <mesh position={[-rockSize * 0.5, -rockSize * 0.3, -rockSize * 0.4]} castShadow receiveShadow>
            <dodecahedronGeometry args={[rockSize * 0.4, 0]} />
            <meshStandardMaterial
              color={structure.color || '#666'}
              roughness={0.85}
              metalness={0.15}
            />
          </mesh>
          
          {/* Small rocks around base */}
          <mesh position={[rockSize * 0.8, -rockSize * 0.6, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[rockSize * 0.2, 0]} />
            <meshStandardMaterial
              color={structure.color || '#666'}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[-rockSize * 0.7, -rockSize * 0.6, rockSize * 0.5]} castShadow receiveShadow>
            <dodecahedronGeometry args={[rockSize * 0.15, 0]} />
            <meshStandardMaterial
              color={structure.color || '#666'}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        </group>
      );

    case 'crystal':
      const crystalSize = (structure.size?.[0] || 1) * 0.5;
      return (
        <group position={structure.position}>
          {/* Main crystal */}
          <mesh castShadow>
            <octahedronGeometry args={[crystalSize, 0]} />
            <meshStandardMaterial
              color={structure.color || '#00ffff'}
              emissive={structure.color || '#008888'}
              emissiveIntensity={1}
              metalness={0.95}
              roughness={0.05}
              transparent
              opacity={0.85}
            />
          </mesh>
          
          {/* Secondary crystals */}
          <mesh position={[crystalSize * 0.7, -crystalSize * 0.3, crystalSize * 0.3]} castShadow>
            <octahedronGeometry args={[crystalSize * 0.5, 0]} />
            <meshStandardMaterial
              color={structure.color || '#00ffff'}
              emissive={structure.color || '#008888'}
              emissiveIntensity={0.9}
              metalness={0.95}
              roughness={0.05}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[-crystalSize * 0.6, -crystalSize * 0.4, -crystalSize * 0.4]} castShadow>
            <octahedronGeometry args={[crystalSize * 0.4, 0]} />
            <meshStandardMaterial
              color={structure.color || '#00ffff'}
              emissive={structure.color || '#008888'}
              emissiveIntensity={0.9}
              metalness={0.95}
              roughness={0.05}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Small crystal shards */}
          <mesh position={[crystalSize * 0.9, -crystalSize * 0.6, 0]} castShadow>
            <octahedronGeometry args={[crystalSize * 0.2, 0]} />
            <meshStandardMaterial
              color={structure.color || '#00ffff'}
              emissive={structure.color || '#008888'}
              emissiveIntensity={0.8}
              metalness={0.95}
              roughness={0.05}
              transparent
              opacity={0.75}
            />
          </mesh>
          <mesh position={[-crystalSize * 0.8, -crystalSize * 0.6, crystalSize * 0.5]} castShadow>
            <octahedronGeometry args={[crystalSize * 0.15, 0]} />
            <meshStandardMaterial
              color={structure.color || '#00ffff'}
              emissive={structure.color || '#008888'}
              emissiveIntensity={0.8}
              metalness={0.95}
              roughness={0.05}
              transparent
              opacity={0.75}
            />
          </mesh>
          
          {/* Base rock */}
          <mesh position={[0, -crystalSize * 0.8, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[crystalSize * 0.6, 0]} />
            <meshStandardMaterial
              color="#4a4a4a"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          
          {/* Multiple lights for dramatic effect */}
          <pointLight
            color={structure.color || '#00ffff'}
            intensity={4}
            distance={8}
          />
          <pointLight
            color={structure.color || '#00ffff'}
            position={[0, crystalSize, 0]}
            intensity={2}
            distance={5}
          />
        </group>
      );

    case 'crate':
      const [crateWidth, crateHeight, crateDepth] = structure.size || [0.8, 0.8, 0.8];
      return (
        <group position={structure.position}>
          {/* Main crate body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[crateWidth, crateHeight, crateDepth]} />
            <meshStandardMaterial
              color={structure.color || '#8b6914'}
              roughness={0.8}
              metalness={0.2}
              emissive={structure.color || '#8b6914'}
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* Metal bands - horizontal */}
          <mesh position={[0, crateHeight * 0.3, 0]} castShadow>
            <boxGeometry args={[crateWidth + 0.02, 0.05, crateDepth + 0.02]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -crateHeight * 0.3, 0]} castShadow>
            <boxGeometry args={[crateWidth + 0.02, 0.05, crateDepth + 0.02]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          
          {/* Metal bands - vertical */}
          <mesh position={[crateWidth * 0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.05, crateHeight + 0.02, crateDepth + 0.02]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-crateWidth * 0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.05, crateHeight + 0.02, crateDepth + 0.02]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          
          {/* Lock/latch on front */}
          <mesh position={[0, 0, crateDepth / 2 + 0.02]} castShadow>
            <boxGeometry args={[0.15, 0.1, 0.03]} />
            <meshStandardMaterial
              color="#ffd700"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Corner reinforcements */}
          <mesh position={[crateWidth / 2, crateHeight / 2, crateDepth / 2]} castShadow>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-crateWidth / 2, crateHeight / 2, crateDepth / 2]} castShadow>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[crateWidth / 2, -crateHeight / 2, crateDepth / 2]} castShadow>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-crateWidth / 2, -crateHeight / 2, crateDepth / 2]} castShadow>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
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
