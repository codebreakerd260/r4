// FILE: parts/gimbal_parts.scad
include <../config.scad>;
use <hardware.scad>;

module Part_PiCam_Head() translate([-2.5, 0, -4.5]){
    color("gray") difference() { 
        cube([26, 30, 3], center = true); 
        cylinder(h = 5, d = 6.5, center = true); 
        for(mx=[-10.5, 10.5]) for(my=[-10, 10]) translate([mx,my,0]) cylinder(d=2.2, h=5, center=true);
    }
    translate([0, 0, 2]) rotate([0, 0, 180]) Part_Pi_Camera_Module();
}

module Part_Pi_Camera_Module() { color("darkgreen") cube([25, 24, 1], center=true); color("black") translate([0, 2, 2.5]) cube([8, 8, 5], center=true); color("ivory") translate([0, -9.5, 1.5]) cube([20, 4, 2], center=true); }
module Base_Mount() { color("orange") difference() { translate([-3, -3, 0]) cube([29.5, 19, 14.25]); translate([0, 0, 3]) cube([23.5, 13, 22.5]); } }
module U_Bracket_Fixed() { 
    // GAP CALCULATION:
    // Servo Body Depth (~24mm with cable strain relief?) + C-Cradle Base (2.5mm) + Clearance.
    // Let's set a comfortable Gap of 34mm (Adjustable).
    gap_half = 19; // 38mm total gap
    arm_thick = 3;
    base_w = gap_half * 2 + arm_thick * 2;
    
    union() {
        color("orange") difference() { 
            union() { 
                // Base
                translate([-base_w/2, -13.5, 0]) cube([base_w, 27, 3]); 
                // Right Arm
                translate([gap_half, -13.5, 3]) cube([arm_thick, 27, 36.5]); 
                // Left Arm
                translate([-gap_half - arm_thick, -13.5, 3]) cube([arm_thick, 27, 36.5]); 
            } 
            
            // 1. Bottom: Double Arm Horn Recess
            translate([0, 0, 0]) Servo_Horn_Recess("double"); 
            
            // 2. Right Arm: Single Arm Horn Recess (Internal face)
            translate([gap_half, 0, 28]) rotate([0, 90, 0]) Servo_Horn_Recess("single"); 
            
            // 3. Left Arm: Pivot Pin Recess (Internal face)
            translate([-gap_half, 0, 28]) rotate([0, 90, 0]) cylinder(h=10, d=6, center=true); 
        }

        // Add Horns (Additive geometry)
        // 1. Bottom Horn
        translate([0, 0, 0]) rotate([180, 0, 0]) translate([0,0,-1.5]) Servo_Horn("double");

        // 2. Right Arm Horn
        translate([gap_half, 0, 28]) rotate([0, 90, 0]) rotate([180, 0, 0]) translate([0,0,-1.5]) Servo_Horn("single");
    } 
}

module C_Cradle_Fixed() { 
    // "LAY DOWN C" (Refactored)
    // Optimized for standard Servo Body (22.5mm x 12mm x 23mm)
    
    // 1. DIMENSIONS
    wall_thick = 5;          // Thickened wall
    
    // Total Length target: ~22.5mm (Match Servo Body, stop before ears).
    // Length = wall_thick + arm_len_x.
    // 23 = 5 + 18.
    arm_len_x  = 18;         // Restored length to cover body
    arm_h      = 16.0;         // Compact height (-8 to +8)
    
    // 2. POSITIONING
    // Consolidated Offset:
    // Original Pivot (-17) + User Shift (-6) + User Thickness Shift (+2) = -21.
    cradle_origin_x = -21; 
    cradle_shift_y  = -8; 
    
    translate([cradle_origin_x, cradle_shift_y, 0]) color("limegreen") {
        union() {
            // A. LEFT WALL (BASE)
            // Sits at local origin (0, -15, -8)
            // Extended Y-length to 33 to reach Back Arm at Y=13
            translate([0, -15, -arm_h/2]) cube([wall_thick, 33, arm_h]);
            
            // B. PIVOT PIN
            // Extends from local 0,0,0
            translate([0, 8, 0]) rotate([0, -90, 0]) cylinder(d=5.8, h=8);

            // C. FRONT ARM (Camera Side)
            difference() {
                translate([0, -14, -arm_h/2]) cube([arm_len_x + wall_thick, 5, arm_h]); 
            }
            
            // D. CAMERA MOUNT PLATE
            // Attached to Front Arm.
            translate([13.5, -15.5, 0]) rotate([90, 0, 0]) {
                difference() {
                    cube([28, 28, 4], center=true); 
                     // Camera Screw Holes
                     for(x=[-10.5, 10.5]) for(y=[-10, 10]) translate([x,y,0]) cylinder(d=1.8, h=10, center=true);
                }
            }

            // E. BACK ARM
            // Moved to Y=14 (Tightened from 15 based on user feedback).
            difference() {
                translate([0, 14, -arm_h/2]) cube([arm_len_x + wall_thick, 5, arm_h]); 
            }
        }
    }
}
