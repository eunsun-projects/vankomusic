"use client"
import styles from '@/app/modernmove/page.module.css'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useRef, useMemo, useEffect, useState, Suspense }  from 'react';
import { Canvas, extend, useThree, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, Stars, useAnimations, useSelect, Select, useCursor, Cloud, Circle} from '@react-three/drei';
import MoonLoaderBlack from './loaders/moonloaderblack';
import MoonLoaderDrei from './loaders/moonloaderDrei';
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing'
import CustomAudio from './customAudio';
import Earth from './earthmodern';
import MovingGrid from './movingGrid';
import generateBuildings from './hooks/generateBuildings';
import VaporwaveScene2d from './vaporScene2d';
import CrackRandom from "../elements/crackrandom";
import Firework from "./firework";
import { MovingStars } from './stars';
import StarTrail from './startrail';
import { sun } from './sun';
// import { ModelSelectContext } from '@/context/modelSelectContext';
// import { useSpring, a } from '@react-spring/three';
// import * as THREE from "three"
// import PartyTelevision from './partyTelevision';
// import Sprite from './gifSprite';

const folder = '/assets/glbs/';
const modelUrl = [ 
    `${folder}marble.glb`, 
    `${folder}stonetower_low.glb`, 
    `${folder}budha.glb`, 
    `${folder}fish_shaped_bun.glb`, 
    `${folder}maxwell_dance.glb`,
    `${folder}thinking.glb`,
    `${folder}cat_box.glb`,
    `${folder}cat_face.glb`,
    `${folder}tunnel2.glb`,
    `${folder}gwa_gwa_cat.glb`,
    `${folder}pinktrooper.glb`,
    `${folder}pinktrooper.glb`,
    `${folder}spam.glb`,
    `${folder}coupang_box.glb`,
    `${folder}slipwarning.glb`,
    `${folder}lamp.glb`,
    `${folder}lamp.glb`,
    `${folder}pinktrooper.glb`,
    `${folder}pinktrooper.glb`,
    `${folder}pinktrooper.glb`,
    `${folder}pinktrooper.glb`,
];
const modelData = [
    {
        name: 'caligula',
        model : undefined,
        position: [0, 1, 0.2], //17
        rotation: [0, 5, 0],
        scale: [0.36, 0.36, 0.36]
    },
    {
        name: 'stonetower',
        model: undefined,
        position: [0, 1, 1], // -8, 0, 22
        rotation: [0, 1, 0],
        scale: [19, 19, 19] //9,9,9
    },
    {
        name: 'budha',
        model: undefined,
        position: [0, 0, 3], //-0.5, 0, 23.5
        rotation: [0, -2, 0],
        scale: [29, 29, 29] // 15,15,15
    },
    {
        name: 'fish_shaped_bun',
        model: undefined,
        position: [0, 3, 0], //11, -2, 23
        rotation: [0, 0, 0], // 3.8
        scale: [0.1, 0.1, 0.1] // 3 3 3
    },
    {
        name: 'maxwell',
        model: undefined,
        position: [0, 3, 0], //5.8, 15, 4
        rotation: [0, -1, 0],
        scale: [0.35, 0.35, 0.35] //0.15
    },
    {
        name: 'thinking',
        model: undefined,
        position: [0, 8, 2], // -8, 7, 24
        rotation: [0, 0.7, 0],
        scale: [3, 3, 3]
    },
    {
        name: 'cat_box',
        model: undefined,
        position: [2, 2, 2], //5, 0, 26
        rotation: [0, -1.8, 0],
        scale: [1.5, 1.5, 1.5] // 0.4
    },
    {
        name: 'cat_face',
        model: undefined,
        position: [0, 5, 2], // -9.5, 2.7, 24
        rotation: [0, 0.6, 0],
        scale: [3, 3, 3] // 0.8
    },
    {
        name: 'tunnel',
        model: undefined,
        position: [0, 6, -80], // -9.5, 2.7, 24
        rotation: [0, -1.57, 0],
        scale: [8, 8, 8] // 0.8
    },
    {
        name: 'gwa_gwa_cat',
        model: undefined,
        position: [0, 3.5, 0], 
        rotation: [0, -1.57, 0.3],
        scale: [13, 13, 13] 
    },
    {
        name: 'dancing_stormtrooper',
        model: undefined,
        position: [-17, 0, 5], 
        rotation: [0, 0, 0],
        scale: [3.5, 3.5, 3.5] 
    },
    {
        name: 'dancing_stormtrooper2',
        model: undefined,
        position: [17, 0, 5], 
        rotation: [0, 0, 0],
        scale: [3.5, 3.5, 3.5] 
    },
    {
        name: 'spam',
        model: undefined,
        position: [0, 3, 0], 
        rotation: [0, 0, 0],
        scale: [1, 1, 1] 
    },
    {
        name: 'coupang_box',
        model: undefined,
        position: [0, 3, 0], 
        rotation: [-0.1, 0, 0],
        scale: [0.3, 0.3, 0.3] 
    },
    {
        name: 'slipwarning',
        model: undefined,
        position: [0, 3, 0], 
        rotation: [0, 0, 0],
        scale: [70, 70, 70] 
    },
    {
        name: 'lamp',
        model: undefined,
        position: [17, 0, 5], 
        rotation: [0, 3, 0],
        scale: [0.8, 0.8, 0.8] 
    },
    {
        name: 'lamp2',
        model: undefined,
        position: [-17, 0, 5], 
        rotation: [0, 0, 0],
        scale: [0.8, 0.8, 0.8] 
    },
    {
        name: 'dancing_stormtrooper3',
        model: undefined,
        position: [-15, 0, 19], 
        rotation: [0, 0, 0],
        scale: [3.5, 3.5, 3.5] 
    },
    {
        name: 'dancing_stormtrooper4',
        model: undefined,
        position: [15, 0, 19], 
        rotation: [0, 0, 0],
        scale: [3.5, 3.5, 3.5] 
    },
    {
        name: 'dancing_stormtrooper5',
        model: undefined,
        position: [-5, 0, 15], 
        rotation: [0, 0, 0],
        scale: [3.5, 3.5, 3.5] 
    },
    {
        name: 'dancing_stormtrooper6',
        model: undefined,
        position: [5, 0, 15], 
        rotation: [0, 0, 0],
        scale: [3.5, 3.5, 3.5] 
    },
];

