import { DoubleSide } from "three"
import React, { useState, useMemo, forwardRef } from "react"
import { useSelect, useCursor } from "@react-three/drei"

const Sprite = React.forwardRef(({ textureSrc, IconPosition, IconSize, IconRotation = [0,0,0] }, ref) => {
    const [hovered, setHover] = useState(false);

    const [video] = useState(() => {
        const vid = document.createElement("video");
        // vid.type = 'video/quicktime'
        // vid.codecs = "hvc1"
        vid.src = textureSrc;
        vid.crossOrigin = "Anonymous";
        vid.loop = true;
        vid.muted = true;
        vid.oncanplaythrough = () => {
            vid.play();
        };
        return vid;
    });

    // const selected = useSelect();
    // useCursor(hovered);

    return (
        <mesh 
            ref={ref}
            position={IconPosition}
            rotation={IconRotation}
            onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
            onPointerOut={(e) => setHover(false)}
            transparent={true}
        >
            <planeGeometry args={IconSize} transparent={true} />
            <meshStandardMaterial side={DoubleSide} transparent={true}>
                <videoTexture attach="map" args={[video]} transparent={true} />
            </meshStandardMaterial>
        </mesh>
    )
})
Sprite.displayName = "Sprite";
export default Sprite;

// const spriteTexture = useLoader( TextureLoader, textureSrc )
// const [animator] = useState(() => new PlainAnimator(spriteTexture, 4, 4, 10, 15))
// useFrame(() => animator.animate())