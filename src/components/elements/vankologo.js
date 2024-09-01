'use client'

import React from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF } from '@react-three/drei';

function VankoLogoModel(){
    // const loadedGlb = useLoader( GLTFLoader, '/assets/glbs/vankologo.glb' );
    const gltf = useGLTF('/assets/glbs/vankologo.glb')

    return(
        <>
        <primitive
            object={gltf.scene}
            rotation={[0,-1.57,0]}
            position={[0, -2.5, 0]}
            scale={[1.5,1.5,1.5]}
        >
        </primitive>
        <ambientLight 
            color={0xffffff}
            intensity={3.5}
        />

        <PerspectiveCamera />
        </>
    )
}

export default function VankoLogoCanvas(){
    return(
        <>
            <div style={{width:'20rem', height:'20rem', margin:'0 auto'}}>
                <Canvas
                    dpr={[2, 4]}
                    gl={gl => {
                        gl.gammaOutput = true;
                        gl.gammaFactor = 2.2;
                    }}
                >
                    <VankoLogoModel></VankoLogoModel>
                </Canvas>
            </div>
        </>
    )
}