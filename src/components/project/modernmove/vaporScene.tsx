'use client';

import {
  CrackRandom,
  CustomAudio,
  Earth,
  Firework,
  MovingGrid,
  MovingStars,
  StarTrail,
  VaporScene2d,
  sun,
} from '@/components/project/modernmove';
import generateBuildings from '@/components/project/modernmove/hooks/generateBuildings';
import MoonLoaderBlack from '@/components/project/modernmove/loaders/moonloaderblack';
import MoonLoaderDrei from '@/components/project/modernmove/loaders/moonloaderDrei';
import styles from '@/styles/modern-move.module.css';
import { Cloud, PerspectiveCamera, Stars, useAnimations } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Object3DEventMap,
  SphereGeometry,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
    model: undefined,
    position: [0, 1, 0.2], //17
    rotation: [0, 5, 0],
    scale: [0.36, 0.36, 0.36],
  },
  {
    name: 'stonetower',
    model: undefined,
    position: [0, 1, 1], // -8, 0, 22
    rotation: [0, 1, 0],
    scale: [19, 19, 19], //9,9,9
  },
  {
    name: 'budha',
    model: undefined,
    position: [0, 0, 3], //-0.5, 0, 23.5
    rotation: [0, -2, 0],
    scale: [29, 29, 29], // 15,15,15
  },
  {
    name: 'fish_shaped_bun',
    model: undefined,
    position: [0, 3, 0], //11, -2, 23
    rotation: [0, 0, 0], // 3.8
    scale: [0.1, 0.1, 0.1], // 3 3 3
  },
  {
    name: 'maxwell',
    model: undefined,
    position: [0, 3, 0], //5.8, 15, 4
    rotation: [0, -1, 0],
    scale: [0.35, 0.35, 0.35], //0.15
  },
  {
    name: 'thinking',
    model: undefined,
    position: [0, 8, 2], // -8, 7, 24
    rotation: [0, 0.7, 0],
    scale: [3, 3, 3],
  },
  {
    name: 'cat_box',
    model: undefined,
    position: [2, 2, 2], //5, 0, 26
    rotation: [0, -1.8, 0],
    scale: [1.5, 1.5, 1.5], // 0.4
  },
  {
    name: 'cat_face',
    model: undefined,
    position: [0, 5, 2], // -9.5, 2.7, 24
    rotation: [0, 0.6, 0],
    scale: [3, 3, 3], // 0.8
  },
  {
    name: 'tunnel',
    model: undefined,
    position: [0, 6, -80], // -9.5, 2.7, 24
    rotation: [0, -1.57, 0],
    scale: [8, 8, 8], // 0.8
  },
  {
    name: 'gwa_gwa_cat',
    model: undefined,
    position: [0, 3.5, 0],
    rotation: [0, -1.57, 0.3],
    scale: [13, 13, 13],
  },
  {
    name: 'dancing_stormtrooper',
    model: undefined,
    position: [-17, 0, 5],
    rotation: [0, 0, 0],
    scale: [3.5, 3.5, 3.5],
  },
  {
    name: 'dancing_stormtrooper2',
    model: undefined,
    position: [17, 0, 5],
    rotation: [0, 0, 0],
    scale: [3.5, 3.5, 3.5],
  },
  {
    name: 'spam',
    model: undefined,
    position: [0, 3, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  {
    name: 'coupang_box',
    model: undefined,
    position: [0, 3, 0],
    rotation: [-0.1, 0, 0],
    scale: [0.3, 0.3, 0.3],
  },
  {
    name: 'slipwarning',
    model: undefined,
    position: [0, 3, 0],
    rotation: [0, 0, 0],
    scale: [70, 70, 70],
  },
  {
    name: 'lamp',
    model: undefined,
    position: [17, 0, 5],
    rotation: [0, 3, 0],
    scale: [0.8, 0.8, 0.8],
  },
  {
    name: 'lamp2',
    model: undefined,
    position: [-17, 0, 5],
    rotation: [0, 0, 0],
    scale: [0.8, 0.8, 0.8],
  },
  {
    name: 'dancing_stormtrooper3',
    model: undefined,
    position: [-15, 0, 19],
    rotation: [0, 0, 0],
    scale: [3.5, 3.5, 3.5],
  },
  {
    name: 'dancing_stormtrooper4',
    model: undefined,
    position: [15, 0, 19],
    rotation: [0, 0, 0],
    scale: [3.5, 3.5, 3.5],
  },
  {
    name: 'dancing_stormtrooper5',
    model: undefined,
    position: [-5, 0, 15],
    rotation: [0, 0, 0],
    scale: [3.5, 3.5, 3.5],
  },
  {
    name: 'dancing_stormtrooper6',
    model: undefined,
    position: [5, 0, 15],
    rotation: [0, 0, 0],
    scale: [3.5, 3.5, 3.5],
  },
];

function setSceneName(obj: Group<Object3DEventMap> | Object3D<Object3DEventMap>, name: string) {
  if (obj.hasOwnProperty('name')) {
    obj.name = name;
  }
  // 객체에 children 프로퍼티가 있고, children 배열에 요소가 있는 경우 각 요소를 재귀적으로 탐색합니다.
  if (obj.children && Array.isArray(obj.children) && obj.children.length > 0) {
    obj.children.forEach((child) => {
      setSceneName(child, name);
    });
  }
}

interface ModelProps {
  audio: HTMLAudioElement;
  play: boolean;
  buildings: JSX.Element[];
  meteor: boolean;
  objet: boolean;
}

function Model({ audio, play, buildings, meteor, objet }: ModelProps) {
  const loadedArr = useLoader(GLTFLoader, modelUrl);
  const maxwellAction = useAnimations(loadedArr[4].animations, loadedArr[4].scene);
  const catfaceAction = useAnimations(loadedArr[7].animations, loadedArr[7].scene);
  const stormTrooperAction = useAnimations(loadedArr[10].animations, loadedArr[10].scene);
  const stormTrooperAction2 = useAnimations(loadedArr[11].animations, loadedArr[11].scene);
  const stormTrooperAction3 = useAnimations(loadedArr[17].animations, loadedArr[17].scene);
  const stormTrooperAction4 = useAnimations(loadedArr[18].animations, loadedArr[18].scene);
  const stormTrooperAction5 = useAnimations(loadedArr[19].animations, loadedArr[19].scene);
  const stormTrooperAction6 = useAnimations(loadedArr[20].animations, loadedArr[20].scene);
  const [objects, setObjects] = useState<number | null>(null);
  const [tunnel, setTunnel] = useState(false);
  const [lamp, setLamp] = useState(false);
  const [deem, setDeem] = useState(false);
  const [deem2, setDeem2] = useState(true);
  const [firework, setFirework] = useState(false);
  const [firework2, setFirework2] = useState(false);
  const [firework3, setFirework3] = useState(false);
  const [firework4, setFirework4] = useState(false);
  const [movStars, setMovStars] = useState<MovingStars | null>(null);

  const refs = useRef<{ [key: string]: Object3D<Object3DEventMap> }>({});
  const earthRef = useRef<Mesh<SphereGeometry, MeshStandardMaterial> | null>(null);
  const lastUpdateSecond = useRef(-1);

  const { scene } = useThree();

  // 회전 및 각종 애니메이션을 위해
  useFrame(({ clock }, delta) => {
    const elapsedTime = clock.getElapsedTime();
    const currentSecond = Math.floor(elapsedTime); // 현재 초를 정수로 가져옵니다.

    if (!earthRef.current) return;

    if (lastUpdateSecond.current !== currentSecond) {
      // 마지막으로 업데이트된 초와 현재 초가 다르면
      if (currentSecond % 2 === 0) {
        // 짝수초
        setLamp(false);
      } else {
        // 홀수초
        setLamp(true);
      }
      lastUpdateSecond.current = currentSecond; // 마지막으로 업데이트된 초를 현재 초로 업데이트합니다.
    }

    if (objects === 0 && play) {
      earthRef.current.position.z += delta * 12;
      earthRef.current.rotation.y += delta * 6.3;
    }
    if (objects === 1 && play) {
      refs.current.caligula.position.z += delta * 12;
      refs.current.caligula.rotation.y += delta * 5;
    }
    if (objects === 2 && play) {
      refs.current.stonetower.position.z += delta * 12;
      refs.current.stonetower.rotation.y += delta * 5;
    }
    if (objects === 3 && play) {
      refs.current.budha.position.z += delta * 12;
      refs.current.budha.position.y = -1 + Math.sin(Date.now() / 1000) * 4; // 붓다 천천히 위 아래로 1
    }
    if (objects === 4 && play) {
      refs.current.fish_shaped_bun.position.z += delta * 12;
      refs.current.fish_shaped_bun.rotation.x += delta * 5;
    }
    if (objects === 5 && play) {
      refs.current.maxwell.position.z += delta * 12;
    }
    if (objects === 6 && play) {
      refs.current.thinking.position.z += delta * 12;
      refs.current.thinking.rotation.y += delta * 5;
    }
    if (objects === 7 && play) {
      refs.current.cat_face.position.z += delta * 12;
    }
    if (objects === 8 && play) {
      refs.current.gwa_gwa_cat.position.z += delta * 12;
    }
    if (objects === 9 && play) {
      refs.current.spam.position.z += delta * 12;
    }
    if (objects === 10 && play) {
      refs.current.slipwarning.position.z += delta * 12;
    }
    if (tunnel && play) {
      refs.current.tunnel.position.z += delta * 6.3;
    }
    if (play) {
      refs.current.lamp.position.z += delta * 24;
      refs.current.lamp2.position.z += delta * 24;
    }
    if (deem && play) {
      // deem 일때 === 터널 지났을 때
      if (currentSecond % 2 === 0) {
        // 짝수초
        setFirework(true);
        setFirework2(false);
        setFirework3(true);
        setFirework4(false);
      } else {
        // 홀수초
        setFirework(false);
        setFirework2(true);
        setFirework3(false);
        setFirework4(true);
      }
    }

    if (movStars) {
      movStars.update(delta * 20);
    }
  });

  useEffect(() => {
    if (objet) {
      const random = Math.floor(Math.random() * 11);
      setObjects(random);
      const timer = setTimeout(() => {
        setObjects(null);
        clearTimeout(timer);
      }, 2500);
    }

    function recieve() {
      let curr = audio.currentTime;

      if (curr > 93 && curr < 93.3 && play) {
        setTunnel(true);
        setDeem2(false);
      }
      if (curr > 126 && curr < 126.3 && play) {
        setTunnel(false);
        setDeem(true);
        setDeem2(true);
      }
    }

    if (audio) {
      audio.addEventListener('timeupdate', recieve);
    }

    return () => {
      audio?.removeEventListener('timeupdate', recieve);
    };
  }, [audio, play, objet]);

  useEffect(() => {
    if (stormTrooperAction) stormTrooperAction.actions['mixamo.com']?.play();
    if (stormTrooperAction2) stormTrooperAction2.actions['mixamo.com']?.play();
    if (stormTrooperAction3) stormTrooperAction3.actions['mixamo.com']?.play();
    if (stormTrooperAction4) stormTrooperAction4.actions['mixamo.com']?.play();
    if (stormTrooperAction5) stormTrooperAction5.actions['mixamo.com']?.play();
    if (stormTrooperAction6) stormTrooperAction6.actions['mixamo.com']?.play();
    if (maxwellAction) maxwellAction.actions['Action']?.play();
    if (catfaceAction) catfaceAction.actions['GltfAnimation 0']?.play();
  }, [
    maxwellAction,
    stormTrooperAction,
    catfaceAction,
    stormTrooperAction2,
    stormTrooperAction3,
    stormTrooperAction4,
    stormTrooperAction5,
    stormTrooperAction6,
  ]);

  useEffect(() => {
    for (let i = 0; i < loadedArr.length; i++) {
      loadedArr[i].scenes.forEach((e) => setSceneName(e, modelData[i].name));
    }
  }, [loadedArr]);

  useEffect(() => {
    const movingStars = new MovingStars(300, 50, 500);
    scene.add(movingStars);
    setMovStars(movingStars);

    sun.position.set(0, 20, -60);
    scene.add(sun);
  }, [scene]);

  // sphere (radius, widthseg, heightseg)
  return (
    <>
      {firework && <Firework position={[2, 13, 15]} />}
      {firework2 && <Firework position={[13, 15, 15]} />}
      {firework3 && <Firework position={[-15, 17, 15]} />}
      {firework4 && <Firework position={[-2, 15, 15]} />}
      {tunnel && <directionalLight color="#fff" position={[0, 8, 30]} intensity={1} />}
      <MovingGrid />

      {buildings}

      {meteor && (
        <>
          <StarTrail position={[290, 100, -60]} />
          <StarTrail position={[210, 100, -40]} />
          <StarTrail position={[160, 100, -30]} />
          <StarTrail position={[110, 100, -20]} />
          <StarTrail position={[70, 100, 0]} />
          <StarTrail position={[20, 100, -20]} />
          <StarTrail position={[-30, 100, -30]} />
          <StarTrail position={[-80, 100, -40]} />
        </>
      )}
      {objects === 0 && <Earth ref={earthRef} />}
      {objects === 1 && (
        <primitive
          name={modelData[0].name}
          ref={(element: Object3D<Object3DEventMap>) =>
            element && (refs.current[modelData[0].name] = element)
          }
          object={loadedArr[0].scene}
          position={modelData[0].position}
          rotation={modelData[0].rotation}
          scale={modelData[0].scale}
        />
      )}
      {objects === 2 && (
        <primitive
          name={modelData[1].name}
          ref={(element: Object3D<Object3DEventMap>) =>
            element && (refs.current[modelData[1].name] = element)
          }
          object={loadedArr[1].scene}
          position={modelData[1].position}
          rotation={modelData[1].rotation}
          scale={modelData[1].scale}
        />
      )}
      {objects === 3 && (
        <primitive
          name={modelData[2].name}
          ref={(element: Object3D<Object3DEventMap>) =>
            element && (refs.current[modelData[2].name] = element)
          }
          object={loadedArr[2].scene}
          position={modelData[2].position}
          rotation={modelData[2].rotation}
          scale={modelData[2].scale}
        />
      )}
      {!audio.ended && (
        <>
          <primitive
            name={modelData[3].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[3].name] = element)
            }
            object={loadedArr[3].scene}
            position={modelData[3].position}
            rotation={modelData[3].rotation}
            scale={modelData[3].scale}
            visible={objects === 4 ? true : false}
          />
          <primitive
            name={modelData[4].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[4].name] = element)
            }
            object={loadedArr[4].scene}
            position={modelData[4].position}
            rotation={modelData[4].rotation}
            scale={modelData[4].scale}
            visible={objects === 5 ? true : false}
          />
        </>
      )}
      {objects === 6 && (
        <primitive
          name={modelData[5].name}
          ref={(element: Object3D<Object3DEventMap>) =>
            element && (refs.current[modelData[5].name] = element)
          }
          object={loadedArr[5].scene}
          position={modelData[5].position}
          rotation={modelData[5].rotation}
          scale={modelData[5].scale}
        />
      )}
      <primitive
        name={modelData[7].name}
        ref={(element: Object3D<Object3DEventMap>) =>
          element && (refs.current[modelData[7].name] = element)
        }
        object={loadedArr[7].scene}
        position={modelData[7].position}
        rotation={modelData[7].rotation}
        scale={modelData[7].scale}
        visible={objects === 7 ? true : false}
      />
      {objects === 8 && (
        <primitive
          name={modelData[9].name}
          ref={(element: Object3D<Object3DEventMap>) =>
            element && (refs.current[modelData[9].name] = element)
          }
          object={loadedArr[9].scene}
          position={modelData[9].position}
          rotation={modelData[9].rotation}
          scale={modelData[9].scale}
        />
      )}
      {objects === 9 && (
        <primitive
          name={modelData[12].name}
          ref={(element: Object3D<Object3DEventMap>) =>
            element && (refs.current[modelData[12].name] = element)
          }
          object={loadedArr[12].scene}
          position={modelData[12].position}
          rotation={modelData[12].rotation}
          scale={modelData[12].scale}
        />
      )}
      {objects === 10 && (
        <primitive
          name={modelData[14].name}
          ref={(element: Object3D<Object3DEventMap>) =>
            element && (refs.current[modelData[14].name] = element)
          }
          object={loadedArr[14].scene}
          position={modelData[14].position}
          rotation={modelData[14].rotation}
          scale={modelData[14].scale}
        />
      )}
      {tunnel && (
        <primitive
          name={modelData[8].name}
          ref={(element: Object3D<Object3DEventMap>) =>
            element && (refs.current[modelData[8].name] = element)
          }
          object={loadedArr[8].scene}
          position={modelData[8].position}
          rotation={modelData[8].rotation}
          scale={modelData[8].scale}
        />
      )}
      {!audio.ended && (
        <>
          <primitive
            name={modelData[10].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[10].name] = element)
            }
            object={loadedArr[10].scene}
            position={modelData[10].position}
            rotation={modelData[10].rotation}
            scale={modelData[10].scale}
            visible={deem2 ? true : false}
          />
          <primitive
            name={modelData[11].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[11].name] = element)
            }
            object={loadedArr[11].scene}
            position={modelData[11].position}
            rotation={modelData[11].rotation}
            scale={modelData[11].scale}
            visible={deem2 ? true : false}
          />
          <primitive
            name={modelData[17].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[17].name] = element)
            }
            object={loadedArr[17].scene}
            position={modelData[17].position}
            rotation={modelData[17].rotation}
            scale={modelData[17].scale}
            visible={deem ? true : false}
          />
          <primitive
            name={modelData[18].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[18].name] = element)
            }
            object={loadedArr[18].scene}
            position={modelData[18].position}
            rotation={modelData[18].rotation}
            scale={modelData[18].scale}
            visible={deem ? true : false}
          />
          <primitive
            name={modelData[19].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[19].name] = element)
            }
            object={loadedArr[19].scene}
            position={modelData[19].position}
            rotation={modelData[19].rotation}
            scale={modelData[19].scale}
            visible={deem ? true : false}
          />
          <primitive
            name={modelData[20].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[20].name] = element)
            }
            object={loadedArr[20].scene}
            position={modelData[20].position}
            rotation={modelData[20].rotation}
            scale={modelData[20].scale}
            visible={deem ? true : false}
          />
        </>
      )}
      {!audio.ended && lamp && (
        <>
          <primitive
            name={modelData[15].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[15].name] = element)
            }
            object={loadedArr[15].scene}
            position={modelData[15].position}
            rotation={modelData[15].rotation}
            scale={modelData[15].scale}
          />
          <primitive
            name={modelData[16].name}
            ref={(element: Object3D<Object3DEventMap>) =>
              element && (refs.current[modelData[16].name] = element)
            }
            object={loadedArr[16].scene}
            position={modelData[16].position}
            rotation={modelData[16].rotation}
            scale={modelData[16].scale}
          />
        </>
      )}
    </>
  );
}

