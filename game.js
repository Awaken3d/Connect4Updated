
angular.module('myApp')
.controller('Ctrl', ['$scope','$rootScope', '$log', '$timeout',
        'gameLogic',  function (
   $scope, $rootScope, $log, $timeout,
   gameLogic) {
    'use strict';

        resizeGameAreaService.setWidthToHeight(1.16667);

    var rowsNum = 6;
    var colsNum = 7;
    dragAndDropService.addDragListener("gameArea", handleDragEvent);
    var draggingLines = document.getElementById("draggingLines");
     var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
     var verticalDraggingLine = document.getElementById("verticalDraggingLine");
     var clickToDragPiece = document.getElementById("clickToDragPiece");
    var canMakeMove = false;
    function sendComputerMove(){
      gameService.makeMove(
        gameLogic.createComputerMove($scope.board, $scope.turnIndex));
      }

      function getIntegersTill(number) {
        var res = [];
        for (var i = 0; i < number; i++) {
          res.push(i);
        }
        return res;
      }

      function updateUI(params) {
        // check if commented: $scope.jsonState = angular.toJson(params.stateAfterMove, true);
        $scope.board = params.stateAfterMove.board;
        $scope.delta = params.stateAfterMove.delta;
        if ($scope.board === undefined) {
          $scope.board = [
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


        $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; //it's my turn
        $scope.turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            $scope.isYourTurn = false;
            $timeout(sendComputerMove, 1100);
          }
        }



        updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

        $scope.cellClicked = function (row, col) {
          $log.info(["Clicked on cell:", row, col]);
          if (!$scope.isYourTurn) {
            return;
          }

          try {
            var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
            $scope.isYourTurn = false; // to prevent making another move

            gameService.makeMove(move);
          } catch (e) {
            $log.info(["wrong move", row, col]);
            return;
          }
        };

        $scope.shouldSlowlyAppear = function (row, col) {
          return $scope.delta !== undefined
          && $scope.delta.row === row && $scope.delta.col === col;
        }
         $scope.shouldShowImage = function (row, col) {
      var cell = $scope.board[row][col];
      return cell !== "";
    };

         $scope.rows = getIntegersTill(rowsNum);
      $scope.cols = getIntegersTill(colsNum);
        $scope.isWhite = function (row, col) {
          if ($scope.board[row][col] === 'B')
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        $scope.isBlack = function (row, col) {
          if ($scope.board[row][col] === 'R')
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        $scope.oddSum = function (row, col){
          if ((row + col) % 2 !== 0)
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        $scope.evenSum = function (row, col){
          if ((row + col) % 2 === 0)
          {
            return true;
          }
          else
          {
            return false;
          }
        }

        $scope.getImageSrc = function (row, col) {
      var cell = $scope.board[row][col];
      return cell === "R" ? "img/red.png"
          : cell === "B" ? "img/blue.png" : "";
        };

        function handleDragEvent(type, clientX, clientY) {
      //if not your turn, dont handle event
      // if (!canMakeMove) {
      //   return;
      // }
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
      verticalDraggingLine.setAttribute("x1", centerXY.x);
      verticalDraggingLine.setAttribute("x2", centerXY.x);
      horizontalDraggingLine.setAttribute("y1", centerXY.y);
      horizontalDraggingLine.setAttribute("y2", centerXY.y);
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
    function getSquareWidthHeight() {
      return {
        width: gameArea.clientWidth / colsNum,
        height: gameArea.clientHeight / rowsNum
      };
    }

    function getSquareTopLeft(row, col) {
      var size = getSquareWidthHeight();
      return {top: row * size.height, left: col * size.width};
    }

    function getSquareCenterXY(row, col) {
      var size = getSquareWidthHeight();
      return {
        x: col * size.width + size.width / 2,
        y: row * size.height + size.height / 2
      };
    }

    function dragDone(row, col) {
      $scope.cellClicked(row, col);
      $rootScope.$apply(function () {
        $log.info("Dragged to " + row + "x" + col);
      });
    }

    $scope.getPreviewSrc = function () {
      return  $scope.turnIndex === 1 ? "img/blue.png" : "img/red.png";
    };

    //window.handleDragEvent = handleDragEvent;

        gameService.setGame({
          gameDeveloperEmail: "purnima.p01@gmail.com",
          minNumberOfPlayers: 2,
          maxNumberOfPlayers: 2,
        //  exampleGame: gameLogic.exampleGame(),
          //riddles: gameLogic.riddles(),
          isMoveOk: gameLogic.isMoveOk,
          updateUI: updateUI
        });
      } ]);
