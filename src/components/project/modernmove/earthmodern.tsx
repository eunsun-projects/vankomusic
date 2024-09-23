'use client';
import { useLoader } from '@react-three/fiber';
import { ForwardedRef, forwardRef } from 'react';
import { Mesh, TextureLoader } from 'three';

const EarthDayMap = '/assets/img/earth_daymap.jpg';

const Earth = forwardRef((props, ref: ForwardedRef<Mesh>) => {
  const [colorMap] = useLoader(TextureLoader, [EarthDayMap]);

  return (
    <mesh ref={ref} position={[0, 6, 5]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial map={colorMap} emissive="#fff8db" emissiveIntensity={0.09} />
    </mesh>
  );
});

Earth.displayName = 'Earth';
export default Earth;
