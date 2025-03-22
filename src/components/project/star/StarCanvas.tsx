'use client';

import { Canvas } from '@react-three/fiber';
import StarScene from './StarScene';

function StarCanvas() {
  return (
    <Canvas>
      <StarScene />
    </Canvas>
  );
}

export default StarCanvas;
