'use client';

import { Sphere, Stars } from '@react-three/drei';
import BloomEffect from '../timecapsule/BloomEffect';
import Spheres from './Spheres';
import StarCamera from './StarCamera';

function StarScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Sphere scale={0.04} position={[0, 0, 0]}>
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
        <pointLight position={[0, 0, 0]} intensity={5000} color="white" power={1200} />
      </Sphere>
      <Spheres />
      <Stars count={2500} depth={20} radius={3.5} saturation={1} factor={0.3} speed={3} />
      <BloomEffect />
      <StarCamera />
    </>
  );
}

export default StarScene;
