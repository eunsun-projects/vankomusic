'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useStarQuery, useStarsQuery } from '@/hooks/queries/star.query';
import { useStarStore } from '@/stores/zustand';
import { Star } from '@/types/projects.type';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import SphereStar from './Sphere';

function Spheres() {
  const { user } = useAuth();
  const { data: starFromSupabase } = useStarQuery(user?.email ?? null);
  const { data: starsFromSupabase } = useStarsQuery();
  const { star, stars, focusedStar, setFocusedStar, setStars, setStar } = useStarStore(
    useShallow((state) => ({
      star: state.star,
      stars: state.stars,
      focusedStar: state.focusedStar,
      setFocusedStar: state.setFocusedStar,
      setStars: state.setStars,
      setStar: state.setStar,
    })),
  );

  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // 그룹을 반복문 돌면서 각 자식 요소의 이름(uuid임)을 확인하여 업데이트
    if (!groupRef.current) return;
    const updatedStars = groupRef.current.children.map((child) => {
      const matchedStar = starsFromSupabase?.find((star) => star.id === child.name);
      if (matchedStar) {
        const newStar = { ...matchedStar, object: child as THREE.Mesh };
        return newStar;
      }
      return matchedStar;
    });
    setStars(updatedStars as Star[]);
  }, [starsFromSupabase, setStars]);

  console.log(stars);

  useEffect(() => {
    if (!starFromSupabase || !('id' in starFromSupabase) || !user) return;
    if (stars.length === 0) return;

    const star = stars.find((star) => star.id === starFromSupabase.id);
    if (!star) return;

    setFocusedStar(star);
  }, [star, stars, setFocusedStar, user, starFromSupabase]);

  return (
    <group ref={groupRef}>
      {starsFromSupabase?.map((star) => (
        <SphereStar ref={sphereRef} key={star.id} star={star} onClick={() => console.log(star)} />
      ))}
    </group>
  );
}

export default Spheres;
