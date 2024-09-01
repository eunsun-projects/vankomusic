import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "./PointerLockControls";
import * as THREE from "three";

export const FirstPersonRotationControls = (props) => {
  const controlsRef = useRef();

  useFrame((state, delta) => {
    const { camera } = state;

    // 카메라의 회전을 PointerLockControls의 회전으로 설정합니다.
    if (controlsRef.current) {
      camera.rotation.setFromQuaternion(controlsRef.current.getObject().quaternion);
    }
  });

  return <PointerLockControls ref={controlsRef}/>;
};
