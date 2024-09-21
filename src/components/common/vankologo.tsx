'use client';

import { PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

function VankoLogoModel() {
  const gltf = useGLTF('/assets/glbs/vankologo.glb');

  return (
    <>
      <primitive
        object={gltf.scene}
        rotation={[0, -1.57, 0]}
        position={[0, -2.5, 0]}
        scale={[1.5, 1.5, 1.5]}
      ></primitive>
      <ambientLight color={0xffffff} intensity={3.5} />

      <PerspectiveCamera />
    </>
  );
}

export default function VankoLogoCanvas() {
  return (
    <>
      <div style={{ width: '20rem', height: '20rem', margin: '0 auto' }}>
        <Canvas dpr={[2, 4]}>
          <VankoLogoModel></VankoLogoModel>
        </Canvas>
      </div>
    </>
  );
}
