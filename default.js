const board = document.querySelector(".chess-board");

const general = [
  ["br1", "bn1", "bb1", "bq1", "bk0", "bb2", "bn2", "br2"],
  ["bp1", "bp2", "bp3", "bp4", "bp5", "bp6", "bp7", "bp8"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["wp1", "wp2", "wp3", "wp4", "wp5", "wp6", "wp7", "wp8"],
  ["wr1", "wn1", "wb1", "wq1", "wk0", "wb2", "wn2", "wr2"],
];

function importGeneralBoard() {
  for (let i = 0, k = 8; i < 8; i++, k--) {
    // no wo samjha but 2 variables in one
    for (let j = 0; j < 8; j++) {
      // if(general[i][j] == "") continue;
      if (!general[i][j]) continue;
      let color = general[i][j].substring(0, 1); // also one mistake
      let piece = general[i][j].substring(1, 2);
      let count = general[i][j].substring(2, 3);
      let cell = document.querySelector(".r-" + String.fromCharCode(k + 96) + " .f-" + (j + 1));
      if(cell) cell.innerHTML = "Hi";
      console.log(".r-" + String.fromCharCode(k + 96) + " .f-" + (j + 1));
    }
  }
}

importGeneralBoard();
