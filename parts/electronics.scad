// FILE: parts/electronics.scad
include <../config.scad>; // Needed for pi_lift

module Detailed_IMU_Assembly() {
    color("#222") {
        translate([7.5, 5, 2.5]) cylinder(d=3, h=5, center=true);
        translate([-7.5, 5, 2.5]) cylinder(d=3, h=5, center=true);
        translate([7.5, -5, 2.5]) cylinder(d=3, h=5, center=true);
        translate([-7.5, -5, 2.5]) cylinder(d=3, h=5, center=true);
    }
    translate([0, 0, 5]) { color("blue") cube([20, 15, 2], center=true); color("black") translate([0,0,1.5]) cube([4,4,1], center=true); }
}

module Detailed_L298N() {
    color("red") cube([43, 43, 2], center=true);
    color("black") {
        translate([18, 18, -6]) cylinder(d=6, h=10, center=true);
        translate([-18, 18, -6]) cylinder(d=6, h=10, center=true);
        translate([18, -18, -6]) cylinder(d=6, h=10, center=true);
        translate([-18, -18, -6]) cylinder(d=6, h=10, center=true);
    }
    color("#111") translate([0,0,12]) difference() { cube([25, 20, 22], center=true); for(x=[-10:4:10]) translate([x, 5, 0]) cube([2, 12, 24], center=true); }
    color("black") translate([15, 15, 8]) cylinder(d=8, h=14);
    color("dodgerblue") { translate([0, -18, 6]) cube([20, 8, 10], center=true); translate([-18, 0, 6]) cube([8, 30, 10], center=true); translate([18, 0, 6]) cube([8, 30, 10], center=true); }
}

module Detailed_Buck() {
    color("dodgerblue") cube([43, 21, 2], center=true);
    color("black") { translate([18, 0, -6]) cylinder(d=6, h=10, center=true); translate([-18, 0, -6]) cylinder(d=6, h=10, center=true); }
    color("#B87333") translate([-8, 0, 6]) cylinder(d=12, h=10);
    color("black") translate([12, 0, 6]) cylinder(d=8, h=10);
    color("blue") translate([15, 6, 5]) cube([5, 5, 8], center=true);
    color("gold") translate([15, 6, 9]) cylinder(d=2, h=1);
}

module Detailed_Battery() {
    hull() {
        color("#222") translate([-18, -35, 0]) cylinder(r=2, h=20, center=true); color("#222") translate([18, -35, 0]) cylinder(r=2, h=20, center=true);
        color("#222") translate([-18, 35, 0]) cylinder(r=2, h=20, center=true); color("#222") translate([18, 35, 0]) cylinder(r=2, h=20, center=true);
    }
    color("red") translate([0, 35, 5]) rotate([90,0,0]) cylinder(d=3, h=10); color("black") translate([5, 35, 5]) rotate([90,0,0]) cylinder(d=3, h=10);
}

module Part_Pi4() { 
    color("darkgreen") difference() { translate([0,0,pi_lift-1.5]) cube([85, 56, 1.5], center=true); for(mx=[-29, 29]) for(my=[-24.5, 24.5]) translate([mx,my,pi_lift-2.5]) cylinder(d=2.7, h=5); } 
    for(mx=[-29, 29]) for(my=[-24.5, 24.5]) translate([mx,my,0]) color("gold") cylinder(d=3, h=pi_lift); 
    translate([0,0,pi_lift]) { color("silver") translate([85/2 - 9, 0, 8]) cube([18, 50, 15], center=true); color("black") translate([0, 56/2 - 4, 5]) cube([50, 5, 8], center=true); color("black") translate([-10, 0, 1]) cube([15, 15, 2], center=true); } 
}
