import './App.css'
import { Scene } from './Scene'
import { Leva } from 'leva'
import { Joystick } from './components/Joystick'

function App() {
  const handleJoystickMove = (data: { x: number; y: number }) => {
    // console.log('Joystick:', data);
    // TODO: Connect to RobotModel via State or Context
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Leva theme={{ colors: { highlight1: 'orange', highlight2: 'dodgerblue' } }} />
      <div className="overlay">
        <h1>R4 Robot Twin</h1>
        <p>ROS & AI Edition</p>
      </div>
      <Joystick onMove={handleJoystickMove} />
      <Scene />
    </div>
  )
}

export default App
