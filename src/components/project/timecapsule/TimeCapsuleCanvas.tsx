'use client';

import { useTimeCapsuleStore } from '@/stores/zustand';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import TimeCapsuleScene from './TimeCapsuleScene';

function TimeCapsuleCanvas() {
  const { focusedObject, setFocusedObject } = useTimeCapsuleStore();

  const handlePointerMissed = () => {
    console.log('pointer missed');
    if (!focusedObject?.timeCapsule?.object) return;
    (focusedObject.timeCapsule.object.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.03;
    setFocusedObject({ isIdle: true, timeCapsule: null });
  };

  return (
    <Canvas
      color="black"
      onPointerMissed={handlePointerMissed}
      camera={{ position: [0, 6, 5], fov: 75 }}
    >
      <TimeCapsuleScene />
    </Canvas>
  );
}

export default TimeCapsuleCanvas;
