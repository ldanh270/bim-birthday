import React, { useRef } from 'react';
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { CakeTopper } from './CakeTopper';
import { Polaroids } from './Polaroids';
import { SceneMode } from '../types';

interface ExperienceProps {
  mode: SceneMode;
  handPosition: { x: number; y: number; detected: boolean } | null;
  uploadedPhotos: string[];
}

export const Experience: React.FC<ExperienceProps> = ({ mode, handPosition, uploadedPhotos }) => {
  const controlsRef = useRef<any>(null);

  // Target distance for camera based on mode
  const targetDistanceRef = useRef(15);

  // Update camera rotation and distance based on hand position and mode
  useFrame((_, delta) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      
      // Update target distance based on mode.
      // Zooming out uses a gentler damping so transition feels smoother.
      const targetDist = mode === SceneMode.CHAOS ? 35 : 15;
      const zoomDamping = targetDist > targetDistanceRef.current ? 1.2 : 2.1;
      targetDistanceRef.current = THREE.MathUtils.damp(targetDistanceRef.current, targetDist, zoomDamping, delta);

      if (handPosition && handPosition.detected) {
        // Map hand position to spherical coordinates
        const targetAzimuth = (handPosition.x - 0.5) * Math.PI * 3;
        const adjustedY = (handPosition.y - 0.2) * 2.0;
        const clampedY = Math.max(0, Math.min(1, adjustedY));
        
        const minPolar = Math.PI / 4;
        const maxPolar = Math.PI / 1.8;
        const targetPolar = minPolar + clampedY * (maxPolar - minPolar);
        
        const currentAzimuth = controls.getAzimuthalAngle();
        const currentPolar = controls.getPolarAngle();
        
        let azimuthDiff = targetAzimuth - currentAzimuth;
        if (azimuthDiff > Math.PI) azimuthDiff -= Math.PI * 2;
        if (azimuthDiff < -Math.PI) azimuthDiff += Math.PI * 2;
        
        const angleSmooth = 1 - Math.exp(-delta * 6);
        const newAzimuth = currentAzimuth + azimuthDiff * angleSmooth;
        const newPolar = currentPolar + (targetPolar - currentPolar) * angleSmooth;
        
        // Use the dynamic targetDistanceRef
        const radius = targetDistanceRef.current;
        const targetY = 0; // Centered vertically
        
        const x = radius * Math.sin(newPolar) * Math.sin(newAzimuth);
        const y = targetY + radius * Math.cos(newPolar);
        const z = radius * Math.sin(newPolar) * Math.cos(newAzimuth);
        
        const desiredPosition = new THREE.Vector3(x, y, z);
        const positionSmooth = 1 - Math.exp(-delta * 7);
        controls.object.position.lerp(desiredPosition, positionSmooth);
        controls.target.set(0, targetY, 0);
        controls.update();
      } else {
        // Even when no hand detected, smoothly update distance and target
        const currentRadius = controls.getDistance();
        if (Math.abs(currentRadius - targetDistanceRef.current) > 0.1 || controls.target.y !== 0) {
          const desiredPosition = controls.object.position.clone().normalize().multiplyScalar(targetDistanceRef.current);
          const smooth = 1 - Math.exp(-delta * 5);
          controls.object.position.lerp(desiredPosition, smooth);
          controls.target.lerp(new THREE.Vector3(0, 0, 0), smooth);
          controls.update();
        }
      }
    }
  });

  return (
    <>
      <OrbitControls 
        ref={controlsRef}
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={8}
        maxDistance={50}
        enableDamping
        dampingFactor={0.05}
        enabled={true}
      />

      {/* Lighting Setup for Birthday Theme */}
      <Environment preset="city" background={false} blur={0.8} />
      
      <ambientLight intensity={0.5} color="#E0F2FE" />
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.2} 
        penumbra={1} 
        intensity={2} 
        color="#F0F9FF" 
        castShadow 
      />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#ADD8E6" />

      <group position={[0, -5, 0]}>
        <Foliage mode={mode} count={12000} />
        <Ornaments mode={mode} count={600} />
        <Polaroids mode={mode} uploadedPhotos={uploadedPhotos} />
        <CakeTopper mode={mode} />
        
        {/* Floor Reflections */}
        <ContactShadows 
          opacity={0.7} 
          scale={30} 
          blur={2} 
          far={4.5} 
          color="#000000" 
        />
      </group>

      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.7} />
        <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      </EffectComposer>
    </>
  );
};
