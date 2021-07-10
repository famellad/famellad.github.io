z = [0, 0];
w = [-800, 0];
n = [0, 800];

iks_offset = 1996;
iks_canvas = 4000;

batch = false;

function calc_planar_distance(linear, depth) {
    return Math.sqrt(linear*linear - depth*depth);
}

function dist(c0, c1) {
    x0 = c0[0];
    y0 = c0[1];

    x1 = c1[0];
    y1 = c1[1];

    return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));
}

function avg(c0, c1) {
    return [(c0[0] + c1[0]) / 2, (c0[1] + c1[1]) / 2];
}

function w_avg(c0, c1) {
    return [(2*c0[0] + c1[0]) / 3, (2*c0[1] + c1[1]) / 3];
}

function find_closest_pair(pair0, pair1) {
    d = [];
    // p00 p10
    d[0] = dist(pair0[0], pair1[0]);
    // p01 p10
    d[1] = dist(pair0[1], pair1[0]);
    // p00 p11
    d[2] = dist(pair0[0], pair1[1]);
    // p01 p11
    d[3] = dist(pair0[1], pair1[1]);
    if (!batch)
        document.getElementById("directions").innerHTML += "<br>" + Math.round(d[0]) + " " + Math.round(d[1]) + " " + Math.round(d[2]) + " " + Math.round(d[3]);
    
    minIndex = 0;
    for (i = 0; i < 4; i++) {
        if (d[i] < d[minIndex])
            minIndex = i
    }

    if (!batch)
        document.getElementById("directions").innerHTML += " mI" + minIndex;
    
    if (minIndex == 0)
        return avg(pair0[0], pair1[0]);
    else if (minIndex == 1)
        return avg(pair0[1], pair1[0]);
    else if (minIndex == 2)
        return avg(pair0[0], pair1[1]);
    else
        return avg(pair0[1], pair1[1]);
}

function find_closest_WN(czp, wn_pair) {
    d0 = dist(czp, wn_pair[0]);
    d1 = dist(czp, wn_pair[1]);;
    if (!batch)
        document.getElementById("directions").innerHTML += "<br>" + Math.round(d0) + " " + Math.round(d1);

    if (d0 < d1) {
        if (!batch)
            document.getElementById("directions").innerHTML += " d0 (" + Math.round(wn_pair[0][0]) + ", " + Math.round(wn_pair[0][1]) + ")";
        return wn_pair[0];
    }
    else {
        if (!batch)
            document.getElementById("directions").innerHTML += " d1 (" + Math.round(wn_pair[1][0]) + ", " + Math.round(wn_pair[1][1]) + ")";
        return wn_pair[1];
    }
}

function stringify(f) {
    str = "";
    // decide East/West
    if (f[0] < 0) 
        str += (f[0] * -1) + "m West, ";
    else
        str += f[0] + "m East, ";
    // decide North/South
    if (f[1] < 0) 
        str += (f[1] * -1) + "m South";
    else
        str += f[1] + "m North";
    return str;
}

function intersect_circles(c0, r0, c1, r1) {
    // Calculates intersections between two circles
    // Assumes circles are touching!
    d = dist(c0, c1); // This has to be either 800 or sqrt(2)*800, ALWAYS
    a = (r0*r0 - r1*r1 + d*d) / (2*d);
    h = Math.sqrt(r0*r0 - a*a);
    if (!batch) {
        document.getElementById("directions").innerHTML += " d " + Math.round(d);
        document.getElementById("directions").innerHTML += " a " + Math.round(a);
        document.getElementById("directions").innerHTML += " h " + Math.round(h);
    }

    x0 = c0[0];
    y0 = c0[1];

    x1 = c1[0];
    y1 = c1[1];

    x2 = x0 + a * (x1 - x0) / d;
    y2 = y0 + a * (y1 - y0) / d;

    x30 = x2 + h * (y1 - y0) / d;
    y30 = y2 - h * (x1 - x0) / d;

    x31 = x2 - h * (y1 - y0) / d;
    y31 = y2 + h * (x1 - x0) / d;

    p30 = [x30, y30];
    p31 = [x31, y31];

    if (!batch) {
        document.getElementById("directions").innerHTML += " p30 (" + Math.round(p30[0]) + ", " + Math.round(p30[1]) + ")";
        document.getElementById("directions").innerHTML += " p31 (" + Math.round(p31[0]) + ", " + Math.round(p31[1]) + ")";
    }

    return [p30, p31];
}

