'use client';

import { useTimeCapsuleStore } from '@/stores/zustand';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import EachSphere from './EachSphere';

function RotatingSpheres() {
  const { timeCapsules } = useTimeCapsuleStore();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01 * delta; // 속도 조절
    }
  });

  return (
    <group ref={groupRef}>
      {timeCapsules.map((timeCapsule, index) => (
        <EachSphere key={index} timeCapsule={timeCapsule} />
      ))}
    </group>
  );
}

export default RotatingSpheres;
