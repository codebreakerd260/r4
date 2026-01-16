// FILE: parts/sensors.scad
include <../config.scad>;

module Part_Ultrasonic_Centered() { color("silver") translate([-22, 0, 0]) { cube([44, 2, 20]); translate([10, -2, 10]) rotate([90, 0, 0]) cylinder(d=16, h=5); translate([34, -2, 10]) rotate([90, 0, 0]) cylinder(d=16, h=5); } }
module Part_IR() { color("purple") cube([10, 25, 1.5], center=true); }

module Part_IR_Mount_Extended(sens_y, sens_z) { 
    color("orange") difference() { 
        union() { translate([-13, -13, 0]) cube([26, 35, 25]); } 
        translate([0, sens_y, 13 + sens_z]) rotate([ir_angle, 0, 0]) translate([-50, -50, 0]) cube([100, 100, 50]); 
        translate([0, 15, 0]) cylinder(d=3.2, h=50, center=true); 
        translate([0, sens_y, 13 + sens_z]) rotate([ir_angle, 0, 0]) translate([0,0,-5]) cylinder(d=2.0, h=15, center=true); 
    } 
}
