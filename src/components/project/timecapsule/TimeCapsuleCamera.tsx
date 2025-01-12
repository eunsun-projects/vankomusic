'use client';

import { OrbitControls } from '@react-three/drei';

function TimeCapsuleCamera() {
  return <OrbitControls makeDefault maxDistance={50} enablePan={false} />;
}

export default TimeCapsuleCamera;
