// FILE: parts/motion.scad
module Detailed_Wheel() {
    difference() {
        union() { color("#222222") cylinder(d=65, h=26, center=true); color("gold") cylinder(d=52, h=26.5, center=true); }
        for(r=[0:60:360]) rotate([0,0,r]) translate([15,0,0]) cylinder(d=8, h=30, center=true);
        cube([5.5, 3.8, 30], center=true);
    }
    color("#111111") for(r=[0:15:360]) rotate([0,0,r]) translate([31, 0, 0]) cube([4, 2, 26], center=true);
}

module Detailed_TT_Motor() {
    color("white") rotate([0,90,0]) cylinder(d=5.4, h=65, center=true);
    color("#FFC107") difference() {
        translate([0, -10, 0]) cube([22.5, 37, 19], center=true); 
        translate([0, -10 - 9, 0]) rotate([0,90,0]) cylinder(d=3.2, h=30, center=true); 
        translate([0, -10 + 8, 0]) rotate([0,90,0]) cylinder(d=3.2, h=30, center=true); 
    }
    color("silver") translate([0, -43, 0]) rotate([90,0,0]) cylinder(d=20, h=28, center=true);
    color("white") translate([0, -58, 0]) cube([5, 3, 8], center=true);
}

module Detailed_Caster_Assembly() {
    standoff_len = 15; plate_z = 30; 
    color("gold") {
        translate([12, 12, plate_z + standoff_len/2]) cylinder(d=4, h=standoff_len, center=true);
        translate([-12, 12, plate_z + standoff_len/2]) cylinder(d=4, h=standoff_len, center=true);
        translate([12, -12, plate_z + standoff_len/2]) cylinder(d=4, h=standoff_len, center=true);
        translate([-12, -12, plate_z + standoff_len/2]) cylinder(d=4, h=standoff_len, center=true);
    }
    color("silver") translate([0, 0, plate_z - 1]) cube([32, 32, 2], center=true);
    color("#888888") translate([0, 0, plate_z - 2 - 8]) cylinder(d1=28, d2=24, h=16, center=true);
    color("white") translate([0, 0, 12.5]) sphere(d=25);
}

module TT_Motor_Mount() {
    // "Fang" style mount
    // Fixed: Shifted down FURTHER to avoid Axle collision (Axle Radius ~3mm).
    // Previous Top at Y=-2 hit the shaft.
    // New Top at Y = -4.
    // Bottom at -30. Length = 26. Center = -17.
    
    color("orange") {
        difference() {
            union() {
               // Vertical Plate
               // Temporarily revert sizing logic to cover hole:
               translate([0, -14, 0]) cube([5.5, 32, 25], center=true);
               
               // Top Flange (Connecting to Chassis)
               // Flange Height: Chassis is at Z=? 
               // Wheel Radius = 32.5. Chassis Bottom at 32.5 + ... wait.
               // L1_Bottom_Plate is at Z=wheel_radius + ... no.
               // L1_Bottom_Plate: "translate([0, 0, chassis_z])". chassis_z=45.
               // Wheel Z = 32.5.
               // Delta Z = 45 - 32.5 = 12.5.
               // So Flange Center at Z=12.5 relative to axle is correct.
               translate([-5, -14, 12.5]) cube([15, 32, 4], center=true);
            }
            
            // Motor Screw Holes (Y = -2, -19)
            // But Top is at -4. Front Hole is at -2.
            // WARNING: The mount DOES NOT cover the front hole anymore if Top is -4.
            // The front hole (near axle) is UNUSABLE if we simply cut the block.
            // But standard TT mounts DO use both holes.
            // How?
            // The mount must go *around* the axle or be thin enough?
            // Or the hole is further down?
            // Checked Detailed_TT_Motor: translate([0, -10+8, 0]) -> Y = -2.
            // If hole is at -2, and axle is at 0... gap is 2mm.
            // 3mm screw head radius = 1.6mm. 2 - 1.6 = 0.4. It's tight.
            // If the Mount Plate is 5mm thick, it sits next to the motor.
            // The Axle sticks out.
            // We need a CUTOUT for the axle if we want to reach the front hole?
            // OR: We only use the REAR hole?
            // "one is correct but the another needs to mirror" implied alignment was fine visually before?
            // Collision is likely the TOP EDGE hitting the spinning shaft?
            
            // Re-strategy: Extend the mount UP to cover the hole, but add a cylindrical CUTOUT for the axle?
            // Axle is at (0,0,0).
            // Let's make the block go up to Y=0 or higher, but subtract the axle shaft area.
            
            // Restore Length to cover -2. (Say Top at +2).
            // Length 32 (Top +2, Bottom -30). Center -14.
            // Subtract Axle Cylinder.
            
            // Let's try: Block Center -14, Length 32.
            // Cutout at 0,0,0.
            
            // Motor Screw Holes
            translate([0, -2, 0]) rotate([0, 90, 0]) cylinder(d=3.4, h=20, center=true);
            translate([0, -19, 0]) rotate([0, 90, 0]) cylinder(d=3.4, h=20, center=true);
            
            // Chassis Mounting Holes (in Top Flange)
            // Matched to Structure Assembly (Drill Map Revised):
            // Top Hole: 6mm below Axle (Y=-6).
            // Bottom Hole: 26mm below Axle (Y=-26).
            translate([-8, -26, 12.5]) cylinder(d=3.4, h=10, center=true);
            translate([-8, -6, 12.5]) cylinder(d=3.4, h=10, center=true);
            
            // AXLE CLEARANCE CUTOUT
            // Clearance for 5.4mm axle + wiggle room => 7mm?
            // Axle goes through Y=0.
            translate([0, 0, 0]) rotate([0, 90, 0]) cylinder(d=8, h=20, center=true);
        }
    }
}
