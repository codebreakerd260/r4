import { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
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

  // Pivots
  const P_WHEEL_L = [-70, 20, 32.5] as const;
  const P_WHEEL_R = [70, 20, 32.5] as const;
  const P_PAN = [0, 55, 127.6] as const;
  const P_TILT = [7, 55, 155.6] as const;

  // Refs
  const lWheelGrp = useRef<Group>(null);
  const rWheelGrp = useRef<Group>(null);
  const panGrp = useRef<Group>(null);
  const tiltGrp = useRef<Group>(null);

  useFrame(() => {
    const rPan = pan * (Math.PI / 180);
    const rTilt = tilt * (Math.PI / 180);
    const rWheel = wheelRot * (Math.PI / 180);

    if (lWheelGrp.current) lWheelGrp.current.rotation.x = rWheel;
    if (rWheelGrp.current) rWheelGrp.current.rotation.x = rWheel;
    if (panGrp.current) panGrp.current.rotation.z = rPan;
    if (tiltGrp.current) tiltGrp.current.rotation.x = rTilt;
  });

  return (
    <group ref={group} rotation={[-Math.PI / 2, 0, 0]}>
      {/* 3. Main Body - Gunmetal Grey */}
      <mesh geometry={body} castShadow receiveShadow>
        <meshPhysicalMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 2a. Base Pan - Darker Grey */}
      <mesh geometry={basePan} castShadow receiveShadow>
        <meshPhysicalMaterial color="#444" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 1a. Left Wheel Group */}
      <group ref={lWheelGrp} position={P_WHEEL_L}>
        <mesh geometry={wheelL} position={[-P_WHEEL_L[0], -P_WHEEL_L[1], -P_WHEEL_L[2]]} castShadow receiveShadow>
          {/* Rubber Tire Look */}
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>

      {/* 1b. Right Wheel Group */}
      <group ref={rWheelGrp} position={P_WHEEL_R}>
        <mesh geometry={wheelR} position={[-P_WHEEL_R[0], -P_WHEEL_R[1], -P_WHEEL_R[2]]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>

      {/* Pan Group */}
      <group ref={panGrp} position={P_PAN}>
        {/* U-Bracket - Glossy Orange */}
        <mesh geometry={uBracket} position={[-P_PAN[0], -P_PAN[1], -P_PAN[2]]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#ff8800" roughness={0.2} metalness={0.0} clearcoat={1.0} />
        </mesh>

        {/* Tilt Group */}
        <group ref={tiltGrp} position={[P_TILT[0] - P_PAN[0], P_TILT[1] - P_PAN[1], P_TILT[2] - P_PAN[2]]}>
          {/* Camera - Glossy Blue */}
          <mesh geometry={camHead} position={[-P_TILT[0], -P_TILT[1], -P_TILT[2]]} castShadow receiveShadow>
            <meshPhysicalMaterial color="dodgerblue" roughness={0.2} metalness={0.0} clearcoat={1.0} />
          </mesh>
        </group>
      </group>

    </group>
  );
}
