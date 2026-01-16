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

## Modules

### Drive Train (`assemblies/structure.scad`)
-   Features compact **TT Motor Mounts ("Fangs")** with axle clearance cutouts.
-   Mirrored symmetrical design for optimal footprint.

### Gimbal (`assemblies/gimbal_layer.scad`)
-   **Moving Servo Topology**: The Tilt servo is clamped by the C-Cradle.
-   **Parametric Design**: Adjustable dimensions via `config.scad`.

## Animation

The model is rigged for animation. The internal variables in `config.scad` drive the motion based on the special `$t` time variable:
-   `pan_angle`: Oscillates +/- 45 degrees.
-   `tilt_angle`: Oscillates +/- 30 degrees.
-   `wheel_rot`: Simulates forward motion.
