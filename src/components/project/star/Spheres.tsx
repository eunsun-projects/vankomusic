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
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // groupRef.current.rotation.y += 0.004 * delta; // 속도 조절

    if (!state.controls) return;
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

  // useEffect to associate star data with Three.js objects
  useEffect(() => {
    if (!groupRef.current || !starsFromSupabase) return;

    const updatedStars = groupRef.current.children
      .map((child) => {
        // Child can be Mesh (power < 40) or Group (power >= 40)
        const matchedStar = starsFromSupabase.find((star) => star.id === child.name);
        if (matchedStar) {
          // Associate the direct child (Mesh or Group) with the star data
          // Ensure the object type matches what focusedStar expects (likely the Group/Mesh itself)
          return { ...matchedStar, object: child as THREE.Mesh | THREE.Group };
        }
        return undefined; // Return undefined if no match
      })
      .filter((star) => star !== undefined); // Filter out undefined and type guard

    setStars(updatedStars as Star[]);
    // console.log('Updated stars with objects:', updatedStars);
  }, [starsFromSupabase, setStars]);

  // useEffect to set focused star
  useEffect(() => {
    if (!starFromSupabase || !('id' in starFromSupabase) || !user) return;
    if (stars.length === 0) return;

    // Find the star object (Mesh or Group) associated in the previous effect
    const starObjectData = stars.find((s) => s.id === starFromSupabase.id);
    if (!starObjectData?.object) return;

    // Merge Supabase data with the object reference
    const mergedStar = { ...starFromSupabase, object: starObjectData.object };
    setFocusedStar(mergedStar);
    // console.log('Focused star set:', mergedStar);
  }, [starFromSupabase, stars, setFocusedStar, user]); // Removed star dependency as it seemed incorrect

  // useEffect to adjust emissive intensity
  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child) => {
      let targetMesh: THREE.Mesh | undefined = undefined;

      // Find the mesh to apply emissive to
      if (child instanceof THREE.Mesh) {
        // If child is directly a Mesh (power < 40)
        targetMesh = child;
      } else if (child instanceof THREE.Group && child.children.length > 0) {
        // If child is a Group (power >= 40), find the Sphere Mesh inside
        // Assuming the Sphere is the first Mesh child, adjust if structure changes
        targetMesh = child.children.find((c): c is THREE.Mesh => c instanceof THREE.Mesh);
      }

      if (targetMesh && targetMesh.material) {
        // Ensure material is MeshStandardMaterial or has emissiveIntensity
        const material = targetMesh.material as THREE.MeshStandardMaterial;
        if ('emissiveIntensity' in material) {
          const isFocused = focusedStar?.id === child.name; // Compare with the group/mesh name
          material.emissiveIntensity = isFocused ? 1 : 0.01;
        }
      }
    });
  }, [focusedStar]);

  return (
    <group ref={groupRef}>
      {starsFromSupabase?.map((star) => <SphereStar key={star.id} star={star} name={star.id} />)}
    </group>
  );
}

export default Spheres;
