import { useControls } from 'leva';
import { WebcamWall } from './WebcamWall';

export function Room() {
    const { width, height, depth } = useControls('Room Dimensions', {
        width: { value: 5333, min: 2000, max: 10000, step: 100 },
        height: { value: 3000, min: 2000, max: 6000, step: 100 },
        depth: { value: 4000, min: 2000, max: 10000, step: 100 }
    });

    const wallY = height / 2 - 750;
    const wallZ = depth / 2;
    const wallX = width / 2;

    return (
        <group>
            {/* Floor (Wood/Carpet) */}
            {/* Desk is at y=0. Tabletop height usually ~750mm. */}
            {/* So floor is at y=-750. */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -750, 0]} receiveShadow>
                <planeGeometry args={[width * 1.5, depth * 1.5]} />
                <meshStandardMaterial color="#4e342e" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Back Wall */}
            <mesh position={[0, wallY, -wallZ]} receiveShadow>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {/* Front Wall (User Webcam Feed) */}
            <group position={[0, wallY, wallZ]}>
                <WebcamWall width={width} height={height} />
            </group>

            {/* Side Wall (Left) */}
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-wallX, wallY, 0]} receiveShadow>
                <planeGeometry args={[depth, height]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {/* Side Wall (Right) */}
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[wallX, wallY, 0]} receiveShadow>
                <planeGeometry args={[depth, height]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {/* Baseboard/Trim (Back Wall) */}
            <mesh position={[0, -740, -wallZ + 5]}>
                <boxGeometry args={[width, 20, 10]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
        </group>
    );
}
