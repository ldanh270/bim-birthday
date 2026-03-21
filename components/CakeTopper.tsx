import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneMode } from '../types';

interface CakeTopperProps {
  mode: SceneMode;
}

export const CakeTopper: React.FC<CakeTopperProps> = ({ mode }) => {
  const topperRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Create a heart shape
  const heartShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x, y + 0.3);
    shape.bezierCurveTo(x, y + 0.3, x - 0.5, y + 0.8, x - 1, y + 0.3);
    shape.bezierCurveTo(x - 1.5, y - 0.2, x - 1, y - 0.7, x, y - 1.2);
    shape.bezierCurveTo(x + 1, y - 0.7, x + 1.5, y - 0.2, x + 1, y + 0.3);
    shape.bezierCurveTo(x + 0.5, y + 0.8, x, y + 0.3, x, y + 0.3);
    return shape;
  }, []);

  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3,
  };

  // Target positions
  const formedPos = new THREE.Vector3(0, 11, 0); // Above cake top tier
  const chaosPos = new THREE.Vector3(
    Math.random() * 20 - 10,
    15 + Math.random() * 10,
    Math.random() * 20 - 10
  );

  useFrame((state, delta) => {
    if (!topperRef.current) return;

    const isFormed = mode === SceneMode.FORMED;
    const time = state.clock.elapsedTime;

    // Position animation
    const targetPos = isFormed ? formedPos : chaosPos;
    topperRef.current.position.lerp(targetPos, delta * 1.5);

    // Rotation animation
    if (isFormed) {
      // Gentle floating when formed
      topperRef.current.position.y = 11 + Math.sin(time * 2) * 0.1;
      topperRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
    } else {
      // Spinning in chaos mode
      topperRef.current.rotation.x += delta * 2;
      topperRef.current.rotation.y += delta * 3;
    }

    // Pulsating light
    if (lightRef.current) {
      const pulse = 2 + Math.sin(time * 3) * 0.5;
      lightRef.current.intensity = pulse;
    }
  });

  return (
    <group ref={topperRef} position={[0, 11, 0]}>
      {/* Heart Mesh */}
      <mesh rotation={[0, 0, Math.PI]}>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#ADD8E6"
          emissive="#87CEEB"
          emissiveIntensity={2}
          metalness={0.5}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Point Light for glow effect */}
      <pointLight
        ref={lightRef}
        color="#ADD8E6"
        intensity={2}
        distance={5}
        decay={2}
      />
    </group>
  );
};
