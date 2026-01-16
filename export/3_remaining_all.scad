include <../config.scad>;
use <../parts/motion.scad>;
use <../assemblies/structure.scad>;
use <../assemblies/sensors_layer.scad>;
use <../assemblies/electronics_layer.scad>;

// 3. remaining all
// Includes Layer 1 (Structure) minus Wheels
// Includes Layer 2 (Sensors)
// Includes Layer 4 (Electronics)
// Excludes Layer 3 (Gimbal)

// RECONSTRUCTED Layer_1_Structure WITHOUT WHEELS
module Layer_1_Structure_NoWheels() {
    // Replaces Layer_1_Drive_Unit:
    L1_Bottom_Plate(); 
    // EXCLUDED: Left Wheel
    // EXCLUDED: Right Wheel
    translate([pos_caster_xy.x, pos_caster_xy.y, 0]) Detailed_Caster_Assembly();
    
    L1_Standoffs(); 
    L1_Top_Plate(); 
    translate([0,0,0]) L1_Motor_Bolts();
}

// COMPOSITION
translate([0,0,0])         Layer_1_Structure_NoWheels(); 
translate([0,0,0])         Layer_4_Electronics_Bottom(); 
translate([0,0,0])         Layer_2_Sensors_Bottom();
translate([0,0,0])         Layer_4_Electronics_Top(); 
translate([0,0,0])         Layer_2_Sensors_Top();
// EXCLUDED: Layer_3_Gimbal();
