window.onload = init;

function init() {
  include("default.js");
  const board = document.querySelector(".chess-board");

  for (let i = 8; i >= 1; i--) {
    for (let j = 1; j <= 8; j++) {
      var cell = document.createElement("div");
      cell.className = "cell r-" + String.fromCharCode(i + 96) + " f-" + j; // now done yes
      board.appendChild(cell);
    }
  }
}
