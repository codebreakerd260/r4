import cv2
import mediapipe as mp
import numpy as np
import threading
import time

class VisionSystem:
    def __init__(self, camera_index=0):
        self.camera_index = camera_index
        self.cap = None
        self.running = False
        
        # MediaPipe Hands
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        
        # Latest result [Type, x, y]
        # Type: "FIST", "PALM", or None
        self.latest_gesture = None
        self.latest_vector = (0, 0)
        
    def start(self):
        self.running = True
        try:
            self.cap = cv2.VideoCapture(self.camera_index)
            if not self.cap.isOpened():
                print(f"Warning: Could not open camera {self.camera_index}. CV will be disabled.")
                self.cap = None
            else:
                print(f"Vision System Started on Device {self.camera_index}")
        except Exception as e:
            print(f"Error opening camera: {e}")
            self.cap = None

        threading.Thread(target=self._update_loop, daemon=True).start()

    def stop(self):
        self.running = False
        if self.cap:
            self.cap.release()

    def _update_loop(self):
        while self.running:
            if not self.cap:
                time.sleep(1) # specific sleep if no camera
                continue

            success, image = self.cap.read()
            if not success:
                continue

            # Flip for mirror effect
            image = cv2.flip(image, 1)
            
            # MediaPipe needs RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = self.hands.process(image_rgb)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    self._process_hand(hand_landmarks)
            else:
                self.latest_gesture = None
                self.latest_vector = (0, 0)

            # Optional: Show debug window
            # Draw landmarks on debug image
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                     self.mp_drawing.draw_landmarks(
                        image,
                        hand_landmarks,
                        self.mp_hands.HAND_CONNECTIONS)
            
            # Show gesture status on screen
            status_text = f"Gesture: {self.latest_gesture} | V: {self.latest_vector[0]:.2f}, {self.latest_vector[1]:.2f}"
            cv2.putText(image, status_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            cv2.imshow('R4 Vision', image)
            if cv2.waitKey(5) & 0xFF == 27: break
            
            time.sleep(0.03) # ~30 FPS

    def _process_hand(self, landmarks):
        # 1. Calculate Centroid (approximate by Wrist + Middle Knuckle)
        wrist = landmarks.landmark[self.mp_hands.HandLandmark.WRIST]
        middle_mcp = landmarks.landmark[self.mp_hands.HandLandmark.MIDDLE_FINGER_MCP]
        
        cx = (wrist.x + middle_mcp.x) / 2
        cy = (wrist.y + middle_mcp.y) / 2
        
        # Center is 0.5, 0.5. Map to -1 to 1 range
        vx = (cx - 0.5) * 2  # -1 (Left) to 1 (Right)
        vy = (cy - 0.5) * -2 # -1 (Down) to 1 (Up) - Inverted Y for Joystick logic
        
        # Deadzone
        deadzone = 0.15
        if abs(vx) < deadzone: vx = 0
        if abs(vy) < deadzone: vy = 0
        
        # Debug: Print raw and filtered values logic
        # print(f"Raw: {vx:.2f}, {vy:.2f}")

        self.latest_vector = (vx, vy)

        # 2. Detect Gesture (Fist vs Palm)
        # Robust Method: Distance from Tip to Wrist
        # If tips are close to wrist, it's a fist.
        
        tips = [
            landmarks.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP],
            landmarks.landmark[self.mp_hands.HandLandmark.MIDDLE_FINGER_TIP],
            landmarks.landmark[self.mp_hands.HandLandmark.RING_FINGER_TIP],
            landmarks.landmark[self.mp_hands.HandLandmark.PINKY_TIP]
        ]
        
        wrist_p = landmarks.landmark[self.mp_hands.HandLandmark.WRIST]
        
        folded_fingers = 0
        for tip in tips:
            # Calculate distance in 2D plane (ignoring Z for simplicity)
            dist = np.sqrt((tip.x - wrist_p.x)**2 + (tip.y - wrist_p.y)**2)
            # Threshold needs tuning: 0.15 is roughly "folded" in normalized coords
            if dist < 0.2: 
                folded_fingers += 1

        if folded_fingers >= 3:
            self.latest_gesture = "FIST"
        else:
            self.latest_gesture = "PALM"

    def get_control_data(self):
        return self.latest_gesture, self.latest_vector
