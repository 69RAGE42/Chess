import { defaultBoard, CHESS_COLOR, CHESS_PIECE_BLACK } from "./ChessVariables.js";
import { ChessPiece } from "./ChessPiece.js";
import { objIncludes } from "./util.js";
import { wrapGrid } from "https://esm.sh/animate-css-grid";

const { forceGridAnimation } = wrapGrid(document.querySelector(".piece-holder"));

export class ChessBoard {
	constructor() {
		this.positions = [[], [], [], [], [], [], [], []];
		this.pieces = {
			[CHESS_COLOR.WHITE]: [],
			[CHESS_COLOR.BLACK]: []
		};
		this.currentTurn = ""
	}

	async init() {
		for (let i = 0; i != 8; i++) {
			for (let j = 0; j != 8; j++) {
				let curPiece = defaultBoard[i][j];
				this.positions[i].push(curPiece);

				if (curPiece) {
					if (objIncludes(CHESS_PIECE_BLACK, curPiece))
						this.pieces[CHESS_COLOR.BLACK].push(new ChessPiece(this, CHESS_COLOR.BLACK, curPiece, { x: j, y: i }));
					else this.pieces[CHESS_COLOR.WHITE].push(new ChessPiece(this, CHESS_COLOR.WHITE, curPiece, { x: j, y: i }));
				}
			}
		}

		this.currentTurn = CHESS_COLOR.WHITE
	}

	getPieceOnPosition(pos) {
		let piece = null;
		for (let value of Object.values(this.pieces[CHESS_COLOR.BLACK])) {
			if (value.position.x != pos.x || value.position.y != pos.y) continue;

			piece = value;
			break;
		}

		for (let value of Object.values(this.pieces[CHESS_COLOR.WHITE])) {
			if (value.position.x != pos.x || value.position.y != pos.y) continue;

			piece = value;
			break;
		}
		return piece;
	}

	move(piece, newPos) {
		let visualPiece = document.querySelector(`img.${String.fromCharCode(piece.position.x + 97)}${8 - piece.position.y}`);

		// Logical position
		this.positions[piece.position.y][piece.position.x] = "";
		this.positions[newPos.y][newPos.x] = piece.type;

		// EN PASSANT
		if (piece.isPawn() && piece.pawnInitialMove) {
			piece.pawnInitialMove = false;

			if (Math.abs(newPos.y - piece.position.y) === 2) {
				if (newPos.x - 1 >= 0) {
					let otherPiece = this.getPieceOnPosition({ x: newPos.x - 1, y: newPos.y })

					if (otherPiece && otherPiece.color != piece.color)
						piece.canEnPassant = true;
				}

				if (newPos.x + 1 < 8) {
					let otherPiece = this.getPieceOnPosition({ x: newPos.x + 1, y: newPos.y })

					if (otherPiece && otherPiece.color != piece.color)
						piece.canEnPassant = true;
				}
			}
		}

		piece.position.x = newPos.x;
		piece.position.y = newPos.y;

		// Visual position
		visualPiece.style.gridArea = `${newPos.y + 1}/${newPos.x + 1}`;
		visualPiece.className = `${String.fromCharCode(newPos.x + 97)}${8 - newPos.y}`;
		forceGridAnimation();

		if (this.currentTurn === CHESS_COLOR.WHITE)
			this.currentTurn = CHESS_COLOR.BLACK
		else
			this.currentTurn = CHESS_COLOR.WHITE
	}

	kill(piece, newPos, targetPiece) {
		let visualTargetPiece = document.querySelector(`img.${String.fromCharCode(targetPiece.position.x + 97)}${8 - targetPiece.position.y}`);

		let targetPieceIndex = 0;

		// En passant
		// if (targetPiece.canEnPassant) {
			this.positions[targetPiece.position.y][targetPiece.position.x] = ""
			visualTargetPiece.style.display = "none"

			this.pieces[targetPiece.color].map((e, i) => {


				// very static test
				if (i === 10) {
					console.log(e.position)
					console.log(targetPiece.position)
				}

				if (e.position.x === targetPiece.position.x && e.position.y === targetPiece.position.y) {
					console.log("gm test: ", i)
					targetPieceIndex = i
				}
			})

			this.pieces[targetPiece.color].splice(targetPieceIndex, 1)

			return this.move(piece, newPos)
		// }
	}

	getLogicalBoard() {
		return this.positions;
	}
}
