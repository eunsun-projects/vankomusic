'use client';

import { useTimeCapsuleStore } from '@/stores/zustand';
import { TimeCapsule } from '@/types/projects.type';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useShallow } from 'zustand/react/shallow';
import EachSphere from './EachSphere';

function RotatingSpheres() {
  const { timeCapsules, focusedObject, setFocusedObject, updateTimeCapsuleObject } =
    useTimeCapsuleStore(
      useShallow((state) => ({
        timeCapsules: state.timeCapsules,
        focusedObject: state.focusedObject,
        setFocusedObject: state.setFocusedObject,
        updateTimeCapsuleObject: state.updateTimeCapsuleObject,
      })),
    );
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const initialCameraState = useRef<{ position: THREE.Vector3; fov: number }>({
    position: new THREE.Vector3(0, 6, 5), // 초기 카메라 위치
    fov: 75, // 초기 FOV
  });
  const { camera, controls } = useThree();

  const handleClick = useCallback(
    (timeCapsule: TimeCapsule) => (e: ThreeEvent<MouseEvent>) => {
      setFocusedObject({ isIdle: false, timeCapsule });
    },
    [setFocusedObject],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.01 * delta; // 속도 조절

    if (!sphereRef.current || !controls) return;
    if (focusedObject?.timeCapsule?.object) {
      const target = focusedObject.timeCapsule.object.position.clone();

      const smoothness = 0.05;
      cameraTargetRef.current.lerp(target, smoothness);
      camera.lookAt(target);

      // Fov를 부드럽게 변경
      if (camera instanceof THREE.PerspectiveCamera) {
        const targetFOV = 60; // 목표 줌 레벨
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, smoothness);
        camera.updateProjectionMatrix(); // Zoom 변경 후 프로젝션 매트릭스 업데이트
      }
      (controls as OrbitControls).update();
      (controls as OrbitControls).target.copy(cameraTargetRef.current);
    }

    if (focusedObject?.isIdle) {
      // 초기 카메라 상태 복구
      const { position } = initialCameraState.current;

      camera.position.lerp(position, 0.05); // 초기 위치로 복귀
      camera.lookAt(0, 0, 0); // 초기 시점을 원점으로 설정

      if (camera instanceof THREE.PerspectiveCamera) {
        const targetFOV = 135; // 초기 줌 레벨
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, 0.05); // 초기 FOV로 복귀
        camera.updateProjectionMatrix();
      }

      (controls as OrbitControls).target.lerp(new THREE.Vector3(0, 0, 0), 0.05); // 컨트롤 초기화
      (controls as OrbitControls).update();
    }
  });

  useEffect(() => {
    // 그룹을 반복문 돌면서 각 자식 요소의 이름(uuid임)을 확인하여 업데이트
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child) => {
      updateTimeCapsuleObject(child as THREE.Mesh);
    });
  }, [updateTimeCapsuleObject]);

  useEffect(() => {
    groupRef.current?.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (!focusedObject) {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.01;
        return;
      }
      if (child.name === focusedObject.timeCapsule?.id) {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 4;
      } else {
        (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.01;
      }
    });
  }, [focusedObject]);

  return (
    <group ref={groupRef}>
      {timeCapsules.map((timeCapsule, index) => (
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
