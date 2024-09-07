import { defaultBoard, CHESS_COLOR, CHESS_PIECE_BLACK } from "./ChessVariables.js";
import { ChessPiece } from "./ChessPiece.js";
import { objIncludes } from "./util.js";

export class ChessBoard {
    constructor() {
        this.positions = [[], [], [], [], [], [], [], []];
        this.pieces = {
            [CHESS_COLOR.WHITE]: [],
            [CHESS_COLOR.BLACK]: [],
        };
    }

    async init() {
        for (let i = 0; i != 8; i++) {
            for (let j = 0; j != 8; j++) {
                let curPiece = defaultBoard[i][j];
                this.positions[i].push(curPiece);

                if (curPiece) {
                    if (objIncludes(CHESS_PIECE_BLACK, curPiece))
                        this.pieces[CHESS_COLOR.BLACK].push(new ChessPiece(this, CHESS_COLOR.BLACK, curPiece, { x: j, y: i, }));
                    else
                        this.pieces[CHESS_COLOR.WHITE].push(new ChessPiece(this, CHESS_COLOR.WHITE, curPiece, { x: j, y: i, }));
                }
            }
        }
    }

    getPieceOnPosition(pos) {
        let piece = null;
        for (let value of Object.values(this.pieces[CHESS_COLOR.BLACK])) {
            if (value.position.x != pos.x || value.position.y != pos.y)
                continue;

            piece = value;
            break;
        }

        for (let value of Object.values(this.pieces[CHESS_COLOR.WHITE])) {
            if (value.position.x != pos.x || value.position.y != pos.y)
                continue;

            piece = value;
            break;
        }
        return piece;
    }
}