import { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import { Group } from 'three';

interface RobotModelProps {
  moveCmd: { v: number; w: number };
  lookCmd: { pan: number; tilt: number };
  robotState?: any;
  initialPose?: { x: number; y: number; z: number; theta: number };
}

export function RobotModel({ moveCmd, lookCmd, robotState }: RobotModelProps) {
  const robotRef = useRef<Group>(null);

  // Load STLs
  const wheelL = useLoader(STLLoader, '/models/1a_wheel_left.stl');
  const wheelR = useLoader(STLLoader, '/models/1b_wheel_right.stl');
  const basePan = useLoader(STLLoader, '/models/2a_base_pan.stl');
  const uBracket = useLoader(STLLoader, '/models/2b_u_bracket.stl');
  const camHead = useLoader(STLLoader, '/models/2c_cam_assembly.stl');
  const body = useLoader(STLLoader, '/models/3_remaining_all.stl');

  // Kinematics Constants (mm)
  const WHEEL_SEP = 140;
  const WHEEL_RAD = 32.5;

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

  // State for integration
  const wheelAngles = useRef({ l: 0, r: 0 });
  // 4. Add state ref for robot pose (Home: Mirrored to Lamp)
  // Lamp: x=-500, z=-300, rot=0.75. Robot: x=500, z=-300, theta=120 deg (Face Center).
  const pose = useRef({ x: 400, z: -200, theta: 180 });

  useFrame((_, delta) => {
    // 1. Servo Control (Direct Position from Props)
    // Scale inputs if necessary or assume inputs are already in degrees
    // In App.tsx: Pan is scaled to (-90, 90), Tilt to (45).
    const rPan = lookCmd.pan * (Math.PI / 180);
    const rTilt = lookCmd.tilt * (Math.PI / 180);

    // 2. Differential Drive Kinematics Integration (From Props)
    const velocity = moveCmd.v; // mm/s
    const omega = moveCmd.w;    // rad/s

    // vL = v - (w * L / 2)
    // vR = v + (w * L / 2)
    const vL = velocity - (omega * WHEEL_SEP) / 2;
    const vR = velocity + (omega * WHEEL_SEP) / 2;

    // dTheta = (v / r) * dt
    wheelAngles.current.l += (vL / WHEEL_RAD) * delta;
    wheelAngles.current.r += (vR / WHEEL_RAD) * delta;

    // 5. World Pose Integration (Global Locomotion)
    // Robot faces -Z at theta=0.
    // +Omega (CCW) increases theta.
    const omegaDeg = omega * (180 / Math.PI);
    pose.current.theta += omegaDeg * delta;

    // Calculate velocity vector based on heading
    // vx = -v * sin(theta) (Left is -X)
    // vz = -v * cos(theta) (Forward is -Z)
    const rTheta = pose.current.theta * (Math.PI / 180);
    const vx = -velocity * Math.sin(rTheta);
    const vz = -velocity * Math.cos(rTheta);

    // Desk Bounds (1200x800mm -> +/- 600, +/- 400)
    // Robot Radius approx 80mm
    const BORDER = 80;
    const X_LIM = 600 - BORDER;
    const Z_LIM = 400 - BORDER;

    // Proposed next position
    let nextX = pose.current.x + vx * delta;
    let nextZ = pose.current.z + vz * delta;

    // Hard Stop at Desk Edges
    nextX = Math.max(-X_LIM, Math.min(X_LIM, nextX));
    nextZ = Math.max(-Z_LIM, Math.min(Z_LIM, nextZ));

    pose.current.x = nextX;
    pose.current.z = nextZ;

    // Sync to Shared State for Camera Monitor
    if (robotState) {
      robotState.current = {
        x: nextX,
        z: nextZ,
        theta: pose.current.theta,
        pan: lookCmd.pan,
        tilt: lookCmd.tilt
      };
    }

    // Apply Global Transform to robotRef
    if (robotRef.current) {
      robotRef.current.position.x = pose.current.x;
      robotRef.current.position.z = pose.current.z;
      robotRef.current.rotation.y = pose.current.theta * (Math.PI / 180);
    }

    // Apply Local Wheel/Servo Transforms
    if (lWheelGrp.current) lWheelGrp.current.rotation.x = wheelAngles.current.l;
    if (rWheelGrp.current) rWheelGrp.current.rotation.x = wheelAngles.current.r;

    if (panGrp.current) panGrp.current.rotation.z = rPan;
    if (tiltGrp.current) tiltGrp.current.rotation.x = rTilt;
  });

  return (
    // 1. Outer group uses robotRef, 3. no initial rotation
    <group ref={robotRef}>
      {/* 2. Inner group for model orientation correction */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
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
    </group>
  );
}
