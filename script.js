import { CHESS_SFX } from "./logic/ChessVariables.js";
import { getChessPieceImage, makeGlobal, setDebugMode, logicalToVisual, visualToLogical, generateGame, getMoves, movePiece, getGameStatus, decodeMove, killPiece } from "./logic/util.js";
import { wrapGrid } from "https://esm.sh/animate-css-grid";

setDebugMode(true);

const cellHolder = document.querySelector(".cell-holder");
const pieceHolder = document.querySelector(".piece-holder");
wrapGrid(pieceHolder);

let board = await generateGame();
console.log(board)

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
			let pieceImg = getChessPieceImage(positions[i][j]);
			piece.src = pieceImg;
			piece.style.gridArea = `${i + 1}/${j + 1}`;
			piece.className = `${logicalToVisual({ x: j, y: k })} ${pieceImg.slice(-7, -6)}`
			pieceHolder.appendChild(piece);

			pieces[String.fromCharCode(j + 97) + k] = piece
		}
	}
} (board.positions);

function resetAllCells() {
	let altColor = "white";

	for (let i = 8; i >= 1; i--) {
		for (let j = 1; j <= 8; j++) {
			let pos = String.fromCharCode(96 + j) + i

			let cell = cells[pos]
			cell.classList.add(altColor);

			buttons[pos].children[0].style.transform = "scale(0)"
			buttons[pos].children[1].style.transform = "scale(0)"

			if (altColor == "black")
				cell.style.boxShadow = "inset 0 0 10px 0px black";

			if (j == 8) continue;

			if (altColor != "white") {
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

async function buttonOnClick(event) {
	let pos = event.srcElement.closest(".buttons").className.split(" ")[0]
	console.log(pos)

	let attackingMove = attackingMoves.filter(e => pos == e.position)

	if (availableMoves.includes(pos)) {
		let visualPiece = pieces[lastClickedPosition]
		await movePiece(board.gameID, lastClickedPosition, pos)
		board = await getGameStatus(board.gameID)
		checkGameState()
		console.log(board)

		// Visual position
		let newPos = visualToLogical(pos)
		visualPiece.style.gridArea = `${newPos.y + 1}/${newPos.x + 1}`;
		visualPiece.classList.remove(lastClickedPosition);
		visualPiece.classList.add(pos);

		delete pieces[lastClickedPosition]
		pieces[pos] = visualPiece

		resetAllCells()
		resetHoverEffect()
		availableMoves = []
		attackingMoves = []
		lastClickedPosition = ""
		return;
	}

	console.log(pos)

	if (attackingMove.length) {
		let visualPiece = pieces[lastClickedPosition]
		let targetPiece = pieces[attackingMove[0].killTarget.position]
		await killPiece(board.gameID, lastClickedPosition, pos, attackingMove[0].killTarget.position)
		board = await getGameStatus(board.gameID)
		checkGameState()
		console.log(board)

		// Visual position
		let newPos = visualToLogical(pos)
		visualPiece.style.gridArea = `${newPos.y + 1}/${newPos.x + 1}`;
		visualPiece.classList.remove(lastClickedPosition);
		visualPiece.classList.add(pos);

		targetPiece.remove()

		if (attackingMove[0]["isEnPassant"])
			delete pieces[attackingMove[0].killTarget.position]

		delete pieces[lastClickedPosition];

		pieces[pos] = visualPiece

		resetAllCells()
		resetHoverEffect()
		availableMoves = []
		attackingMoves = []
		lastClickedPosition = ""
		return;
	}

	console.log(pos)

	if (!pieces[pos]) {
		console.log("empty cell!!")
		lastClickedPosition = ""
		availableMoves = []
		attackingMoves = []

		resetAllCells()
		resetHoverEffect()
		return;
	}
	console.log(pos)

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
	console.log(pos)

	if (!pieces[lastClickedPosition || pos].classList.contains(board.currentTurn[0]))
		return;

	resetAllCells()
	resetHoverEffect()
	lastClickedPosition = pos;
	console.log(pos)

	let moves = (await getMoves(board.gameID, pos))
	console.log(moves)
	moves = moves.map(decodeMove)
	console.log(moves)
	moves.forEach(move => {
		if ((move["isPawnDiagonal"] && !move["isKillingMove"]) || move["isFriendlyPiece"])
			return;

		if (move["isKillingMove"]) {
			attackedCell(move.position)
			attackingMoves.push(move)
		}
		else {
			availableCell(move.position)
			availableMoves.push(move.position)
		}
	})

	console.log(attackingMoves)
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

function checkGameState() {
	if(board.check)
		CHESS_SFX.CHECK.play()
}