import {
    CHESS_PIECE_BLACK,
    CHESS_PIECE_WHITE,
    CHESS_COLOR,
} from "./ChessVariables.js";

class ChessPiece {
    constructor(board, color, type, pos) {
        this.board = board;
        this.color = color;
        this.type = type;
        this.position = { x: pos.x, y: pos.y };

        if (
            this.type == CHESS_PIECE_BLACK.PAWN ||
            this.type == CHESS_PIECE_WHITE.PAWN
        )
            this.pawnInitialMove = true;
    }

    isRook() {
        return this.color == CHESS_COLOR.BLACK
            ? this.type == CHESS_PIECE_BLACK.ROOK
            : this.type == CHESS_PIECE_WHITE.ROOK;
    }

    isKnight() {
        return this.color == CHESS_COLOR.BLACK
            ? this.type == CHESS_PIECE_BLACK.KNIGHT
            : this.type == CHESS_PIECE_WHITE.KNIGHT;
    }

    isBishop() {
        return this.color == CHESS_COLOR.BLACK
            ? this.type == CHESS_PIECE_BLACK.BISHOP
            : this.type == CHESS_PIECE_WHITE.BISHOP;
    }

    isQueen() {
        return this.color == CHESS_COLOR.BLACK
            ? this.type == CHESS_PIECE_BLACK.QUEEN
            : this.type == CHESS_PIECE_WHITE.QUEEN;
    }

    isKing() {
        return this.color == CHESS_COLOR.BLACK
            ? this.type == CHESS_PIECE_BLACK.KING
            : this.type == CHESS_PIECE_WHITE.KING;
    }

    isPawn() {
        return this.color == CHESS_COLOR.BLACK
            ? this.type == CHESS_PIECE_BLACK.PAWN
            : this.type == CHESS_PIECE_WHITE.PAWN;
    }

    getMovablePositions() {
        
    }
}

export { ChessPiece };
