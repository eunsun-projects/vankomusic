'use client'
import React,{ useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei"; // `drei` 라이브러리를 사용하여 간단한 Box 컴포넌트를 가져옵니다.

function loadImageToCanvas(url, canvas) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0, img.width, img.height);
            resolve();
        };
        img.onerror = reject;
        img.src = url;
    });
}

async function extractColorsFromBMP(url) {
    const canvas = document.createElement('canvas');
    await loadImageToCanvas(url, canvas);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const width = canvas.width;
    const height = canvas.height;
    const colors = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const data = ctx.getImageData(x, y, 1, 1).data;
            const colorValue = new THREE.Color( `rgb(${data[0]}, ${data[1]}, ${data[2]})` );
            colors.push(colorValue)
        }
    }
    return colors;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
    if((r === 0) && (g === 0) && (b ===0)){
        return "000000"
    }else{  
        return ((r << 16) | (g << 8) | b).toString(16);
    }
}

const BoxGrid = () => {
    const {gl} = useThree();
    const size = 0.4; // 각 상자의 크기
    const gap = 0.001; // 상자 사이의 간격
    const totalSize = 30 * (size + gap);
    const totalWidth = (size + gap) * 30 - gap;
    const totalHeight = (size + gap) * 30 - gap;

    // const { gl, scene } = useThree();
    const [colorArr, setColorArr] = useState(null);
    // const [active, setActive] = useState(false);

    useEffect(()=>{
        extractColorsFromBMP('/assets/img/vanko_profile_pixel.bmp')
        .then((colors)=> {
            const reverse = colors.reverse();
            // console.log(reverse)
            setColorArr(reverse);
        });
        return()=>{
            if(gl) gl.dispose();
        }
    },[])
    
        return (
            <>

                <directionalLight 
                    castShadow
                    color={0xffffff}
                    intensity={8}
                />
                <ambientLight 
                    color={0xffffff}
                    intensity={8}
                />
                {colorArr && colorArr.map((color, index) => {
                    const row = Math.floor(index / 30);
                    const col = index % 30;

                    return(
                        <group key={index} position={[-totalWidth / 2 + size / 2, -totalHeight / 2 + size / 2, 0]}>
                            <mesh
                                position={[
                                    col * (size + gap),
                                    row * (size + gap),
                                    0
                                ]}
                                visible={color.r === 1 && color.g === 1 && color.b ===1 ? false : true}
                                receiveShadow
                                castShadow
                            >
                                <boxGeometry 
                                    args={[size, size, size]} 
                                />
                                <meshPhongMaterial attach="material" color={ color } />
                            </mesh>
                        </group>
                    )
                })}
                <perspectiveCamera />
                <OrbitControls 
                    enableZoom={true}
                    enableRotate={true}
                    enablePan={true}
                    minDistance={12.5}
                    maxDistance={13}
                />
            </>
        )
};

export default function VankoProfile() {
    return (
        <Canvas 
            linear
            // background={'#ffffff'}
            dpr={[1, 2]}
            gl={gl => {
                gl.gammaOutput = true;
                gl.gammaFactor = 2.2;
            }}
        >
            <BoxGrid />
        </Canvas>
    );
}