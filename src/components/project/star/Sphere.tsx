'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useEditStarsMutation } from '@/hooks/mutations/stars.mutation';
import { useStarStore } from '@/stores/zustand';
import { StarFromSupabase } from '@/types/projects.type';
import { Ring, Sphere, shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Import shaders for power level 15 (Moon)
import fragmentShader15 from '@/shaders/fragment15.glsl';
import vertexShader15 from '@/shaders/vertex15.glsl';

// Import shaders for power level 25 (Jupiter)
import fragmentShader25 from '@/shaders/fragment25.glsl';
import vertexShader25 from '@/shaders/vertex25.glsl';

// Import shaders for power level 40 (Saturn)
import fragmentShader40 from '@/shaders/fragment40.glsl';
import vertexShader40 from '@/shaders/vertex40.glsl';

// Import shaders for power level 60
import fragmentShader60 from '@/shaders/fragment60.glsl';
import vertexShader60 from '@/shaders/vertex60.glsl';

// Import shaders for power level 100 (Sun)
import fragmentShader100 from '@/shaders/fragment100.glsl';
import vertexShader100 from '@/shaders/vertex100.glsl';

// Material for power level 15 (Moon)
const MoonMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0xffffff),
  },
  vertexShader15,
  fragmentShader15,
  (material) => {
    if (material) {
      material.transparent = false;
      material.side = THREE.DoubleSide;
    }
  },
);

// Material for power level 25 (Jupiter)
const JupiterMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0xffffff), // Base color (may not be used much)
  },
  vertexShader25,
  fragmentShader25,
  (material) => {
    if (material) {
      material.transparent = false;
      material.side = THREE.DoubleSide;
    }
  },
);

// Material for power level 40 (Saturn)
const SaturnMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0xffffff),
  },
  vertexShader40,
  fragmentShader40,
  (material) => {
    if (material) {
      material.transparent = false;
      material.side = THREE.DoubleSide;
    }
  },
);

// Material for power level 60
const Power60Material = shaderMaterial(
  {
    uTime: 0,
    uPointSize: 5.0, // Default point size, adjust as needed if using points
    color: new THREE.Color(0xffffff), // Base color (might be overridden by shader)
  },
  vertexShader60,
  fragmentShader60,
  (material) => {
    if (material) {
      material.transparent = false;
      material.side = THREE.DoubleSide;
    }
  },
);

// Material for power level 100 (Sun)
const Power100Material = shaderMaterial(
  {
    uTime: 0,
    uPointSize: 5.0, // Keep for consistency, though not directly used by frag shader
    color: new THREE.Color(0xffffff),
  },
  vertexShader100,
  fragmentShader100,
  (material) => {
    if (material) {
      material.transparent = false;
      material.side = THREE.DoubleSide;
    }
  },
);

// Register materials for JSX
extend({ MoonMaterial, JupiterMaterial, SaturnMaterial, Power60Material, Power100Material });

// Add type declarations for the new materials
declare global {
  namespace JSX {
    interface IntrinsicElements {
      moonMaterial: {
        ref?: React.RefObject<THREE.ShaderMaterial>;
        time?: number;
        color?: THREE.ColorRepresentation;
        attach: string;
      };
      jupiterMaterial: {
        ref?: React.RefObject<THREE.ShaderMaterial>;
        time?: number;
        color?: THREE.ColorRepresentation;
        attach: string;
      };
      saturnMaterial: {
        ref?: React.RefObject<THREE.ShaderMaterial>;
        time?: number;
        color?: THREE.ColorRepresentation;
        attach: string;
      };
      power60Material: {
        ref?: React.RefObject<THREE.ShaderMaterial>;
        uTime?: number;
        uPointSize?: number;
        color?: THREE.ColorRepresentation;
        attach: string;
      };
      power100Material: {
        ref?: React.RefObject<THREE.ShaderMaterial>;
        uTime?: number;
        uPointSize?: number;
        color?: THREE.ColorRepresentation;
        attach: string;
      };
    }
  }
}

interface SphereProps {
  star: StarFromSupabase;
  name: string;
}

