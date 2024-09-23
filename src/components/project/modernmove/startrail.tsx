import { Circle, Trail } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React from 'react';
import { Mesh } from 'three';

export default function StarTrail({ position }: { position: [number, number, number] }) {
  const starRef = React.useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (starRef.current) {
      starRef.current.position.x -= delta * 120;
      starRef.current.position.y -= delta * 120;
    }
  });

  return (
    <Trail
      width={8} // Width of the line
      color={'white'} // Color of the line
      length={5} // Length of the line
      decay={1} // How fast the line fades away
      local={false} // Wether to use the target's world or local positions
      stride={0} // Min distance between previous and current point
      interval={1} // Number of frames to wait before next calculation
      target={undefined} // Optional target. This object will produce the trail.
      attenuation={(width) => width} // A function to define the width in each point along it.
    >
      <Circle ref={starRef} position={position} scale={[1.3, 1.3, 1.3]} args={[1, 8]} />
    </Trail>
  );
}
