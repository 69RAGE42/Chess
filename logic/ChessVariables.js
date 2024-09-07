export const defaultBoard = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

// this is technically an enum, cannot directly use "enum" keyword because that is typescript only
export const CHESS_PIECE_BLACK = {
    KNIGHT: 	"♞",
    ROOK: 		"♜",
    BISHOP: 	"♝",
    QUEEN: 		"♛",
    KING: 		"♚",
    PAWN: 		"♟︎",
};

export const CHESS_PIECE_WHITE = {
    ROOK: 		"♖",
    KNIGHT: 	"♘",
    BISHOP: 	"♗",
    QUEEN: 		"♕",
    KING: 		"♔",
    PAWN: 		"♙",
};

export const CHESS_COLOR = {
    WHITE: 		"white",
    BLACK: 		"black",
};

export const CHESS_MOVE_TYPE = {
    DEFAULT: 	0,

    STRAIGHT: 	1 << 0,   	// Finished
    DIAGONAL: 	1 << 1,   	// Finished
    AROUND: 	1 << 2,     // Finished
    KNIGHT: 	1 << 3,		// Yet to be worked
    PAWN: 		1 << 4,     // Finished
};