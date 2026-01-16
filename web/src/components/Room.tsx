export function Room() {
    return (
        <group>
            {/* Floor (Wood/Carpet) */}
            {/* Desk is at y=0. Tabletop height usually ~750mm. */}
            {/* So floor is at y=-750. */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -750, 0]} receiveShadow>
                <planeGeometry args={[4000, 4000]} />
                <meshStandardMaterial color="#4e342e" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Back Wall */}
            <mesh position={[0, 1250, -1000]} receiveShadow>
                <planeGeometry args={[4000, 4000]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {/* Side Wall (Left) */}
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-2000, 1250, 0]} receiveShadow>
                <planeGeometry args={[4000, 4000]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {/* Side Wall (Right) */}
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[2000, 1250, 0]} receiveShadow>
                <planeGeometry args={[4000, 4000]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {/* Baseboard/Trim (Optional detail) */}
            <mesh position={[0, -740, -995]}>
                <boxGeometry args={[4000, 20, 10]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
        </group>
    );
}