function do_calc(zl, wl, nl, depth) {
    // Check if zl, wl and nl are on the surface
    zr = wr = nr = 0;
    
    if (depth == 0) {
        zr = zl;
        wr = wl;
        nr = nl;
    }
    else{
        zr = calc_planar_distance(zl, depth);
        wr = calc_planar_distance(wl, depth);
        nr = calc_planar_distance(nl, depth);
    }

    // Intersect Zero and West
    if (!batch)
        document.getElementById("directions").innerHTML += "<br> 0W";
    zwi = intersect_circles(z, zr, w, wr);

    // Intersect Zero and North
    if (!batch)
        document.getElementById("directions").innerHTML += "<br> 0N";
    zni = intersect_circles(z, zr, n, nr);

    // Intersect West and North
    if (!batch)
        document.getElementById("directions").innerHTML += "<br> WN";
    wni = intersect_circles(w, wr, n, nr);

    // Find closest ZW/ZN pair
    if (!batch)
        document.getElementById("directions").innerHTML += "<br><br>Finding ZW/ZN pair...";
    czp = find_closest_pair(zwi, zni);
    if (!batch)
        document.getElementById("directions").innerHTML += " (" + Math.round(czp[0]) + ", " + Math.round(czp[1]) + ")";

    // Find closest WN intersection
    if (!batch)
        document.getElementById("directions").innerHTML += "<br><br>Finding closest WN coord...";
    cwn = find_closest_WN(czp, wni);

    // Average 3 intersections
    if (!batch)
        document.getElementById("directions").innerHTML += "<br><br>Averaging...";
    final = w_avg(czp, cwn);
    final[0] = Math.round(final[0]);
    final[1] = Math.round(final[1]);
    final_coordinate_string = stringify(final);
    iks_x = final[0] + iks_offset;
    iks_y = iks_canvas - final[1] - iks_offset;
    iks = [iks_x, iks_y]

    if (!batch) {
        document.getElementById("directions").innerHTML += "<br>iks " + iks_x + " " + iks_y;
        document.getElementById("directions").innerHTML += "<br><br>Done!";
        document.getElementById("finalCoords").innerHTML = "Final Coordinates: " + final_coordinate_string;
    }
   
    // Find closest marker

    // Give euclidean directions
    return [final, iks]
}

function do_once() {
    batch = false;

    document.getElementById("directions").innerHTML = "Intersecting...";

    zr = document.getElementById("zero").value;
    wr = document.getElementById("west").value;
    nr = document.getElementById("north").value;
    depth = document.getElementById("depth").value;

    f = do_calc(zr, wr, nr, depth);

    add_marker(f[0], depth, "ffffff", "Triangulated", "custom");
}

function do_batch() {
    batch = true;

    final_snc = [];
    final_iks = [];
    depths = [];

    document.getElementById("directions").innerHTML = "Batch processing...";

    // Read field and separate csv lines
    lines = document.getElementById("batchList").value.split("\n");

    // Loop lines
    for (let i = 0; i < lines.length; i++) {
        console.log(i);
        scsv = lines[i].split(",");
        f = do_calc(scsv[0], scsv[1], scsv[2], scsv[3]);
        final_snc[i] = f[0];
        final_iks[i] = f[1];
        depths[i] = scsv[3];
        add_marker(f[0], scsv[3], "ffffff", i, "custom", true, false);
    }

    document.getElementById("directions").innerHTML += "<br><br> iks coords:";

    for (let i = 0; i < final_iks.length; i++)
        document.getElementById("directions").innerHTML += "<br>" + (i+1) + ": " + final_iks[i] + " (" + depths[i] + ")";

    document.getElementById("directions").innerHTML += "<br><br> SNC coords:";

    for (let i = 0; i < final_snc.length; i++)
        document.getElementById("directions").innerHTML += "<br>" + (i+1) + ": " + final_iks[i] + " (" + depths[i] + ")";
}