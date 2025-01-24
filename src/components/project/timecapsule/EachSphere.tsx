'use client';

import { useTimeCapsuleStore } from '@/stores/zustand';
import { TimeCapsuleFromSupabase } from '@/types/projects.type';
import { Sphere } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';

interface EachSphereProps {
  timeCapsule: TimeCapsuleFromSupabase;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}

function SphereStar({ timeCapsule, onClick }: EachSphereProps, ref: React.Ref<THREE.Mesh>) {
  const { focusedObject } = useTimeCapsuleStore();

  const color = useMemo(() => {
    return new THREE.Color(timeCapsule.color);
  }, [timeCapsule.color]);

  return (
    <Sphere
      ref={ref}
      name={timeCapsule.id}
      scale={focusedObject?.timeCapsule?.id === timeCapsule.id ? 0.4 : 0.25}
      position={
        new THREE.Vector3(timeCapsule.position[0], timeCapsule.position[1], timeCapsule.position[2])
      }
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

const EachSphere = forwardRef(SphereStar);
export default EachSphere;
