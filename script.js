const height = 8,
    width = 8;
var cboard = new Array();
var buildingids = new Array();
var buildingidcounter = -1;
var state = 0,
    cid;
// 0: idle, 1: placing

var stats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// in order: money, happiness, recreation level, adult cnt, children cnt, employment cnt, education cnt, healthcare qual, trade rate

const rotate = (matrix) => {
    //taken from stackoverflow, clockwise
    return matrix[0].map((val, index) =>
        matrix.map((row) => row[index]).reverse()
    );
};
const piecestofunction = [
    "airport",
    "school",
    "hospital",
    "police",
    "housing",
    "military",
    "recreation",
    "industry",
];
var piecestocolor = [
    "gray",
    "yellow",
    "white",
    "cyan",
    "brown",
    "darkgreen",
    "lime",
    "beige",
];
var piecestoprice = [
    1500000000,
    7393000,
    50000000,
    634263,
    3000000,
    200000000,
    200000,
    10000000, // yes, these are real prices (tweak if game becomes too unrealistic i got them from bad sources lol)
];
var tcnt = [0, 0, 0, 0, 0, 0, 0, 0]; // count of
var pieces = [
    [[1, 1, 1, 1, 1]],
    [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
    ],
    [
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0],
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
    ],
    [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
    ],
    [
        [0, 1, 0, 0],
        [1, 1, 1, 1],
        [1, 0, 0, 0],
    ],
    [
        [1, 1, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
];

let crott = [];
let px = 0,
    py = 0,
    valid = 0;

let secondcnt = 0,
    crq = 50;
let cspeed = 0;

let oneit = () => {
    secondcnt += cspeed;
    if (secondcnt >= crq) {
        oneday();
        crq += 50;
    }
    stats[2] = tcnt[0] * 50 + tcnt[6] * 10;
    stats[5] =
        tcnt[0] * 80 +
        tcnt[1] * 40 +
        tcnt[2] * 40 +
        tcnt[3] * 60 +
        tcnt[4] * 20 +
        tcnt[5] * 40 +
        tcnt[6] * 10 +
        tcnt[7] * 60;
    if (stats[5] > stats[3]) {
        stats[5] = stats[3];
    }
    stats[6] = tcnt[1] * 60;
    if (stats[6] > stats[4]) {
        stats[6] = stats[4];
    }
    stats[9] = tcnt[4] * 150;
    if (stats[9] > stats[4] + stats[3]) {
        stats[9] = stats[4] + stats[3];
    }
    document.getElementById("0").innerHTML = stats[0];
    document.getElementById("1").innerHTML = stats[1];
    document.getElementById("2").innerHTML = stats[2];
    document.getElementById("3").innerHTML = stats[3];
    document.getElementById("4").innerHTML = stats[4];
    document.getElementById("5").innerHTML = stats[5];
    document.getElementById("6").innerHTML = stats[6];
    document.getElementById("7").innerHTML = stats[7];
    document.getElementById("8").innerHTML = stats[8];
    document.getElementById("9").innerHTML = stats[9];
};
let oneday = () => {
    console.log("day: " + (crq / 50).toString());
};
let udisp = (cx, cy, id) => {
    for (let i = 0; i < pieces[id].length; i++) {
        for (let j = 0; j < pieces[id][0].length; j++) {
            if (!pieces[id][i][j]) continue;
            if (cboard[cx + i][cy + j] != -1) {
                document.getElementById(
                    "box-" + (cx + i).toString() + "-" + (cy + j).toString()
                ).style.backgroundColor = piecestocolor[cboard[cx + i][cy + j]];
            } else {
                document.getElementById(
                    "box-" + (cx + i).toString() + "-" + (cy + j).toString()
                ).style.backgroundColor = "transparent";
            }
        }
    }
};

let disp = (cx, cy, id) => {
    for (let i = 0; i < pieces[id].length; i++) {
        for (let j = 0; j < pieces[id][0].length; j++) {
            if (!pieces[id][i][j]) continue;
            if (valid) {
                document.getElementById(
                    "box-" + (cx + i).toString() + "-" + (cy + j).toString()
                ).style.backgroundColor = "green";
            } else {
                document.getElementById(
                    "box-" + (cx + i).toString() + "-" + (cy + j).toString()
                ).style.backgroundColor = "red";
            }
        }
    }
};

let mcn = () => {
    alert(tcnt);
};

let pplace = (cx, cy, id) => {
    cid = id;
    state = 1;
    (px = cx), (py = cy);
    let can = 1;
    for (let i = 0; i < pieces[id].length; i++) {
        for (let j = 0; j < pieces[id][0].length; j++) {
            if (cboard[px + i][py + j] != -1 && pieces[id][i][j]) {
                can = 0;
                break;
            }
        }
    }
    valid = can;
    disp(px, py, id);
};

let prot = (acl) => {
    pieces[cid] = rotate(pieces[cid]);
    crott[cid]++;
    if (acl) {
        pieces[cid] = rotate(rotate(pieces[cid]));
        crott[cid] += 2;
    }
    crott[cid] %= 4;
    while (px + pieces[cid].length > height) px--;
    while (py + pieces[cid][0].length > width) py--;
    pplace(px, py, cid);
};

let cplace = () => {
    udisp(px, py, cid);
    if (stats[0] < piecestoprice[cid]) {
        alert("Not enough money! ");
        return;
    }
    if (valid) {
        stats[0] -= piecestoprice[cid];
        tcnt[cid]++;
        buildingidcounter += 1;
        for (let i = 0; i < pieces[cid].length; i++) {
            for (let j = 0; j < pieces[cid][0].length; j++) {
                if (pieces[cid][i][j]) {
                    cboard[px + i][py + j] = cid;
                    buildingids[px + i][py + j] = buildingidcounter;
                    document.getElementById(
                        "box-" + (px + i).toString() + "-" + (py + j).toString()
                    ).innerHTML = cid + " " + buildingidcounter;
                    document.getElementById(
                        "box-" + (px + i).toString() + "-" + (py + j).toString()
                    ).style.backgroundColor = piecestocolor[cid];
                    document.getElementById(
                        "box-" + (px + i).toString() + "-" + (py + j).toString()
                    ).innerHTML = "";
                    var img = document.createElement("img");
                    img.src = `${piecestofunction[cid]}.png`;
                    document
                        .getElementById(
                            "box-" +
                                (px + i).toString() +
                                "-" +
                                (py + j).toString()
                        )
                        .appendChild(img);
                }
            }
        }
        state = 0;
    } else {
        alert("Invalid placement! ");
    }
};

const init = () => {
    // in order: money, happiness, recreation level, adult cnt, children cnt, employment cnt, education cnt, healthcare qual, trade rate
    stats = [10000000000, 50, 0, 300, 100, 0, 0, 0, 0, 400];
    var board = document.getElementById("board");
    for (var i = 0; i < height; i++) {
        var crow = [];
        var row = document.createElement("tr");
        row.id = "row-" + i.toString();
        row.classList.add("row");
        row.classList.add("board");
        for (var j = 0; j < width; j++) {
            var box = document.createElement("td");
            box.id = "box-" + i.toString() + "-" + j.toString();
            box.classList.add("box");
            box.classList.add("board");
            row.appendChild(box);
            var img = document.createElement("img");
            // add img of src emptyimg.png in img
            img.src = "emptyimg.png";
            box.appendChild(img);
            crow.push(-1);
            box.ondblclick = (function (x, y) {
                return function () {
                    // Assuming buildingids[x][y] holds the id of the piece
                    let idToDelete = buildingids[x][y];
                    if (idToDelete >= 0) {
                        // Ensure it's a valid piece id
                        tcnt[cboard[x][y]]--;
                        stats[0] += piecestoprice[cboard[x][y]];
                        dfsDelete(x, y, idToDelete);
                    }
                };
            })(i, j);
        }
        board.appendChild(row);
        cboard.push(crow);
        buildingids.push([...crow]);
    }
    col = document.getElementById("pieces");
    for (let k = 0; k < pieces.length; k++) {
        crott.push(0);
        nx = document.createElement("tr");
        nd = document.createElement("td");
        nx.classList.add("pieces");
        nd.classList.add("pieces");
        nd.classList.add("inline-block");
        nd.onclick = () => {
            if (state == 1) {
                while (crott[cid] != 0) {
                    udisp(px, py, cid);
                    prot(0);
                }
                udisp(px, py, cid);
            }
            pplace(0, 0, k);
        };
        np = document.createElement("table");
        np.classList.add("cpiece");
        for (let i = 0; i < pieces[k].length; i++) {
            nr = document.createElement("tr");
            nr.classList.add("cpiece");
            for (let j = 0; j < pieces[k][0].length; j++) {
                nb = document.createElement("td");
                nb.classList.add("cpiece");
                if (pieces[k][i][j] == 1) {
                    nb.style.border = "2px solid #2f2f2f";
                }
                nr.appendChild(nb);
            }

            np.appendChild(nr);
        }
        let functionDisplay = document.createElement("div");
        functionDisplay.textContent = piecestofunction[k];
        nd.appendChild(functionDisplay);
        nd.appendChild(np);
        nx.appendChild(nd);
        col.appendChild(nx);
    }
    setInterval(oneit, 100);
};

document.onkeydown = (event) => {
    keynum = event.keyCode;
    if (state == 0) return;
    if (state == 1) {
        if (keynum == 87 && px != 0) {
            udisp(px, py, cid);
            px--;
            pplace(px, py, cid);
        }
        if (keynum == 83 && px + pieces[cid].length != height) {
            udisp(px, py, cid);
            px++;
            pplace(px, py, cid);
        }
        if (keynum == 65 && py != 0) {
            udisp(px, py, cid);
            py--;
            pplace(px, py, cid);
        }
        if (keynum == 68 && py + pieces[cid][0].length != width) {
            udisp(px, py, cid);
            py++;
            pplace(px, py, cid);
        }
        if (keynum == 69) {
            // nice
            udisp(px, py, cid);
            prot(0);
        }
        if (keynum == 81) {
            udisp(px, py, cid);
            prot(1);
        }
        if (keynum == 32) cplace();
        if (keynum == 27) {
            udisp(px, py, cid);
            state = 0;
        }
    }
};

function dfsDelete(x, y, idToDelete) {
    // Check boundaries and if the current cell matches the id to delete
    if (
        x < 0 ||
        x >= height ||
        y < 0 ||
        y >= width ||
        buildingids[x][y] !== idToDelete
    ) {
        return; // Outside grid or not matching id, stop recursion
    }

    // Delete or mark the cell by setting it to -1
    cboard[x][y] = -1;
    buildingids[x][y] = -1;

    // Update the cell visually (optional, based on your game's needs)
    document.getElementById("box-" + x + "-" + y).style.backgroundColor =
        "transparent"; // or any indication of deletion
    document.getElementById("box-" + x + "-" + y).innerHTML = ""; // Clear the content if needed
    var img = document.createElement("img");
    img.src = "emptyimg.png";
    document.getElementById("box-" + x + "-" + y).appendChild(img);
    // Recursively apply DFS to neighboring cells
    dfsDelete(x + 1, y, idToDelete); // Down
    dfsDelete(x - 1, y, idToDelete); // Up
    dfsDelete(x, y + 1, idToDelete); // Right
    dfsDelete(x, y - 1, idToDelete); // Left
}

setInterval(onTimerTick, 1000); // 33 milliseconds = ~ 30 frames per sec


var time=60;
function onTimerTick() {
    time--;
    if(time<=-1){
        window.location.href="win.html";
    }
    if(money<=0){
        window.location.href="lose.html";
    }
    document.getElementById("timer").innerHTML = time;
    console.log("tick")
}

init();
