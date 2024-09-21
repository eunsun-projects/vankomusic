import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class VankoLogo {
  private running: boolean;
  private canvas: HTMLDivElement;
  private fixedWidth: number;
  private fixedHeight: number;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private loader: GLTFLoader;
  private objGroup: THREE.Group | null;
  private loadCounter: number;

  constructor(canvas: HTMLDivElement) {
    this.running = true; // 디스트로이 시 false 로 변경되는 상태 스테이트

    /************* canvas ***************/
    this.canvas = canvas;

    /************* widthHeight ***************/
    const fixedWidth = canvas.clientWidth;
    const fixedHeight = canvas.clientHeight;
    this.fixedWidth = fixedWidth;
    this.fixedHeight = fixedHeight;

    /************* renderer ***************/
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); //canvas : canvas,
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(fixedWidth, fixedHeight);
    if (canvas.firstChild) canvas.removeChild(canvas.firstChild); // 만약 캔버스에 이미 domElement 요소가 있다면 삭제
    canvas.appendChild(renderer.domElement); // 캔버스에 렌더러 적용
    this.renderer = renderer;

    /************* scene ***************/
    const scene = new THREE.Scene();
    this.scene = scene;

    /************* model loader ***************/
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    this.loader = loader;

    /************* camera ***************/
    const camera = new THREE.PerspectiveCamera(
      45, // FOV
      this.fixedWidth / this.fixedHeight, // aspect ratio
      1, // near
      1000, // far 10000
    );
    this.isMobile() ? camera.position.set(0, 0, 5) : camera.position.set(0, 0, 5);
    this.camera = camera;

    /************* controls ***************/
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 0, 0); // 모델의 위치로 설정
    controls.minDistance = 2; // 객체에 가까워질 수 있는 최소 거리
    controls.maxDistance = 4; // 객체에서 멀어질 수 있는 최대 거리
    controls.autoRotate = false;
    controls.update();

    /************ init App **************/
    this.setupModel('/assets/glbs/vankolive_logo.glb');
    this.setupLight();

    this.loadCounter = 0;
    this.objGroup = null;
  }
  public isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }

  public setupLight() {
    const light = new THREE.AmbientLight(0xffffff); // soft white light
    light.intensity = 15;
    this.scene.add(light);
  }
  public setupModel(url: string) {
    this.loader.load(
      url,
      (gltf) => {
        gltf.scene.rotation.y = -1.57;
        gltf.scene.position.set(0, -0.5, 0);
        gltf.scene.scale.set(0.3, 0.3, 0.3);
        this.objGroup = gltf.scene; // 그룹 참조 저장 회전 등을 위해
        if (this.scene) this.scene.add(gltf.scene);
      },
      (xhr) => {
        this.loadCounter = (xhr.loaded / xhr.total) * 100;
      },
      (error) => {
        this.canvas.innerHTML = `error ocurred! restart page!`;
        this.canvas.style.fontSize = '0.5rem';
        console.error(error);
      },
    );
  }
  public resize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const aspect = width / height;

    if (this.camera instanceof THREE.PerspectiveCamera) {
      // PerspectiveCamera
      this.camera.aspect = aspect;
    }
    if (this.camera instanceof THREE.OrthographicCamera) {
      // OrthographicCamera
      this.camera.left = aspect * -1;
      this.camera.right = aspect * 1;
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  public render() {
    if (!this.running) return;
    if (this.objGroup) this.objGroup.rotation.y += -0.01;
    this.renderer.render(this.scene, this.camera);
  }
  public destroy() {
    this.running = false;
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
