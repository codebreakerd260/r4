include <../config.scad>;
use <../parts/gimbal_parts.scad>;
use <../parts/hardware.scad>;

// 2b. (U_Bracket)
// From assemblies/gimbal_layer.scad
translate(pos_gimbal) rotate([0, 0, 90]) translate([-6, -6.25, 0]) { 
    translate([6.0, 6.25, 31.6]) rotate([0, 0, pan_angle - 90]) {
        U_Bracket_Fixed(); 
    }
}
