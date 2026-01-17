from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
from .services.vision import VisionSystem

app = FastAPI()

# Enable CORS for React Frontend (default port 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Vision System
vision = VisionSystem()
vision.start()

# Store connected clients to broadcast CV commands
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error sending to client: {e}")
                # self.active_connections.remove(connection) # Don't remove while iterating!

manager = ConnectionManager()

# Background Task to Push CV Commands
@app.on_event("startup")
async def start_cv_broadcast():
    asyncio.create_task(cv_loop())

async def cv_loop():
    print("CV Loop Started")
    while True:
        gesture, (vx, vy) = vision.get_control_data()
        
        if gesture:
            # Scale vector to suitable command range
            # v (velocity) max 500mm/s
            # w (omega) max ~1 rad/s
            # pan max 90 deg, tilt max 45 deg
            
            payload = {"type": "control", "move": None, "look": None}
            
            if gesture == "FIST":
                # Drive
                v = vy * 500  # Up is positive Y (Forward)
                w = vx * -2   # Left is negative X, Right is positive X
                payload["move"] = {"v": int(v), "w": float(w)}
                
            elif gesture == "PALM":
                # Look
                pan = vx * -90
                tilt = vy * 45
                payload["look"] = {"pan": int(pan), "tilt": int(tilt)}
            
            # Broadcast if we have a valid command
            if payload["move"] or payload["look"]:
                print(f"CV CMD: {gesture} {payload}")
                await manager.broadcast(payload)
                
        await asyncio.sleep(0.05) # 20Hz Update


@app.get("/")
def read_root():
    return {"status": "r4_online"}

@app.get("/telemetry")
def read_telemetry():
    # Placeholder for IMU/Sensor data
    return {"pan": 0, "tilt": 0, "battery": 100}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    print("Client connected")
    try:
        while True:
            data = await websocket.receive_text()
            # We receive commands from UI, but now we also SEND commands from CV
            # Ensure we don't create an infinite loop if UI echoes back
            # print(f"UI CMD: {data}")
            pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Client disconnected")
