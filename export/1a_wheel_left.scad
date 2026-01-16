include <../config.scad>;
use <../parts/motion.scad>;

// 1a. Wheel Left
// From assembly/structure.scad: translate([-half_w + 5, 20, wheel_radius])
translate([-half_w + 5, 20, wheel_radius]) rotate([wheel_rot,0,0]) rotate([0, 90, 0]) Detailed_Wheel(); 
