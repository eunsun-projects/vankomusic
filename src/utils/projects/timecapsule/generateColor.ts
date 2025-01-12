import * as THREE from 'three';

export const generateColor = () => {
  return new THREE.Color(
    `hsl(${Math.random() * 360}, ${50 + Math.random() * 45}%, ${70 + Math.random() * 20}%)`,
  );
};
