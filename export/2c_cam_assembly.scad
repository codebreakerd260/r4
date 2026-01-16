include <../config.scad>;
use <../parts/gimbal_parts.scad>;
use <../parts/hardware.scad>;

// 2c. (C_Cradle, tilt servo, Part_PiCam_Head, Part_Pi_Camera_Module)
// From assemblies/gimbal_layer.scad
translate(pos_gimbal) rotate([0, 0, 90]) translate([-6, -6.25, 0]) { 
    translate([6.0, 6.25, 31.6]) rotate([0, 0, pan_angle - 90]) {
        translate([18.0, 0, 28.0]) rotate([tilt_angle, 0, 0]) rotate([90, 0, 90]) color("dodgerblue", 0.5) SG90_Body_Centered();
        translate([7.0, 0, 28.0]) rotate([tilt_angle, 0, 0]) union() {
            rotate([180, 0, 0]) C_Cradle_Fixed(); 
            rotate([90, 0, 90]) translate([27.5, 0, 0]) rotate([0, 90, 0]) translate([10, 0, 5]) {
                Part_PiCam_Head(); 
            }
        }
    }
}
