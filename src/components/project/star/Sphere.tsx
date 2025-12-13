// @ts-nocheck - Custom shader materials type definitions
"use client";

import { Ring, Sphere, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import useAuth from "@/hooks/auth/auth.hook";
import { useEditStarsMutation } from "@/hooks/mutations/stars.mutation";
// Import shaders for power level 15 (Moon)
import fragmentShader15 from "@/shaders/fragment15.glsl";
// Import shaders for power level 25 (Jupiter)
import fragmentShader25 from "@/shaders/fragment25.glsl";
// Import shaders for power level 40 (Saturn)
import fragmentShader40 from "@/shaders/fragment40.glsl";
// Import shaders for power level 60
import fragmentShader60 from "@/shaders/fragment60.glsl";
// Import shaders for power level 80 (Supernova)
import fragmentShader80 from "@/shaders/fragment80.glsl";
// Import shaders for power level 100 (Sun)
import fragmentShader100 from "@/shaders/fragment100.glsl";
import vertexShader15 from "@/shaders/vertex15.glsl";
import vertexShader25 from "@/shaders/vertex25.glsl";
import vertexShader40 from "@/shaders/vertex40.glsl";
import vertexShader60 from "@/shaders/vertex60.glsl";
import vertexShader80 from "@/shaders/vertex80.glsl";
import vertexShader100 from "@/shaders/vertex100.glsl";
import { useStarStore } from "@/stores/zustand";
import type { StarFromSupabase } from "@/types/projects.type";

// Material for power level 15 (Moon) -> Now Moon/Jupiter Cross-fading
const MoonMaterial = shaderMaterial(
	{
		time: 0,
		color: new THREE.Color(0xffffff),
		mixWeight: 0.0, // Initialize mixWeight
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

// Material for power level 25 (Jupiter) -> Now Jupiter/Saturn Cross-fading
const JupiterMaterial = shaderMaterial(
	{
		time: 0,
		color: new THREE.Color(0xffffff), // Base color (used by Saturn logic)
		mixWeight: 0.0, // Initialize mixWeight
	},
	vertexShader25, // Uses the standard vertex shader
	fragmentShader25,
	(material) => {
		if (material) {
			material.transparent = false;
			material.side = THREE.DoubleSide;
		}
	},
);

// Material for power level 40 (Saturn) -> Now Saturn/Power60 Cross-fading
const SaturnMaterial = shaderMaterial(
	{
		time: 0, // Used by Saturn vertex/fragment
		uTime: 0, // Used by integrated Power 60 fragment logic
		color: new THREE.Color(0xffffff),
		mixWeight: 0.0, // Initialize mixWeight
	},
	vertexShader40, // Uses vertex40 (which now also uses time)
	fragmentShader40, // Uses fragment40 (which now combines Saturn/P60 and uses time & uTime)
	(material) => {
		if (material) {
			material.transparent = false;
			material.side = THREE.DoubleSide;
		}
	},
);

// Material for power level 60 -> Now Power60/Power80 Cross-fading
const Power60Material = shaderMaterial(
	{
		uTime: 0,
		uPointSize: 5.0, // Default point size, adjust as needed if using points
		color: new THREE.Color(0xffffff), // Base color (might be overridden by shader)
		mixWeight: 0.0, // Initialize mixWeight
	},
	vertexShader60, // Uses vertex60
	fragmentShader60, // Uses fragment60 (which now combines P60/P80)
	(material) => {
		if (material) {
			material.transparent = false;
			material.side = THREE.DoubleSide;
		}
	},
);

// Material for power level 80 (Supernova) -> Now Power80/Power100 Cross-fading
const Power80Material = shaderMaterial(
	{
		uTime: 0,
		uPointSize: 5.0, // Consistent uniform, might be used differently
		color: new THREE.Color(0xffffff), // Base color
		mixWeight: 0.0, // Initialize mixWeight
	},
	vertexShader80, // Uses vertex80
	fragmentShader80, // Uses fragment80 (which might combine P80/P100)
	(material) => {
		if (material) {
			material.transparent = false; // Adjust if supernova effect needs transparency
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
extend({
	MoonMaterial,
	JupiterMaterial,
	SaturnMaterial,
	Power60Material,
	Power80Material,
	Power100Material,
});

// Add type declarations for the new materials
declare global {
	namespace JSX {
		interface IntrinsicElements {
			moonMaterial: {
				ref?: React.RefObject<THREE.ShaderMaterial>;
				time?: number;
				color?: THREE.ColorRepresentation;
				mixWeight?: number; // Add mixWeight prop
				attach: string;
			};
			jupiterMaterial: {
				ref?: React.RefObject<THREE.ShaderMaterial>;
				time?: number;
				color?: THREE.ColorRepresentation;
				mixWeight?: number; // Add mixWeight prop
				attach: string;
			};
			saturnMaterial: {
				ref?: React.RefObject<THREE.ShaderMaterial>;
				time?: number;
				uTime?: number; // Add uTime for P60 logic
				color?: THREE.ColorRepresentation;
				mixWeight?: number; // Add mixWeight prop
				attach: string;
			};
			power60Material: {
				ref?: React.RefObject<THREE.ShaderMaterial>;
				uTime?: number;
				uPointSize?: number;
				color?: THREE.ColorRepresentation;
				mixWeight?: number; // Add mixWeight prop
				attach: string;
			};
			power80Material: {
				ref?: React.RefObject<THREE.ShaderMaterial>;
				uTime?: number;
				uPointSize?: number;
				color?: THREE.ColorRepresentation;
				mixWeight?: number; // Add mixWeight prop
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

function PureSphere(
	{ star, name }: SphereProps,
	ref: React.Ref<THREE.Group | THREE.Mesh>,
) {
	const { focusedStar } = useStarStore();
	const { mutate: editStar, isPending, error } = useEditStarsMutation();
	const { user } = useAuth();

	// Refs for shader materials
	const moonMaterialRef = useRef<THREE.ShaderMaterial>(null);
	const jupiterMaterialRef = useRef<THREE.ShaderMaterial>(null);
	const saturnMaterialRef = useRef<THREE.ShaderMaterial>(null);
	const power60MaterialRef = useRef<THREE.ShaderMaterial>(null);
	const power80MaterialRef = useRef<THREE.ShaderMaterial>(null);
	const power100MaterialRef = useRef<THREE.ShaderMaterial>(null);

	const sphereColor = useMemo(() => {
		try {
			return new THREE.Color(star.color);
		} catch (e) {
			console.error(
				`Invalid color format for star ${star.id}: ${star.color}`,
				e,
			);
			return new THREE.Color(0xffffff);
		}
	}, [star]);

	useEffect(() => {
		let shaderType = "Standard";
		if (star.power >= 100) shaderType = "Power100";
		else if (star.power >= 80) shaderType = "Power80";
		else if (star.power >= 60) shaderType = "Power60";
		else if (star.power >= 40) shaderType = "Saturn";
		else if (star.power >= 25) shaderType = "Jupiter";
		else if (star.power >= 15) shaderType = "Moon";
		console.log(
			"Star ID:",
			star.id,
			"Power:",
			star.power,
			"Using Shader:",
			shaderType,
		);
	}, [star.id, star.power]);

	// Update shader time uniform based on current material
	useFrame((state) => {
		let currentMaterialRef: React.RefObject<THREE.ShaderMaterial | null> | null =
			null;
		let currentMixWeight_MoonJupiter = 0.0;
		let currentMixWeight_JupiterSaturn = 0.0;
		let currentMixWeight_SaturnPower60 = 0.0;
		let currentMixWeight_Power60Power80 = 0.0;
		let currentMixWeight_Power80Power100 = 0.0;

		if (star.power >= 100) {
			currentMaterialRef = power100MaterialRef;
			// Ensure previous mixes are complete
			currentMixWeight_Power80Power100 = 1.0;
			currentMixWeight_Power60Power80 = 1.0;
			currentMixWeight_SaturnPower60 = 1.0;
			currentMixWeight_JupiterSaturn = 1.0;
			currentMixWeight_MoonJupiter = 1.0;
		} else if (star.power >= 80) {
			currentMaterialRef = power80MaterialRef;
			// Calculate mixWeight for Power 80 -> Power 100 transition (Power 80-99)
			currentMixWeight_Power80Power100 = Math.min(
				1.0,
				Math.max(0.0, (star.power - 80) / (100 - 80)),
			);
			// Ensure previous mixes are complete
			currentMixWeight_Power60Power80 = 1.0;
			currentMixWeight_SaturnPower60 = 1.0;
			currentMixWeight_JupiterSaturn = 1.0;
			currentMixWeight_MoonJupiter = 1.0;
		} else if (star.power >= 60) {
			currentMaterialRef = power60MaterialRef;
			// Calculate mixWeight for Power 60 -> Power 80 transition (Power 60-79)
			currentMixWeight_Power60Power80 = Math.min(
				1.0,
				Math.max(0.0, (star.power - 60) / (80 - 60)),
			);
			// Ensure previous mixes are complete
			currentMixWeight_SaturnPower60 = 1.0;
			currentMixWeight_JupiterSaturn = 1.0;
			currentMixWeight_MoonJupiter = 1.0;
		} else if (star.power >= 40) {
			currentMaterialRef = saturnMaterialRef;
			// Calculate mixWeight for Saturn -> Power 60 transition (Power 40-59)
			currentMixWeight_SaturnPower60 = Math.min(
				1.0,
				Math.max(0.0, (star.power - 40) / (60 - 40)),
			);
			// Ensure previous mix is complete
			currentMixWeight_JupiterSaturn = 1.0;
		} else if (star.power >= 25) {
			currentMaterialRef = jupiterMaterialRef;
			// Calculate mixWeight for Jupiter -> Saturn transition (Power 25-39)
			// Ensure this is 1.0 if power >= 40
			currentMixWeight_JupiterSaturn =
				star.power >= 40
					? 1.0
					: Math.min(1.0, Math.max(0.0, (star.power - 25) / (40 - 25)));
			// Ensure previous mix is complete
			currentMixWeight_MoonJupiter = 1.0;
		} else if (star.power >= 15) {
			currentMaterialRef = moonMaterialRef;
			// Calculate mixWeight for Moon -> Jupiter transition (Power 15-24)
			// Ensure this is 1.0 if power >= 25
			currentMixWeight_MoonJupiter =
				star.power >= 25
					? 1.0
					: Math.min(1.0, Math.max(0.0, (star.power - 15) / (25 - 15)));
		}

		// Update time for all relevant shaders that use it
		if (currentMaterialRef?.current?.uniforms?.time) {
			currentMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
		}
		// uTime is used specifically by Power60, Power80, and Power100
		if (star.power >= 80 && power80MaterialRef.current?.uniforms?.uTime) {
			power80MaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
		}
		if (star.power >= 60 && power60MaterialRef.current?.uniforms?.uTime) {
			power60MaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
		}
		// Update uTime for power100Material
		if (star.power >= 100 && power100MaterialRef.current?.uniforms?.uTime) {
			power100MaterialRef.current.uniforms.uTime.value =
				state.clock.elapsedTime;
		}

		// Update mixWeight for MoonMaterial specifically
		if (
			currentMaterialRef === moonMaterialRef &&
			moonMaterialRef.current?.uniforms?.mixWeight
		) {
			moonMaterialRef.current.uniforms.mixWeight.value =
				currentMixWeight_MoonJupiter;
		}
		// Update mixWeight for JupiterMaterial specifically
		if (
			currentMaterialRef === jupiterMaterialRef &&
			jupiterMaterialRef.current?.uniforms?.mixWeight
		) {
			jupiterMaterialRef.current.uniforms.mixWeight.value =
				currentMixWeight_JupiterSaturn;
		}
		// Update mixWeight and uTime for SaturnMaterial specifically
		if (
			currentMaterialRef === saturnMaterialRef &&
			saturnMaterialRef.current?.uniforms
		) {
			saturnMaterialRef.current.uniforms.mixWeight.value =
				currentMixWeight_SaturnPower60;
			// Pass both time variables needed by the combined shader
			saturnMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
			saturnMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
		}
		// Update mixWeight for Power60Material specifically (now 60->80)
		if (
			currentMaterialRef === power60MaterialRef &&
			power60MaterialRef.current?.uniforms?.mixWeight
		) {
			power60MaterialRef.current.uniforms.mixWeight.value =
				currentMixWeight_Power60Power80;
		}
		// Update mixWeight for Power80Material specifically (80->100)
		if (
			currentMaterialRef === power80MaterialRef &&
			power80MaterialRef.current?.uniforms?.mixWeight
		) {
			power80MaterialRef.current.uniforms.mixWeight.value =
				currentMixWeight_Power80Power100;
			// Also update uTime if needed by this shader
			if (power80MaterialRef.current.uniforms.uTime) {
				power80MaterialRef.current.uniforms.uTime.value =
					state.clock.elapsedTime;
			}
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
			console.error("Error editing star:", error);
		}
	}, [error]);

	// Determine scale based on power level
	const scale = useMemo(() => {
		const baseScale = focusedStar?.id === star.id ? 0.4 : 0.25;
		if (star.power >= 100) return baseScale * 5; // Even larger scale for Power 100
		if (star.power >= 80) return baseScale * 3.0; // Scale for Power 80 (Supernova-like?)
		if (star.power >= 60) return baseScale * 2.0; // Scale for Power 60
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
				position={
					new THREE.Vector3(
						star.positions[0],
						star.positions[1],
						star.positions[2],
					)
				}
				onClick={handleClick}
				onPointerOver={() => (document.body.style.cursor = "pointer")}
				onPointerOut={() => (document.body.style.cursor = "default")}
			>
				<power100Material
					ref={power100MaterialRef}
					uTime={0}
					uPointSize={5.0} // Keep for uniform consistency
					attach="material"
				/>
			</Sphere>
		);
	} else if (star.power >= 80) {
		// Return Sphere for Power >= 80 (Supernova)
		return (
			<Sphere
				ref={ref as React.Ref<THREE.Mesh>} // Cast ref to Mesh
				name={star.id} // Name the sphere
				scale={scale}
				position={
					new THREE.Vector3(
						star.positions[0],
						star.positions[1],
						star.positions[2],
					)
				}
				onClick={handleClick}
				onPointerOver={() => (document.body.style.cursor = "pointer")}
				onPointerOut={() => (document.body.style.cursor = "default")}
			>
				<power80Material
					ref={power80MaterialRef}
					uTime={0}
					uPointSize={5.0} // Pass initial value
					mixWeight={0} // Initial mixWeight (for 80->100 fade)
					attach="material"
					// color={sphereColor} // Color might be handled internally
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
				position={
					new THREE.Vector3(
						star.positions[0],
						star.positions[1],
						star.positions[2],
					)
				}
				onClick={handleClick}
				onPointerOver={() => (document.body.style.cursor = "pointer")}
				onPointerOut={() => (document.body.style.cursor = "default")}
			>
				<power60Material
					ref={power60MaterialRef}
					uTime={0}
					uPointSize={5.0} // Pass initial value
					mixWeight={0} // Initial mixWeight (now for 60->80 fade)
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
				position={
					new THREE.Vector3(
						star.positions[0],
						star.positions[1],
						star.positions[2],
					)
				}
				onClick={handleClick}
				onPointerOver={() => (document.body.style.cursor = "pointer")}
				onPointerOut={() => (document.body.style.cursor = "default")}
			>
				<Sphere scale={scale}>
					{/* Power 40-59 uses SaturnMaterial with cross-fading */}
					<saturnMaterial
						ref={saturnMaterialRef}
						color={sphereColor}
						time={0}
						uTime={0} // Pass initial uTime
						mixWeight={0} // Initial mixWeight
						attach="material"
					/>
				</Sphere>
				<Ring
					args={[ringInnerRadius, ringOuterRadius, 64]}
					rotation={[Math.PI / 2, 0, 0]}
				>
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
				position={
					new THREE.Vector3(
						star.positions[0],
						star.positions[1],
						star.positions[2],
					)
				}
				onClick={handleClick}
				onPointerOver={() => (document.body.style.cursor = "pointer")}
				onPointerOut={() => (document.body.style.cursor = "default")}
			>
				{star.power >= 25 ? (
					// Power 25 to 39 uses JupiterMaterial with cross-fading to Saturn
					<jupiterMaterial
						ref={jupiterMaterialRef}
						color={sphereColor} // Pass color for Saturn blend
						time={0}
						mixWeight={0} // Initial value, updated by useFrame
						attach="material"
					/>
				) : star.power >= 15 ? (
					// Power 15 to 24 uses MoonMaterial with cross-fading to Jupiter
					<moonMaterial
						ref={moonMaterialRef}
						color={sphereColor}
						time={0}
						mixWeight={0} // Initial value, will be updated by useFrame
						attach="material"
					/>
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
