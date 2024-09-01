"use client"
import React, {useRef, forwardRef} from "react";
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, DoubleSide } from 'three'

const EarthDayMap = "/assets/img/earth_daymap.jpg";

const Earth = React.forwardRef((props, ref) => {
    // const earthRef = useRef();

    const [ colorMap, ] = useLoader( TextureLoader, [EarthDayMap] );

    // //회전을 위해
    // useFrame(({ clock }) => {
    //     const elapsedTime = clock.getElapsedTime();
    //     earthRef.current.rotation.y = elapsedTime / 4;
    // });

    return(
        <mesh ref={ref} position={[0, 6, 5]}>
            <sphereGeometry args={[2, 32, 32]} />
            {/* <meshPhongMaterial specularMap={specularMap} /> */}
            <meshStandardMaterial
                map={colorMap}
                // normalMap={normalMap}
                emissive="#fff8db"
                emissiveIntensity={0.09}
            />
        </mesh>
    )
})

Earth.displayName = "Earth";
export default Earth