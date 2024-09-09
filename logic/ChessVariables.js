export const defaultBoard = [
	["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
	["♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎"],
	// ["", "♟︎", "", "♟︎", "", "♟︎", "", "♟︎"],
	["", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	// ["", "", "", "", "", "", "", ""],
	// ["♙", "", "♙", "", "♙", "", "♙", ""],
	["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
	["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

export const CHESS_PIECE_BLACK = {
	KNIGHT: "♞",
	ROOK: "♜",
	BISHOP: "♝",
	QUEEN: "♛",
	KING: "♚",
	PAWN: "♟︎"
};

export const CHESS_PIECE_WHITE = {
	ROOK: "♖",
	KNIGHT: "♘",
	BISHOP: "♗",
	QUEEN: "♕",
	KING: "♔",
	PAWN: "♙"
};

export const CHESS_COLOR = {
	WHITE: "white",
	BLACK: "black"
};

export const CHESS_MOVE_TYPE = {
	DEFAULT: 0,

	STRAIGHT: 1 << 0,
	DIAGONAL: 1 << 1,
	KING: 1 << 2,
	KNIGHT: 1 << 3,
	PAWN: 1 << 4
};

export const CHESS_PIECE_UNICODE = {
	WHITE_KING: 9812,
	BLACK_KING: 9818,

	WHITE_QUEEN: 9813,
	BLACK_QUEEN: 9819,

	WHITE_ROOK: 9814,
	BLACK_ROOK: 9820,

	WHITE_BISHOP: 9815,
	BLACK_BISHOP: 9821,

	WHITE_KNIGHT: 9816,
	BLACK_KNIGHT: 9822,

	WHITE_PAWN: 9817,
	BLACK_PAWN: 9823
}
