import * as THREE from 'three'

export default function createWindowTexture(windowCanvas) {
    windowCanvas.width = 256;
    windowCanvas.height = 256;
    const context = windowCanvas.getContext("2d");

    // 배경을 검은색으로 설정
    context.fillStyle = "black";
    context.fillRect(0, 0, 256, 256);

    // 창문을 흰색 사각형으로 그림
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (Math.random() > 0.5) { // 랜덤한 창문을 '불이 켜진' 상태로 만들기
                context.fillStyle = "white";
                context.fillRect(i * 25, j * 25, 20, 20);
            }
        }
    }

    const texture = new THREE.Texture(windowCanvas);
    texture.needsUpdate = true;
    return texture;
}