import { getChessPieceImage } from "./logic/util.js";

// export const general = [
//     ["br1", "bn1", "bb1", "bq1", "bk0", "bb2", "bn2", "br2"],
//     ["bp1", "bp2", "bp3", "bp4", "bp5", "bp6", "bp7", "bp8"],
//     ["", "", "", "", "", "", "", ""],
//     ["", "", "", "", "", "", "", ""],
//     ["", "", "", "", "", "", "", ""],
//     ["", "", "", "", "", "", "", ""],
//     ["wp1", "wp2", "wp3", "wp4", "wp5", "wp6", "wp7", "wp8"],
//     ["wr1", "wn1", "wb1", "wq1", "wk0", "wb2", "wn2", "wr2"],
// ];

const pieceHolder = document.querySelector(".piece-holder");

export function renderBoardPieces(positions) {
	for (let i = 0, k = 8; i < 8; i++, k--) {
		for (let j = 0; j < 8; j++) {
			if (!positions[i][j]) continue;

			let pieceImgElement = document.createElement("img");
			pieceImgElement.src = getChessPieceImage(positions[i][j]);
			pieceImgElement.style.gridArea = `${i + 1}/${j + 1}`;
			pieceImgElement.className = String.fromCharCode(j + 97) + k;
			pieceHolder.appendChild(pieceImgElement);
		}
	}
}

// export function renderPiece(file, rank, piece, row, col) {
//     let p = document.createElement("img");
//     p.src = "./assets/chess_pieces/" + piece + ".svg";
//     p.style.gridArea = `${row + 1}/${col + 1}`;
//     p.className = rank + file;
//     pieceHolder.appendChild(p);
// }

// export function initGeneralBoard() {
//     for (let i = 0, k = 8; i < 8; i++, k--) {
//         for (let j = 0; j < 8; j++) {
//             if (!general[i][j]) continue;

//             console.log(i, k, j);

//             let color = general[i][j].substring(0, 1);
//             let piece = general[i][j].substring(1, 2);

//             renderPiece(
//                 k,
//                 String.fromCharCode(j + 97),
//                 `${color}_${piece}`,
//                 i,
//                 j
//             );
//         }
//     }
// }
