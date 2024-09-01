import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { CustomPointerLockControls as PLC } from "./custompointerlock"

export default function CustomPointerLockControls() {
    const { camera, gl } = useThree();
    let controls;

    const isDragging = useRef(false);
    const preventKeyFlag = useRef(false); // 초기 헬프 창이 켜져있을때 true 로 설정할것 

    useEffect(() => {
        controls = new PLC(camera, gl.domElement);

        // 필요한 경우 추가 이벤트 리스너나 설정을 여기에 추가합니다.

        const handleMouseDown = (e) => {
            isDragging.current = true;
            preventKeyFlag.current ? e.preventDefault() : controls.lock();
        };
    
        const handleMouseMove = (e) => {
            controls.onMouseMove(e);
        };
    
        const handleMouseUp = (e) => {
            if (isDragging.current) {
            isDragging.current = false;
            preventKeyFlag.current ? e.preventDefault() : controls.unlock();
            }
        };
    
        const handleTouchStart = (e) => {
            isDragging.current = true;
            controls.onTouchMove(e);
        };
    
        const handleTouchEnd = (e) => {
            if (isDragging.current) {
            isDragging.current = false;
            controls.onTouchEnd(e);
            }
        };
    
        gl.domElement.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            gl.domElement.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchend", handleTouchEnd);
            controls.dispose();
        };
    }, [camera, gl]);

    return null;
}
