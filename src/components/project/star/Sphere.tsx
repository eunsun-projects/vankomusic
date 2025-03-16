'use client';

import { useStarStore } from '@/stores/zustand';
import { StarFromSupabase } from '@/types/projects.type';
import { Sphere } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';

interface SphereProps {
  star: StarFromSupabase;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}

function PureSphere({ star, onClick }: SphereProps, ref: React.Ref<THREE.Mesh>) {
  const { focusedStar } = useStarStore();

  const color = useMemo(() => {
    return new THREE.Color(star.color);
  }, [star.color]);

  return (
    <Sphere
      ref={ref}
      name={star.id}
      scale={focusedStar?.id === star.id ? 0.4 : 0.25}
      position={new THREE.Vector3(star.positions[0], star.positions[1], star.positions[2])}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <Sphere scale={0.8} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.01} />
      </Sphere>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.01}
        opacity={0.1}
        transparent
      />
    </Sphere>
  );
}

const SphereStar = forwardRef(PureSphere);
export default SphereStar;
