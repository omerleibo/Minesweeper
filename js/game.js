'use strict'

const MINE = '💣';
const SMILEY = '😄';
const FLAG = '🚩';
const WIN = '😎';
const LOSE = '🤯';

var gBoard;
var gLevel = { size: 8, mines: 12 };
var gGame;
var gFirstClick = false;
var isOn = true;
var showCount;
var markedCount;
var secsPassed;
var gTimer = document.querySelector('.time p')

function initGame() {

    gFirstClick = false;
    gGame = createGame();
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard);

}
function createGame() {
    return {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
}
function resetBtn() {
    var elBtn = document.querySelector('#resetBtn');
    elBtn.innerText = SMILEY;
    initGame();

}
function btnLevel(size) {
    switch (size) {
        case 4:
            gLevel = { size: 4, mines: 2 };
            break;
        case 8:
            gLevel = { size: 8, mines: 12 };
            break;
        case 12:
            gLevel = { size: 12, mines: 30 };
            break;

    }
    initGame();
}
function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: gLevel.mines,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
        }
    }
    return board;
}
function setMinesNegsCount(board, cellI, cellJ) {
    var minesNegCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) minesNegCount++;
        }
    }
    return minesNegCount;
}

function cellClicked(elCell,i, j) {
    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn) return;
    if (gBoard[i][j].isMarked) return;
    if (!gFirstClick) {
        console.log('first move');
        gFirstClick = true;
        placeRndMines(i, j);
    }

    var value = '';
    if (gBoard[i][j].isMine) {
        elCell.classList.add('mine');
        gameOver();
        return;
    }
    else {
        value = setMinesNegsCount(gBoard, i, j);
        if (value === 0) {
            expandShown(gBoard, i, j);
        }
        else {
            renderCell(i, j, value);
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
        }
        console.log('marked', gGame.markedCount);
        console.log('shown', gGame.shownCount);

        checkGameOver();
    }
}

function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.classList.add('clicked');
    elCell.innerHTML = value;
}

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return;
    if (!gBoard[i][j].isMarked) {
        elCell.innerHTML = FLAG;
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
        if (gBoard[i][j].isMine && gBoard[i][j].isMarked) checkGameOver();
    }
    else {
        elCell.innerHTML = ' ';
        gGame.markedCount--;
        gBoard[i][j].isMarked = false;
    }
}

function checkGameOver() {
    if (gGame.shownCount === (gLevel.size ** 2) - gGame.markedCount) {
        var elBtn = document.querySelector('#resetBtn');
        elBtn.innerText = WIN;
        gGame.isOn = false;
    }
}
function gameOver() {
    var elBtn = document.querySelector('#resetBtn').innerText = LOSE;

    gGame.isOn = false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                renderCell(i, j, MINE);
                gBoard[i][j].minesAroundCount--;

            }
        }
    }
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cellContent = ' ';
            var cell = board[i][j];
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j});return false">${cellContent}</td>`;
        }
        strHTML += '</tr>'
    }
  
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
  }

function expandShown(board, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (!board[i][j].isMine || !board[i][j].isMarked) {
                if (!board[i][j].isShown) {
                    board[i][j].isShown = true;
                    gGame.shownCount++;
                }
                var value = setMinesNegsCount(gBoard, i, j);
                if (value === 0) value = ' ';
                renderCell(i, j, value);

            }
        }
    }
}

function placeRndMines(cellI, cellJ) {

    for (var i = 0; i < gLevel.mines; i++) {
        var rndI = getRandomInt(0, gBoard.length - 1);
        var rndJ = getRandomInt(0, gBoard[0].length - 1);
        var elCell = document.querySelector(`.cell${rndI}-${rndJ}`);
        if (rndI !== cellI && rndJ !== cellJ && !elCell.innerText) {
            gBoard[rndI][rndJ].isMine = true;
            elCell.innerText += 'mine';

        }
        else i -= 1;
    }
}

function setTimer() {
    var currTime = Date.now();
    gTimer.innerText = `${(currTime - gStartTime) / 1000}s`;
}