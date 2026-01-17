import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useControls } from 'leva';
import { RobotModel } from '../robot/RobotModel';
import { DeskEnvironment } from './DeskEnvironment';
import { Room } from './Room';

interface SceneProps {
    moveCmd: { v: number; w: number };
    lookCmd: { pan: number; tilt: number };
}

export function Scene({ moveCmd, lookCmd }: SceneProps) {
    const robotState = useRef({ x: 500, z: -300, theta: 120, pan: 0, tilt: 0 });

    const { width, height, depth } = useControls('Room Size', {
        width: { value: 5000, min: 2000, max: 10000, step: 100 },
        height: { value: 2800, min: 2000, max: 6000, step: 100 },
        depth: { value: 4000, min: 2000, max: 10000, step: 100 }
    });

    // Calculate safe limits (Room Half-Dimension minus Desk Half-Dimension)
    // Desk is approx 1200mm wide (X) and 800mm deep (Z)
    const xLim = Math.floor((width / 2) - 600);
    const zLim = Math.floor((depth / 2) - 400);

    const { deskX, deskY, deskZ } = useControls('Desk Location', {
        deskX: { value: 0, min: -xLim, max: xLim, step: 10, label: 'X (Side)' },
        deskY: { value: 750, min: 0, max: 1500, step: 10, label: 'Y (Height)' },
        deskZ: { value: 0, min: -zLim, max: zLim, step: 10, label: 'Z (Back/Forth)' }
    }, [width, depth]); // Re-run when size changes

    return (
        <Canvas camera={{ position: [1000, 800, 1000], fov: 50, far: 10000, near: 100 }} shadows>
            <color attach="background" args={['#101010']} />

            {/* Ambient Light for base visibility */}
            <ambientLight intensity={0.8} />

            <Suspense fallback={null}>
                {/* 1. Static Room (World Frame) */}
                <Room width={width} height={height} depth={depth} />

                {/* 2. Moving Desk Group */}
                <group position={[deskX, deskY, deskZ]}>
                    <DeskEnvironment
                        robotState={robotState}
                        roomProps={{ width, height, depth }}
                        deskPosition={[deskX, deskY, deskZ]}
                    />

                    <RobotModel
                        moveCmd={moveCmd}
                        lookCmd={lookCmd}
                        robotState={robotState}
                        initialPose={{ x: 0, y: 0, z: 0, theta: 0 }}
                    />
                </group>
            </Suspense>

            <OrbitControls
                makeDefault
                enablePan={false}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.2}
                minDistance={300}
                maxDistance={5000}
            />
        </Canvas>
    );
}
