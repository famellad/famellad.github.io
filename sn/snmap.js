canvas_factor = 0.25;
marker_offset = -7;
csv_list = ["fam.csv","markers.csv","poi.csv"];

last_id = "";
last_name = "";

function snc2iks (snc) {
    iks_x = Number(snc[0]) + iks_offset;
    iks_y = iks_canvas - Number(snc[1]) - iks_offset;

    return [iks_x * canvas_factor, iks_y * canvas_factor];
}

function load_csv (item, index) {
    requestURI("csv/" + item).then(
        function (value) {
            // This is executed if the file is properly fetched
            // The contents of the file are held in value
            parse_csv(value);
        },
        function (reason) {
            console.error("Something wrong", reason);
        });
}

function parse_csv (str) {
    lines = str.split("\n");

    for (let i = 0; i < lines.length; i++) {
        if (lines[i][0] == "#")
            continue;
        
        cols = lines[i].split(",");

        if (lines[i][0] == ";") {
            add_layer(cols[1], cols[0].replace(";", ""));
            continue;
        }

        nm_x = cols[0];
        nm_y = cols[1];
        nm_depth = cols[2];
        nm_color = cols[3];
        nm_label = cols[4];

        add_marker([nm_x, nm_y], nm_depth, nm_color, nm_label);
    }
}

function add_layer (layer_id, layer_name) {
    tmp = "";
    lf = document.getElementById("layersForm");

    last_id = layer_id;
    last_name = layer_name;

    tmp += '<label class="container">';
    tmp += '<input type="checkbox" checked="checked" onchange="toggle_layer(\'%layerid\')">'.replace("%layerid", layer_id);
    tmp += '<span class="checkmark"></span>';
    tmp += '%layername</label>'.replace("%layername", layer_name);

    lf.innerHTML += tmp;
}

function add_marker (snc, depth, m_color, m_label, small=false, draw_label=true) {
    iks = snc2iks(snc);

    marker = "marker";
    offset = marker_offset;
    top_off = 0;
    label = "";

    if (small) {
        offset = marker_offset/1.8;
        top_off = 2;
        marker = "smallMarker";
    }

    c_top = iks[1] + (offset - 4 * canvas_factor + top_off) + "px";
    c_left = iks[0] + (offset + 4 * canvas_factor) + "px";
    if (draw_label)
        label = m_label + " (" + depth + "m)";
    color = "#" + m_color;
    

    tmp = "";

    md = document.getElementById("mapDiv");

    tmp += '<div class="landmark %class" style="margin-top: %top; margin-left: %left;">'.replace("%class", last_id).replace("%top", c_top).replace("%left", c_left);
    tmp += '<div class="%marker" style="background-color: %color;"></div>'.replace("%color", color).replace("%marker", marker);
    tmp += '<div class="markerText" style="color: %color;">%label</div>'.replace("%color", color).replace("%label", label);
    tmp += '</div>';

    md.innerHTML += tmp;
}

function toggle_layer (layer_id) {
    markers = document.getElementsByClassName(layer_id);

    hidden = false;

    if (markers[0].classList.contains("landmarkHidden"))
        hidden = true;

    for (let i = 0; i < markers.length; i++) {
        if (hidden)
            markers[i].classList.remove("landmarkHidden");
        else
            markers[i].classList.add("landmarkHidden");
    }
}

window.onload = function() {
    csv_list.forEach(load_csv);


}



/*
<div class="%class" style="margin-top: %top; margin-left: %left;">
<div class="marker" style="background-color: %color;"></div>
<div class="markerText" style="color: %color;">%label</div>
</div>
*/

/*
<label class="container">
<input type="checkbox" checked="checked" id="%markid">
<span class="checkmark"></span>
%markname</label>
*/