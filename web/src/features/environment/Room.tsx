import { WebcamWall } from './WebcamWall';

interface RoomProps {
    width?: number;
    height?: number;
    depth?: number;
}

export function Room({ width = 5333, height = 3000, depth = 4000 }: RoomProps) {
    const wallX = width / 2;
    const wallY = height / 2;
    const wallZ = depth / 2;

    return (
        <group>
            {/* Floor (at Y=0) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[width * 1.5, depth * 1.5]} />
                <meshStandardMaterial color="#4e342e" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Back Wall (Brown) - Now at -Z (Behind Robot, since Robot faces +Z) */}
            <mesh position={[0, wallY, -wallZ]} receiveShadow>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {/* Front Wall (Webcam) - Now at +Z (In Front of Robot) */}
            {/* WebcamWall internally faces -Z. If at +Z, it looks at Origin. Perfect. */}
            <group position={[0, wallY, wallZ]}>
                <WebcamWall width={width} height={height} />
            </group>

            {/* Side Wall (Left) */}
            {/* At -X, faces +X. (Standard) */}
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-wallX, wallY, 0]} receiveShadow>
                <planeGeometry args={[depth, height]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {/* Side Wall (Right) */}
            {/* At +X, faces -X. (Standard) */}
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[wallX, wallY, 0]} receiveShadow>
                <planeGeometry args={[depth, height]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {/* Baseboard/Trim (Back Wall at -Z) */}
            <mesh position={[0, 10, -wallZ + 5]}>
                <boxGeometry args={[width, 20, 10]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
        </group>
    );
}
