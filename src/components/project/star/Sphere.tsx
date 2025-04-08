'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useEditStarsMutation } from '@/hooks/mutations/stars.mutation';
import { useStarStore } from '@/stores/zustand';
import { StarFromSupabase } from '@/types/projects.type';
import { Sphere, shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Vertex shader
const moonVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader
const moonFragmentShader = `
  uniform float time;
  uniform vec3 color; // Base color passed from component

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simple noise function (can be replaced with a more complex one if needed)
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12, 78))) * 458.5453);
  }

  // Function to create multiple layers of noise for detail
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.8;
    float frequency = 0.0;
    for (int i = 0; i < 3; i++) { // Combine 6 layers of noise
      value += amplitude * noise(p);
      p *= 1.0; // Double frequency
      amplitude *= 0.9; // Halve amplitude
    }
    return value;
  }

  void main() {
    // Use fbm (fractal Brownian motion) for a more detailed surface
    // Scale the UV coordinates to control the noise pattern size
    vec2 scaledUv = vUv * 0.001; // 1.5; // Was 5.0
    float surfaceNoise = fbm(scaledUv);

    // Add another layer of noise for larger features (like maria/seas)
    // Reduce the multiplier to make these features larger
    float largeFeatures = noise(vUv * 0.05); // Was 1.5
    surfaceNoise = mix(surfaceNoise, largeFeatures * 0.5, 0.3); // Blend large features

    // Use the noise to modulate the base color (make darker areas)
    // We use the base color 'color' and darken it based on noise
    vec3 surfaceColor = color * (0.6 + 0.4 * surfaceNoise); // Adjust brightness range

    // Add subtle crater-like details using smoothstep
    // Reduce the multiplier to make craters larger and less frequent
    float craters = smoothstep(0.65, 0.7, noise(vUv * 5.0)); // Was 25.0
    vec3 finalColor = mix(surfaceColor, surfaceColor * 0.7, craters * 0.5); // Darken slightly for craters

    // Basic lighting approximation based on normal (optional, can be improved)
    float light = dot(vNormal, normalize(vec3(0.5, 0.5, 1.0))); // Simple directional light
    finalColor *= (0.7 + 0.3 * light); // Apply subtle lighting

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Create moon material with proper callback for additional properties
const MoonMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0xffffff),
  },
  moonVertexShader,
  moonFragmentShader,
  (material) => {
    if (material) {
      material.transparent = false;
      material.side = THREE.DoubleSide;
    }
  },
);

// Register the material to make it available in JSX
extend({ MoonMaterial });

// Add type declaration for the new material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      moonMaterial: {
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

  // Reference to moon material for updating uniforms
  const moonMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // Convert star.color string to THREE.Color object once
  const sphereColor = useMemo(() => {
    try {
      return new THREE.Color(star.color);
    } catch (e) {
      console.error(`Invalid color format for star ${star.id}: ${star.color}`, e);
      return new THREE.Color(0xffffff); // Fallback color
    }
  }, [star]);

  useEffect(() => {
    console.log(
      'Star ID:',
      star.id,
      'Power:',
      star.power,
      'Color:',
      star.color,
      'Parsed Color:',
      sphereColor,
    );
    console.log('Using moon shader:', star.power >= 15);
  }, [star.id, star.power, star.color, sphereColor]);

  // Update shader time uniform
  useFrame((state) => {
    if (moonMaterialRef.current && star.power >= 15) {
      moonMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const handleClick = () => {
    if (!user) return;

    const newPower = star.power + 1;
    let newColor = star.color;

    if (newPower === 10) {
      const match = star.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
        const [h, s, l] = match.slice(1).map(Number);
        newColor = `hsl(${h}, ${Math.min(s + 20, 100)}%, ${l}%)`;
      } else {
        // Handle cases where color might not be in expected HSL format
        console.warn(
          `Star ${star.id} color ${star.color} not in expected hsl format for power up.`,
        );
        // Attempt to parse and saturate anyway, or use a default logic
        try {
          const tempColor = new THREE.Color(star.color);
          const hsl = tempColor.getHSL({ h: 0, s: 0, l: 0 });
          newColor = `hsl(${Math.round(hsl.h * 360)}, ${Math.min(Math.round(hsl.s * 100) + 20, 100)}%, ${Math.round(hsl.l * 100)}%)`;
        } catch {
          // If parsing fails, keep original color or set a default
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

  const shouldUseMoonMaterial = star.power >= 15;

  return (
    <Sphere
      ref={ref}
      name={star.id}
      scale={focusedStar?.id === star.id ? 0.4 : 0.25}
      position={new THREE.Vector3(star.positions[0], star.positions[1], star.positions[2])}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      {shouldUseMoonMaterial ? (
        <moonMaterial ref={moonMaterialRef} color={sphereColor} time={0} attach="material" />
      ) : (
        <meshStandardMaterial color={sphereColor} emissive={sphereColor} emissiveIntensity={0.1} />
      )}
    </Sphere>
  );
}

const SphereStar = forwardRef(PureSphere);
export default SphereStar;
