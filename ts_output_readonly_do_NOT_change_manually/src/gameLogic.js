//var h=6;//Rows
//var w=7;//Columns
//'use strict';
//angular.module('myApp',['ngTouch', 'ui.bootstrap', 'gameServices']).factory('gameLogic', function() {
var gameLogic;
(function (gameLogic) {
    var h = 6; //Rows
    var w = 7; //Columns
    function isEqual(object1, object2) {
        //console.log(JSON.stringify(object1));
        //console.log(JSON.stringify(object2));
        return angular.equals(object1, object2);
    }
    gameLogic.isEqual = isEqual;
    function copyObject(object) {
        return angular.copy(object);
    }
    gameLogic.copyObject = copyObject;
    /** Return the winner (either 'R' or 'B') or '' if there is no winner. */
    function getWinner(board) {
        var count = 0;
        function p(y, x) {
            return (y < 0 || x < 0 || y >= h || x >= w) ? 0 : board[y][x];
        }
        //loops through rows, columns, diagonals, etc
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                if (p(y, x) !== 0 && p(y, x) !== '' && p(y, x) === p(y, x + 1) && p(y, x) === p(y, x + 2) && p(y, x) === p(y, x + 3)) {
                    return p(y, x);
                }
            }
        }
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                if (p(y, x) !== 0 && p(y, x) !== '' && p(y, x) === p(y + 1, x) && p(y, x) === p(y + 2, x) && p(y, x) === p(y + 3, x)) {
                    return p(y, x);
                }
            }
        }
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                for (var d = -1; d <= 1; d += 2) {
                    if (p(y, x) !== 0 && p(y, x) !== '' && p(y, x) === p(y + 1 * d, x + 1) && p(y, x) === p(y + 2 * d, x + 2) && p(y, x) === p(y + 3 * d, x + 3)) {
                        return p(y, x);
                    }
                }
            }
        }
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                if (p(y, x) === '') {
                    return '';
                }
            }
        }
    }
    gameLogic.getWinner = getWinner;
    function isTie(board) {
        var i, j;
        for (i = 0; i < 5; i++) {
            for (j = 0; j < 6; j++) {
                if (board[i][j] === '') {
                    // If there is an empty cell then we do not have a tie.
                    return false;
                }
            }
        }
        // No empty cells --> tie!
        return true;
    }
    gameLogic.isTie = isTie;
    function getInitialBoard() {
        return [['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '']];
    }
    gameLogic.getInitialBoard = getInitialBoard;
    function createComputerMove(board, turnIndexBeforeMove) {
        var possibleMoves = [];
        var i, j;
        for (i = 0; i < 6; i++) {
            for (j = 0; j < 7; j++) {
                try {
                    possibleMoves.push(createMove(board, i, j, turnIndexBeforeMove));
                }
                catch (e) {
                }
            }
        }
        var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return randomMove;
    }
    gameLogic.createComputerMove = createComputerMove;
    function createMove(board, row, col, turnIndexBeforeMove) {
        if (board === undefined) {
            // Initially (at the beginning of the match), the board in state is undefined.
            board = [['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '']];
        }
        if (board[row][col] !== '') {
            throw new Error("One can only make a move in an empty position!");
        }
        var count1 = 0;
        for (var i = 5; i >= 0; i--) {
            if (board[i][col] === '') {
                count1++;
            }
        }
        if (row !== count1 - 1) {
            throw new Error("One can only make a move in an correct position!");
            ;
        }
        var boardAfterMove = copyObject(board);
        boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'R' : 'B';
        var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (winner !== '' || isTie(board)) {
            // Game over.
            firstOperation = { endMatch: { endMatchScores: (winner === 'R' ? [1, 0] : (winner === 'B' ? [0, 1] : [0, 0])) } };
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
        }
        return [firstOperation,
            { set: { key: 'board', value: boardAfterMove } },
            { set: { key: 'delta', value: { row: row, col: col } } }];
    }
    gameLogic.createMove = createMove;
    /** Returns an array of {stateBeforeMove, move, comment}. */
    function getExampleMoves(initialTurnIndex, initialState, arrayOfRowColComment) {
        var exampleMoves = [];
        var state = initialState;
        var turnIndex = initialTurnIndex;
        for (var i = 0; i < arrayOfRowColComment.length; i++) {
            var rowColComment = arrayOfRowColComment[i];
            var move = createMove(state.board, rowColComment.row, rowColComment.col, turnIndex);
            exampleMoves.push({
                stateBeforeMove: state,
                turnIndexBeforeMove: turnIndex,
                move: move,
                comment: { en: rowColComment.comment } });
            state = { board: move[1].set.value, delta: move[2].set.value };
            turnIndex = 1 - turnIndex;
        }
        return exampleMoves;
    }
    gameLogic.getExampleMoves = getExampleMoves;
    function getRiddles() {
        return [
            getExampleMoves(0, {
                board: [['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['', '', 'B', '', '', '', ''],
                    ['B', 'R', 'B', '', '', '', ''],
                    ['B', 'B', 'R', '', '', '', ''],
                    ['R', 'B', 'R', 'R', '', '', '']],
                delta: { row: 3, col: 0 }
            }, [
                { row: 5, col: 3, comment: "Find the position for R where he could win in his next turn by having a diagonal " },
                { row: 2, col: 2, comment: "B played here" },
                { row: 2, col: 0, comment: "R wins by placing here having 4 diagonal elements ." }
            ]),
            getExampleMoves(1, {
                board: [['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['', '', 'B', '', '', '', ''],
                    ['', 'R', 'B', '', '', '', ''],
                    ['', 'R', 'B', '', '', '', ''],
                    ['R', 'B', 'R', '', '', '', '']],
                delta: { row: 4, col: 1 }
            }, [
                { row: 2, col: 2, comment: "B places here to make a vertical 4" },
                { row: 3, col: 1, comment: "R places  to have 4 in a row in subsequent moves" },
                { row: 1, col: 2, comment: "B wins by having 4 in a row!" }
            ])
        ];
    }
    gameLogic.getRiddles = getRiddles;
    function getExampleGame() {
        return getExampleMoves(0, {}, [
            { row: 5, col: 4, comment: "The classic opening is to put R in the middle" },
            { row: 5, col: 3, comment: "Place B adjacent to R" },
            { row: 5, col: 5, comment: "Place R next to original R" },
            { row: 5, col: 2, comment: "Place B to adjacent to the first one" },
            { row: 4, col: 5, comment: "Place R on top of 1 R" },
            { row: 3, col: 3, comment: "Place R on top of yellow to prevent from reaching 4" },
            { row: 4, col: 2, comment: "Place B on top of another B." },
            { row: 3, col: 2, comment: "place R on top of that as well" },
            { row: 5, col: 1, comment: "Place B here to create a 4 next time" },
            { row: 5, col: 0, comment: "R blocks from B to create a 4" },
            { row: 4, col: 1, comment: "Place B here to create a 4 next time " },
            { row: 4, col: 0, comment: "R blocks this as well to prevent B to create a 4" },
            { row: 3, col: 1, comment: "Place B here to create a vertical 4 next time" },
            { row: 2, col: 1, comment: "R prevents it by placing R on top of B" },
            { row: 3, col: 5, comment: "Place B on top of R here" },
            { row: 4, col: 4, comment: "R places here" },
            { row: 5, col: 6, comment: "Place B here" },
            { row: 2, col: 1, comment: "R wins by creating a diagonal  " },
        ]);
    }
    gameLogic.getExampleGame = getExampleGame;
    function isMoveOk(params) {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;
        try {
            // Example move:
            // [{setTurn: {turnIndex : 1},
            //  {set: {key: 'board', value: [['X', '', ''], ['', '', ''], ['', '', '']]}},
            //  {set: {key: 'delta', value: {row: 0, col: 0}}}]
            var deltaValue = move[2].set.value;
            var row = deltaValue.row;
            var col = deltaValue.col;
            var board = stateBeforeMove.board;
            if (board === undefined) {
                // Initially (at the beginning of the match), stateBeforeMove is {}.
                board = [['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '']];
            }
            // One can only make a move in an empty position
            if (board[row][col] !== '') {
                return false;
            }
            var count1 = 0;
            for (var i = 5; i >= 0; i--) {
                if (board[i][col] === '') {
                    count1++;
                }
            }
            if (row !== count1 - 1) {
                return false;
            }
            var expectedMove = createMove(board, row, col, turnIndexBeforeMove);
            if (!isEqual(move, expectedMove)) {
                return false;
            }
        }
        catch (e) {
            // if there are any exceptions then the move is illegal
            return false;
        }
        return true;
    }
    gameLogic.isMoveOk = isMoveOk;
})(gameLogic || (gameLogic = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices']).factory('gameLogic', function () {
    return {
        isMoveOk: gameLogic.isMoveOk,
        getExampleGame: gameLogic.getExampleGame,
        getRiddles: gameLogic.getRiddles,
        getInitialBoard: gameLogic.getInitialBoard,
        createMove: gameLogic.createMove,
        createComputerMove: gameLogic.createComputerMove
    };
});
