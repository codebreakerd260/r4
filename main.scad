// FILE: main.scad
// =================================================================
// MASTER ROBOT TWIN: ROS & AI EDITION (v11.0 - REFACTORED)
// =================================================================

// 1. GLOBAL CONTEXT
include <config.scad>;

// 2. IMPORT COMPONENTS (use = import)
use <assemblies/structure.scad>;
use <assemblies/sensors_layer.scad>;
use <assemblies/gimbal_layer.scad>;
use <assemblies/electronics_layer.scad>;

// 3. ROUTER (View Controller)
// 0 = Master, 100 = Structure, 200 = Sensors, etc.
view_index = 00; 
explode_factor = 0.0; 

// 4. RENDER
if (view_index == 0) Master_View();
else if (view_index == 100) Layer_1_Structure();
else if (view_index == 200) Layer_2_Sensors();
else if (view_index == 300) Layer_3_Gimbal();
else if (view_index == 400) Layer_4_Electronics();

// 5. MASTER COMPOSITION
module Master_View() {
    z_gap = 60 * explode_factor;
    
    translate([0,0,0])         Layer_1_Structure(); 
    translate([0,0,z_gap*0.5]) Layer_4_Electronics_Bottom(); 
    translate([0,0,z_gap*0.5]) Layer_2_Sensors_Bottom();
    
    // Note: We need to access sub-modules of assemblies for the exploded view specific animation
    // Since 'use' hides sub-modules, we just render the main layers positioned correctly if exploded.
    // Ideally, the Assembly files should expose "Top" and "Bottom" public modules if you need split explosions.
    // For now, we group them slightly differently than the original monolithic file to respect the component boundaries.
    
    translate([0,0,z_gap*2.5]) Layer_4_Electronics_Top(); 
    translate([0,0,z_gap*2.5]) Layer_2_Sensors_Top();    
    translate([0,0,z_gap*3.5]) Layer_3_Gimbal();
}
