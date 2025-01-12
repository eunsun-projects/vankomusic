'use client';

import Loading from '@/app/loading';
import { useTimeCapsuleStore } from '@/stores/zustand';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import TimeCapsuleScene from './TimeCapsuleScene';
import TimeCapsuleUi from './TimeCapsuleUI';

function TimeCapsuleCanvas() {
  const { focusedObject, setFocusedObject } = useTimeCapsuleStore();

  const handlePointerMissed = () => {
    console.log('pointer missed');
    if (focusedObject?.object.material) {
      (focusedObject?.object.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.03;
    }
    setFocusedObject(null);
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative w-full h-full">
        <TimeCapsuleUi />
        <Canvas
          color="black"
          onPointerMissed={handlePointerMissed}
          camera={{ position: [0, 6, 5], fov: 75 }}
        >
          <TimeCapsuleScene />
        </Canvas>
      </div>
    </Suspense>
  );
}

export default TimeCapsuleCanvas;
