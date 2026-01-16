import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { RobotModel } from './RobotModel';
import { Suspense } from 'react';

export function Scene() {
    return (
        <Canvas camera={{ position: [-250, 150, -250], fov: 50 }} shadows>
            <color attach="background" args={['#202020']} />

            {/* Lights */}
            <ambientLight intensity={0.5} />
            <pointLight position={[500, 500, 500]} intensity={2.0} decay={0} castShadow />

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
