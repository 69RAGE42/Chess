import { ChessBoard } from "./logic/ChessBoard.js";
import { getChessPieceImage, makeGlobal, setDebugMode, logicalToVisual, visualToLogical } from "./logic/util.js";

setDebugMode(true);

const cellHolder = document.querySelector(".cell-holder");
const pieceHolder = document.querySelector(".piece-holder");
const board = new ChessBoard();
board.init();

let cells = {}
let pieces = {}
let buttons = {}

makeGlobal('cells', cells);
makeGlobal('pieces', pieces);
makeGlobal('buttons', buttons);
makeGlobal('board', board);

makeGlobal("availableCell", availableCell)
makeGlobal('attackedCell', attackedCell)
makeGlobal('resetAllCells', resetAllCells)
makeGlobal('resetHoverEffect', resetHoverEffect)

makeGlobal('logicalToVisual', logicalToVisual)
makeGlobal('visualToLogical', visualToLogical)

for (let i = 8; i >= 1; i--) {
	for (let j = 1; j <= 8; j++) {
		var cell = document.createElement("div");
		cell.className = "cell f-" + String.fromCharCode(96 + j) + " r-" + i;
		cellHolder.appendChild(cell);

		cells[String.fromCharCode(j + 96) + i] = cell;
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

			button.addEventListener("click", buttonOnClick)

			buttons[String.fromCharCode(j + 97) + k] = button

			if (!positions[i][j]) continue;

			let piece = document.createElement("img");
			piece.src = getChessPieceImage(positions[i][j]);
			piece.style.gridArea = `${i + 1}/${j + 1}`;
			piece.className = String.fromCharCode(j + 97) + k;
			pieceHolder.appendChild(piece);

			pieces[String.fromCharCode(j + 97) + k] = piece
		}
	}
} (board.getLogicalBoard());

function resetAllCells() {
	let altColor = "white";

	for (let i = 8; i >= 1; i--) {
		for (let j = 1; j <= 8; j++) {
			let pos = String.fromCharCode(96 + j) + i

			let cell = cells[pos]
			cell.classList.add(altColor);

			buttons[pos].children[0].style.transform = "scale(0)"
			buttons[pos].children[1].style.transform = "scale(0)"

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
	for (let button of Object.values(buttons)) {
		button.addEventListener('mouseover', () => {
			button.style.border = "3px solid hsla(0, 0%, 80%, 1)";
			button.style.borderRadius = "10%";
		})
		button.addEventListener('mouseout', () => {
			button.style.border = "0px solid hsla(0, 0%, 80%, 1)";
		})
	}
}

let lastClickedPosition = ""
let availableMoves = []
let attackingMoves = []

function buttonOnClick(event) {
	let pos = event.srcElement.closest(".buttons").className.split(" ")[0]

	let attackingMove = attackingMoves.filter(e => e.x === visualToLogical(pos).x && e.y === visualToLogical(pos).y)

	if (availableMoves.includes(pos)) {
		let visualPiece = pieces[lastClickedPosition]
		let piece = board.getPieceOnPosition(visualToLogical(lastClickedPosition));
		board.move(piece, visualToLogical(pos))

		delete pieces[lastClickedPosition]
		pieces[pos] = visualPiece

		resetAllCells()
		resetHoverEffect()
		availableMoves = []
		attackingMoves = []
		lastClickedPosition = ""
		return;
	}

	if (attackingMove.length) {
		let visualPiece = pieces[lastClickedPosition]
		let piece = board.getPieceOnPosition(visualToLogical(lastClickedPosition));
		board.kill(piece, attackingMove[0], attackingMove[0].killTarget)

		if (attackingMove[0]["isEnPassant"])
			delete pieces[logicalToVisual(attackingMove[0].killTarget.position)]

		delete pieces[lastClickedPosition];

		pieces[pos] = visualPiece

		resetAllCells()
		resetHoverEffect()
		availableMoves = []
		attackingMoves = []
		lastClickedPosition = ""
		return;
	}

	if (!pieces[pos]) {
		console.log("empty cell!!")
		lastClickedPosition = ""
		availableMoves = []
		attackingMoves = []

		resetAllCells()
		resetHoverEffect()
		return;
	}

	if (lastClickedPosition.length) {

		if (lastClickedPosition === pos) {
			lastClickedPosition = ""
			availableMoves = []
			attackingMoves = []
			return resetAllCells();
		}

		lastClickedPosition = ""
		availableMoves = []
		attackingMoves = []
	}

	resetAllCells()
	resetHoverEffect()
	lastClickedPosition = pos;

	if (board.currentTurn != board.getPieceOnPosition(visualToLogical(pos)).color)
		return;

	let piece = board.getPieceOnPosition(visualToLogical(pos));
	piece.getMovablePositions().forEach(move => {
		if (move["isKillingMove"]) {
			attackedCell(logicalToVisual(move))
			attackingMoves.push(move)
		}
		else {
			availableCell(logicalToVisual(move))
			availableMoves.push(logicalToVisual(move))
		}
	})

}

function availableCell(pos) {
	let button = buttons[pos]

	button.children[1].style.transform = "scale(1)";
	button.addEventListener("mouseover", () => {
		button.style.border = "4px solid hsla(180, 100%, 75%, 1)";
		button.style.borderRadius = "10%";
	})
	button.addEventListener("mouseout", () => {
		button.style.border = "0px solid hsla(180, 100%, 75%, 1)";
		button.style.borderRadius = "10%";
	})
}

function attackedCell(pos) {
	let button = buttons[pos]

	button.children[0].style.transform = "scale(1)";
	button.addEventListener("mouseover", () => {
		button.style.border = "4px solid hsla(360, 100%, 50%, 1)";
		button.style.borderRadius = "10%";
	})
	button.addEventListener("mouseout", () => {
		button.style.border = "0px solid hsla(360, 100%, 50%, 1)";
		button.style.borderRadius = "10%";
	})
}