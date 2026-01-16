// FILE: assemblies/sensors_layer.scad
include <../config.scad>;
use <../parts/sensors.scad>;
use <../parts/hardware.scad>;

module Layer_2_Sensors() { 
    Layer_2_Sensors_Bottom(); 
    Layer_2_Sensors_Top(); 
}

module Layer_2_Sensors_Bottom() { 
    Single_IR_Unit(pos_ir_fl, 0, true);    
    Single_IR_Unit(pos_ir_fr, 0, false);   
    Single_IR_Unit(pos_ir_rl, 180, true); 
    Single_IR_Unit(pos_ir_rr, 180, false); 
    translate(pos_sonar) Part_Ultrasonic_Centered(); 
}

module Layer_2_Sensors_Top() { }

module Single_IR_Unit(pos_vec, rotation_deg, do_mirror) {
    y_shift = 15; 
    dx = -y_shift * sin(rotation_deg);
    dy =  y_shift * cos(rotation_deg);

    translate([pos_vec.x + dx, pos_vec.y + dy, deck_1_z]) Part_Bolt_M3();
    translate([pos_vec.x + dx, pos_vec.y + dy, pos_vec.z]) color("silver") cylinder(d=5, h=ir_drop); 
    
    translate(pos_vec) rotate([0, 180, 0]) rotate([0, 0, rotation_deg]) { 
        if (do_mirror) mirror([1,0,0]) IR_Assembly(); 
        else IR_Assembly(); 
    }
}

module IR_Assembly() { 
    y_adj = 5 + 15 - (6 * sin(ir_angle)); 
    z_adj = 6 * cos(ir_angle); 
    Part_IR_Mount_Extended(y_adj, z_adj); 
    translate([0, y_adj, 13 + z_adj]) rotate([ir_angle, 0, 0]) { 
        Part_IR(); 
        translate([0, 0, 3]) color("silver") cylinder(d=1.5, h=2, center=true); 
    } 
}
