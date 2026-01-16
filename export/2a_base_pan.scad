include <../config.scad>;
use <../parts/gimbal_parts.scad>;
use <../parts/hardware.scad>;

// 2a. (Base_Mount, pan servo)
// From assemblies/gimbal_layer.scad
translate(pos_gimbal) rotate([0, 0, 90]) translate([-6, -6.25, 0]) { 
    Base_Mount();
    translate([0, 0, 3.0]) color("dodgerblue", 0.3) SG90_Body();
}