function setSceneName(obj, name) {
    if (obj.hasOwnProperty('name')) {
        obj.name = name;
        // console.log('name setted!')
    }
    // 객체에 children 프로퍼티가 있고, children 배열에 요소가 있는 경우 각 요소를 재귀적으로 탐색합니다.
    if (obj.children && Array.isArray(obj.children) && obj.children.length > 0) {
        obj.children.forEach(child => {
            setSceneName(child, name);
        });
    }
};

function Model({audio, play, buildings, meteor, objet}) {
    // const [hovered, setHover] = useState(false);
    const loadedArr = useLoader( GLTFLoader, modelUrl );
    const maxwellAction = useAnimations(loadedArr[4].animations, loadedArr[4].scene);
    const catfaceAction = useAnimations(loadedArr[7].animations, loadedArr[7].scene);
    const stormTrooperAction = useAnimations(loadedArr[10].animations, loadedArr[10].scene);
    const stormTrooperAction2 = useAnimations(loadedArr[11].animations, loadedArr[11].scene);
    const stormTrooperAction3 = useAnimations(loadedArr[17].animations, loadedArr[17].scene);
    const stormTrooperAction4 = useAnimations(loadedArr[18].animations, loadedArr[18].scene);
    const stormTrooperAction5 = useAnimations(loadedArr[19].animations, loadedArr[19].scene);
    const stormTrooperAction6 = useAnimations(loadedArr[20].animations, loadedArr[20].scene);
    const [objects, setObjects] = useState(null);
    const [tunnel, setTunnel] = useState(false);
    const [lamp, setLamp] = useState(false);
    const [deem, setDeem] = useState(false);
    const [deem2, setDeem2] = useState(true);
    const [firework, setFirework] = useState(false);
    const [firework2, setFirework2] = useState(false);
    const [firework3, setFirework3] = useState(false);
    const [firework4, setFirework4] = useState(false);
    const [movStars, setMovStars] = useState(null);

    const refs = useRef({});
    const earthRef = useRef();
    const lastUpdateSecond = useRef(-1);

    const { scene } = useThree();
    // const selected = useSelect();
    // useCursor(hovered);

    function destroy(scene) {
        scene.traverse(object => {
            // Geometry 삭제
            if (object.geometry) {
                object.geometry.dispose();
                console.log('geo disposed!')
            }
            // Material 삭제
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => this.disposeMaterial(material));
                    console.log('material array disposed!')
                } else {
                    // 텍스처 삭제
                    if (object.material.map) object.material.map.dispose();
                    if (object.material.lightMap) object.material.lightMap.dispose();
                    if (object.material.bumpMap) object.material.bumpMap.dispose();
                    if (object.material.normalMap) object.material.normalMap.dispose();
                    if (object.material.specularMap) object.material.specularMap.dispose();
                    if (object.material.envMap) object.material.envMap.dispose();
                    // Material 자체 삭제
                    object.material.dispose();
                    console.log('material disposed!');
                }
            }
        })
    }
    
    // 회전 및 각종 애니메이션을 위해
    useFrame(({ clock }, delta) => {
        const elapsedTime = clock.getElapsedTime();
        const currentSecond = Math.floor(elapsedTime); // 현재 초를 정수로 가져옵니다.

        if (lastUpdateSecond.current !== currentSecond) {  // 마지막으로 업데이트된 초와 현재 초가 다르면
            if (currentSecond % 2 === 0) {  // 짝수초
                setLamp(false);
            } else {  // 홀수초
                setLamp(true);
            }
            lastUpdateSecond.current = currentSecond;  // 마지막으로 업데이트된 초를 현재 초로 업데이트합니다.
        }

        if(objects === 0 && play) {
            earthRef.current.position.z += delta * 12;
            earthRef.current.rotation.y += delta * 6.3;
        }
        if(objects === 1 && play) {            
            refs.current.caligula.position.z += delta * 12;
            refs.current.caligula.rotation.y += delta * 5;
        }
        if(objects === 2 && play) {
            refs.current.stonetower.position.z += delta * 12;
            refs.current.stonetower.rotation.y += delta * 5;
        }
        if(objects === 3 && play) {
            refs.current.budha.position.z += delta * 12;
            refs.current.budha.position.y = -1 + Math.sin(Date.now() / 1000) * 4; // 붓다 천천히 위 아래로 1
        }
        if(objects === 4 && play) {
            refs.current.fish_shaped_bun.position.z += delta * 12;
            refs.current.fish_shaped_bun.rotation.x += delta * 5;
        }
        if(objects === 5 && play) {
            refs.current.maxwell.position.z += delta * 12;
        }
        if(objects === 6 && play) {
            refs.current.thinking.position.z += delta * 12;
            refs.current.thinking.rotation.y += delta * 5; 
        }
        if(objects === 7 && play) {
            refs.current.cat_face.position.z += delta * 12;
        }
        if(objects === 8 && play) {
            refs.current.gwa_gwa_cat.position.z += delta * 12;
        }
        if(objects === 9 && play) {
            refs.current.spam.position.z += delta * 12;
        }
        if(objects === 10 && play) {
            refs.current.slipwarning.position.z += delta * 12;
        }
        if(tunnel && play) {
            refs.current.tunnel.position.z += delta * 6.3;
        }
        if(play) {
            refs.current.lamp.position.z += delta * 24;
            refs.current.lamp2.position.z += delta * 24;
        }
        if (deem && play ) {  // deem 일때 === 터널 지났을 때
            if (currentSecond % 2 === 0) {  // 짝수초
                setFirework(true);
                setFirework2(false);
                setFirework3(true);
                setFirework4(false);
            } else {  // 홀수초
                setFirework(false);
                setFirework2(true);
                setFirework3(false);
                setFirework4(true);
            }
        }

        if(movStars){
            movStars.update(delta * 20);
        }
    });

    useEffect(()=>{
        if(objet){
            const random = Math.floor(Math.random() * 11);
            setObjects(random);
            const timer = setTimeout(() => {
                setObjects(null);
                clearTimeout(timer);
            }, 2500);
        }

        function recieve(){
            let curr = audio.currentTime;

            if(curr > 93 && curr < 93.3 && play) {
                setTunnel(true);
                setDeem2(false);
            }
            if(curr > 126 && curr < 126.3 && play) {
                setTunnel(false);
                setDeem(true);
                setDeem2(true);
            }
        }

        function destroyAll (){
            if(scene) destroy(scene)
        }

        if(audio){
            audio.addEventListener('timeupdate', recieve);
            audio.addEventListener('ended', destroyAll);
        }

        return () => {
            audio?.removeEventListener('timeupdate', recieve);
            audio?.removeEventListener('ended', destroyAll);
        }
    },[audio, play, objet])

    useEffect(()=>{
        // if (flagAction) flagAction.actions['KeyAction']?.play();
        if (stormTrooperAction) stormTrooperAction.actions['mixamo.com']?.play();
        if (stormTrooperAction2) stormTrooperAction2.actions['mixamo.com']?.play();
        if (stormTrooperAction3) stormTrooperAction3.actions['mixamo.com']?.play();
        if (stormTrooperAction4) stormTrooperAction4.actions['mixamo.com']?.play();
        if (stormTrooperAction5) stormTrooperAction5.actions['mixamo.com']?.play();
        if (stormTrooperAction6) stormTrooperAction6.actions['mixamo.com']?.play();
        if (maxwellAction) maxwellAction.actions['Action']?.play();
        if (catfaceAction) catfaceAction.actions['GltfAnimation 0']?.play();
    },[maxwellAction, maxwellAction, stormTrooperAction])

    useEffect(() => {
        for(let i = 0; i < loadedArr.length; i++){
            loadedArr[i].scenes.forEach(e => setSceneName(e, modelData[i].name))
        }
    }, [loadedArr])

    useEffect(()=>{
        const movingStars = new MovingStars(300, 50, 500);
        scene.add(movingStars);
        setMovStars(movingStars);

        sun.position.set(0, 20, -60);
        scene.add(sun);

    },[])
    
    // sphere (radius, widthseg, heightseg)
    return(
        <>
            {firework && <Firework position={[2,13,15]}/>}
            {firework2 && <Firework position={[13,15,15]}/>}
            {firework3 && <Firework position={[-15,17,15]}/>}
            {firework4 && <Firework position={[-2,15,15]}/>}
            {tunnel && <directionalLight color='#fff' position={[0, 8, 30]} intensity={1} />}           
            <MovingGrid />
            
            {/* <mesh position={[0,15,-60]}>
                <sphereGeometry args={[25, 30, 30]} />
                <meshPhongMaterial 
                    color={'#8b008b'} //#fd8813
                    metalness={0.1}
                    roughness={0.1}
                    emissive = {'orange'}
                    emissiveIntensity = {0.8}
                />
            </mesh> */}

            {buildings}
            
            {meteor && (
                <>
                    <StarTrail position={[290, 100, -60]}/>
                    <StarTrail position={[210, 100, -40]}/>
                    <StarTrail position={[160, 100, -30]}/>
                    <StarTrail position={[110, 100, -20]}/>
                    <StarTrail position={[70, 100, 0]}/>
                    <StarTrail position={[20, 100, -20]}/>
                    <StarTrail position={[-30, 100, -30]}/>
                    <StarTrail position={[-80, 100, -40]}/>
                </>
            )}
            {objects === 0 && <Earth ref={earthRef} /> } 
            {/* {sprite01 && <Sprite ref={spriteRef} IconPosition={[-4, 1, 5]} IconSize={[12, 12]} textureSrc="/assets/mp4/gif01.mp4" /> } */}
            {/* {party && <PartyTelevision ref={tvRef} IconPosition={[-3, 3 ,5]} IconSize={[14, 12, 0.2]} textureSrc="/assets/mp4/party.mp4" />} */}
            {objects === 1 && (
                <primitive
                    name = {modelData[0].name}
                    ref={(element) => element && (refs.current[modelData[0].name] = element)}
                    object={loadedArr[0].scene}
                    position={modelData[0].position}
                    rotation={modelData[0].rotation}
                    scale={modelData[0].scale}
                />
            )}
            {objects === 2 && (
                <primitive
                    name = {modelData[1].name}
                    ref={(element) => element && (refs.current[modelData[1].name] = element)}
                    object={loadedArr[1].scene}
                    position={modelData[1].position}
                    rotation={modelData[1].rotation}
                    scale={modelData[1].scale}
                />
            )}
            {objects === 3 && (
                <primitive
                    name = {modelData[2].name}
                    ref={(element) => element && (refs.current[modelData[2].name] = element)}
                    object={loadedArr[2].scene}
                    position={modelData[2].position}
                    rotation={modelData[2].rotation}
                    scale={modelData[2].scale}
                />
            )}
            {!audio.ended && (
                <>
                    <primitive
                        name = {modelData[3].name}
                        ref={(element) => element && (refs.current[modelData[3].name] = element)}
                        object={loadedArr[3].scene}
                        position={modelData[3].position}
                        rotation={modelData[3].rotation}
                        scale={modelData[3].scale}
                        visible = {objects === 4 ? true : false}
                    />
                    <primitive
                        name = {modelData[4].name}
                        ref={(element) => element && (refs.current[modelData[4].name] = element)}
                        object={loadedArr[4].scene}
                        position={modelData[4].position}
                        rotation={modelData[4].rotation}
                        scale={modelData[4].scale}
                        visible = {objects === 5 ? true : false}
                    />
                </>
            )}
            {objects === 6 && (
                <primitive
                    name = {modelData[5].name}
                    ref={(element) => element && (refs.current[modelData[5].name] = element)}
                    object={loadedArr[5].scene}
                    position={modelData[5].position}
                    rotation={modelData[5].rotation}
                    scale={modelData[5].scale}
                />
            )}
            <primitive
                name = {modelData[7].name}
                ref={(element) => element && (refs.current[modelData[7].name] = element)}
                object={loadedArr[7].scene}
                position={modelData[7].position}
                rotation={modelData[7].rotation}
                scale={modelData[7].scale}
                visible = {objects === 7 ? true : false}
            />
            {objects === 8 && (
                <primitive
                    name = {modelData[9].name}
                    ref={(element) => element && (refs.current[modelData[9].name] = element)}
                    object={loadedArr[9].scene}
                    position={modelData[9].position}
                    rotation={modelData[9].rotation}
                    scale={modelData[9].scale}
                />
            )}
            {objects === 9 && (
                <primitive
                    name = {modelData[12].name}
                    ref={(element) => element && (refs.current[modelData[12].name] = element)}
                    object={loadedArr[12].scene}
                    position={modelData[12].position}
                    rotation={modelData[12].rotation}
                    scale={modelData[12].scale}
                />
            )}    
            {objects === 10 && (
                <primitive
                    name = {modelData[14].name}
                    ref={(element) => element && (refs.current[modelData[14].name] = element)}
                    object={loadedArr[14].scene}
                    position={modelData[14].position}
                    rotation={modelData[14].rotation}
                    scale={modelData[14].scale}
                />
            )} 
            {tunnel && (
                <primitive
                    name = {modelData[8].name}
                    ref={(element) => element && (refs.current[modelData[8].name] = element)}
                    object={loadedArr[8].scene}
                    position={modelData[8].position}
                    rotation={modelData[8].rotation}
                    scale={modelData[8].scale}
                />
            )}
            {!audio.ended && (
                <>
                    <primitive
                        name = {modelData[10].name}
                        ref={(element) => element && (refs.current[modelData[10].name] = element)}
                        object={loadedArr[10].scene}
                        position={modelData[10].position}
                        rotation={modelData[10].rotation}
                        scale={modelData[10].scale}
                        visible = {deem2 ? true : false}
                    />
                    <primitive
                        name = {modelData[11].name}
                        ref={(element) => element && (refs.current[modelData[11].name] = element)}
                        object={loadedArr[11].scene}
                        position={modelData[11].position}
                        rotation={modelData[11].rotation}
                        scale={modelData[11].scale}
                        visible = {deem2 ? true : false}
                    />
                    <primitive
                        name = {modelData[17].name}
                        ref={(element) => element && (refs.current[modelData[17].name] = element)}
                        object={loadedArr[17].scene}
                        position={modelData[17].position}
                        rotation={modelData[17].rotation}
                        scale={modelData[17].scale}
                        visible = {deem ? true : false}
                    />
                    <primitive
                        name = {modelData[18].name}
                        ref={(element) => element && (refs.current[modelData[18].name] = element)}
                        object={loadedArr[18].scene}
                        position={modelData[18].position}
                        rotation={modelData[18].rotation}
                        scale={modelData[18].scale}
                        visible = {deem ? true : false}
                    />
                    <primitive
                        name = {modelData[19].name}
                        ref={(element) => element && (refs.current[modelData[19].name] = element)}
                        object={loadedArr[19].scene}
                        position={modelData[19].position}
                        rotation={modelData[19].rotation}
                        scale={modelData[19].scale}
                        visible = {deem ? true : false}
                    />
                    <primitive
                        name = {modelData[20].name}
                        ref={(element) => element && (refs.current[modelData[20].name] = element)}
                        object={loadedArr[20].scene}
                        position={modelData[20].position}
                        rotation={modelData[20].rotation}
                        scale={modelData[20].scale}
                        visible = {deem ? true : false}
                    />
                </>
            )}
            {/* {!audio.ended && deem && <Sprite ref={spriteRef} IconPosition={[0, 0, 25]} IconSize={[10, 10]} IconRotation={[-0.2, 0, 0]} textureSrc="/assets/mp4/gif01.mp4" />} */}
            {!audio.ended && lamp && (
                <>
                    <primitive
                    name = {modelData[15].name}
                    ref={(element) => element && (refs.current[modelData[15].name] = element)}
                    object={loadedArr[15].scene}
                    position={modelData[15].position}
                    rotation={modelData[15].rotation}
                    scale={modelData[15].scale}
                    />
                    <primitive
                        name = {modelData[16].name}
                        ref={(element) => element && (refs.current[modelData[16].name] = element)}
                        object={loadedArr[16].scene}
                        position={modelData[16].position}
                        rotation={modelData[16].rotation}
                        scale={modelData[16].scale}
                    />
                </>
            )}
        </>
    )
};

