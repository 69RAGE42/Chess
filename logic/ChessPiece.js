import { CHESS_PIECE_BLACK, CHESS_PIECE_WHITE, CHESS_MOVE_TYPE, CHESS_COLOR } from "./ChessVariables.js";

export class ChessPiece {
	constructor(board, color, type, pos) {
		this.board = board;
		this.color = color;
		this.type = type;
		this.position = { x: pos.x, y: pos.y };

		if (this.isPawn()) {
			this.pawnInitialMove = true;
			this.canEnPassant = false;
		}

		this.moveType = CHESS_MOVE_TYPE.DEFAULT;
		this.setupMoveType();
	}

	setupMoveType() {
		if (this.isRook())
			this.moveType = CHESS_MOVE_TYPE.STRAIGHT;

		if (this.isBishop())
			this.moveType = CHESS_MOVE_TYPE.DIAGONAL;

		if (this.isKnight())
			this.moveType = CHESS_MOVE_TYPE.KNIGHT;

		if (this.isKing())
			this.moveType = CHESS_MOVE_TYPE.KING;

		if (this.isPawn())
			this.moveType = CHESS_MOVE_TYPE.PAWN;

		if (this.isQueen())
			this.moveType = CHESS_MOVE_TYPE.STRAIGHT | CHESS_MOVE_TYPE.DIAGONAL;
	}

	isRook() {
		return [CHESS_PIECE_BLACK.ROOK, CHESS_PIECE_WHITE.ROOK].includes(this.type);
	}

	isKnight() {
		return [CHESS_PIECE_BLACK.KNIGHT, CHESS_PIECE_WHITE.KNIGHT].includes(this.type);
	}

	isBishop() {
		return [CHESS_PIECE_BLACK.BISHOP, CHESS_PIECE_WHITE.BISHOP].includes(this.type);
	}

	isQueen() {
		return [CHESS_PIECE_BLACK.QUEEN, CHESS_PIECE_WHITE.QUEEN].includes(this.type);
	}

	isKing() {
		return [CHESS_PIECE_BLACK.KING, CHESS_PIECE_WHITE.KING].includes(this.type);
	}

	isPawn() {
		return [CHESS_PIECE_BLACK.PAWN, CHESS_PIECE_WHITE.PAWN].includes(this.type);
	}

