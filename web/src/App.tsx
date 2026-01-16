import { useState, useRef, useEffect } from 'react';
import { Leva, useControls } from 'leva';
import { Scene } from './Scene';
import { Joystick } from './components/Joystick';
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

  // State for Robot Control
  const [moveCmd, setMoveCmd] = useState({ v: 0, w: 0 });
  const [lookCmd, setLookCmd] = useState({ pan: 0, tilt: 0 });

  // WebSocket Connection
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to Backend API
    const socket = new WebSocket('ws://localhost:8000/ws');

    socket.onopen = () => {
      console.log('Connected to r4 Brain');
    };

    socket.onclose = () => {
      console.log('Disconnected from r4 Brain');
    };

    socket.onerror = (err) => {
      console.error('WebSocket Error:', err);
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  // Transmit Commands
  useEffect(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'control',
        move: moveCmd,
        look: lookCmd
      };
      ws.current.send(JSON.stringify(payload));
    }
  }, [moveCmd, lookCmd]);

  // Left Joystick: Drive (Velocity, Omega)
  const handleDrive = (data: { x: number; y: number }) => {
    // scale inputs by config values
    setMoveCmd({
      v: data.y * config.maxVelocity,
      w: data.x * -(config.maxTurnSpeed * (Math.PI / 180))
    });
  };

  const handleDriveEnd = () => {
    setMoveCmd({ v: 0, w: 0 });
  };

  // Right Joystick: Gimbal (Pan, Tilt)
  const handleLook = (data: { x: number; y: number }) => {
    setLookCmd({
      pan: data.x * -config.maxPan,
      tilt: data.y * config.maxTilt
    });
  };

  const handleLookEnd = () => {
    // Return to center on release
    setLookCmd({ pan: 0, tilt: 0 });
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
      <Scene moveCmd={moveCmd} lookCmd={lookCmd} />

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