function Scene({buildings, audio, play, meteor, objet}) {
    
    // const { selectedValue, setSelectedValue } = useContext(ModelSelectContext);
    // const handleClickChange = useCallback((e) => {
    //     console.log(e.object);
    //     setSelectedValue(e.object.name);
    // }, []);

    return (
        <>
            <Suspense fallback={ <MoonLoaderDrei />} >
                <ambientLight />
                <directionalLight color='#fff' position={[0, 5, 10]} intensity={5} />
                <Stars
                    count={1300}
                    depth={60}
                    radius={1}
                    saturation={0.5}
                    factor={0.3}
                    speed={3}
                    opacity={0.8}
                    size={0.01}
                    scale={0.02}
                    noise={0.05}
                />
                {/* <Select onClick={handleClickChange}> */}
                    <Model audio={audio} play={play} buildings={buildings} meteor={meteor} objet={objet}/>
                {/* </Select> */}
                {/* <Cloud position={[0, 0, -35]} scale={[20, 20, 20]} opacity={0.05} speed={0.2} width={5} depth={1} segments={20} color='#ffa500' /> */}
                {/* <Cloud position={[0, 0, -30]} scale={[30, 30, 30]} opacity={0.05} speed={0} width={5} depth={1} segments={20} color='#0000ff' /> */}
                <Cloud position={[0, 0, -30]} scale={[20, 20, 20]} opacity={0.03} speed={0.1} width={5} depth={1} segments={20} color='#9dbaf0' />
                {/* <Cloud position={[0, 0, -15]} scale={[15, 15, 15]} opacity={0.05} speed={0.2} width={5} depth={1} segments={20} color='#9dbaf0' /> */}
                {/* <Sparkles position={[0, 4, -15]} scale={[100, 50, 50]} count={100} speed={0} opacity={1} size={20} noise={1} color="#ff70fa"/> */}
            </Suspense>
            {/* <OrbitControls 
                enableZoom={true}
                enablePan={false}
                enableRotate={false}
                zoomSpeed={0.3}
                panSpeed={0.5}
                rotateSpeed={0.4}
                maxZoom={1}
                minDistance={30}
                maxDistance={35}
            /> */}
            <PerspectiveCamera 
                makeDefault
                position={[0, 8, 30]} 
                near={1}
                far={90}
                zoom={0.2}
            />
        </>
    )
};

