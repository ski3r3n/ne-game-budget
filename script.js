const height = 8,
    width = 8;
var cboard = new Array();
var buildingids = new Array();
var buildingidcounter = -1;
var state = 0,
    cid;
// 0: idle, 1: placing

var stats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var deathRate=0;
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
    150000,
    73930,
    500000,
    6342,
    30000,
    20000,
    2000,
    100000, // yes, these are real prices (tweak if game becomes too unrealistic i got them from bad sources lol)
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

// let oneit = () => {
//     secondcnt += cspeed;
//     if (secondcnt >= crq) {
//         oneday();
//         crq += 50;
//     }
//     stats[2] = tcnt[0] * 50 + tcnt[6] * 10;
//     stats[5] =
//         tcnt[0] * 80 +
//         tcnt[1] * 40 +
//         tcnt[2] * 40 +
//         tcnt[3] * 60 +
//         tcnt[4] * 20 +
//         tcnt[5] * 40 +
//         tcnt[6] * 10 +
//         tcnt[7] * 60;
//     if (stats[5] > stats[3]) {
//         stats[5] = stats[3];
//     }
//     stats[6] = tcnt[1] * 60;
//     if (stats[6] > stats[4]) {
//         stats[6] = stats[4];
//     }
//     stats[9] = tcnt[4] * 150;
//     if (stats[9] > stats[4] + stats[3]) {
//         stats[9] = stats[4] + stats[3];
//     }
//     document.getElementById("0").innerHTML = stats[0];
//     document.getElementById("1").innerHTML = stats[1];
//     document.getElementById("2").innerHTML = stats[2];
//     document.getElementById("3").innerHTML = stats[3];
//     document.getElementById("4").innerHTML = stats[4];
//     document.getElementById("5").innerHTML = stats[5];
//     document.getElementById("6").innerHTML = stats[6];
//     document.getElementById("7").innerHTML = stats[7];
//     document.getElementById("8").innerHTML = stats[8];
//     document.getElementById("9").innerHTML = stats[9];
// };
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
        moneyChange(piecestoprice[cid],-1);
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
    // in order: money[0], happiness[1], adult cnt[2], children cnt[3], employment cnt[4], education cnt[5], healthcare qual[6], trade rate[7], housing[8]
    stats = [10000000, 100, 4930000, 1000000, 0, 50, 50, 0, 0];
    var board = document.getElementById("board");
    for (var i = 0; i < height; i++) {
        var crow = [];
        var row = document.createElement("div");
        row.id = "row-" + i.toString();
        row.classList.add("row");
        row.classList.add("board");
        for (var j = 0; j < width; j++) {
            var box = document.createElement("div");
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
                    if (state == 1) {
                        if (px != 0) {
                            udisp(px, py, cid);
                            px--;
                            pplace(px, py, cid);
                            udisp(px, py, cid);
                            px++;
                            pplace(px, py, cid);
                        } else {
                            udisp(px, py, cid);
                            px++;
                            pplace(px, py, cid);
                            udisp(px, py, cid);
                            px--;
                            pplace(px, py, cid);
                        }
                    }
                };
            })(i, j);
        }
        board.appendChild(row);
        cboard.push(crow);
        buildingids.push([...crow]);
    }
    col = document.getElementById("piece");
    for (let k = 0; k < pieces.length; k++) {
        crott.push(0);
        nd = document.createElement("div");
        nd.classList.add("pieces");
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
        np.classList.add("pieceTable");
        for (let i = 0; i < pieces[k].length; i++) {
            nr = document.createElement("tr");
            nr.classList.add("pieceShapeRow");
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
        col.appendChild(nd);
    }
    setInterval(onTimerTick, 1000);
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

function update() {
    for(var i=0;i<8;i++){
        document.getElementById(i.toString()).innerHTML = stats[i];
    }
    document.getElementById("timer").innerHTML = month + " months" + "<br />" + year + " years";
}

function moneyChange(amount, sign) {
    var dmgText = document.createElement("span");
    dmgText.style.color="green";
    if(sign<0){
        dmgText.style.color="red";
        dmgText.innerHTML += "-";
    }
    dmgText.innerHTML += "$" + amount.toString();
    dmgText.classList += "FloatingCombatText";
    document.getElementById("moneyTag").appendChild(dmgText);
    dmgText.addEventListener("animationend", () => {dmgText.remove()});
}

let events = [
    [-100000, -45, -20000, -1000, -20, 0, 0, -2000, "COVID-19 Pandemic"],
    [-1000000, -50, -30000, -1000, 0, 0, 0, 0, -5000, "War"],
    [0,-30,-40000,-1000,-90,-20,0,-10000, "AI Takeover"],
    [-5000000, -70, -100, -5, -60, 0, -30, -60000, "Global Economic Crisis"]
]

function eventUpdate(stat_updates) {
    for(var i;i<8;i++){
        stats[i]+=stat_updates[i];
    }
}

function lose(){
    window.location.href="lose.html";
}


var operationCost = [100000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]

var time=0;
var month=0;
var year=0;
var crisisCost=[];
function onTimerTick() {
    
    console.log(Math.floor(Math.random()*2));
    time++;
    if(time%1==0){
        month++;
        if(month>=12){
            month=0;
            year++;
            //events
            var eventid=Math.floor(Math.random()*4);
            if(eventid==1&&tcnt[5]==0){
                lose();
            }
            crisisCost=events[eventid];
            document.getElementById("event").innerHTML=crisisCost[9];
            //win
            if(year>=5){
                window.location.href="win.html";            
            }
        }
    }
    console.log(crisisCost);
    
    //if not lost, change stats
    //operation costs
    var costToday=0;
    for(var i=0;i<8;i++){
        costToday+=tcnt[i]*operationCost[i];
    }
    stats[0]-=costToday;
    
    //death rate
    deathRate = (1-(stats[6]*0.01))*(1/100);
    console.log(deathRate);
    //population
    var graduated = 200+Math.floor(Math.random()*101);
    stats[2]-=stats[2]*deathRate;
    stats[2]*=(201/200);
    stats[2]+= graduated;
    stats[2]=Math.floor(stats[2]);
    update();
    stats[3]-=graduated;
    stats[3]+=Math.floor(stats[2]/2000)
    //employment
    var sumOfBuildings=0;
    for(var i=0;i<8;i++){
        if(i==4){
            continue;
        }
        sumOfBuildings += tcnt[i];
    }
    stats[4]=sumOfBuildings*8
    //education
    var educatedNum=(stats[5]*0.01)*(stats[2]+stats[3]);
    educatedNum+=tcnt[1]*2000;
    stats[5]=Math.round(educatedNum/(stats[2]+stats[3])*10000)/100;
    //healthcare
    stats[6]+=tcnt[2]*2;
    if(stats[6]>100){
        stats[6]=100;
    }
    if(tcnt[2]==0){
        stats[6]-=2;
        if(stats[6]<0){
            stats[6]=1;
        }
    }
    //trade;
    stats[7]=tcnt[0]*50000+Math.floor(Math.random()*10)*1000*stats[4];
    console.log(stats);
    //moneyyyyyy
    //operation costs
    var costToday=0;
    for(var i=0;i<8;i++){
        costToday+=tcnt[i]*operationCost[i];
    }
    stats[0]-=costToday;
    //crisis costs
    // eventUpdate(crisisCost)
    //increase due to trade
    stats[0]+=stats[7];
    //housed
    stats[8] = Math.max(tcnt[4] * 20000, stats[2]+stats[3]);
    //happiness
    stats[1]+=tcnt[6]*3;
    if(stats[5]>80){
        stats[1]+=1;
    } 
    if(stats[4]>80){
        stats[1]+=1;
    }
    if(stats[7]>1500000){
        stats[1]+=1;
    }
    if(stats[4]<20){
        stats[1]-=1;
    }
    if(stats[6]<40){
        stats[1]-=1;
    }
    if (stats[8]/(stats[2]+stats[3])<0.8){
        stats[1]-=2;
    }
    //crisis costs
    eventUpdate(crisisCost);

    //losing conditions
    if(stats[0]<=0){
        console.log(1);
        lose();
    } else if(stats[1]<15){
        console.log(2);
        lose();
    } else if(stats[2]<1000||stats[3]<100){
        console.log(3);
        lose();
    }
}

init();
