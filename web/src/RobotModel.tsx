import { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { useControls } from 'leva';
import { Group } from 'three';

export function RobotModel() {
  const group = useRef<Group>(null);

  // Load STLs
  const wheelL = useLoader(STLLoader, '/models/1a_wheel_left.stl');
  const wheelR = useLoader(STLLoader, '/models/1b_wheel_right.stl');
  const basePan = useLoader(STLLoader, '/models/2a_base_pan.stl');
  const uBracket = useLoader(STLLoader, '/models/2b_u_bracket.stl');
  const camHead = useLoader(STLLoader, '/models/2c_cam_assembly.stl');
  const body = useLoader(STLLoader, '/models/3_remaining_all.stl');

  // Controls
  const { pan, tilt, wheelRot } = useControls({
    pan: { value: 0, min: -90, max: 90 },
    tilt: { value: 0, min: -45, max: 45 },
    wheelRot: { value: 0, min: 0, max: 360 },
  });

  // Animation Refs
  const lWheelRef = useRef<Group>(null);
  const rWheelRef = useRef<Group>(null);
  const panRef = useRef<Group>(null);    // Moves Pan Link (U-Bracket)
  const tiltRef = useRef<Group>(null);   // Moves Tilt Link (Cam)

  // Apply Transformations
  useFrame(() => {
    // Wheels
    if (lWheelRef.current) lWheelRef.current.rotation.x = wheelRot * (Math.PI / 180);
    if (rWheelRef.current) rWheelRef.current.rotation.x = wheelRot * (Math.PI / 180);

    // Pan (Rotates around Z-axis of Base Mount? No, check assembly)
    // In SCAD: Pan Servo rotates U-Bracket.
    // Origin of rotation needs to be matched.
    // For now, simple rotation. Refinement needed for pivots.
    if (panRef.current) panRef.current.rotation.z = pan * (Math.PI / 180);

    // Tilt (Rotates around X-axis of U-Bracket)
    if (tiltRef.current) tiltRef.current.rotation.x = tilt * (Math.PI / 180);
  });

  return (
    <group ref={group} dispose={null}>
      {/* 3. Main Body (Static) */}
      <primitive object={body} material-color="#333" />
      
      {/* 2a. Base Pan (Static relative to Body) */}
      <primitive object={basePan} material-color="#555" />

      {/* 1a. Left Wheel */}
      <group ref={lWheelRef}>
          <primitive object={wheelL} material-color="#111" />
      </group>

      {/* 1b. Right Wheel */}
      <group ref={rWheelRef}>
          <primitive object={wheelR} material-color="#111" />
      </group>

      {/* Dynamic Linkage Chain */}
      {/* Pan Joint */}
      <group ref={panRef} position={[0, 0, 0]}> {/* Pivot Point TBD */}
          {/* 2b. U-Bracket */}
          <primitive object={uBracket} material-color="orange" />

          {/* Tilt Joint */}
          <group ref={tiltRef} position={[0, 0, 0]}> {/* Pivot Point TBD */}
              {/* 2c. Cam Assembly */}
              <primitive object={camHead} material-color="dodgerblue" />
          </group>
      </group>

    </group>
  );
}