interface SceneProps {
  buildings: JSX.Element[];
  audio: HTMLAudioElement;
  play: boolean;
  meteor: boolean;
  objet: boolean;
}

function Scene({ buildings, audio, play, meteor, objet }: SceneProps) {
  return (
    <>
      <Suspense fallback={<MoonLoaderDrei />}>
        <ambientLight />
        <directionalLight color="#fff" position={[0, 5, 10]} intensity={5} />
        <Stars count={1300} depth={60} radius={1} saturation={0.5} factor={0.3} speed={3} />
        <Model audio={audio} play={play} buildings={buildings} meteor={meteor} objet={objet} />
        <Cloud
          position={[0, 0, -30]}
          scale={[20, 20, 20]}
          opacity={0.03}
          speed={0.1}
          segments={20}
          color="#9dbaf0"
        />
      </Suspense>
      <PerspectiveCamera makeDefault position={[0, 8, 30]} near={1} far={90} zoom={0.2} />
    </>
  );
}

interface VaporwaveSceneProps {
  audio: HTMLAudioElement;
  play: boolean;
  threeD: boolean;
  meteor: boolean;
  objet: boolean;
}

export default function VaporwaveScene({
  audio,
  play,
  threeD,
  meteor,
  objet,
}: VaporwaveSceneProps) {
  const [crack, setCrack] = useState({ xx: 0, yy: 0 }); // 432 정도
  const [ready, setReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const buildings = useMemo(() => {
    if (typeof window === 'object' && typeof document !== undefined) {
      const building = generateBuildings();
      return building;
    }
  }, []);

  useEffect(() => {
    function recieve() {
      let curr = audio.currentTime;
      if (curr > 179 && curr < 179.3) {
        setCrack({ xx: 300, yy: 150 });
      }
      if (curr > 179.3 && curr < 179.6) {
        setCrack({ xx: 100, yy: 300 });
      }
      if (curr > 179.6 && curr < 179.9) {
        setCrack({ xx: 200, yy: 350 });
      }
      if (curr > 179.9 && curr < 180.2) {
        setCrack({ xx: 250, yy: 200 });
      }
      if (curr > 180.2 && curr < 180.5) {
        setCrack({ xx: 180, yy: 170 });
      }
      if (curr > 180.5 && curr < 180.7) {
        setCrack({ xx: 280, yy: 360 });
      }
      if (curr > 180.7 && curr < 181.0) {
        setCrack({ xx: 300, yy: 390 });
      }
      if (curr > 181.0 && curr < 181.3) {
        setCrack({ xx: 70, yy: 120 });
      }
      if (curr > 181.3 && curr < 181.6) {
        setCrack({ xx: 330, yy: 70 });
      }
    }

    if (audio) {
      audio.addEventListener('timeupdate', recieve);
    }

    return () => {
      audio?.removeEventListener('timeupdate', recieve);
    };
  }, [audio]);

  return (
    <>
      <Suspense fallback={<MoonLoaderBlack />}>
        <div className={styles.canvas_container}>
          {canvasRef.current && (
            <CrackRandom
              width={canvasRef.current.clientWidth}
              height={canvasRef.current.clientHeight}
              crack={crack}
            />
          )}
          {ready && (
            <>
              <VaporScene2d threeD={threeD} ready={ready} audio={audio} play={play} />

              <div className={styles.customaudiobox}>
                <div style={{ position: 'relative', boxSizing: 'border-box', padding: '1rem' }}>
                  <CustomAudio audio={audio} />
                </div>
              </div>
            </>
          )}
          <div style={{ width: '100%', height: '100%' }}>
            <Canvas
              ref={canvasRef}
              linear
              dpr={[1, 1]}
              onCreated={({ gl }) => {
                console.log(gl);
                // gl.setPixelRatio(window.devicePixelRatio);
                setReady(true);
              }}
            >
              <color attach="background" args={['#1d1052']} />
              {buildings && (
                <Scene
                  buildings={buildings}
                  audio={audio}
                  play={play}
                  meteor={meteor}
                  objet={objet}
                />
              )}
              <EffectComposer>
                <Bloom
                  intensity={0.4}
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
  );
}
