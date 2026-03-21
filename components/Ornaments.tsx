import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneMode } from '../types';

interface OrnamentsProps {
  mode: SceneMode;
  count: number;
}

type OrnamentType = 'candle' | 'sprinkle';

interface InstanceData {
  chaosPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  type: OrnamentType;
  color: THREE.Color;
  scale: number;
  speed: number;
  rotationOffset: THREE.Euler;
}

export const Ornaments: React.FC<OrnamentsProps> = ({ mode, count }) => {
  const candlesRef = useRef<THREE.InstancedMesh>(null);
  const sprinklesRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { candlesData, sprinklesData } = useMemo(() => {
    const _candles: InstanceData[] = [];
    const _sprinkles: InstanceData[] = [];

    const height = 10;
    const maxRadius = 3.5;

    const lightBlue = new THREE.Color("#ADD8E6");
    const pink = new THREE.Color("#FFB6C1");
    const cream = new THREE.Color("#FFFDD0");
    const white = new THREE.Color("#FFFFFF");

    const palette = [lightBlue, pink, cream, white];

    for (let i = 0; i < count; i++) {
      const rnd = Math.random();
      let type: OrnamentType = 'sprinkle';
      if (rnd > 0.95) type = 'candle';

      let y, r;
      const tierRnd = Math.random();

      if (type === 'candle') {
         const tierChoice = Math.random();
         if (tierChoice < 0.4) {
           y = height * 0.35;
           r = maxRadius * 0.9;
         } else if (tierChoice < 0.75) {
           y = height * 0.65;
           r = maxRadius * 0.6;
         } else {
           y = height;
           r = maxRadius * 0.3;
         }
      } else {
        if (tierRnd < 0.4) {
          y = Math.random() * (height * 0.35);
          r = maxRadius + 0.2;
        } else if (tierRnd < 0.7) {
          y = Math.random() * (height * 0.3) + height * 0.35;
          r = maxRadius * 0.7 + 0.2;
        } else {
          y = Math.random() * (height * 0.3) + height * 0.65;
          r = maxRadius * 0.4 + 0.2;
        }
      }

      const theta = Math.random() * Math.PI * 2;
      const targetPos = new THREE.Vector3(
        r * Math.cos(theta),
        y,
        r * Math.sin(theta)
      );

      const cR = 15 + Math.random() * 15;
      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(2 * Math.random() - 1);
      const chaosPos = new THREE.Vector3(
        cR * Math.sin(cPhi) * Math.cos(cTheta),
        cR * Math.sin(cPhi) * Math.sin(cTheta) + 5,
        cR * Math.cos(cPhi)
      );

      const scale = type === 'candle' ? 0.3 : 0.1;
      const color = palette[Math.floor(Math.random() * palette.length)];

      const data: InstanceData = {
        chaosPos,
        targetPos,
        type,
        color,
        scale,
        speed: 0.5 + Math.random() * 1.5,
        rotationOffset: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      };

      if (type === 'candle') _candles.push(data);
      else _sprinkles.push(data);
    }

    return { candlesData: _candles, sprinklesData: _sprinkles };
  }, [count]);

  useLayoutEffect(() => {
    [
      { ref: candlesRef, data: candlesData },
      { ref: sprinklesRef, data: sprinklesData }
    ].forEach(({ ref, data }) => {
      if (ref.current) {
        data.forEach((d, i) => {
          ref.current!.setColorAt(i, d.color);
        });
        ref.current.instanceColor!.needsUpdate = true;
      }
    });
  }, [candlesData, sprinklesData]);

  useFrame((state, delta) => {
    const isFormed = mode === SceneMode.FORMED;
    const time = state.clock.elapsedTime;

    const updateMesh = (ref: React.RefObject<THREE.InstancedMesh>, data: InstanceData[]) => {
      if (!ref.current) return;

      let needsUpdate = false;

      data.forEach((d, i) => {
        const dest = isFormed ? d.targetPos : d.chaosPos;

        ref.current!.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

        const step = delta * d.speed;
        dummy.position.lerp(dest, step);

        if (isFormed && dummy.position.distanceTo(d.targetPos) < 0.5) {
          dummy.position.y += Math.sin(time * 2 + d.chaosPos.x) * 0.002;
        }

        if (d.type === 'candle') {
           dummy.rotation.set(0, 0, 0);
        } else {
           dummy.rotation.x += delta * 2;
        }

        dummy.scale.setScalar(d.scale);
        if (d.type === 'candle') {
           const flicker = 1 + Math.sin(time * 10 + d.chaosPos.y) * 0.1;
           dummy.scale.y *= flicker;
        }

        dummy.updateMatrix();
        ref.current!.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
      });

      if (needsUpdate) ref.current.instanceMatrix.needsUpdate = true;
    };

    updateMesh(candlesRef, candlesData);
    updateMesh(sprinklesRef, sprinklesData);
  });

  return (
    <>
      <instancedMesh ref={candlesRef} args={[undefined, undefined, candlesData.length]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
        <meshStandardMaterial roughness={0.3} metalness={0.2} />
      </instancedMesh>

      <instancedMesh ref={sprinklesRef} args={[undefined, undefined, sprinklesData.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial roughness={0.5} metalness={0.1} />
      </instancedMesh>
    </>
  );
};
