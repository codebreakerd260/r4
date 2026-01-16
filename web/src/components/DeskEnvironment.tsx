import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, RenderTexture } from '@react-three/drei';
import { DeskLayout } from './DeskLayout';
import { PerspectiveCamera as PerspectiveCameraType } from 'three';

interface DeskEnvironmentProps {
    robotState?: any;
}

export function DeskEnvironment({ robotState }: DeskEnvironmentProps) {
    const camRef = useRef<PerspectiveCameraType>(null);
    const P_TILT_HEIGHT = 155.6; // Approximate camera height

    useFrame(() => {
        if (camRef.current && robotState && robotState.current) {
            const { x, z, theta, pan, tilt } = robotState.current;

            // Sync Position
            camRef.current.position.set(x, P_TILT_HEIGHT, z);

            // Sync Rotation
            // Theta (Base Heading, deg) + Pan (Head Turn, deg)
            const globalHeading = (theta + pan) * (Math.PI / 180);
            const tiltRad = tilt * (Math.PI / 180);

            // Apply Y rotation (Heading)
            // Note: Camera defaults to looking down -Z. 
            // Our theta=0 faces -Z. +Theta is CCW (Left). 
            // Three.js rotY IS CCW. So direct mapping works.
            camRef.current.rotation.set(tiltRad, globalHeading, 0, 'YXZ');
        }
    });

    return (
        <group>
            {/* The Real Physical World */}
            <DeskLayout />

            {/* The Monitor Screen (Picture-in-Picture) */}
            <group position={[0, 230, -275]}>
                <mesh position={[0, 0, 11]}>
                    <planeGeometry args={[480, 280]} />
                    <meshBasicMaterial toneMapped={false}>
                        <RenderTexture attach="map" width={512} height={512}>
                            <PerspectiveCamera makeDefault manual ref={camRef} position={[0, 150, 0]} fov={80} />

                            {/* Lighting for inside the monitor */}
                            <ambientLight intensity={0.6} />
                            <pointLight position={[0, 1000, 0]} intensity={1.0} />

                            {/* The World seen by the Robot */}
                            <DeskLayout />
                        </RenderTexture>
                    </meshBasicMaterial>
                </mesh>
            </group>
        </group>
    );
}
