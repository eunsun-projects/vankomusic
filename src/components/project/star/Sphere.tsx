'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useEditStarsMutation } from '@/hooks/mutations/stars.mutation';
import { useStarStore } from '@/stores/zustand';
import { StarFromSupabase } from '@/types/projects.type';
import { Sphere } from '@react-three/drei';
import { forwardRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface SphereProps {
  star: StarFromSupabase;
}

function PureSphere({ star }: SphereProps, ref: React.Ref<THREE.Mesh>) {
  const { focusedStar } = useStarStore();
  const { mutate: editStar, isPending, error } = useEditStarsMutation();
  const { user } = useAuth();

  const color = useMemo(() => {
    return new THREE.Color(star.color);
  }, [star.color]);

  const handleClick = () => {
    if (!user) return;
    if (star.power >= 10) return;

    const newPower = star.power + 1;
    let newColor = star.color;

    if (newPower === 10) {
      // HSL 문자열에서 채도 값을 추출하고 증가
      const [h, s, l] = star.color.match(/\d+/g)?.map(Number) || [0, 50, 70];
      newColor = `hsl(${h}, ${Math.min(s + 20, 100)}%, ${l}%)`;
    }

    editStar({
      ...star,
      power: newPower,
      color: newColor,
      last_touched_at: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (!error) return;
    console.error(error);
  }, [error]);

  useEffect(() => {
    if (!isPending) return;
    console.log('isPending..... in Sphere');
  }, [isPending]);

  return (
    <Sphere
      ref={ref}
      name={star.id}
      scale={focusedStar?.id === star.id ? 0.4 : 0.25}
      position={new THREE.Vector3(star.positions[0], star.positions[1], star.positions[2])}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <Sphere scale={0.9} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.001} />
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
