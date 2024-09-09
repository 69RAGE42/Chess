import { ChessBoard } from "./logic/ChessBoard.js";
import { getChessPieceImage } from "./logic/util.js";

let board = new ChessBoard();
board.init();

const cellHolder = document.querySelector(".cell-holder");
const pieceHolder = document.querySelector(".piece-holder");

for (let i = 8; i >= 1; i--) {
	for (let j = 1; j <= 8; j++) {
		var cell = document.createElement("div");
		cell.className = "cell f-" + String.fromCharCode(96 + j) + " r-" + i;
		cellHolder.appendChild(cell);
	}
}

renderBoardPieces(board.positions)
resetAllCells()
resetHoverEffect()

function renderBoardPieces(positions) {
	for (let i = 0, k = 8; i < 8; i++, k--) {
		for (let j = 0; j < 8; j++) {

			let button = document.createElement("div");
			button.style.gridArea = `${i + 1}/${j + 1}`;
			button.className = String.fromCharCode(j + 97) + k + " buttons";
			button.innerHTML = "<div class='fa-solid fa-xmark'></div><div class='fa-solid fa-circle'></div>";
			pieceHolder.appendChild(button);

			if (!positions[i][j]) continue;

			let pieceImgElement = document.createElement("img");
			pieceImgElement.src = getChessPieceImage(positions[i][j]);
			pieceImgElement.style.gridArea = `${i + 1}/${j + 1}`;
			pieceImgElement.className = String.fromCharCode(j + 97) + k;
			pieceHolder.appendChild(pieceImgElement);

		}
	}
} (board.getLogicalBoard());

function resetAllCells() {
	let altColor = "white";

	for (let i = 8; i >= 1; i--) {
		for (let j = 1; j <= 8; j++) {
			let file = String.fromCharCode(96 + j);
			let rank = i;

			let cell = document.querySelector(`.cell.f-${file}.r-${rank}`);
			cell.classList.add(altColor);

			document.querySelector(`.${file}${rank}.buttons > .fa-xmark`).style.transform = "scale(0)";
			document.querySelector(`.${file}${rank}.buttons > .fa-circle`).style.transform = "scale(0)";

			if (j == 8) continue;

			if (altColor != "white") {
				cell.style.boxShadow = "inset 0 0 10px 0px black";
				altColor = "white";
			} else
				altColor = "black";
		}
	}
};

function resetHoverEffect() {
	document.querySelectorAll(".buttons").forEach(button => {
		button = document.querySelector(`.${button.className.split(" ")[0]}.buttons`);
		button.addEventListener('mouseover', () => {
			button.style.border = "3px solid hsla(0, 0%, 80%, 1)";
			button.style.borderRadius = "10%";
		})
		button.addEventListener('mouseout', () => {
			button.style.border = "0px solid hsla(0, 0%, 80%, 1)";
		})

	})
}

let lastClickedCell = "";
let lastClickedPiece = null;
let availableMoves = []
let availableAttackingMoves = []

