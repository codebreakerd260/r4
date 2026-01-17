import sys
print(f"Python executable: {sys.executable}")
print(f"Python path: {sys.path}")

try:
    import mediapipe
    print(f"mediapipe imported. File: {mediapipe.__file__}")
    print(f"dir(mediapipe): {dir(mediapipe)}")
except ImportError as e:
    print(f"Failed to import mediapipe: {e}")

try:
    import mediapipe as mp
    print(f"mp.solutions: {mp.solutions}")
except AttributeError:
    print("mp.solutions does not exist")
except Exception as e:
    print(f"Error accessing mp.solutions: {e}")

try:
    import mediapipe.solutions
    print("import mediapipe.solutions SUCCESS")
    import mediapipe.solutions.hands
    print("import mediapipe.solutions.hands SUCCESS")
except Exception as e:
    print(f"import mediapipe.solutions FAILED: {e}")
