import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { CustomCameraRotationControls as CRC } from "./customCameraRotation"

export default function CustomCameraRotationControls() {
    const { camera, gl } = useThree();
    let controls;

    const isDragging = useRef(false);

    useEffect(() => {
        controls = new CRC(camera, gl.domElement);

        const handleMouseDown = (e) => {
            console.log('mousedown')
            isDragging.current = true;
        };
        const handleMouseMove = (e) => {
            if (isDragging.current) {
                controls.onMouseMove(e);
            }
        };
        const handleMouseUp = (e) => {
            if (isDragging.current) {
                isDragging.current = false;
            }
        };
        // const handleTouchStart = (e) => {
        //     isDragging.current = true;
        //     controls.onTouchMove(e);
        // };
        // const handleTouchEnd = (e) => {
        //     if (isDragging.current) {
        //         isDragging.current = false;
        //         controls.onTouchEnd(e);
        //     }
        // };
    
        gl.domElement.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        // document.addEventListener("touchstart", handleTouchStart);
        // document.addEventListener("touchend", handleTouchEnd);

        return () => {
            gl.domElement.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            // document.removeEventListener("touchstart", handleTouchStart);
            // document.removeEventListener("touchend", handleTouchEnd);
            controls.dispose();
        };
    }, [camera, gl]);

    return null;
}
