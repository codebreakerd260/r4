import { Grid } from '@react-three/drei';
import { Room } from './Room';

export function DeskLayout() {
    return (
        <group>
            {/* The Room Environment (Floor, Walls) */}
            <Room />

            {/* Desk Surface (1200mm x 800mm) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[1200, 800]} />
                <meshStandardMaterial color="#222" roughness={0.9} metalness={0.0} />
            </mesh>

            {/* Table Edge */}
            <mesh position={[0, -15, 0]} receiveShadow>
                <boxGeometry args={[1200, 30, 800]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Grid */}
            <Grid
                position={[0, 0.1, 0]}
                args={[1200, 800]}
                sectionSize={100}
                cellSize={25}
                sectionColor="#444"
                cellColor="#2a2a2a"
                fadeDistance={800}
            />

            {/* Monitor Stand & Frame (No Screen Content) */}
            <group position={[0, 230, -275]}>
                {/* Screen Frame/Back */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[500, 300, 20]} />
                    <meshStandardMaterial color="#111" roughness={0.2} />
                </mesh>
                {/* Stand */}
                <mesh position={[0, -150, -20]}>
                    <cylinderGeometry args={[15, 25, 150]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                <mesh position={[0, -225, -20]}>
                    <boxGeometry args={[150, 10, 150]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
            </group>

            {/* Desk Lamp (Back Right) */}
            <group position={[-400, 0, -200]} rotation={[0, 0.75, 0]}>
                {/* Base */}
                <mesh position={[0, 10, 0]}>
                    <cylinderGeometry args={[40, 50, 20]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                {/* Stem */}
                <mesh position={[0, 150, 0]}>
                    <cylinderGeometry args={[5, 5, 300]} />
                    <meshStandardMaterial color="#ccc" metalness={0.8} roughness={0.1} />
                </mesh>
                {/* Head */}
                <group position={[0, 300, 50]} rotation={[0.5, 0, 0]}>
                    <mesh rotation={[1.57, 0, 0]}>
                        <coneGeometry args={[40, 80, 32, 1, true]} />
                        <meshStandardMaterial color="white" side={2} />
                    </mesh>
                    {/* Light Bulb */}
                    <pointLight position={[0, -20, 0]} distance={1500} intensity={15} color="#ffaa55" castShadow />
                    <mesh position={[0, -10, 0]}>
                        <sphereGeometry args={[15]} />
                        <meshBasicMaterial color="#ffcc88" toneMapped={false} />
                    </mesh>
                </group>
            </group>
        </group>
    );
}
