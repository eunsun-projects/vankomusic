import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Circle, Trail } from '@react-three/drei';
// import * as THREE from 'three';

export default function StarTrail({position}) {
    const starRef = useRef();

    useFrame((state, delta) => {
        if (starRef.current) {
            starRef.current.position.x -= delta * 120;
            starRef.current.position.y -= delta * 120;
        }
    });

    return (
        <Trail
            width={8} // Width of the line
            color={'white'} // Color of the line
            length={5} // Length of the line
            decay={1} // How fast the line fades away
            local={false} // Wether to use the target's world or local positions
            stride={0} // Min distance between previous and current point
            interval={1} // Number of frames to wait before next calculation
            target={undefined} // Optional target. This object will produce the trail.
            attenuation={(width) => width} // A function to define the width in each point along it.
            >
            <Circle ref={starRef} position={position} scale={[1.3, 1.3, 1.3]} args={[1, 8]} color='skyblue' emissive={'white'} emissiveIntensity={20}/>
        </Trail>
    );
}

// export default function StarTrail({position}) {
//     const starRef = useRef();
//     const refs = useRef({});
//     // const trailRef = useRef();

//     // const previousStarPosition = useRef(new THREE.Vector3(40, 80, -40)); // 별의 이전 위치

//     useEffect(() => {

//         // if (trailRef.current) {
//         //     const positions = new Float32Array(100 * 3); // 100개의 파티클
//         //     for (let i = 0; i < positions.length; i++) {
//         //       positions[i] = Math.random() * 50 - 25; // 초기 위치 무작위 설정
//         //     }
//         //     trailRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//         // }
//     }, []);

//     useFrame((state, delta) => {

//         if (starRef.current && refs.current) {
//             starRef.current.position.x -= delta * 80;
//             starRef.current.position.y -= delta * 80;

//             refs.current.trail01.position.x -= delta * 79.9;
//             refs.current.trail01.position.y -= delta * 79.9;

//             refs.current.trail02.position.x -= delta * 79.87;
//             refs.current.trail02.position.y -= delta * 79.87;

//             refs.current.trail03.position.x -= delta * 79.85;
//             refs.current.trail03.position.y -= delta * 79.85;

//             refs.current.trail04.position.x -= delta * 79.83;
//             refs.current.trail04.position.y -= delta * 79.83;

//             refs.current.trail05.position.x -= delta * 79.81;
//             refs.current.trail05.position.y -= delta * 79.81;
//         }
//         // if (starRef.current && trailRef.current) {
//         //     starRef.current.position.x -= delta * 7;
//         //     starRef.current.position.y -= delta * 7;

//         //     const positions = trailRef.current.geometry.attributes.position;
//         //     for (let i = 0; i < positions.count; i++) {
//         //         const lerpAmount = -50; // 보간 비율 조절
//         //         const prevPosition = new THREE.Vector3();
//         //         prevPosition.lerpVectors(previousStarPosition.current, starRef.current.position, lerpAmount);
//         //         positions.setXYZ(i, prevPosition.x, prevPosition.y, prevPosition.z);
//         //     }
//         //     positions.needsUpdate = true;

//         //     // 별의 현재 위치를 이전 위치로 업데이트
//         //     previousStarPosition.current.copy(starRef.current.position);
//         // }
//     });

//     return (
//         <group>
//             <Circle ref={starRef} position={position} scale={[3, 3, 3]} args={[1, 8]} color='skyblue' emissive={'white'} emissiveIntensity={20}/>
//             <Circle ref={(element) => element && (refs.current['trail01'] = element)} position={[position[0] + 2, position[1] + 1, position[2]]} scale={[2.5, 2.5, 2.5]} args={[1, 6]} color='skyblue' emissive={'white'} emissiveIntensity={20}/>
//             <Circle ref={(element) => element && (refs.current['trail02'] = element)} position={[position[0] + 4, position[1] + 3, position[2]]} scale={[2, 2, 2]} args={[1, 6]} color='skyblue' emissive={'white'} emissiveIntensity={20}/>
//             <Circle ref={(element) => element && (refs.current['trail03'] = element)} position={[position[0] + 6, position[1] + 5, position[2]]} scale={[1.5, 1.5, 1.5]} args={[1, 6]} color='skyblue' emissive={'white'} emissiveIntensity={20}/>
//             <Circle ref={(element) => element && (refs.current['trail04'] = element)} position={[position[0] + 8, position[1] + 6, position[2]]} scale={[1, 1, 1]} args={[1, 6]} color='skyblue' emissive={'white'} emissiveIntensity={20}/>
//             <Circle ref={(element) => element && (refs.current['trail05'] = element)} position={[position[0] + 8.5, position[1] + 7, position[2]]} scale={[0.8, 0.8, 0.8]} args={[1, 6]} color='skyblue' emissive={'white'} emissiveIntensity={20}/>

//             {/* <pointLight
//                 color={0xffee88}
//                 intensity={2}
//                 distance={100}
//                 decay={2}
//                 position={[3.5,0,0]}
//                 ref={lightRef}
//                 castShadow
//             ></pointLight> */}

//             {/* <points ref={trailRef}>
//                 <bufferGeometry attach="geometry" />
//                 <pointsMaterial attach="material" size={1} color="skyblue" />
//             </points> */}
//         </group>
//     );
// }