function PureSphere({ star, name }: SphereProps, ref: React.Ref<THREE.Group | THREE.Mesh>) {
  const { focusedStar } = useStarStore();
  const { mutate: editStar, isPending, error } = useEditStarsMutation();
  const { user } = useAuth();

  // Refs for shader materials
  const moonMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const jupiterMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const saturnMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const power60MaterialRef = useRef<THREE.ShaderMaterial>(null);
  const power100MaterialRef = useRef<THREE.ShaderMaterial>(null);

  const sphereColor = useMemo(() => {
    try {
      return new THREE.Color(star.color);
    } catch (e) {
      console.error(`Invalid color format for star ${star.id}: ${star.color}`, e);
      return new THREE.Color(0xffffff);
    }
  }, [star]);

  useEffect(() => {
    let shaderType = 'Standard';
    if (star.power >= 100) shaderType = 'Power100';
    else if (star.power >= 60) shaderType = 'Power60';
    else if (star.power >= 40) shaderType = 'Saturn';
    else if (star.power >= 25) shaderType = 'Jupiter';
    else if (star.power >= 15) shaderType = 'Moon';
    console.log('Star ID:', star.id, 'Power:', star.power, 'Using Shader:', shaderType);
  }, [star.id, star.power]);

  // Update shader time uniform based on current material
  useFrame((state) => {
    let currentMaterialRef: React.RefObject<THREE.ShaderMaterial> | null = null;
    if (star.power >= 100) {
      currentMaterialRef = power100MaterialRef;
    } else if (star.power >= 60) {
      currentMaterialRef = power60MaterialRef;
    } else if (star.power >= 40) {
      currentMaterialRef = saturnMaterialRef;
    } else if (star.power >= 25) {
      currentMaterialRef = jupiterMaterialRef;
    } else if (star.power >= 15) {
      currentMaterialRef = moonMaterialRef;
    }

    if (currentMaterialRef?.current?.uniforms?.time) {
      currentMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    // Also update uTime for power60Material specifically
    if (star.power >= 60 && power60MaterialRef.current?.uniforms?.uTime) {
      power60MaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Update uPointSize if you plan dynamic sizing, otherwise keep default
      // power60MaterialRef.current.uniforms.uPointSize.value = someDynamicValue;
    }
    // Update uTime for power100Material
    if (star.power >= 100 && power100MaterialRef.current?.uniforms?.uTime) {
      power100MaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const handleClick = () => {
    if (!user) return;
    const newPower = star.power + 1;
    let newColor = star.color;

    // Existing color logic for power 10...
    if (newPower === 10) {
      const match = star.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
        const [h, s, l] = match.slice(1).map(Number);
        newColor = `hsl(${h}, ${Math.min(s + 20, 100)}%, ${l}%)`;
      } else {
        try {
          const tempColor = new THREE.Color(star.color);
          const hsl = tempColor.getHSL({ h: 0, s: 0, l: 0 });
          newColor = `hsl(${Math.round(hsl.h * 360)}, ${Math.min(Math.round(hsl.s * 100) + 20, 100)}%, ${Math.round(hsl.l * 100)}%)`;
        } catch {
          newColor = star.color;
        }
      }
    }

    editStar({
      ...star,
      power: newPower,
      color: newColor,
      last_touched_at: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (error) {
      console.error('Error editing star:', error);
    }
  }, [error]);

  // Determine scale based on power level
  const scale = useMemo(() => {
    const baseScale = focusedStar?.id === star.id ? 0.4 : 0.25;
    if (star.power >= 100) return baseScale * 5; // Even larger scale for Power 100
    if (star.power >= 60) return baseScale * 2.0; // Larger scale for Power 60
    if (star.power >= 25) return baseScale * 1.5; // Scale for Jupiter and Saturn
    return baseScale; // Base scale for others
  }, [star.power, focusedStar, star.id]);

  const ringInnerRadius = scale * 1.5; // Adjust as needed
  const ringOuterRadius = scale * 2.2; // Adjust as needed

  // Return a group containing the Sphere and conditionally the Ring
  if (star.power >= 100) {
    // Return Sphere for Power >= 100
    return (
      <Sphere
        ref={ref as React.Ref<THREE.Mesh>} // Cast ref to Mesh
        name={star.id} // Name the sphere
        scale={scale}
        position={new THREE.Vector3(star.positions[0], star.positions[1], star.positions[2])}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <power100Material
          ref={power100MaterialRef}
          uTime={0}
          uPointSize={5.0} // Keep for uniform consistency
          attach="material"
        />
      </Sphere>
    );
  } else if (star.power >= 60) {
    // Return Sphere for Power >= 60
    return (
      <Sphere
        ref={ref as React.Ref<THREE.Mesh>} // Cast ref to Mesh
        name={star.id} // Name the sphere
        scale={scale}
        position={new THREE.Vector3(star.positions[0], star.positions[1], star.positions[2])}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <power60Material
          ref={power60MaterialRef}
          uTime={0}
          uPointSize={5.0} // Pass initial value
          attach="material"
          // color={sphereColor} // Color is handled internally by shader
        />
      </Sphere>
    );
  } else if (star.power >= 40) {
    // Return Group for Saturn + Ring
    return (
      <group
        ref={ref as React.Ref<THREE.Group>} // Cast ref
        name={star.id} // Name the group
        position={new THREE.Vector3(star.positions[0], star.positions[1], star.positions[2])}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <Sphere scale={scale}>
          <saturnMaterial ref={saturnMaterialRef} color={sphereColor} time={0} attach="material" />
        </Sphere>
        <Ring args={[ringInnerRadius, ringOuterRadius, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#FFE0B2"
            emissive="#FFB74D"
            emissiveIntensity={0.25}
            metalness={0.7}
            roughness={0.2}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </Ring>
      </group>
    );
  } else {
    // Return Sphere directly for Moon, Jupiter, or Standard
    return (
      <Sphere
        ref={ref as React.Ref<THREE.Mesh>} // Cast ref
        name={star.id} // Name the sphere
        scale={scale}
        position={new THREE.Vector3(star.positions[0], star.positions[1], star.positions[2])}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        {star.power >= 25 ? (
          <jupiterMaterial
            ref={jupiterMaterialRef}
            color={sphereColor}
            time={0}
            attach="material"
          />
        ) : star.power >= 15 ? (
          <moonMaterial ref={moonMaterialRef} color={sphereColor} time={0} attach="material" />
        ) : (
          <meshStandardMaterial
            color={sphereColor}
            emissive={sphereColor}
            emissiveIntensity={0.1}
          />
        )}
      </Sphere>
    );
  }
}

const SphereStar = forwardRef(PureSphere);
export default SphereStar;