	getMovablePositions() {
		let movablePosArr = [];
		let curPos = this.position;
		let isBlocked = false;

		if (this.moveType & CHESS_MOVE_TYPE.PAWN) {
			let pawnNumPos = this.pawnInitialMove ? 2 : 1;

			// get moves on y axis (ranks)
			if (this.color === CHESS_COLOR.BLACK) {
				// special case, pawns can move diagonally if there's an enemy piece
				if (curPos.x - 1 >= 0) {
					let piece = this.board.getPieceOnPosition({ x: curPos.x - 1, y: curPos.y + 1 });
					if (piece && piece.color != this.color) movablePosArr.push({ x: curPos.x - 1, y: curPos.y + 1, isKillingMove: true, killTarget: piece });

					// en passant
					if (!piece) {
						piece = this.board.getPieceOnPosition({ x: curPos.x - 1, y: curPos.y })
						if (piece && piece.color != this.color && piece.canEnPassant)
							movablePosArr.push({ x: curPos.x - 1, y: curPos.y + 1, isKillingMove: true, isEnPassant: true, killTarget: piece })
					}
				}

				if (curPos.x + 1 < 8) {
					let piece = this.board.getPieceOnPosition({ x: curPos.x + 1, y: curPos.y + 1 });
					if (piece && piece.color != this.color) movablePosArr.push({ x: curPos.x + 1, y: curPos.y + 1, isKillingMove: true, killTarget: piece });

					// en passant
					if (!piece) {
						piece = this.board.getPieceOnPosition({ x: curPos.x + 1, y: curPos.y })
						if (piece && piece.color != this.color && piece.canEnPassant)
							movablePosArr.push({ x: curPos.x + 1, y: curPos.y + 1, isKillingMove: true, isEnPassant: true, killTarget: piece })
					}
				}

				for (let i = curPos.y; i <= curPos.y + pawnNumPos && (curPos.y + pawnNumPos) < 8; i++) {
					// ignore self
					if (curPos.y == i) continue;

					if (this.board.getPieceOnPosition({ x: curPos.x, y: i })) {
						isBlocked = true;
						break;
					} else movablePosArr.push({ x: curPos.x, y: i });
				}
			} else {
				// special case, pawns can move diagonally if there's an enemy piece
				if (curPos.x - 1 >= 0) {
					let piece = this.board.getPieceOnPosition({ x: curPos.x - 1, y: curPos.y - 1 });
					if (piece && piece.color != this.color) movablePosArr.push({ x: curPos.x - 1, y: curPos.y - 1, isKillingMove: true, killTarget: piece });

					// en passant
					if (!piece) {
						piece = this.board.getPieceOnPosition({ x: curPos.x - 1, y: curPos.y })
						if (piece && piece.color != this.color && piece.canEnPassant)
							movablePosArr.push({ x: curPos.x - 1, y: curPos.y - 1, isKillingMove: true, isEnPassant: true, killTarget: piece })
					}
				}

				if (curPos.x + 1 < 8) {
					let piece = this.board.getPieceOnPosition({ x: curPos.x + 1, y: curPos.y - 1 });
					if (piece && piece.color != this.color) movablePosArr.push({ x: curPos.x + 1, y: curPos.y - 1, isKillingMove: true, killTarget: piece });

					// en passant
					if (!piece) {
						piece = this.board.getPieceOnPosition({ x: curPos.x + 1, y: curPos.y })
						if (piece && piece.color != this.color && piece.canEnPassant)
							movablePosArr.push({ x: curPos.x + 1, y: curPos.y - 1, isKillingMove: true, isEnPassant: true, killTarget: piece })
					}
				}

				for (let i = curPos.y; i >= curPos.y - pawnNumPos && (curPos.y - pawnNumPos) >= 0; i--) {
					// ignore self
					if (curPos.y == i) continue;

					if (this.board.getPieceOnPosition({ x: curPos.x, y: i })) {
						isBlocked = true;
						break;
					} else movablePosArr.push({ x: curPos.x, y: i });
				}
			}
		}

		if (this.moveType & CHESS_MOVE_TYPE.STRAIGHT) {
			// get moves on x axis (files)
			for (let i = curPos.x; i >= 0; i--) {
				// ignore self
				if (curPos.x == i) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: curPos.y })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: curPos.y, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: curPos.y });
			}

			isBlocked = false;

			for (let i = curPos.x; i < 8; i++) {
				// ignore self
				if (curPos.x == i) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: curPos.y })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: curPos.y, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: curPos.y });
			}

			isBlocked = false;

			// get moves on y axis (ranks)
			for (let i = curPos.y; i >= 0; i--) {
				// ignore self
				if (curPos.y == i) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: curPos.x, y: i })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: curPos.x, y: i, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: curPos.x, y: i });
			}

			isBlocked = false;

			for (let i = curPos.y; i < 8; i++) {
				// ignore self
				if (curPos.y == i) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: curPos.x, y: i })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: curPos.x, y: i, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: curPos.x, y: i });
			}
		}

		if (this.moveType & CHESS_MOVE_TYPE.DIAGONAL) {
			for (let i = curPos.x, j = curPos.y; i >= 0 && j >= 0; i--, j--) {
				// ignore self
				if (curPos.x == i && curPos.y == j) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: j })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: j, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: j });
			}

			isBlocked = false;

			// i = 1 j = 1
			for (let i = curPos.x, j = curPos.y; i < 8 && j >= 0; i++, j--) {
				// ignore self
				if (curPos.x == i && curPos.y == j) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: j })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: j, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: j });
			}

			isBlocked = false;

			for (let i = curPos.x, j = curPos.y; i >= 0 && j < 8; i--, j++) {
				// ignore self
				if (curPos.x == i && curPos.y == j) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: j })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: j, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: j });
			}

			isBlocked = false;

			for (let i = curPos.x, j = curPos.y; i < 8 && j < 8; i++, j++) {
				// ignore self
				if (curPos.x == i && curPos.y == j) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: j })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: j, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: j });
			}
		}

		if (this.moveType & CHESS_MOVE_TYPE.KING) {
			for (let i = curPos.x, j = curPos.y; i >= 0 && j >= 0 && i >= curPos.x - 1 && j >= curPos.y - 1; i--, j--) {
				// ignore self
				if (curPos.x == i && curPos.y == j) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: j })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: j, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: j });
			}

			isBlocked = false;

			for (let i = curPos.x, j = curPos.y; (i <= curPos.x + 1 || j >= curPos.y + 1) && i < 8 && j >= 0; i++, j--) {
				// ignore self
				if (curPos.x == i && curPos.y == j) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: j })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: j, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: j });
			}

			isBlocked = false;

			for (let i = curPos.x, j = curPos.y; (i >= curPos.x + 1 || j <= curPos.y + 1) && i >= 0 && j < 8; i--, j++) {
				// ignore self
				if (curPos.x == i && curPos.y == j) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: j })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: j, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: j });
			}

			isBlocked = false;

			for (let i = curPos.x, j = curPos.y; (i <= curPos.x + 1 || j <= curPos.y + 1) && i < 8 && j < 8; i++, j++) {
				// ignore self
				if (curPos.x == i && curPos.y == j) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: j })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: j, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: j });
			}

			// get moves on x axis (files)
			for (let i = curPos.x; i >= curPos.x - 1 && i >= 0; i--) {
				// ignore self
				if (curPos.x == i) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: curPos.y })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: curPos.y, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: curPos.y });
			}

			isBlocked = false;

			for (let i = curPos.x; i <= curPos.x + 1 && i < 8; i++) {
				// ignore self
				if (curPos.x == i) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: i, y: curPos.y })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: i, y: curPos.y, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: i, y: curPos.y });
			}

			isBlocked = false;

			// get moves on y axis (ranks)
			for (let i = curPos.y; i >= curPos.y - 1 && i >= 0; i--) {
				// ignore self
				if (curPos.y == i) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: curPos.x, y: i })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: curPos.x, y: i, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: curPos.x, y: i });
			}

			isBlocked = false;

			for (let i = curPos.y; i <= curPos.y + 1 && i < 8; i++) {
				// ignore self
				if (curPos.y == i) continue;

				let blockingPiece = this.board.getPieceOnPosition({ x: curPos.x, y: i })

				if (blockingPiece) {
					isBlocked = true;
					if (blockingPiece.color != this.color)
						movablePosArr.push({ x: curPos.x, y: i, isKillingMove: true, killTarget: blockingPiece })
					break;
				} else movablePosArr.push({ x: curPos.x, y: i });
			}
		}

		if (this.moveType & CHESS_MOVE_TYPE.KNIGHT) {
			// top
			if (curPos.y - 2 >= 0) {
				if (curPos.x - 1 >= 0) {
					let otherPiece = this.board.getPieceOnPosition({ x: curPos.x - 1, y: curPos.y - 2 })
					if (otherPiece) {
						if (otherPiece.color != this.color)
							movablePosArr.push({ x: curPos.x - 1, y: curPos.y - 2, isKillingMove: true, killTarget: otherPiece })
					}
					else
						movablePosArr.push({ x: curPos.x - 1, y: curPos.y - 2 });
				}

				if (curPos.x + 1 <= 7) {
					let otherPiece = this.board.getPieceOnPosition({ x: curPos.x + 1, y: curPos.y - 2 })
					if (otherPiece) {
						if (otherPiece.color != this.color)
							movablePosArr.push({ x: curPos.x + 1, y: curPos.y - 2, isKillingMove: true, killTarget: otherPiece })
					}
					else
						movablePosArr.push({ x: curPos.x + 1, y: curPos.y - 2 });
				}
			}

			// bottom
			if (curPos.y + 2 <= 7) {
				if (curPos.x - 1 >= 0) {
					let otherPiece = this.board.getPieceOnPosition({ x: curPos.x - 1, y: curPos.y + 2 });
					if (otherPiece) {
						if (otherPiece.color != this.color)
							movablePosArr.push({ x: curPos.x - 1, y: curPos.y + 2, isKillingMove: true, killTarget: otherPiece })
					}
					else
						movablePosArr.push({ x: curPos.x - 1, y: curPos.y + 2 });
				}

				if (curPos.x + 1 <= 7) {
					let otherPiece = this.board.getPieceOnPosition({ x: curPos.x + 1, y: curPos.y + 2 });
					if (otherPiece) {
						if (otherPiece.color != this.color)
							movablePosArr.push({ x: curPos.x + 1, y: curPos.y + 2, isKillingMove: true, killTarget: otherPiece })
					}
					else
						movablePosArr.push({ x: curPos.x + 1, y: curPos.y + 2 });
				}
			}

			// left
			if (curPos.x - 2 >= 0) {
				if (curPos.y - 1 >= 0) {
					let otherPiece = this.board.getPieceOnPosition({ x: curPos.x - 2, y: curPos.y - 1 })
					if (otherPiece) {
						if (otherPiece.color != this.color)
							movablePosArr.push({ x: curPos.x - 2, y: curPos.y - 1, isKillingMove: true, killTarget: otherPiece })
					}
					else
						movablePosArr.push({ x: curPos.x - 2, y: curPos.y - 1 });
				}

				if (curPos.y + 1 <= 7) {
					let otherPiece = this.board.getPieceOnPosition({ x: curPos.x - 2, y: curPos.y + 1 })
					if (otherPiece) {
						if (otherPiece.color != this.color)
							movablePosArr.push({ x: curPos.x - 2, y: curPos.y + 1, isKillingMove: true, killTarget: otherPiece })
					}
					else
						movablePosArr.push({ x: curPos.x - 2, y: curPos.y + 1 });
				}
			}

			// right
			if (curPos.x + 2 <= 7) {
				if (curPos.y - 1 >= 0) {
					let otherPiece = this.board.getPieceOnPosition({ x: curPos.x + 2, y: curPos.y - 1 })
					if (otherPiece) {
						if (otherPiece.color != this.color)
							movablePosArr.push({ x: curPos.x + 2, y: curPos.y - 1, isKillingMove: true, killTarget: otherPiece })
					}
					else
						movablePosArr.push({ x: curPos.x + 2, y: curPos.y - 1 });
				}

				if (curPos.y + 1 <= 7) {
					let otherPiece = this.board.getPieceOnPosition({ x: curPos.x + 2, y: curPos.y + 1 })
					if (otherPiece) {
						if (otherPiece.color != this.color)
							movablePosArr.push({ x: curPos.x + 2, y: curPos.y + 1, isKillingMove: true, killTarget: otherPiece })
					}
					else
						movablePosArr.push({ x: curPos.x + 2, y: curPos.y + 1 });
				}
			}
		}

		// remove duplicates
		// - Convert array to JSON string
		// - Create new Set with JSON string
		// - Convert Set to Array
		// - Parse the JSON string back
		// movablePosArr = Array.from(new Set(movablePosArr.map(JSON.stringify))).map(JSON.parse);

		return movablePosArr;
	}
}