document.querySelectorAll(".piece-holder > .buttons").forEach(button => {
	button.addEventListener("click", (event) => {
		let pos = button.className.substring(0, 2);

		if (!document.querySelector("img." + pos) || document.querySelector("img." + pos).style.display === "none") {
			console.log(availableMoves, availableAttackingMoves)
			if (availableMoves.includes(pos)) {
				let piece = board.getPieceOnPosition({ x: lastClickedCell[0].charCodeAt(0) - 97, y: 8 - +lastClickedCell[1] })
				board.move(piece, { x: pos[0].charCodeAt(0) - 97, y: 8 - +pos[1] })

				resetHoverEffect();
				resetAllCells();
				lastClickedCell = "";
				lastClickedPiece = null;
				availableMoves = []
				availableAttackingMoves = []
				return;
			}

			let movePossible = availableAttackingMoves.filter(e => e.x == pos[0].charCodeAt(0) - 97 && e.y == 8 - +pos[1]).length

			// this condition will ONLY EVER be applicable in case of en passant
			if (movePossible) {
				let piece = board.getPieceOnPosition({ x: lastClickedCell[0].charCodeAt(0) - 97, y: 8 - +lastClickedCell[1] })
				let enPassantMove = availableAttackingMoves.filter(e => e.isKillingMove && !board.getPieceOnPosition({ x: e.x, y: e.y }))

				board.kill(piece, enPassantMove[0], enPassantMove[0].killTarget)

				resetHoverEffect();
				resetAllCells();
				lastClickedCell = "";
				lastClickedPiece = null;
				availableMoves = []
				availableAttackingMoves = []
				return;
			}

			let attacked = document.querySelector(`.${pos}.buttons > .fa-xmark`).style.transform == "scale(0)";
			let available = document.querySelector(`.${pos}.buttons > .fa-circle`).style.transform == "scale(0)";
			console.log(attacked, available)
			return;
		}

		// if (lastClickedCell.length) {
		// 	if (lastClickedCell === pos)
		// 		resetAllCells();

		// 	lastClickedCell = "";
		// 	lastClickedPiece = null;
		// 	availableMoves = []
		// 	availableAttackingMoves = []
		// 	return
		// }

		if (lastClickedPiece && lastClickedPiece.color === board.currentTurn) {
			let movePossible = availableAttackingMoves.filter(e => e.x == pos[0].charCodeAt(0) - 97 && e.y == 8 - +pos[1]).length

			if (movePossible) {
				let killingMove = availableAttackingMoves.filter(e => e.x == pos[0].charCodeAt(0) - 97 && e.y == 8 - +pos[1])[0]

				let piece = board.getPieceOnPosition({ x: lastClickedCell[0].charCodeAt(0) - 97, y: 8 - +lastClickedCell[1] })
				board.kill(piece, killingMove, killingMove.killTarget)

				resetHoverEffect();
				resetAllCells();
				lastClickedCell = "";
				lastClickedPiece = null;
				availableMoves = []
				availableAttackingMoves = []
				return;
			}
		}

		let piece = board.getPieceOnPosition({ x: pos[0].charCodeAt(0) - 97, y: 8 - +pos[1] });

		if (piece.color != board.currentTurn)
			return;

		lastClickedPiece = piece;

		console.log(piece.getMovablePositions())

		resetHoverEffect();

		lastClickedCell = pos;

		resetAllCells();

		piece.getMovablePositions().forEach((move) => {
			if (move['isKillingMove']) {
				attackedCell(String.fromCharCode(move.x + 97), 8 - move.y)
				availableAttackingMoves.push(move)

				// if (availableAttackingMoves.indexOf(`${String.fromCharCode(move.x + 97) + (8 - move.y)}`) == -1)
				// 	availableAttackingMoves.push(`${String.fromCharCode(move.x + 97) + (8 - move.y)}`)
			}
			else {
				availableCell(String.fromCharCode(move.x + 97), 8 - move.y);

				if (availableMoves.indexOf(`${String.fromCharCode(move.x + 97) + (8 - move.y)}`) == -1)
					availableMoves.push(`${String.fromCharCode(move.x + 97) + (8 - move.y)}`)
			}
		});
	})
})

function availableCell(file, rank) {
	document.querySelector(`.${file}${rank}.buttons > .fa-circle`).style.transform = "scale(1)";

	let button = document.querySelector(`.${file}${rank}.buttons`);
	button.addEventListener("mouseover", () => {
		button.style.border = "4px solid hsla(180, 100%, 75%, 1)";
		button.style.borderRadius = "10%";
	})
	button.addEventListener("mouseout", () => {
		button.style.border = "0px solid hsla(180, 100%, 75%, 1)";
		button.style.borderRadius = "10%";
	})
}

function attackedCell(file, rank) {
	document.querySelector(`.${file}${rank}.buttons > .fa-xmark`).style.transform = "scale(1)";

	let button = document.querySelector(`.${file}${rank}.buttons`);
	button.addEventListener("mouseover", () => {
		button.style.border = "4px solid hsla(360, 100%, 50%, 1)";
		button.style.borderRadius = "10%";
	})
	button.addEventListener("mouseout", () => {
		button.style.border = "0px solid hsla(360, 100%, 50%, 1)";
		button.style.borderRadius = "10%";
	})
}