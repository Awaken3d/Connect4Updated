/*angular.module('myApp')
.controller('Ctrl', ['$scope','$rootScope', '$log', '$timeout',
        'gameLogic',  function (
   $scope:any, $rootScope:any, $log:any, $timeout:any,
   gameLogic:any) {*/
var game;
(function (game) {
    //'use strict';
    //resizeGameAreaService.setWidthToHeight(1.16667);
    var gameArea;
    var rowsNum = 6;
    var colsNum = 7;
    //dragAndDropService.addDragListener("gameArea", handleDragEvent);
    var draggingLines;
    var horizontalDraggingLine;
    var verticalDraggingLine;
    function test() {
        console.log("clicktodrag" + game.clickToDragPiece);
        return "clicktodrag" + game.clickToDragPiece;
    }
    game.test = test;
    var canMakeMove = false;
    //added new variables
    var board = undefined;
    var isYourTurn;
    var turnIndex;
    var delta;
    function init() {
        resizeGameAreaService.setWidthToHeight(1.16667);
        gameService.setGame({
            gameDeveloperEmail: "purnima.p01@gmail.com",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            //  exampleGame: gameLogic.exampleGame(),
            //riddles: gameLogic.riddles(),
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
    }
    game.init = init;
    function sendComputerMove() {
        gameService.makeMove(gameLogic.createComputerMove(board, turnIndex));
    }
    game.sendComputerMove = sendComputerMove;
    function getIntegersTill(number) {
        var res = [];
        for (var i = 0; i < number; i++) {
            res.push(i);
        }
        return res;
    }
    game.getIntegersTill = getIntegersTill;
    function updateUI(params) {
        // check if commented: $scope.jsonState = angular.toJson(params.stateAfterMove, true);
        board = params.stateAfterMove.board;
        delta = params.stateAfterMove.delta;
        if (board === undefined) {
            board = [
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
            ];
        }
        canMakeMove = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; //it's my turn
        turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        if (isYourTurn
            && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            isYourTurn = false;
            $timeout(sendComputerMove, 1100);
        }
    }
    game.updateUI = updateUI;
    updateUI({ stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2 });
    game.cellClicked = function (row, col) {
        //$log.info(["Clicked on cell:", row, col]);
        if (!isYourTurn) {
            return;
        }
        try {
            var move = gameLogic.createMove(board, row, col, turnIndex);
            isYourTurn = false; // to prevent making another move
            gameService.makeMove(move);
        }
        catch (e) {
            //$log.info(["wrong move", row, col]);
            return;
        }
    };
    game.shouldSlowlyAppear = function (row, col) {
        return delta !== undefined
            && delta.row === row && delta.col === col;
    };
    game.shouldShowImage = function (row, col) {
        var cell = board[row][col];
        return cell !== "";
    };
    game.rows = getIntegersTill(rowsNum);
    game.cols = getIntegersTill(colsNum);
    game.isWhite = function (row, col) {
        if (board[row][col] === 'B') {
            return true;
        }
        else {
            return false;
        }
    };
    game.isBlack = function (row, col) {
        if (board[row][col] === 'R') {
            return true;
        }
        else {
            return false;
        }
    };
    game.oddSum = function (row, col) {
        if ((row + col) % 2 !== 0) {
            return true;
        }
        else {
            return false;
        }
    };
    game.evenSum = function (row, col) {
        if ((row + col) % 2 === 0) {
            return true;
        }
        else {
            return false;
        }
    };
    game.getImageSrc = function (row, col) {
        var cell = board[row][col];
        return cell === "R" ? "img/red.png"
            : cell === "B" ? "img/blue.png" : "";
    };
    function handleDragEvent(type, clientX, clientY) {
        //if not your turn, dont handle event
        // if (!canMakeMove) {
        //   return;
        // }
        game.clickToDragPiece = document.getElementById("clickToDragPiece");
        gameArea = document.getElementById("gameArea");
        draggingLines = document.getElementById("draggingLines");
        horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
        verticalDraggingLine = document.getElementById("verticalDraggingLine");
        // Center point in gameArea
        var x = clientX - gameArea.offsetLeft;
        var y = clientY - gameArea.offsetTop;
        // Is outside gameArea?
        if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
            game.clickToDragPiece.style.display = "none";
            draggingLines.style.display = "none";
            return;
        }
        game.clickToDragPiece.style.display = "inline";
        draggingLines.style.display = "inline";
        // Inside gameArea. Let's find the containing square's row and col
        var col = Math.floor(colsNum * x / gameArea.clientWidth);
        var row = Math.floor(rowsNum * y / gameArea.clientHeight);
        var centerXY = getSquareCenterXY(row, col);
        verticalDraggingLine.setAttribute("x1", "" + centerXY.x);
        verticalDraggingLine.setAttribute("x2", "" + centerXY.x);
        horizontalDraggingLine.setAttribute("y1", "" + centerXY.y);
        horizontalDraggingLine.setAttribute("y2", "" + centerXY.y);
        var topLeft = getSquareTopLeft(row, col);
        game.clickToDragPiece.style.left = topLeft.left + "px";
        game.clickToDragPiece.style.top = topLeft.top + "px";
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
            // drag ended
            game.clickToDragPiece.style.display = "none";
            draggingLines.style.display = "none";
            dragDone(row, col);
        }
    }
    game.handleDragEvent = handleDragEvent;
    function getSquareWidthHeight() {
        return {
            width: gameArea.clientWidth / colsNum,
            height: gameArea.clientHeight / rowsNum
        };
    }
    game.getSquareWidthHeight = getSquareWidthHeight;
    function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return { top: row * size.height, left: col * size.width };
    }
    game.getSquareTopLeft = getSquareTopLeft;
    function getSquareCenterXY(row, col) {
        var size = getSquareWidthHeight();
        return {
            x: col * size.width + size.width / 2,
            y: row * size.height + size.height / 2
        };
    }
    game.getSquareCenterXY = getSquareCenterXY;
    function dragDone(row, col) {
        game.cellClicked(row, col);
        $rootScope.$apply(function () {
            //$log.info("Dragged to " + row + "x" + col);
        });
    }
    game.dragDone = dragDone;
    game.getPreviewSrc = function () {
        return turnIndex === 1 ? "img/blue.png" : "img/red.png";
    };
})(game || (game = {}));
//window.handleDragEvent = handleDragEvent;
angular.module('myApp')
    .run(function () {
    $rootScope['game'] = game;
    /*gameService.setGame({
      gameDeveloperEmail: "purnima.p01@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
    //  exampleGame: gameLogic.exampleGame(),
      //riddles: gameLogic.riddles(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });*/
    translate.setLanguage('en', {
        "RULES_OF_CONNECT4": "Rules of Connect4",
        "RULES_SLIDE1": "Each player drops a disc of their color down a column. The disc can fall only on the lowest available spot in the column",
        "RULES_SLIDE2": "The objective of the game is to connect four of one's own discs of the same color next to each other vertically, horizontally, or diagonally before your opponent",
        "CLOSE": "Close"
    });
    game.init();
});
