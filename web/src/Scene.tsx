import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RobotModel } from './RobotModel';
import { Suspense } from 'react';
import { DeskEnvironment } from './components/DeskEnvironment';

interface SceneProps {
    moveCmd: { v: number; w: number };
    lookCmd: { pan: number; tilt: number };
}

export function Scene({ moveCmd, lookCmd }: SceneProps) {
    return (
        <Canvas camera={{ position: [250, 250, 250], fov: 90 }} shadows>
            <color attach="background" args={['#101010']} />

            {/* Ambient Light for base visibility */}
            <ambientLight intensity={0.2} />

            {/* Main Overhead Room Light */}
            <pointLight position={[0, 1000, 0]} intensity={1.5} decay={0} castShadow shadow-mapSize={[2048, 2048]} />

            {/* Desk Environment (Desk, Monitor, Lamp) */}
            <DeskEnvironment />

            {/* Robot Model */}
            <Suspense fallback={null}>
                <RobotModel moveCmd={moveCmd} lookCmd={lookCmd} />
            </Suspense>

            <OrbitControls
                makeDefault
                enablePan={false}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.2}
                minDistance={300}
                maxDistance={1200}
            />
        </Canvas>
    );
}
