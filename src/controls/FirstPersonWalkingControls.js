import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "./PointerLockControls";
import * as THREE from "three";

const listenedKeys = ["w", "a", "s", "d"];

const handleKeyDown = (e, keyRef) => {
  const key = e.key;
  if (listenedKeys.includes(key)) {
    keyRef.current[key] = true;
  }
};

const handleKeyUp = (e, keyRef) => {
  const key = e.key;
  if (listenedKeys.includes(key)) {
    keyRef.current[key] = false;
  }
};

export const FirstPersonWalkingControls = (props) => {
  const keysRef = useRef({ w: false, a: false, s: false, d: false });
  const cameraDirRef = useRef(new THREE.Vector3());
  const controlsRef = useRef();

  useEffect(() => {
    document.addEventListener("keydown", (e) => handleKeyDown(e, keysRef));
    document.addEventListener("keyup", (e) => handleKeyUp(e, keysRef));

    return () => {
      document.removeEventListener("keydown", (e) => handleKeyDown(e, keysRef));
      document.removeEventListener("keyup", (e) => handleKeyUp(e, keysRef));
    };
  });

  useFrame((state, delta) => {
    const { camera } = state;
    const keys = keysRef.current;
    const cameraDir = cameraDirRef.current;
    const speed = delta * 10;

    camera.position.y = props.height || 1.5;
    camera.getWorldDirection(cameraDir);
    cameraDir.y = 0;
    cameraDir.normalize();
    cameraDir.multiplyScalar(speed);

    // 카메라의 회전을 PointerLockControls의 회전으로 설정합니다.
    if (controlsRef.current) {
      camera.rotation.setFromQuaternion(controlsRef.current.getObject().quaternion);
    }

    if (keys.w) {
      camera.position.add(cameraDir);
    }
    if (keys.s) {
      camera.position.sub(cameraDir);
    }
    if (keys.a) {
      camera.position.sub(cameraDir.clone().cross(new THREE.Vector3(0, 1, 0)));
    }
    if (keys.d) {
      camera.position.add(cameraDir.clone().cross(new THREE.Vector3(0, 1, 0)));
    }
  });

  return <PointerLockControls ref={controlsRef}/>;
};
