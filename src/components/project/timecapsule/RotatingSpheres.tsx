'use client';

import { useTimeCapsuleStore } from '@/stores/zustand';
import { TimeCapsule, TimeCapsuleFromSupabase } from '@/types/projects.type';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useShallow } from 'zustand/react/shallow';
import EachSphere from './EachSphere';

function RotatingSpheres() {
  const {
    timeCapsules,
    focusedObject,
    timeCapsulesWithoutObject,
    setFocusedObject,
    setTimeCapsules,
  } = useTimeCapsuleStore(
    useShallow((state) => ({
      timeCapsulesWithoutObject: state.timeCapsulesWithoutObject,
      timeCapsules: state.timeCapsules,
      focusedObject: state.focusedObject,
      setFocusedObject: state.setFocusedObject,
      setTimeCapsules: state.setTimeCapsules,
    })),
  );
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const initialCameraState = useRef<{ position: THREE.Vector3; fov: number }>({
    position: new THREE.Vector3(0, 6, 5), // 초기 카메라 위치
    fov: 135, // 초기 FOV
  });

  const handleClick = useCallback(
    (timeCapsule: TimeCapsuleFromSupabase) => (e: ThreeEvent<MouseEvent>) => {
      const matchedTimeCapsule = timeCapsules.find((item) => item.id === timeCapsule.id);
      setFocusedObject({ isIdle: false, timeCapsule: matchedTimeCapsule || null });
    },
    [setFocusedObject, timeCapsules],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.01 * delta; // 속도 조절

    if (!sphereRef.current || !state.controls) return;
    if (focusedObject?.timeCapsule?.object) {
      const target = focusedObject.timeCapsule.object.position.clone();

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

    if (focusedObject?.isIdle) {
      // 초기 카메라 상태 복구
      const { position } = initialCameraState.current;

      state.camera.position.lerp(position, 0.05); // 초기 위치로 복귀
      state.camera.lookAt(0, 0, 0); // 초기 시점을 원점으로 설정

      if (state.camera instanceof THREE.PerspectiveCamera) {
        const targetFOV = 135; // 초기 FOV로 복귀
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFOV, 0.05); // 초기 FOV로 복귀
        state.camera.updateProjectionMatrix();
      }

      (state.controls as OrbitControls).target.lerp(new THREE.Vector3(0, 0, 0), 0.05); // 컨트롤 초기화
      (state.controls as OrbitControls).update();

      if (state.camera instanceof THREE.PerspectiveCamera && state.camera.fov >= 134) {
        setFocusedObject({ isIdle: null, timeCapsule: null });
      }
    }
  });

  useEffect(() => {
    // 그룹을 반복문 돌면서 각 자식 요소의 이름(uuid임)을 확인하여 업데이트
    if (!groupRef.current) return;
    const updatedTimeCapsules = groupRef.current.children.map((child) => {
      const matchedTimeCapsule = timeCapsulesWithoutObject.find(
        (timeCapsule) => timeCapsule.id === child.name,
      );
      if (matchedTimeCapsule) {
        const newTimeCapsule = { ...matchedTimeCapsule, object: child as THREE.Mesh };
        return newTimeCapsule;
      }
      return matchedTimeCapsule;
    });
    setTimeCapsules(updatedTimeCapsules as TimeCapsule[]);
  }, [timeCapsulesWithoutObject, setTimeCapsules]);

  useEffect(() => {
    groupRef.current?.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (!focusedObject) {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.01;
        return;
      }
      if (child.name === focusedObject.timeCapsule?.id) {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 14;
      } else {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.01;
      }
    });
  }, [focusedObject]);

  return (
    <group ref={groupRef}>
      {timeCapsulesWithoutObject.map((timeCapsule) => (
        <EachSphere
          ref={sphereRef}
          key={timeCapsule.id}
          timeCapsule={timeCapsule}
          onClick={handleClick(timeCapsule)}
        />
      ))}
    </group>
  );
}

export default RotatingSpheres;
