import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import WebGL from 'three/examples/jsm/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class VankoLogo {
    constructor(canvas){
        this.running = true; // 디스트로이 시 false 로 변경되는 상태 스테이트

        /************* canvas ***************/
        this._canvas = canvas;

        /************* widthHeight ***************/
        const fixedWidth = canvas.clientWidth; 
        const fixedHeight = canvas.clientHeight;
        this._fixedWidth = fixedWidth;
        this._fixedHeight = fixedHeight;

        /************* renderer ***************/
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); //canvas : canvas,
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( fixedWidth, fixedHeight);
        if (canvas.firstChild) canvas.removeChild(canvas.firstChild); // 만약 캔버스에 이미 domElement 요소가 있다면 삭제
        canvas.appendChild(renderer.domElement ); // 캔버스에 렌더러 적용
        this._renderer = renderer;

        /************* scene ***************/
        const scene = new THREE.Scene();
        this._scene = scene;

        /************ init App **************/
        this._setupLoader();
        this._setupModel('/assets/glbs/vankolive_logo.glb');
        this._setupLight();
        this._setupCamera();
        this._setupControls();
    }
    _isMobile(){
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
    _setupLoader(){
        /************* model loader ***************/
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
        loader.setDRACOLoader( dracoLoader );
        this._loader = loader;
    };
    _setupCamera(){
        /************* camera ***************/
        const camera = new THREE.PerspectiveCamera(
            45, // FOV
            this._fixedWidth / this._fixedHeight, // aspect ratio
            1, // near
            1000 // far 10000
        );

        this._isMobile() ? camera.position.set(0,0,5) : camera.position.set(0,0,5);
        this._camera = camera;
    };
    _setupLight(){
        const light = new THREE.AmbientLight( 0xffffff ); // soft white light
        light.intensity = 15;
        this._scene.add( light );
    }
    _setupModel(url){
        this._loader.load(
            url,       
            (gltf)=>{
                gltf.scene.rotation.y = -1.57;
                gltf.scene.position.set(0, -0.5, 0) 
                gltf.scene.scale.set(0.3,0.3,0.3)
                this.objGroup = gltf.scene; // 그룹 참조 저장 회전 등을 위해
                if(this._scene) this._scene.add(gltf.scene);
            }, 
            ( xhr ) => {
                this.loadCounter = ( xhr.loaded / xhr.total * 100 );
            }, 
            ( error ) => { 
                this._canvas.innerHTML = `error ocurred! restart page!`;
                this._canvas.style.fontSize = '0.5rem';
                console.error( error );
            }
        )
    };
    _setupControls(){
        /************* controls ***************/
        const controls = new OrbitControls( this._camera, this._renderer.domElement );
        controls.target.set(0, 0, 0); // 모델의 위치로 설정
        controls.minDistance = 2; // 객체에 가까워질 수 있는 최소 거리
        controls.maxDistance = 4; // 객체에서 멀어질 수 있는 최대 거리
        controls.autoRotate = false;
        controls.update();
        this._controls = controls;
    };
    resize() {
		const width = this._canvas.clientWidth;
		const height = this._canvas.clientHeight;
		const aspect = width / height;

		if (this._camera instanceof THREE.PerspectiveCamera) {
			// PerspectiveCamera
			this._camera.aspect = aspect;
		} else {
			// OrthographicCamera
			this._camera.left = aspect * -1;
			this._camera.right = aspect * 1;
		}

		this._camera.updateProjectionMatrix();
		this._renderer.setSize(width, height);
	};
    render() {
        if (!this.running) return;
        // this._controls.update();
        if(this.objGroup)this.objGroup.rotation.y += -0.01;
        this._renderer.render(this._scene, this._camera);
        // console.log(this.objGroup)
	};
    _destroy() {
        this.running = false;
        this.modelDispose(this._scene);

        if (this._renderer) {
            this._renderer.dispose();
            this._renderer = null; // 렌더러 참조 해제
        }

        if (this._scene) {
            this._scene = null; // 씬 참조 해제
        }

        if (this._camera) {
            this._camera = null; // 카메라 참조 해제
        }
    };
    modelDispose(scene){
        // scene.children.forEach((e)=>{
        //     if(typeof e.number === 'number' ){
        //         scene.remove(e);
        //         if (e.children[0].geometry) {
        //             // console.log('지오 폐기')
        //             e.children[0].geometry.dispose();
        //         }
        //         if (e.children[0].material) {
        //             // console.log('메터리얼 폐기')
        //             e.children[0].material.dispose();
        //         }
        //         if (e.children[0].material.map) {
        //             // console.log('텍스처 폐기')
        //             e.children[0].material.map.dispose();
        //         }
        //     }       
        // })
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
                    this.disposeMaterial(object.material);
                    console.log('material disposed!')
                }
            }
        });
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
        }
    };
    disposeMaterial(material) {
        // 텍스처 삭제
        if (material.map) material.map.dispose();
        if (material.lightMap) material.lightMap.dispose();
        if (material.bumpMap) material.bumpMap.dispose();
        if (material.normalMap) material.normalMap.dispose();
        if (material.specularMap) material.specularMap.dispose();
        if (material.envMap) material.envMap.dispose();
        // Material 자체 삭제
        material.dispose();
    };
}