# OpenSCAD Robot Twin (ROS & AI Edition)

A fully parametric, modular CAD twin for a Pan-Tilt Mobile Robot, designed for AI and ROS integration.

## Project Structure

This project uses a "React-style" component architecture:

-   **`main.scad`**: The entry point. Controls the global view and assembles the master model.
-   **`config.scad`**: Global configuration (dimensions, animation state, colors).
-   **`parts/`**: Atomic components (Servos, Motors, Sensors, Printed Parts).
-   **`assemblies/`**: Sub-assemblies combining parts (Chassis, Gimbal, Electronics).

## Getting Started

1.  **Install OpenSCAD**: Download and install from [openscad.org](https://openscad.org/).
2.  **Open Project**: Open `main.scad` in OpenSCAD.
3.  **Enable Preview**: Check "Automatic Reload and Preview" in the *Design* menu.

## View Controller

In `main.scad`, change the `view_index` variable to inspect different subsystems:

| Index | View | Description |
| :--- | :--- | :--- |
| `0` | **Master View** | Complete robot assembly. |
| `100` | **Structure** | Chassis Layer (Plates, Standoffs, Drive Train). |
| `200` | **Sensors** | Sensor Layer (IR Arrays, Ultrasonic). |
| `300` | **Gimbal** | Pan-Tilt Mechanism (Servos, C-Cradle, Camera). |
| `400` | **Electronics** | Compute Layer (Pi 4, IMU, Motor Drivers). |

## Export (`export/`)

The model is pre-configured to export specific sub-assemblies for manufacturing or simulation. Open these files individually to render/export:

| File | Component | Description |
| :--- | :--- | :--- |
| `1a_wheel_left.scad` | **Left Wheel** | Positioned In-Place (-X). |
| `1b_wheel_right.scad` | **Right Wheel** | Positioned In-Place (+X). |
| `2a_base_pan.scad` | **Pan Assembly** | Base Mount + Pan Servo Body. |
| `2b_u_bracket.scad` | **U-Bracket** | Bracket + Integrated Servo Horns. |
| `2c_cam_assembly.scad` | **Camera Head** | C-Cradle + Tilt Servo Body + Camera. |
| `3_remaining_all.scad` | **Main Body** | Chassis, Sensors, Electronics (Excludes Wheels & Gimbal). |

## Modules

### Drive Train (`assemblies/structure.scad`)
-   Features compact **TT Motor Mounts ("Fangs")** with axle clearance cutouts.
-   Mirrored symmetrical design for optimal footprint.

### Gimbal (`assemblies/gimbal_layer.scad`)
-   **Servo Horn Integration**: Horns are geometrically fused to the **U-Bracket** (not the servo), matching the physical "clipped-in" assembly.
-   **Split Topology**: Servos utilize a split `SG90_Body` vs `Servo_Horn` architecture to prevent visual artifacts.
-   **Moving Topology**: The Tilt servo is clamped by the C-Cradle.

## Animation

The model is rigged for animation. The internal variables in `config.scad` drive the motion based on the special `$t` time variable:
-   `pan_angle`: Oscillates +/- 45 degrees.
-   `tilt_angle`: Oscillates +/- 30 degrees.
-   `wheel_rot`: Simulates forward motion.
