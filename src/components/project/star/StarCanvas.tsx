'use client';

import { Canvas } from '@react-three/fiber';
import StarScene from './StarScene';

function StarCanvas() {
  return (
    <Canvas gl={{ antialias: true, alpha: true }}>
      <StarScene />
    </Canvas>
  );
}

export default StarCanvas;
