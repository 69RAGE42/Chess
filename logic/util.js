import { CHESS_PIECE_BLACK, CHESS_PIECE_UNICODE } from "./ChessVariables.js";

export function objIncludes(obj, element) {
	let res = false;
	for (let value of Object.values(obj)) {
		if (value === element) {
			res = true;
			break;
		}
	}

	return res;
}

export function getChessPieceImage(strPiece) {
	let str = "./assets/chess_pieces/";

	if (objIncludes(CHESS_PIECE_BLACK, strPiece)) str += "b_";
	else str += "w_";

	switch (strPiece.charCodeAt(0)) {
		case CHESS_PIECE_UNICODE.BLACK_KING:
		case CHESS_PIECE_UNICODE.WHITE_KING:
			str += "k";
			break;

		case CHESS_PIECE_UNICODE.BLACK_QUEEN:
		case CHESS_PIECE_UNICODE.WHITE_QUEEN:
			str += "q";
			break;

		case CHESS_PIECE_UNICODE.BLACK_ROOK:
		case CHESS_PIECE_UNICODE.WHITE_ROOK:
			str += "r";
			break;

		case CHESS_PIECE_UNICODE.BLACK_BISHOP:
		case CHESS_PIECE_UNICODE.WHITE_BISHOP:
			str += "b";
			break;

		case CHESS_PIECE_UNICODE.BLACK_KNIGHT:
		case CHESS_PIECE_UNICODE.WHITE_KNIGHT:
			str += "n";
			break;

		case CHESS_PIECE_UNICODE.BLACK_PAWN:
		case CHESS_PIECE_UNICODE.WHITE_PAWN:
			str += "p";
			break;
	}

	str += ".svg";

	return str;
}
