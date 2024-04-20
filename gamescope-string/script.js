let ex="gamescope";
let realtime="--rt";
let fullscreen="-f";
let filter="-F %s";
let sharpness="--sharpness %i";
let nested_height="-h %i";
let refresh="-r %i";
let u_refresh="-o %i";
let wayland="--expose-wayland";
let mouse_trap="--force-grab-cursor";
let mouse_sensitivity="-s %f";
let vrr="--adaptive-sync";
let steamlaunch="%command%"

function final_string() {
    return ex + realtime + fullscreen + finter + sharpness + nested_height + refresh + u_refresh + wayland + mouse_trap + mouse_sensitivity + vrr + "--" + steamlaunch
}
