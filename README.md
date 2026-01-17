# r4: Robot Control Studio 🧠🤖

**r4** is a web-based digital twin and control interface for mobile robots. It combines real-time 3D visualization, immersive environment simulation, computer vision, and low-latency hardware control into a single "Command Center" dashboard.

![Robot Studio Preview](https://via.placeholder.com/800x450.png?text=r4+Robot+Studio+Interface)
*(Replace with actual screenshot)*

## 🌟 Key Features

### 🧠 AI & Computer Vision (New!)
-   **Hand Gesture Control**: Drive the robot just by moving your hand!
    -   ✊ **FIST**: Driver Mode (Move Forward/Back, Turn Left/Right).
    -   ✋ **PALM**: Lookout Mode (Pan/Tilt Camera).
-   **Real-time Visualization**: See what the robot "sees" (Skeleton Tracking & Target Vectors).

### 🖥️ 3D Digital Twin
-   **High-Fidelity Model**: Uses detailed STL exports from our CAD source (OpenSCAD) to render the robot with physically based materials.
-   **Real-Time Kinematics**: Visualizes differential drive movement and gimbal kinematics (Pan/Tilt) in real-time.

### 🏠 Immersive Environment
-   **Dynamic Room**: A fully configurable 3D workspace. Adjust width, depth, and height to match your real surroundings.
-   **"Magic Mirror" Wall**: The front wall renders your live **Webcam Feed** (Coming soon via MJPEG Stream).
-   **Smart Desk Bounds**: Drive your robot on a virtual desk setup with collision prevention.

### 🎮 Control Interface
-   **Dual Joystick Control**:
    -   **Left Stick**: Omnidirectional Drive (Velocity/Turn).
    -   **Right Stick**: Camera Gimbal (Pan/Tilt).
-   **Touch Optimized**: Works seamlessly on touchscreens or with mouse input.

---

## 🏗️ Architecture

The system follows a modern **Domain-Driven Architecture**:

### 1. Frontend (`web/src/features/`)
Built with **React**, **Vite**, and **React Three Fiber**.
-   **`robot/`**: Kinematics logic and 3D Model components.
-   **`environment/`**: Room, Desk, and Webcam Wall simulation.
-   **`controls/`**: Joysticks, HUD, and State Management.
-   **`hooks/`**: Custom hooks like `useRobotSocket` for robust Connection Management.

### 2. Backend (`api/app/`)
Built with **FastAPI** (Python).
-   **`services/vision.py`**: The Computer Vision Engine (MediaPipe + OpenCV).
-   **`main.py`**: The Central Brain. Handles WebSockets, Broadcasts AI Commands, and manages Hardware state.

---

## 🚀 Getting Started

### Prerequisites
-   **Node.js** (v18+)
-   **Python** (v3.10+)

### 1. Frontend Setup (The Studio)
```bash
cd web
npm install
npm run dev
# Open http://localhost:5173
```

### 2. Backend Setup (The Brain)
In a new terminal:
```bash
cd api
# Create/Activate Virtual Env (Recommended)
python -m venv venv
.\venv\Scripts\activate  # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload
# Listening on http://localhost:8000
```

---

## 🕹️ Controls Guide

| Input | Action |
| :--- | :--- |
| **Left Joystick** | **Drive**: Push Up/Down for Speed, Left/Right for Turning. |
| **Right Joystick** | **Look**: Push Up/Down (Tilt), Left/Right (Pan). |
| **Hand Gestures** | **FIST**: Drive | **PALM**: Look |
| **Room Controls** | Use the **Leva Panel** (Top Right) to resize the room. |

---

## 🔮 Roadmap
- [x] **Phase 1**: Structure & Basic Teleop (Completed)
- [ ] **Phase 2**: One Camera Streaming (In Progress) implies -> *No more Camera Conflicts!*
- [ ] **Phase 3**: Hardware Integration (Arduino/ESP Serial)
- [ ] **Phase 4**: Autonomous Face Tracking

---

*Project r4 - codebreakerd260*
