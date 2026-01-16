// FILE: assemblies/electronics_layer.scad
include <../config.scad>;
use <../parts/electronics.scad>;

module Layer_4_Electronics() { 
    Layer_4_Electronics_Bottom(); 
    Layer_4_Electronics_Top(); 
}

module Layer_4_Electronics_Bottom() { 
    translate(pos_driver) Detailed_L298N(); 
    translate(pos_buck) Detailed_Buck(); 
    translate(pos_battery) rotate([0,0,90]) Detailed_Battery(); 
}

module Layer_4_Electronics_Top() { 
    translate(pos_pi) Part_Pi4(); 
    translate(pos_imu) Detailed_IMU_Assembly(); 
}
