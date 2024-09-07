import { initGeneralBoard } from "./default.js";
import { ChessBoard } from "./logic/ChessBoard.js";
import {
    CHESS_PIECE_WHITE,
    CHESS_PIECE_BLACK,
    CHESS_COLOR,
} from "./logic/ChessVariables.js";
import { ChessPiece } from "./logic/ChessPiece.js";

let gm = new ChessBoard();
gm.init();
console.log(gm);

// const queryString = window.location.search;
// console.log(queryString.split("?gameId=")[1]); // now the frontend knows that this is the game id

const holder = document.querySelector(".cell-holder");

for (let i = 8; i >= 1; i--) {
    for (let j = 1; j <= 8; j++) {
        var cell = document.createElement("div");
        cell.className = "cell r-" + String.fromCharCode(i + 96) + " f-" + j;
        holder.appendChild(cell);
    }
}

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

        console.log(rank, file, color, piece);
        moveFromTo(rank, file, "g", "4", color, piece, true);
    });
});

function moveFromTo(iRank, iFile, fRank, fFile, color, piece, legal) {
    if (!legal) return;

    let src = document.querySelector(
        ".cell.r-" + iRank + ".f-" + iFile
    ).innerHTML; // achha ok yes understandable
    document.querySelector(".cell.r-" + iRank + ".f-" + iFile).innerHTML = "";
    // document.querySelector(".cell.r-" + fRank + ".f-" + fFile).innerHTML = src; // this is null
}
