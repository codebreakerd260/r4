import { useState, useEffect } from 'react';
import { Leva, useControls } from 'leva';
import { Scene } from './features/environment/Scene';
import { Joystick } from './features/controls/Joystick';
import { useRobotSocket } from './hooks/useRobotSocket';
import './App.css';

function App() {
  // Configurable Sensitivity
  // Leva controls appear in the panel
  const config = useControls('Sensitivity', {
    maxVelocity: { value: 250, min: 10, max: 500, label: 'Max Speed (mm/s)' },
    maxTurnSpeed: { value: 60, min: 10, max: 180, label: 'Turn Speed (deg/s)' },
    maxPan: { value: 45, min: 1, max: 120, label: 'Pan Range (deg)' },
    maxTilt: { value: 20, min: 1, max: 90, label: 'Tilt Range (deg)' }
  });

  // WebSocket Hook (Handles connection & incoming CV commands)
  const { isConnected, moveCmd: cvMove, lookCmd: cvLook, sendCommand } = useRobotSocket('ws://localhost:8000/ws');

  // Joystick State (Manual Input)
  const [manualMove, setManualMove] = useState({ v: 0, w: 0 });
  const [manualLook, setManualLook] = useState({ pan: 0, tilt: 0 });

  // Merge CV + Manual (Manual overrides CV if active?)
  // For now, let's just use Manual directly for sending, and CV for display/override if needed
  // Or simpler: If Manual is 0, use CV. 

  // ACTUALLY: The previous logic was: if update from socket, set state.
  // The hook provides `moveCmd` from socket. 
  // Let's use a combined effect to sync them or just prefer one.

  // Current logic: 
  // 1. User moves joystick -> updates `moveCmd` -> sends to backend.
  // 2. Backend sends CV -> updates `moveCmd` -> joystick updates?

  // Let's keep it simple: The Source of Truth is the State.
  // We need to sync the hook's output to our state if it changes.

  useEffect(() => {
    if (cvMove.v !== 0 || cvMove.w !== 0) setManualMove(cvMove);
  }, [cvMove]);

  useEffect(() => {
    if (cvLook.pan !== 0 || cvLook.tilt !== 0) setManualLook(cvLook);
  }, [cvLook]);

  // Transmit whenever Manual State changes (User Input)
  useEffect(() => {
    if (isConnected) {
      sendCommand({ move: manualMove, look: manualLook });
    }
  }, [manualMove, manualLook, isConnected, sendCommand]);

  // Left Joystick: Drive (Velocity, Omega)
  const handleDrive = (data: { x: number; y: number }) => {
    // scale inputs by config values
    setManualMove({
      v: data.y * config.maxVelocity,
      w: data.x * -(config.maxTurnSpeed * (Math.PI / 180))
    });
  };

  const handleDriveEnd = () => {
    setManualMove({ v: 0, w: 0 });
  };

  // Right Joystick: Gimbal (Pan, Tilt)
  const handleLook = (data: { x: number; y: number }) => {
    setManualLook({
      pan: data.x * -config.maxPan,
      tilt: data.y * config.maxTilt
    });
  };

  const handleLookEnd = () => {
    // Return to center on release
    setManualLook({ pan: 0, tilt: 0 });
  };

  return (
    <>
      <div className="overlay">
        <h1>R4 Studio</h1>
        <p>Teleoperation Interface</p>
      </div>

      <div className="controls">
        {/* Ensure Leva is visible, maybe collapsed by default */}
        <Leva collapsed />
      </div>

      {/* 3D Scene - Pass Commands */}
      <Scene moveCmd={manualMove} lookCmd={manualLook} />

      {/* Left Joystick: Drive (Orange) */}
      <Joystick
        side="left"
        color="#ff8800"
        onMove={handleDrive}
        onEnd={handleDriveEnd}
      />

      {/* Right Joystick: Gimbal (Blue) */}
      <Joystick
        side="right"
        color="dodgerblue"
        onMove={handleLook}
        onEnd={handleLookEnd}
      />
    </>
  );
}

export default App;
