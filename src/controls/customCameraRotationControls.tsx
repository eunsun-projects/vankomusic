import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { CustomCameraRotationControls as CRC } from './customCameraRotation';

export default function CustomCameraRotationControls() {
  const { camera, gl } = useThree();
  const controls = useRef<CRC | null>(null);

  const isDragging = useRef(false);

  useEffect(() => {
    controls.current = new CRC(camera, gl.domElement);

    const handleMouseDown = (e: MouseEvent) => {
      console.log('mousedown');
      isDragging.current = true;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        controls.current?.onMouseMove(e);
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging.current) {
        isDragging.current = false;
      }
    };

    gl.domElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      controls.current?.dispose();
    };
  }, [camera, gl]);

  return null;
}
