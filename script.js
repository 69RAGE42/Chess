import { initGeneralBoard } from "./default.js";

const holder = document.querySelector(".cell-holder");

for (let i = 8; i >= 1; i--) {
    for (let j = 1; j <= 8; j++) {
        var cell = document.createElement("div");
        cell.className = "cell r-" + String.fromCharCode(i + 96) + " f-" + j;
        holder.appendChild(cell);
    }
}

resetAllCells();

initGeneralBoard();

document.querySelectorAll(".piece-holder > img").forEach((image) => {
    image.addEventListener("click", (event) => {
        let src = image.src;
        let rank = image.className.substring(0, 1);
        let file = image.className.substring(1, 2);
        let color = src.substring(
            src.lastIndexOf("/") + 1,
            src.lastIndexOf("_")
        );
        let piece = src.substring(
            src.lastIndexOf("_") + 1,
            src.lastIndexOf(".")
        );

        moveFromTo(rank, file, "g", "4", color, piece, true);
    });
});

function moveFromTo(iRank, iFile, fRank, fFile, color, piece, legal) {
    if (!legal) return;

    // let src = document.querySelector(".cell.r-" + iRank + ".f-" + iFile).innerHTML;
    document.querySelector(".cell.r-" + iRank + ".f-" + iFile).innerHTML = "";
}

function resetAllCells() {
    let altColor = "white";

    for (let i = 8; i >= 1; i--) {
        for (let j = 1; j <= 8; j++) {
            let element = document.querySelector(".cell.r-" + String.fromCharCode(i + 96) + ".f-" + j);
            element.classList.remove("white");
            element.classList.remove("black");
            element.classList.remove("cyan");
            element.classList.remove("red");
            element.classList.add(altColor);
            
            if (j == 8) continue;

            if (altColor != "white") {
                element.style.boxShadow = "inset 0 0 10px 0px black";
                altColor = "white";
            }
            else
                altColor = "black";
        }
    }
}

function cellShowCyan(rank, file) {
    document.querySelector(".cell.r-" + rank + ".f-" + file).classList.remove("black");
    document.querySelector(".cell.r-" + rank + ".f-" + file).classList.remove("white");
    document.querySelector(".cell.r-" + rank + ".f-" + file).classList.remove("red");
    document.querySelector(".cell.r-" + rank + ".f-" + file).classList.add("cyan");
}


function cellShowRed(rank, file) {
    document.querySelector(".cell.r-" + rank + ".f-" + file).classList.remove("black");
    document.querySelector(".cell.r-" + rank + ".f-" + file).classList.remove("white");
    document.querySelector(".cell.r-" + rank + ".f-" + file).classList.remove("cyan");
    document.querySelector(".cell.r-" + rank + ".f-" + file).classList.add("red");
}

cellShowRed("d", "4");
cellShowRed("e", "5");
cellShowCyan("d", "5");
cellShowCyan("e", "4");
cellShowCyan("f", "5");