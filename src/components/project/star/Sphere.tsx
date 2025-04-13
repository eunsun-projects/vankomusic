'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useEditStarsMutation } from '@/hooks/mutations/stars.mutation';
import { useStarStore } from '@/stores/zustand';
import { StarFromSupabase } from '@/types/projects.type';
import { Sphere, shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Import shaders for power level 15 (Moon)
import fragmentShader15 from '@/shaders/fragment15.glsl';
import vertexShader15 from '@/shaders/vertex15.glsl';

// Import shaders for power level 25 (Jupiter)
import fragmentShader25 from '@/shaders/fragment25.glsl';
import vertexShader25 from '@/shaders/vertex25.glsl';

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

// Register materials for JSX
extend({ MoonMaterial, JupiterMaterial });

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
        // Added Jupiter material type
        ref?: React.RefObject<THREE.ShaderMaterial>;
        time?: number;
        color?: THREE.ColorRepresentation;
        attach: string;
      };
    }
  }
}

interface SphereProps {
  star: StarFromSupabase;
}

function PureSphere({ star }: SphereProps, ref: React.Ref<THREE.Mesh>) {
  const { focusedStar } = useStarStore();
  const { mutate: editStar, isPending, error } = useEditStarsMutation();
  const { user } = useAuth();

  // Refs for shader materials
  const moonMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const jupiterMaterialRef = useRef<THREE.ShaderMaterial>(null); // Added Jupiter ref

  const sphereColor = useMemo(() => {
    try {
      return new THREE.Color(star.color);
    } catch (e) {
      console.error(`Invalid color format for star ${star.id}: ${star.color}`, e);
      return new THREE.Color(0xffffff);
    }
  }, [star]);

  useEffect(() => {
    console.log(
      'Star ID:',
      star.id,
      'Power:',
      star.power,
      'Using Jupiter shader:',
      star.power >= 25,
      'Using Moon shader:',
      star.power >= 15 && star.power < 25,
    );
  }, [star.id, star.power]);

  // Update shader time uniform based on current material
  useFrame((state) => {
    const currentMaterialRef =
      star.power >= 25 ? jupiterMaterialRef : star.power >= 15 ? moonMaterialRef : null;
    if (currentMaterialRef?.current) {
      currentMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
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
    if (star.power >= 25) return baseScale * 1.5; // Larger scale for Jupiter
    return baseScale;
  }, [star.power, focusedStar, star.id]);

  return (
    <Sphere
      ref={ref}
      name={star.id}
      scale={scale} // Apply dynamic scale
      position={new THREE.Vector3(star.positions[0], star.positions[1], star.positions[2])}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      {star.power >= 25 ? (
        <jupiterMaterial ref={jupiterMaterialRef} color={sphereColor} time={0} attach="material" />
      ) : star.power >= 15 ? (
        <moonMaterial ref={moonMaterialRef} color={sphereColor} time={0} attach="material" />
      ) : (
        <meshStandardMaterial color={sphereColor} emissive={sphereColor} emissiveIntensity={0.1} />
      )}
    </Sphere>
  );
}

const SphereStar = forwardRef(PureSphere);
export default SphereStar;
