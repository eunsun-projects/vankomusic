'use client';

import { TimeCapsuleState, useTimeCapsuleStore } from '@/stores/zustand';
import { TimeCapsule } from '@/types/projects.type';
import { Sphere } from '@react-three/drei';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useShallow } from 'zustand/react/shallow';

interface EachSphereProps {
  timeCapsule: TimeCapsule;
}

function EachSphere({ timeCapsule }: EachSphereProps) {
  const { camera, controls } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const previousFocusedObject = useRef<THREE.Mesh | null>(null);
  const { focusedObject, timeCapsules, setFocusedObject, updateTimeCapsuleObject } =
    useTimeCapsuleStore(
      useShallow((state: TimeCapsuleState) => ({
        focusedObject: state.focusedObject,
        timeCapsules: state.timeCapsules,
        setFocusedObject: state.setFocusedObject,
        updateTimeCapsuleObject: state.updateTimeCapsuleObject,
      })),
    );
  const initialTimeCapsulesLength = useRef(timeCapsules.length);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    const object = e.eventObject;
    if (object instanceof THREE.Mesh) {
      setFocusedObject({ timeCapsule });
    }
  };

  const color = useMemo(() => {
    return new THREE.Color(timeCapsule.color);
  }, [timeCapsule.color]);

  useFrame(() => {
    if (!sphereRef.current || !controls || !focusedObject?.timeCapsule.object) return;
    if (focusedObject) {
      let target;

      if (focusedObject.instanceId !== undefined) {
        target = new THREE.Vector3().setFromMatrixPosition(
          focusedObject.timeCapsule.object.matrixWorld,
        );
      } else {
        target = focusedObject.timeCapsule.object.position.clone();
      }

      const smoothness = 0.05;
      cameraTargetRef.current.lerp(target, smoothness);
      camera.lookAt(target);

      // Fov를 부드럽게 변경
      if (camera instanceof THREE.PerspectiveCamera) {
        const targetFOV = 60; // 목표 줌 레벨
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, smoothness);
        camera.updateProjectionMatrix(); // Zoom 변경 후 프로젝션 매트릭스 업데이트
      }

      (controls as OrbitControls).target.copy(cameraTargetRef.current);
      (controls as OrbitControls).update();
    } else {
      // 초기 카메라 상태 복귀
      if (camera instanceof THREE.PerspectiveCamera) {
        const targetFOV = 135; // 초기 줌 레벨
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, 0.05);
        camera.updateProjectionMatrix();
      }
    }
  });

  useEffect(() => {
    if (!previousFocusedObject.current) return;
    if (!focusedObject || !focusedObject.timeCapsule.object) {
      if (previousFocusedObject.current) {
        (previousFocusedObject.current?.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.01;
      }
      return;
    }
    if (previousFocusedObject.current?.uuid !== focusedObject.timeCapsule.object.uuid) {
      (previousFocusedObject.current?.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.01;
      (focusedObject.timeCapsule.object.material as THREE.MeshStandardMaterial).emissiveIntensity =
        4;
    } else {
      (previousFocusedObject.current?.material as THREE.MeshStandardMaterial).emissiveIntensity = 4;
    }
    previousFocusedObject.current = focusedObject.timeCapsule.object;
  }, [focusedObject, controls]);

  useEffect(() => {
    if (timeCapsules.length > initialTimeCapsulesLength.current) {
      setFocusedObject({
        timeCapsule: timeCapsules[timeCapsules.length - 1],
      });
    }
  }, [timeCapsules, setFocusedObject]);

  useEffect(() => {
    if (!sphereRef.current) return;
    sphereRef.current.userData = {
      name: 'timeCapsule',
      timeCapsule,
    };
    updateTimeCapsuleObject(sphereRef.current);
  }, [timeCapsule, updateTimeCapsuleObject]);

  return (
    <Sphere
      ref={sphereRef}
      scale={0.25}
      position={
        new THREE.Vector3(timeCapsule.position[0], timeCapsule.position[1], timeCapsule.position[2])
      }
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <Sphere scale={0.8} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.01} />
      </Sphere>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        opacity={0.1}
        transparent
      />
    </Sphere>
  );
}

export default EachSphere;
