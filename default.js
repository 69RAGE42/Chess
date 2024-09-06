export const general = [
  ["br1", "bn1", "bb1", "bq1", "bk0", "bb2", "bn2", "br2"],
  ["bp1", "bp2", "bp3", "bp4", "bp5", "bp6", "bp7", "bp8"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["wp1", "wp2", "wp3", "wp4", "wp5", "wp6", "wp7", "wp8"],
  ["wr1", "wn1", "wb1", "wq1", "wk0", "wb2", "wn2", "wr2"],
];

export function renderPiece(rank, file, piece, cell) {
  // broken code for now
  if (cell) {
    let p = document.createElement("img");
    p.src = "./assets/" + piece + ".svg";
    p.className = rank + file;
    p.style.gridArea = "1/2";
    //p.width = p.height = 72;
    cell.appendChild(p);
  }
}

export function initGeneralBoard() {
  for (let i = 0, k = 8; i < 8; i++, k--) {
    for (let j = 0; j < 8; j++) {
      if (!general[i][j]) continue;

      let color = general[i][j].substring(0, 1);
      let piece = general[i][j].substring(1, 2);
      let count = general[i][j].substring(2, 3);

      let cell = document.getElementsByClassName(
        "cell r-" + String.fromCharCode(k + 96) + " f-" + (j + 1)
      )[0];

      renderPiece(
        String.fromCharCode(k + 96),
        j + 1,
        `${color}_${piece}`,
        cell
      );
    }
  }
}
