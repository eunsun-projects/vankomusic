'use client';

import { OrbitControls } from '@react-three/drei';

function StarCamera() {
  return <OrbitControls makeDefault maxDistance={50} enablePan={false} />;
}

export default StarCamera;
