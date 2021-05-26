/*----------- Game State Data ----------*/

const board = [
    null, null, 37, 47, 57, null, null,
    null, null, 36, 46, 56, null, null,
    15, 25, 35, 45, 55, 65, 75,
    14, 24, 34, null, 54, 64, 74,
    13, 23, 33, 43, 53, 63, 73,
    null, null, 32, 42, 52, null, null,
    null, null, 31, 41, 51, null, null
];
const boardSize = 7;

/*---------- Cached Variables ----------*/

// parses pieceId's and returns the index of that piece's place on the board
let findPiece = function (pieceId) {
    let parsed = parseInt(pieceId);
    return board.indexOf(parsed);
};

// DOM referenes
const cells = document.querySelectorAll("td");
let redsPieces = document.querySelectorAll("p");
let moves = document.querySelectorAll(".moves")[0];
moves.innerHTML = "";

// player properties
let turn = true;
let redScore = 32;
let playerPieces;

// selected piece properties
let selectedPiece = {
    pieceId: -1,
    indexOfBoardPiece: -1,
    allowUp: false,
    allowDown: false,
    allowLeft: false,
    allowRight: false,
    allow: false
    // ,
    // seventhSpace: false,
    // ninthSpace: false,
    // fourteenthSpace: false,
    // eighteenthSpace: false,
    // minusSeventhSpace: false,
    // minusNinthSpace: false,
    // minusFourteenthSpace: false,
    // minusEighteenthSpace: false
};

/*---------- Event Listeners ----------*/

// initialize event listeners on pieces
function givePiecesEventListeners() {
    for (let i = 0; i < redsPieces.length; i++) {
        redsPieces[i].removeAttribute("onclick");
        redsPieces[i].addEventListener("click", getPlayerPieces);
    }
}

/*---------- Logic ----------*/

// holds the length of the players piece count
function getPlayerPieces() {
    playerPieces = redsPieces;
    resetBorders();
}

// resets borders to default
function resetBorders() {
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.border = "1px solid white";
    }
    resetSelectedPieceProperties();
    getSelectedPiece();
}

// resets selected piece properties
function resetSelectedPieceProperties() {
    selectedPiece.pieceId = -1;
    selectedPiece.allow = false;
    selectedPiece.allowUp = false;
    selectedPiece.allowDown = false;
    selectedPiece.allowLeft = false;
    selectedPiece.allowRight = false;
}

// gets ID and index of the board cell its on
function getSelectedPiece() {
    selectedPiece.pieceId = parseInt(event.target.id);
    selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
    getAvailableSpaces();
    givePieceBorder();
}

// gets the moves that the selected piece can make
function getAvailableSpaces() {
    const column = selectedPiece.indexOfBoardPiece % boardSize;
    const row = parseInt(selectedPiece.indexOfBoardPiece / boardSize);

    if (row > 1 &&
        board[selectedPiece.indexOfBoardPiece - 2*boardSize ] === null &&
        board[selectedPiece.indexOfBoardPiece - 1*boardSize ] !== null &&
        cells[selectedPiece.indexOfBoardPiece - 2*boardSize].classList.contains("noPieceHere") !== true) {
        selectedPiece.allowUp = true;
        selectedPiece.allow = true;
    }
    if (row < boardSize-1 &&
        board[selectedPiece.indexOfBoardPiece + 2*boardSize ] === null &&
        board[selectedPiece.indexOfBoardPiece + 1*boardSize ] !== null &&
        cells[selectedPiece.indexOfBoardPiece + 2*boardSize].classList.contains("noPieceHere") !== true) {
        selectedPiece.allowDown = true;
        selectedPiece.allow = true;
    }
    if (column > 1 &&
        board[selectedPiece.indexOfBoardPiece - 2 ] === null &&
        board[selectedPiece.indexOfBoardPiece - 1 ] !== null &&
        cells[selectedPiece.indexOfBoardPiece - 2].classList.contains("noPieceHere") !== true) {
        selectedPiece.allowLeft = true;
        selectedPiece.allow = true;
    }
    if (column < boardSize-1 &&
        board[selectedPiece.indexOfBoardPiece + 2 ] === null &&
        board[selectedPiece.indexOfBoardPiece + 1 ] !== null &&
        cells[selectedPiece.indexOfBoardPiece + 2].classList.contains("noPieceHere") !== true) {
        selectedPiece.allowRight = true;
        selectedPiece.allow = true;
    }
}

// gives the piece a green highlight for the user (showing its movable)
function givePieceBorder() {
    if (selectedPiece.allow) {
        document.getElementById(selectedPiece.pieceId).style.border = "3px solid green";
        giveCellsClick();
    }
}

// gives the cells on the board a 'click' bassed on the possible moves
function giveCellsClick() {
    if (selectedPiece.allowDown) {
        cells[selectedPiece.indexOfBoardPiece + 2*boardSize].setAttribute("onclick", "makeMove("+2*boardSize+")");
    }
    if (selectedPiece.allowUp) {
        cells[selectedPiece.indexOfBoardPiece - 2*boardSize].setAttribute("onclick", "makeMove("+"-"+2*boardSize+")");
    }
    if (selectedPiece.allowRight) {
        cells[selectedPiece.indexOfBoardPiece + 2].setAttribute("onclick", "makeMove("+2+")");
    }
    if (selectedPiece.allowLeft) {
        cells[selectedPiece.indexOfBoardPiece - 2].setAttribute("onclick", "makeMove("+"-2"+")");
    }
}

/* v when the cell is clicked v */

// makes the move that was clicked
function makeMove(number) {
    if (redScore < 32) moves.innerHTML += ", ";
    moves.innerHTML += board[selectedPiece.indexOfBoardPiece];

    document.getElementById(selectedPiece.pieceId).remove();
    document.getElementById(board[selectedPiece.indexOfBoardPiece + number / 2]).remove();
    cells[selectedPiece.indexOfBoardPiece].innerHTML = "";
    cells[selectedPiece.indexOfBoardPiece + number / 2].innerHTML = "";

    cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece" id="${selectedPiece.pieceId}"></p>`;
    redsPieces = document.querySelectorAll("p");

    let indexOfPiece = selectedPiece.indexOfBoardPiece;
    changeData(indexOfPiece, indexOfPiece + number, indexOfPiece + number / 2);
    redScore--;
    removeCellonclick();
    givePiecesEventListeners();
}

// Changes the board states data on the back end
function changeData(indexOfBoardPiece, modifiedIndex, removePiece) {
    board[indexOfBoardPiece] = null;
    board[removePiece] = null;
    board[modifiedIndex] = parseInt(selectedPiece.pieceId);

    resetSelectedPieceProperties();
}

// removes possible moves from old selected piece (* this is needed because the user might re-select a piece *)
function removeCellonclick() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
    }
}

givePiecesEventListeners();