'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

function BloomEffect() {
  const { scene, camera, gl, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const bokehPassRef = useRef<BokehPass | null>(null);

  useEffect(() => {
    // EffectComposer 인스턴스 생성
    composerRef.current = new EffectComposer(gl);
    composerRef.current.setSize(size.width, size.height);

    // 씬을 그리는 RenderPass 추가
    const renderPass = new RenderPass(scene, camera);
    composerRef.current.addPass(renderPass);

    // UnrealBloomPass 추가
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height), // 해상도
      1, // Bloom 강도
      0.3, // Bloom 반경
      0.2, // Bloom 임계값
      // 5, // strength
      // 1.2, // radius
      // 0, // threshold
      // 3, // strength
      // 0, // radius
      // 0, // threshold
    );
    composerRef.current.addPass(bloomPass);

    const bokehPass = new BokehPass(scene, camera, {
      focus: 15.0,
      aperture: 0.025,
      maxblur: 0.0003,
    });
    composerRef.current.addPass(bokehPass);
    bokehPassRef.current = bokehPass;

    gl.toneMapping = THREE.ReinhardToneMapping;
  }, [scene, camera, gl, size]);

  // 카메라의 중앙 초점 거리 업데이트
  useFrame(() => {
    // if (bokehPassRef.current) {
    //   // Z축 중심부 (camera와 Z=0 사이의 거리)
    //   const focusDistance = Math.abs(camera.position.z - 0); // Z=0 기준
    //   (bokehPassRef.current.uniforms as any).focus.value = focusDistance; // 초점 거리 업데이트
    // }
    composerRef.current?.render();
  }, 1);

  return null;
}

export default BloomEffect;
