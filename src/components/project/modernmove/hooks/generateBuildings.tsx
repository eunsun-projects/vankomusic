export default function generateBuildings() {
  const buildings = [];
  const buildingCount = Math.floor(Math.random() * 10) + 80; // 5 ~ 35개의 빌딩

  for (let i = 0; i < buildingCount; i++) {
    const boxHeight = Math.random() * 10 + 2; // 5 ~ 12의 높이
    const meshPosition = [
      (Math.random() - 0.5) * 100,
      boxHeight / 2, // y: 빌딩의 중앙
      Math.random() * -10 - 8,
    ];

    buildings.push(
      <mesh position={meshPosition as [number, number, number]} key={i}>
        <boxGeometry args={[3, boxHeight, 3]} />
        <meshStandardMaterial
          color="#80a6ed" // #555 #ff4d00 #9726a3
          emissive="aqua" // #ff70fa #fff8db
          emissiveIntensity={0.1}
        />
      </mesh>,
    );
  }
  return buildings;
}
