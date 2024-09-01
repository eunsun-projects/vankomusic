import { DoubleSide } from "three"
import React, { useState, useMemo, forwardRef} from "react"
import { useSelect, useCursor } from "@react-three/drei"

const PartyTelevision = React.forwardRef(({ textureSrc, IconPosition, IconSize }, ref) => {
    const [hovered, setHover] = useState(false);

    const [video] = useState(() => {
        const vid = document.createElement("video");
        vid.src = textureSrc;
        vid.crossOrigin = "Anonymous";
        vid.loop = true;
        vid.muted = true;
        vid.oncanplaythrough = () => {
            vid.play();
        };
        return vid;
    });

    const selected = useSelect();
    useCursor(hovered);

    return (
        <group ref={ref}>
            <mesh position={[IconPosition[0], IconPosition[1], IconPosition[2]-0.2]}>
                <boxGeometry args={[IconSize[0]+1, IconSize[1]+1, IconSize[2]]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={IconPosition}>
                <planeGeometry args={[IconSize[0], IconSize[1]]}/>
                <meshStandardMaterial side={DoubleSide}>
                    <videoTexture attach="map" args={[video]} />
                </meshStandardMaterial>
            </mesh>
        </group>
    )
})
PartyTelevision.displayName = "PartyTelevision";
export default PartyTelevision;