// FILE: assemblies/structure.scad
include <../config.scad>;
use <../parts/motion.scad>;
use <../parts/hardware.scad>;

module Layer_1_Structure() { 
    Layer_1_Drive_Unit(); 
    L1_Standoffs(); 
    L1_Top_Plate(); 
    translate([0,0,0]) L1_Motor_Bolts();
}

module Layer_1_Drive_Unit() { 
    L1_Bottom_Plate(); 
    // Shifted inwards by another 10mm (Global 70mm)
    // half_w = 75. half_w - 5 = 70.
    translate([-half_w + 5, 20, wheel_radius]) rotate([wheel_rot,0,0]) rotate([0, 90, 0]) Detailed_Wheel(); 
    translate([half_w - 5, 20, wheel_radius]) rotate([wheel_rot,0,0]) rotate([0, -90, 0]) Detailed_Wheel(); 
    translate([pos_caster_xy.x, pos_caster_xy.y, 0]) Detailed_Caster_Assembly();
}

module L1_Bottom_Plate() { 
    translate([-half_w, -half_l, 0]) { 
        color("cyan", 0.5) translate([0, 0, chassis_z]) difference() { 
            cube([chassis_w, chassis_l, chassis_t]); 
            // Widen cutouts by 10mm (was 25 width) -> Restoring to 25mm
            translate([-1, half_l + 20 - 35, -1]) cube([25, 70, 5]); 
            translate([chassis_w-24, half_l + 20 - 35, -1]) cube([25, 70, 5]); 
            translate([half_w, half_l, 0]) Drill_Map_Bottom(); 
        } 
        // Shift motors inwards by 10mm (Global 35mm from center)
        // Local X = Global X + 75. 
        // Global -35 + 75 = 40.
        
        // Left Motor & Mount (Mirrored X)
        translate([40, half_l + 20, wheel_radius]) {
            mirror([1, 0, 0]) Detailed_TT_Motor(); 
            // Mount needs to match the mirrored motor geometry (Holes at same Y).
            // Mirroring the mount flips its X features (Flange at -5 becomes +5/Inward).
            // Y features (-10, -27.5) stay the same.
            translate([14.5, 0, 0]) mirror([1, 0, 0]) TT_Motor_Mount();
        }
        
        // Right Motor & Mount
        translate([chassis_w - 40, half_l + 20, wheel_radius]) {
            Detailed_TT_Motor();
            // Mount at -X (Inner). Flange needs to point -X (Away from motor).
            // Default flange points -X. So Rotate 0.
            translate([-14.5, 0, 0]) rotate([0, 0, 0]) TT_Motor_Mount();
        }
    } 
}

module L1_Top_Plate() { 
    translate([-half_w, -half_l, 0]) { 
        color("cyan", 0.3) translate([0, 0, deck_1_z + standoff_h]) difference() { 
            cube([chassis_w, chassis_l, chassis_t]); 
            translate([-1, half_l + 20 - 35, -1]) cube([25, 70, 5]); 
            translate([chassis_w-24, half_l + 20 - 35, -1]) cube([25, 70, 5]); 
            translate([half_w, half_l, 0]) Drill_Map_Top(); 
        } 
    } 
}

module L1_Standoffs() { 
    for(pos = [pos_standoff_fl, pos_standoff_fr, pos_standoff_rl, pos_standoff_rr]) 
        translate(pos) color("gold") cylinder(h=standoff_h, d=6); 
}

module Drill_Map_Bottom() { 
    m3=3.2; 
    for(pos = [pos_standoff_fl, pos_standoff_fr, pos_standoff_rl, pos_standoff_rr]) translate([pos.x, pos.y, -10]) cylinder(d=m3, h=20); 
    translate([pos_driver.x, pos_driver.y, -10]) cylinder(d=m3, h=20); 
    translate([pos_buck.x, pos_buck.y, -10]) cylinder(d=m3, h=20); 
    translate([pos_battery.x, pos_battery.y - 15, -10]) cylinder(d=m3, h=20); 
    translate([pos_battery.x, pos_battery.y + 15, -10]) cylinder(d=m3, h=20); 
    translate([pos_sonar.x, pos_sonar.y + 10, -10]) { translate([-10, 0, 0]) cylinder(d=m3, h=20); translate([10, 0, 0]) cylinder(d=m3, h=20); }
    for(pos = [pos_ir_fl, pos_ir_fr]) translate([pos.x, pos.y + 15, -10]) cylinder(d=m3, h=20); 
    for(pos = [pos_ir_rl, pos_ir_rr]) translate([pos.x, pos.y - 15, -10]) cylinder(d=m3, h=20); 
    translate([pos_driver.x - 18, pos_driver.y - 18, -10]) cylinder(d=m3, h=20);
    translate([pos_driver.x + 18, pos_driver.y - 18, -10]) cylinder(d=m3, h=20);
    translate([pos_driver.x - 18, pos_driver.y + 18, -10]) cylinder(d=m3, h=20);
    translate([pos_driver.x + 18, pos_driver.y + 18, -10]) cylinder(d=m3, h=20);
    translate([pos_buck.x - 18, pos_buck.y, -10]) cylinder(d=m3, h=20);
    translate([pos_buck.x + 18, pos_buck.y, -10]) cylinder(d=m3, h=20);
    cx = pos_caster_xy.x; cy = pos_caster_xy.y;
    translate([cx + 12, cy + 12, -10]) cylinder(d=m3, h=20);
    translate([cx - 12, cy + 12, -10]) cylinder(d=m3, h=20);
    translate([cx + 12, cy - 12, -10]) cylinder(d=m3, h=20);
    translate([cx - 12, cy - 12, -10]) cylinder(d=m3, h=20);
    
