import { renderBoardPieces } from "./default.js";
import { ChessBoard } from "./logic/ChessBoard.js";

let test = new ChessBoard();
test.init();
// console.log("Before moving:");
// console.log(test);

let piece = test.pieces["black"][0];
console.log(piece.getMovablePositions());

let piece2 = test.pieces["white"][0];
console.log(piece.getMovablePositions());

setTimeout(() => {
	console.log("After moving:");
	test.move(piece, piece.getMovablePositions()[1]);
	test.move(piece2, piece2.getMovablePositions()[1]);
	console.log(test);
	console.log(piece.getMovablePositions());
}, 1000);

const holder = document.querySelector(".cell-holder");

for (let i = 8; i >= 1; i--) {
	for (let j = 1; j <= 8; j++) {
		var cell = document.createElement("div");
		cell.className = "cell f-" + String.fromCharCode(96 + j) + " r-" + i;
		holder.appendChild(cell);
		cell.innerHTML =
			"<div class='valid fa-solid fa-circle'></div><div class='valid fa-regular fa-circle'></div>";
	}
}

resetAllCells();

renderBoardPieces(test.positions);

let alreadyClicked = false; // never assigned
let pieceClicked = "";

document.querySelectorAll(".piece-holder > img").forEach((image) => {
	image.addEventListener("click", (event) => {
		let pos = image.className;

		if (alreadyClicked && pieceClicked === pos) {
			resetAllCells();
			alreadyClicked = false;
			return;
		}

		resetAllCells();

		let fileNum = pos[0].charCodeAt(0) - 97;
		let rankNum = 8 - +pos[1];

		let piece = test.getPieceOnPosition({ x: fileNum, y: rankNum });
		let availablePieceMoves = piece.getMovablePositions();
		pieceClicked = pos;
		alreadyClicked = true;

		availablePieceMoves.forEach((cell) => {
			const { x, y } = cell;

			let file = String.fromCharCode(x + 97);
			let rank = String(8 - y);

			if (cell['isKillingMove'])
				attackedCell(file, rank)
			else
				availableCell(file, rank);
		});
	});
});

function resetAllCells() {
	let altColor = "white";

	for (let i = 8; i >= 1; i--) {
		for (let j = 1; j <= 8; j++) {
			let element = document.querySelector(
				".cell.f-" + String.fromCharCode(96 + j) + ".r-" + i
			);

			document.querySelector(
				".cell.f-" +
				String.fromCharCode(96 + j) +
				".r-" +
				i +
				" > .fa-solid"
			).style.transform = "scale(0)";
			document.querySelector(
				".cell.f-" +
				String.fromCharCode(96 + j) +
				".r-" +
				i +
				" > .fa-regular"
			).style.transform = "scale(0)";
			element.classList.remove("white");
			element.classList.remove("black");
			element.classList.remove("cyan");
			element.classList.remove("red");
			element.classList.add(altColor);

			if (altColor == "black")
				element.style.boxShadow = "inset 0 0 10px 0px black";
			if (j == 8) continue;
			if (altColor != "white") {
				element.style.boxShadow = "inset 0 0 10px 0px black";
				altColor = "white";
			} else altColor = "black";
		}
	}
}

function availableCell(file, rank) {
	let element = document.querySelector(
		".cell.f-" + file + ".r-" + rank + " > .fa-solid"
	);

	if (element.style.transform === "scale(1)")
		element.style.transform = "scale(0)";
	else element.style.transform = "scale(1)";
}

function attackedCell(file, rank) {
	let element = document.querySelector(
		".cell.f-" + file + ".r-" + rank + " > .fa-regular"
	);
	element.style.transform = "scale(1)";
}

// setTimeout(() => {
//     attackedCell("e", "1");
//     attackedCell("d", "1");
//     attackedCell("e", "8");
//     attackedCell("d", "8");
// }, 2500);
