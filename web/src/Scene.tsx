import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Grid } from '@react-three/drei';
import { RobotModel } from './RobotModel';

export function Scene() {
    return (
        <Canvas camera={{ position: [5, 5, 5], fov: 45 }} shadows>
            <color attach="background" args={['#101010']} />

            {/* Lights & Environment */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />

            {/* Robot Stage */}
            <Stage intensity={0.5} environment="city" adjustCamera={false}>
                <RobotModel />
            </Stage>

            {/* Helpers */}
            <Grid infiniteGrid fadeDistance={50} sectionColor="#444" cellColor="#222" />
            <OrbitControls makeDefault />
        </Canvas>
    );
}