export default function VaporwaveScene({audio, play, threeD, innerW, meteor, objet}) {
    const [crack, setCrack] = useState({}) // 432 정도
    const [ready, setReady] = useState(false);
    const canvasRef = useRef();
    // const {selectedValue, setSelectedValue} = useContext(ModelSelectContext);

    const buildings = useMemo(() => {
        if(typeof window === 'object' && typeof document !== undefined){
            const b = generateBuildings();
            return b
        }
    }, []);

    useEffect(()=>{
        function recieve(){
            let curr = audio.currentTime;
            if(curr > 179 && curr < 179.3) {
                setCrack({xx: 300, yy: 150})
            }
            if(curr > 179.3 && curr < 179.6) { 
                setCrack({xx: 100, yy: 300})
            }
            if(curr > 179.6 && curr < 179.9) {
                setCrack({xx: 200, yy: 350})
            }
            if(curr > 179.9 && curr < 180.2) {
                setCrack({xx: 250, yy: 200})
            }
            if(curr > 180.2 && curr < 180.5) {
                setCrack({xx: 180, yy: 170})
            }
            if(curr > 180.5 && curr < 180.7) {
                setCrack({xx: 280, yy: 360})
            }
            if(curr > 180.7 && curr < 181.0) {
                setCrack({xx: 300, yy: 390})
            }
            if(curr > 181.0 && curr < 181.3) {
                setCrack({xx: 70, yy: 120})
            }
            if(curr > 181.3 && curr < 181.6) {
                setCrack({xx: 330, yy: 70})
            }
        }

        if(audio){
            audio.addEventListener('timeupdate', recieve);
        }

        return () => {
            audio?.removeEventListener('timeupdate', recieve);
        }
    },[audio])

    return (
        <>  
            <Suspense fallback={ <MoonLoaderBlack />} >
                <div className={styles.canvas_container}>
                    {canvasRef.current && (<CrackRandom width={canvasRef.current.clientWidth} height={canvasRef.current.clientHeight} crack={crack} cvs3d={canvasRef.current}/>)}
                    {ready && (
                        <>
                            <VaporwaveScene2d threeD={threeD} ready={ready} audio={audio} play={play}/>

                            <div className={styles.customaudiobox}>
                                <div style={{position: 'relative', boxSizing: 'border-box', padding: '1rem'}}>
                                    <CustomAudio audio={audio}/>
                                </div>
                            </div>
                        </>
                    )}
                    <div style={{ width: "100%", height: "100%" }}>
                        <Canvas 
                            ref={canvasRef}
                            linear
                            dpr={[1, 1]}
                            onCreated={({gl}) => { 
                                console.log(gl)
                                // gl.setPixelRatio(window.devicePixelRatio);
                                setReady(true);
                            }}
                        >
                            <color attach="background" args={['#1d1052']} />
                            {buildings && ( <Scene buildings={buildings} audio={audio} play={play} meteor={meteor} objet={objet} /> )} 
                            <EffectComposer>
                                {/* <DepthOfField focusDistance={1} focalLength={0.1} bokehScale={2} /> */}
                                <Bloom 
                                    // mipmapBlur={true} 
                                    intensity={0.4} 
                                    // radius={0.9} 
                                    // luminanceThreshold={0.12} 
                                    // luminanceSmoothing={0.02} 
                                    radius={0.1}
                                    luminanceThreshold={0.1}
                                    luminanceSmoothing={0.9}
                                    opacity={1}
                                />
                                <Vignette eskil={false} offset={0.05} darkness={0.8} />
                            </EffectComposer>
                        </Canvas>
                    </div>
                </div>
            </Suspense>
        </>
    )
}