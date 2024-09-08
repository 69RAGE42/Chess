import { CHESS_PIECE_BLACK, CHESS_PIECE_WHITE, CHESS_MOVE_TYPE } from "./ChessVariables.js";

export class ChessPiece {
    constructor(board, color, type, pos) {
        this.board = board;
        this.color = color;
        this.type = type;
        this.position = { x: pos.x, y: pos.y };

        if (this.isPawn())
            this.pawnInitialMove = true;

        this.moveType = CHESS_MOVE_TYPE.DEFAULT
        this.setupMoveType();
    }

    setupMoveType() {
        if (this.isRook())
            this.moveType = CHESS_MOVE_TYPE.STRAIGHT

        if (this.isBishop())
            this.moveType = CHESS_MOVE_TYPE.DIAGONAL

        if (this.isKnight())
            this.moveType = CHESS_MOVE_TYPE.KNIGHT

        if (this.isKing())
            this.moveType = CHESS_MOVE_TYPE.KING

        if (this.isPawn())
            this.moveType = CHESS_MOVE_TYPE.PAWN

        if (this.isQueen())
            this.moveType = CHESS_MOVE_TYPE.STRAIGHT | CHESS_MOVE_TYPE.DIAGONAL
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
        let movablePosArr = []
        let curPos = this.position;
        let isBlocked = false;

        if (this.moveType & CHESS_MOVE_TYPE.PAWN) {
            let pawnNumPos = this.pawnInitialMove ? 1 : 0;

            // special case, pawns can move diagonally if there's an enemy piece
            if (curPos.x - 1 >= 0 && curPos.x + 1 <= 7) {
                let piece = this.board.getPieceOnPosition({ x: curPos.x - 1, y: curPos.y + 1 })
                if (piece && piece.color != this.color)
                    movablePosArr.push({ x: curPos.x - 1, y: curPos.y + 1 })

                piece = this.board.getPieceOnPosition({ x: curPos.x + 1, y: curPos.y + 1 })
                if (piece && piece.color != this.color)
                    movablePosArr.push({ x: curPos.x + 1, y: curPos.y + 1 })
            }

            // get moves on y axis (ranks)
            for (let i = curPos.y; i != curPos.y + 2 + pawnNumPos; i++) {

                // ignore self
                if (curPos.y == i)
                    continue;

                if (this.board.getPieceOnPosition({ x: curPos.x, y: i })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: curPos.x, y: i })
            }
        }

