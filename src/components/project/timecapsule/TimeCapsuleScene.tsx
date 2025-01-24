import { Sphere, Stars } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import BloomEffect from './BloomEffect';
import RotatingSpheres from './RotatingSpheres';
import TimeCapsuleCamera from './TimeCapsuleCamera';

function TimeCapsuleScene() {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const startFOV = camera.fov; // 초기 fov 값
      const targetFOV = 135; // 목표 fov 값
      const duration = 1000; // 1.5초 동안 보간
      const startTime = performance.now();

      const animateFOV = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1); // 0 ~ 1 사이로 정규화
        camera.fov = THREE.MathUtils.lerp(startFOV, targetFOV, t); // 부드러운 보간
        camera.updateProjectionMatrix();

        if (t < 1) {
          requestAnimationFrame(animateFOV); // 목표값에 도달할 때까지 실행
        }
      };

      requestAnimationFrame(animateFOV); // 애니메이션 시작
    }
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.01} />
      <Sphere scale={0.01} position={[0, 0, 0]}>
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
        <pointLight position={[0, 0, 0]} intensity={5000} color="white" power={3300} />
      </Sphere>
      <RotatingSpheres />
      <Stars count={2500} depth={20} radius={3.5} saturation={1} factor={0.3} speed={3} />
      <BloomEffect />
      <TimeCapsuleCamera />
    </>
  );
}

export default TimeCapsuleScene;
