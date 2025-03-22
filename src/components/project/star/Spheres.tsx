'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useStarQuery, useStarsQuery } from '@/hooks/queries/star.query';
import { useStarStore } from '@/stores/zustand';
import { Star } from '@/types/projects.type';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // groupRef.current.rotation.y += 0.004 * delta; // 속도 조절

    if (!sphereRef.current || !state.controls) return;
    if (focusedStar?.object) {
      const target = focusedStar.object.position.clone();

      const smoothness = 0.05;
      cameraTargetRef.current.lerp(target, smoothness);
      state.camera.lookAt(target);

      // Fov를 부드럽게 변경
      if (state.camera instanceof THREE.PerspectiveCamera) {
        const targetFOV = 60; // 목표 줌 레벨
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFOV, smoothness);
        state.camera.updateProjectionMatrix(); // Zoom 변경 후 프로젝션 매트릭스 업데이트
      }
      (state.controls as OrbitControls).target.copy(cameraTargetRef.current);
      (state.controls as OrbitControls).update();
    }
  });

  // 별의 three.js 객체를 stars 배열에 추가
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

  // 포커스된 별 설정
  // 테이블 업데이트 되면 focusedStar 도 여기서 업데이트함
  useEffect(() => {
    if (!starFromSupabase || !('id' in starFromSupabase) || !user) return;
    if (stars.length === 0) return;

    const star = stars.find((star) => star.id === starFromSupabase.id);
    if (!star) return;

    const mergedStar = { ...starFromSupabase, ...star };
    setFocusedStar(mergedStar);
  }, [star, stars, setFocusedStar, user, starFromSupabase]);

  // 포커스된 별의 밝기 조정
  useEffect(() => {
    groupRef.current?.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (!focusedStar) {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.01;
        return;
      }
      if (child.name === focusedStar.id) {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 1;
      } else {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.01;
      }
    });
  }, [focusedStar]);

  return (
    <group ref={groupRef}>
      {starsFromSupabase?.map((star) => <SphereStar ref={sphereRef} key={star.id} star={star} />)}
    </group>
  );
}

export default Spheres;
