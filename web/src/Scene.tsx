import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { RobotModel } from './RobotModel';
import { Suspense } from 'react';

export function Scene() {
    return (
        <Canvas camera={{ position: [-250, 150, -250], fov: 50 }} shadows>
            <color attach="background" args={['#202020']} />
            <fog attach="fog" args={['#202020', 500, 2000]} />

            {/* Lights */}
            <ambientLight intensity={0.5} />
            <pointLight position={[500, 500, 500]} intensity={2.0} decay={0} castShadow />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[5000, 5000]} />
                <meshStandardMaterial color="#202020" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Robot Model */}
            <Suspense fallback={null}>
                <RobotModel />
            </Suspense>

            {/* Helpers */}
            <Grid infiniteGrid sectionSize={100} cellSize={10} sectionColor="#666" cellColor="#444" />
            <OrbitControls makeDefault />
        </Canvas>
    );
}
