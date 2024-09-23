import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ShaderMaterial } from 'three';

const MovingGrid = () => {
  const gridRef = useRef<THREE.GridHelper>(null);
  const limit = 100;

  useEffect(() => {
    if (gridRef.current) {
      const division = 20;
      const moveable = [];
      for (let i = 0; i <= division; i++) {
        moveable.push(1, 1, 0, 0); // move horizontal lines only
      }
      gridRef.current.geometry.attributes.moveable = new THREE.BufferAttribute(
        new Uint8Array(moveable),
        1,
      );
    }
  }, []);

  useFrame(({ clock }) => {
    if (gridRef.current) {
      const time = clock.getElapsedTime();
      (gridRef.current.material as unknown as ShaderMaterial).uniforms.time.value = time;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[250, 20, '#80a6ed', '#80a6ed']}
      position={[0, -12, 0]}
      material={
        new THREE.ShaderMaterial({
          uniforms: {
            time: {
              value: 0,
            },
            limits: {
              value: new THREE.Vector2(-limit, limit),
            },
            speed: {
              value: 23, //5
            },
          },
          vertexShader: `
                        uniform float time;
                        uniform vec2 limits;
                        uniform float speed;
                        
                        attribute float moveable;
                        
                        varying vec3 vColor;
                    
                        void main() {
                        vColor = color;
                        float limLen = limits.y - limits.x;
                        vec3 pos = position;
                        if (floor(moveable + 0.5) > 0.5){ // if a point has "moveable" attribute = 1 
                            float dist = speed * time;
                            float currPos = mod((pos.z + dist) - limits.x, limLen) + limits.x;
                            pos.z = currPos;
                        } 
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
                        }
                    `,
          fragmentShader: `
                        varying vec3 vColor;
                    
                        void main() {
                        gl_FragColor = vec4(vColor, 1.);
                        }
                    `,
          vertexColors: true,
        }) as unknown as THREE.LineBasicMaterial
      }
    />
  );
};

export default MovingGrid;
