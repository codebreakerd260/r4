# r4: Robot Control Studio

**r4** is a web-based digital twin and control interface for mobile robots. It combines real-time 3D visualization, immersive environment simulation, and low-latency hardware control into a single "Command Center" dashboard.

![Robot Studio Preview](https://via.placeholder.com/800x450.png?text=r4+Robot+Studio+Interface)
*(Replace with actual screenshot)*

## 🌟 Key Features

### 🖥️ 3D Digital Twin
-   **High-Fidelity Model**: Uses detailed STL exports from our CAD source (OpenSCAD) to render the robot with physically based materials (Gunmetal, Rubber, Glossy Plastic).
-   **Real-Time Kinematics**: Visualizes differential drive movement and gimbal kinematics (Pan/Tilt) in real-time.

### 🏠 Immersive Environment
-   **Dynamic Room**: A fully configurable 3D workspace. Adjust width, depth, and height to match your real surroundings.
-   **"Magic Mirror" Wall**: The front wall renders your live **Webcam Feed** using `getUserMedia`. This creates a mixed-reality experience where the digital robot seems to exist in your physical room.
-   **Smart Desk Bounds**: Drive your robot on a virtual desk setup. The system automatically enforces wall boundaries to prevent accidents.

### 👓 FPV Monitor System
-   **Picture-in-Picture**: A virtual monitor on the desk displays the robot's **First Person View**.
-   **True Perspective**: The FPV camera realistically renders the room, the desk, and the webcam wall from the robot's vantage point.

### 🎮 Control Interface
-   **Dual Joystick Control**:
    -   **Left Stick**: Omnidirectional Drive (Velocity/Turn).
    -   **Right Stick**: Camera Gimbal (Pan/Tilt).
-   **Touch Optimized**: Works seamlessly on touchscreens or with mouse input.
-   **Tuning**: Adjustable sensitivity sliders for speed and turn rates.

---

## 🏗️ Architecture

The system follows a modern decoupled architecture:

1.  **Frontend (`web/`)**: Built with **React**, **Vite**, and **React Three Fiber**. Handles 3D rendering, user input, and WebSocket communication.
2.  **Backend (`api/`)**: Built with **FastAPI** (Python). Acts as the bridge between the web interface and the physical robot hardware (Serial/ROS).
3.  **Hardware (Design)**: Source CAD models defined in **OpenSCAD** (`main.scad`).

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

### 2. Backend Setup (The Bridge)
In a new terminal:
```bash
cd api
# Create/Activate Virtual Env (Recommended)
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt
uvicorn main:app --reload
# Listening on http://localhost:8000
```

---

## 🕹️ Controls Guide

| Input | Action |
| :--- | :--- |
| **Left Joystick** | **Drive**: Push Up/Down for Speed, Left/Right for Turning. |
| **Right Joystick** | **Look**: Push Up/Down (Tilt), Left/Right (Pan). |
| **Room Controls** | Use the **Leva Panel** (Top Right) to resize the room or move the desk setup. |
| **Webcam** | Allow browser camera access to enable the "Magic Wall". |

---

## 🛠️ CAD Source

The physical robot design is parametric and defined in **OpenSCAD**.
-   **Entry Point**: `main.scad`.
-   **Parameters**: `config.scad`.
-   Exported STLs are located in `web/public/models/`.

---

*Project r4 - codebreakerd260*
