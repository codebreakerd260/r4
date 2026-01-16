from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

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

@app.get("/")
def read_root():
    return {"status": "r4_online"}

@app.get("/telemetry")
def read_telemetry():
    # Placeholder for IMU/Sensor data
    return {"pan": 0, "tilt": 0, "battery": 100}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")
    try:
        while True:
            data = await websocket.receive_text()
            # For now, just print the command to verify throughput
            # In real system, this would write to Serial
            print(f"CMD: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")