        if (this.moveType & CHESS_MOVE_TYPE.STRAIGHT) {

            // get moves on x axis (files)
            for (let i = curPos.x; i != 0; i--) {

                // ignore self
                if (curPos.x == i)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: curPos.y })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: curPos.y })
            }

            isBlocked = false;

            for (let i = curPos.x; i != 8; i++) {

                // ignore self
                if (curPos.x == i)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: curPos.y })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: curPos.y })
            }

            isBlocked = false;

            // get moves on y axis (ranks)
            for (let i = curPos.y; i != 0; i--) {

                // ignore self
                if (curPos.y == i)
                    continue;

                if (this.board.getPieceOnPosition({ x: curPos.x, y: i })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: curPos.x, y: i })
            }

            isBlocked = false;


            for (let i = curPos.y; i != 8; i++) {

                // ignore self
                if (curPos.y == i)
                    continue;

                if (this.board.getPieceOnPosition({ x: curPos.x, y: i })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: curPos.x, y: i })
            }
        }

        if (this.moveType & CHESS_MOVE_TYPE.DIAGONAL) {

            for (let i = curPos.x, j = curPos.y; i > 1 && j > 1; i--, j--) {

                // ignore self
                if (curPos.x == i && curPos.y == j)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: j })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: j })
            }

            isBlocked = false;

            for (let i = curPos.x, j = curPos.y; i <= curPos.x + curPos.y || j > 1; i++, j--) {

                // ignore self
                if (curPos.x == i && curPos.y == j)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: j })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: j })
            }

            isBlocked = false;

            for (let i = curPos.x, j = curPos.y; i > 1 || j <= curPos.x + curPos.y; i--, j++) {

                // ignore self
                if (curPos.x == i && curPos.y == j)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: j })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: j })
            }

            isBlocked = false;

            for (let i = curPos.x, j = curPos.y; i < 8 && j < 8; i++, j++) {

                // ignore self
                if (curPos.x == i && curPos.y == j)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: j })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: j })
            }
        }

        if (this.moveType & CHESS_MOVE_TYPE.AROUND) {
            for (let i = curPos.x, j = curPos.y; i > 1 && j > 1 && i >= curPos.x - 1 && j >= curPos.y - 1; i--, j--) {

                // ignore self
                if (curPos.x == i && curPos.y == j)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: j })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: j })
            }

            isBlocked = false;

            for (let i = curPos.x, j = curPos.y; (i <= curPos.x + 1 || j >= curPos.y + 1) && i < 8 && j > 1; i++, j--) {

                // ignore self
                if (curPos.x == i && curPos.y == j)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: j })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: j })
            }

            isBlocked = false;

            for (let i = curPos.x, j = curPos.y; (i >= curPos.x + 1 || j <= curPos.y + 1) && i > 1 && j < 8; i--, j++) {

                // ignore self
                if (curPos.x == i && curPos.y == j)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: j })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: j })
            }

            isBlocked = false;

            for (let i = curPos.x, j = curPos.y; (i <= curPos.x + 1 || j <= curPos.y + 1) && i < 8 && j < 8; i++, j++) {

                // ignore self
                if (curPos.x == i && curPos.y == j)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: j })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: j })
            }

            // get moves on x axis (files)
            for (let i = curPos.x; i >= curPos.x - 1 && i > 1; i--) {

                // ignore self
                if (curPos.x == i)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: curPos.y })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: curPos.y })
            }

            isBlocked = false;

            for (let i = curPos.x; i <= curPos.i + 1 && i < 8; i++) {

                // ignore self
                if (curPos.x == i)
                    continue;

                if (this.board.getPieceOnPosition({ x: i, y: curPos.y })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: i, y: curPos.y })
            }

            isBlocked = false;

            // get moves on y axis (ranks)
            for (let i = curPos.y; i >= curPos.y - 1 && i > 1; i--) {

                // ignore self
                if (curPos.y == i)
                    continue;

                if (this.board.getPieceOnPosition({ x: curPos.x, y: i })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: curPos.x, y: i })
            }

            isBlocked = false;


            for (let i = curPos.y; i <= curPos.y + 1 && i < 8; i++) {

                // ignore self
                if (curPos.y == i)
                    continue;

                if (this.board.getPieceOnPosition({ x: curPos.x, y: i })) {
                    isBlocked = true;
                    break;
                }
                else
                    movablePosArr.push({ x: curPos.x, y: i })
            }
        }

        if (this.moveType & CHESS_MOVE_TYPE.KNIGHT) {
            if (curPos.x - 1 >= 0 && curPos.x + 1 <= 7) {
                // top
                if (!this.board.getPieceOnPosition({ x: curPos.x + 1, y: curPos.y - 2 }))
                    movablePosArr.push({ x: curPos.x + 1, y: curPos.y - 2 })

                if (!this.board.getPieceOnPosition({ x: curPos.x - 1, y: curPos.y - 2 }))
                    movablePosArr.push({ x: curPos.x - 1, y: curPos.y - 2 })

                // bottom
                if (!this.board.getPieceOnPosition({ x: curPos.x + 1, y: curPos.y + 2 }))
                    movablePosArr.push({ x: curPos.x + 1, y: curPos.y + 2 })

                if (!this.board.getPieceOnPosition({ x: curPos.x - 1, y: curPos.y + 2 }))
                    movablePosArr.push({ x: curPos.x - 1, y: curPos.y + 2 })
            }

            if (curPos.y - 1 >= 0 && curPos.y + 1 <= 7) {
                // right
                if (!this.board.getPieceOnPosition({ x: curPos.x + 2, y: curPos.y + 1 }))
                    movablePosArr.push({ x: curPos.x + 2, y: curPos.y + 1 })

                if (!this.board.getPieceOnPosition({ x: curPos.x + 2, y: curPos.y - 1 }))
                    movablePosArr.push({ x: curPos.x + 2, y: curPos.y - 1 })

                // left
                if (!this.board.getPieceOnPosition({ x: curPos.x - 2, y: curPos.y + 1 }))
                    movablePosArr.push({ x: curPos.x - 2, y: curPos.y + 1 })

                if (!this.board.getPieceOnPosition({ x: curPos.x - 2, y: curPos.y - 1 }))
                    movablePosArr.push({ x: curPos.x - 2, y: curPos.y - 1 })
            }
        }

        // remove duplicates
        // - Convert array to JSON string
        // - Create new Set with JSON string
        // - Convert Set to Array
        // - Parse the JSON string back
        movablePosArr = Array.from(new Set(movablePosArr.map(JSON.stringify))).map(JSON.parse)

        return movablePosArr
    }
}