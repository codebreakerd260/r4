// FILE: config.scad
// =================================================================
// GLOBAL STATE & CONFIGURATION
// =================================================================

$fn = 60;

// --- ANIMATION STATE (Global Hooks) ---
ir_angle   = 60;
pan_angle  = sin($t * 360) * 45;
tilt_angle = sin($t * 360) * 30;
wheel_rot  = $t * 360 * 2;

// --- DIMENSIONS (Theme) ---
chassis_w = 150;
chassis_l = 180;
chassis_t = 3.0;

// Heights
wheel_radius = 32.5;
chassis_z    = 45.0;
deck_1_z     = chassis_z + chassis_t;
standoff_h   = 45;
deck_2_z     = deck_1_z + standoff_h + chassis_t;
pi_lift      = 12;

half_w = chassis_w / 2;
half_l = chassis_l / 2;

// --- COMPONENT POSITIONS (Layout Grid) ---
pos_gimbal      = [0, 55, deck_2_z];
pos_pi          = [0, -45, deck_2_z];
pos_imu         = [0, 0, deck_2_z];
pos_sonar       = [0, -half_l - 2, deck_1_z];
pos_driver      = [0, 40, deck_1_z + 10];
pos_buck        = [0, 0, deck_1_z + 7];
pos_battery     = [0, -40, deck_1_z + 10];
pos_caster_xy   = [0, -half_l + 35];

// Standoffs
inset_standoff = 10;
pos_standoff_fl = [-half_w + inset_standoff,  half_l - inset_standoff, deck_1_z];
pos_standoff_fr = [ half_w - inset_standoff,  half_l - inset_standoff, deck_1_z];
pos_standoff_rl = [-half_w + inset_standoff, -half_l + inset_standoff, deck_1_z];
pos_standoff_rr = [ half_w - inset_standoff, -half_l + inset_standoff, deck_1_z];

// IR Sensors
ir_inset_x = 25; ir_inset_y = 25; ir_drop = 4;
pos_ir_fl = [-half_w + ir_inset_x,  half_l - ir_inset_y, chassis_z - ir_drop];
pos_ir_fr = [ half_w - ir_inset_x,  half_l - ir_inset_y, chassis_z - ir_drop];
pos_ir_rl = [-half_w + ir_inset_x, -half_l + ir_inset_y, chassis_z - ir_drop];
pos_ir_rr = [ half_w - ir_inset_x, -half_l + ir_inset_y, chassis_z - ir_drop];
