
/*angular.module('myApp')
.controller('Ctrl', ['$scope','$rootScope', '$log', '$timeout',
        'gameLogic',  function (
   $scope:any, $rootScope:any, $log:any, $timeout:any,
   gameLogic:any) {*/
     module game{
    //'use strict';

        //resizeGameAreaService.setWidthToHeight(1.16667);
    let gameArea: HTMLElement;
    var rowsNum = 6;
    var colsNum = 7;
    //dragAndDropService.addDragListener("gameArea", handleDragEvent);
    var draggingLines:any;
     var horizontalDraggingLine:any;
     var verticalDraggingLine:any;
     //export var clickToDragPiece:HTMLElement = (<HTMLInputElement>document.getElementById("clickToDragPiece"));
     export var clickToDragPiece:HTMLElement;
     export function test(){
        console.log("clicktodrag" + clickToDragPiece);
        return "clicktodrag" + clickToDragPiece;
     }

    var canMakeMove = false;
    //added new variables
    var board:any = undefined;
    var isYourTurn:any;
    var turnIndex:number;
    var delta:any;
    export function init() {
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

    export function sendComputerMove(){
      gameService.makeMove(
        gameLogic.createComputerMove(board, turnIndex));
      }

      export function getIntegersTill(number:any) {
        var res:any = [];
        for (var i = 0; i < number; i++) {
          res.push(i);
        }
        return res;
      }

      export function updateUI(params:any) {
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

         canMakeMove = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn


        isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; //it's my turn
        turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        if (isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            isYourTurn = false;
            $timeout(sendComputerMove, 1100);
          }
        }



        updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

        export let cellClicked = function (row:any, col:any) {
          //$log.info(["Clicked on cell:", row, col]);
          if (!isYourTurn) {
            return;
          }

          try {
            var move = gameLogic.createMove(board, row, col, turnIndex);
            isYourTurn = false; // to prevent making another move

            gameService.makeMove(move);
          } catch (e) {
            //$log.info(["wrong move", row, col]);
            return;
          }
        };

        export let shouldSlowlyAppear = function (row:any, col:any) {
          return delta !== undefined
          && delta.row === row && delta.col === col;
        }
         export let shouldShowImage = function (row:any, col:any) {
      var cell = board[row][col];
      return cell !== "";
    };

        export let rows = getIntegersTill(rowsNum);
      export let cols = getIntegersTill(colsNum);
        export let isWhite = function (row:any, col:any) {
          if (board[row][col] === 'B')
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        export let isBlack = function (row:any, col:any) {
          if (board[row][col] === 'R')
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        export let oddSum = function (row:any, col:any){
          if ((row + col) % 2 !== 0)
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        export let evenSum = function (row:any, col:any){
          if ((row + col) % 2 === 0)
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        export let getImageSrc = function (row:any, col:any) {
      var cell = board[row][col];
      return cell === "R" ? "img/red.png"
          : cell === "B" ? "img/blue.png" : "";
        };

        export function handleDragEvent(type:any, clientX:any, clientY:any) {
      //if not your turn, dont handle event
      // if (!canMakeMove) {
      //   return;
      // }
      clickToDragPiece = document.getElementById("clickToDragPiece");
      gameArea = document.getElementById("gameArea");
      draggingLines = document.getElementById("draggingLines");
      horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
      verticalDraggingLine = document.getElementById("verticalDraggingLine");
      // Center point in gameArea
      var x = clientX - gameArea.offsetLeft;
      var y = clientY - gameArea.offsetTop;
      // Is outside gameArea?
      if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
        clickToDragPiece.style.display = "none";
        draggingLines.style.display = "none";
        return;
      }

      clickToDragPiece.style.display = "inline";
      draggingLines.style.display = "inline";

      // Inside gameArea. Let's find the containing square's row and col
      var col = Math.floor(colsNum * x / gameArea.clientWidth);
      var row = Math.floor(rowsNum * y / gameArea.clientHeight);

      var centerXY = getSquareCenterXY(row, col);
      verticalDraggingLine.setAttribute("x1", ""+centerXY.x);
      verticalDraggingLine.setAttribute("x2", ""+centerXY.x);
      horizontalDraggingLine.setAttribute("y1", ""+centerXY.y);
      horizontalDraggingLine.setAttribute("y2", ""+centerXY.y);
      var topLeft = getSquareTopLeft(row, col);
      clickToDragPiece.style.left = topLeft.left + "px";
      clickToDragPiece.style.top = topLeft.top + "px";

      if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
        // drag ended
        clickToDragPiece.style.display = "none";
        draggingLines.style.display = "none";
        dragDone(row, col);
      }
    }
    export function getSquareWidthHeight() {
      return {
        width: gameArea.clientWidth / colsNum,
        height: gameArea.clientHeight / rowsNum
      };
    }

    export function getSquareTopLeft(row:any, col:any) {
      var size = getSquareWidthHeight();
      return {top: row * size.height, left: col * size.width};
    }

    export function getSquareCenterXY(row:any, col:any) {
      var size = getSquareWidthHeight();
      return {
        x: col * size.width + size.width / 2,
        y: row * size.height + size.height / 2
      };
    }

  export function dragDone(row:any, col:any) {
      cellClicked(row, col);
      $rootScope.$apply(function () {
        //$log.info("Dragged to " + row + "x" + col);
      });
    }

    export let getPreviewSrc = function () {
      return  turnIndex === 1 ? "img/blue.png" : "img/red.png";
    };
}
    //window.handleDragEvent = handleDragEvent;
    angular.module('myApp')
    .run(function() {
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
        translate.setLanguage('en',{
        "RULES_OF_CONNECT4":"Rules of Connect4",
        "RULES_SLIDE1":"Each player drops a disc of their color down a column. The disc can fall only on the lowest available spot in the column",
        "RULES_SLIDE2":"The objective of the game is to connect four of one's own discs of the same color next to each other vertically, horizontally, or diagonally before your opponent",
        "CLOSE":"Close"
  });
  game.init();
});