    // Motor Mount Holes
    // Calculated Global (Centered) Coordinates:
    // Left Mount Holes (X = -12.5): Y = -6, Y = 14 (Global from Center? Wait).
    // Let's re-verify logic.
    // L1_Bottom_Plate origin is Center?
    // Drill_Map_Bottom is TRANSLATED to [half_w, half_l].
    // So Drill_Map_Bottom LOCAL Origin corresponds to Chassis CENTER.
    // My previous calculation:
    // Left Mount: [-20.5, 20] relative to Center.
    // Mirror([1,0,0]) -> Holes at +8 (Local X).
    // Global Hole X = -20.5 + 8 = -12.5.
    // Global Hole Y = 20 - 22 = -2. (Wait, new hole at -22).
    // Global Hole Y2 = 20 + 0 = 20. (new hole at 0).
    // So Left Holes: [-12.5, -2] and [-12.5, 20].
    
    // Right Mount: [20.5, 20] relative to Center.
    // Local Holes [-8].
    // Global Hole X = 20.5 - 8 = 12.5.
    // Global Hole Y = 20 - 22 = -2.
    // Right Mount:
    // Global Hole X = 87.5. Drill Map X = 12.5. Correct.
    
    // Y Coordinates (Revised for Axle Clearance):
    // Axle Global Y = 110. (Drill Map Local Y = 20).
    // Mount Top Hole Local (relative to axle) = -6.
    // Global Hole Y = 110 - 6 = 104.
    // Drill Map Local Y = 104 - 90 = 14.
    
    // Mount Bottom Hole Local (relative to axle) = -26.
    // Global Hole Y = 110 - 26 = 84.
    // Drill Map Local Y = 84 - 90 = -6.
    
    translate([-12.5, -6, -10]) cylinder(d=m3, h=20);
    translate([-12.5, 14, -10]) cylinder(d=m3, h=20);
    translate([12.5, -6, -10]) cylinder(d=m3, h=20);
    translate([12.5, 14, -10]) cylinder(d=m3, h=20);
}

module L1_Motor_Bolts() {
    // Add Bolts to show connection
    translate([-12.5, -6, chassis_z+3]) Part_Bolt_M3();
    translate([-12.5, 14, chassis_z+3]) Part_Bolt_M3();
    translate([12.5, -6, chassis_z+3]) Part_Bolt_M3();
    translate([12.5, 14, chassis_z+3]) Part_Bolt_M3();
}

module Drill_Map_Top() { 
    m3=3.2; m25=2.7; 
    for(pos = [pos_standoff_fl, pos_standoff_fr, pos_standoff_rl, pos_standoff_rr]) translate([pos.x, pos.y, -20]) cylinder(d=m3, h=40); 
    translate([pos_gimbal.x, pos_gimbal.y, -20]) rotate([0,0,90]) translate([-6, -6.25, 0]) { 
        translate([0, 0, 0]) cylinder(d=m3, h=40);
        translate([23.5, 0, 0]) cylinder(d=m3, h=40);
        translate([0, 13, 0]) cylinder(d=m3, h=40);
        translate([23.5, 13, 0]) cylinder(d=m3, h=40);
        translate([11.75, 6.5, 0]) cylinder(d=10, h=40);
    } 
    translate([pos_pi.x, pos_pi.y, -20]) { for(kx=[-29, 29]) for(ky=[-24.5, 24.5]) translate([kx,ky,0]) cylinder(d=m25, h=40); } 
    translate([pos_imu.x, pos_imu.y, -10]) {
        translate([-7.5, -5, 0]) cylinder(d=m3, h=20);
        translate([7.5, -5, 0]) cylinder(d=m3, h=20);
        translate([-7.5, 5, 0]) cylinder(d=m3, h=20);
        translate([7.5, 5, 0]) cylinder(d=m3, h=20);
    }
}
