 function Player(name){
  this.name = name;
}

function TicTacToe(name1,name2) {
  this.player1 = new Player(name1);
  this.player2 = new Player(name2);
  
  this.reset();
  this.board.initialize();
  this.computerPlay();
}


TicTacToe.prototype.message = function(message){
  $('#messageContainer').empty();
  $('#messageContainer').append("<p>" + message +"</p>");
}

TicTacToe.prototype.reset = function () {
  this.currentPlayer = this.player1;
  this.board = new Board();
  this.board.update();
  $('#messageContainer').empty();
  this.computerPlay();
}

TicTacToe.prototype.print = function () {
  this.board.update();

  if(this.board.winner() === undefined){
    this.message("It's " + this.currentPlayer.name +"'s turn!");
  }  
}

TicTacToe.prototype.switchCurrentPlayer = function () {
  this.currentPlayer === this.player1 ? this.currentPlayer = this.player2 : this.currentPlayer = this.player1;
}

TicTacToe.prototype.currentChar = function () {
  var char = ''
  this.currentPlayer === this.player1 ? char = 'X' : char = 'O';
  return char;
}

TicTacToe.prototype.play = function (position) {
  var hasWinner = this.board.winner();
  if(hasWinner === undefined){
    var legal = this.board.play(this.currentChar(),position);
    if(legal === undefined){
      return;
    }
    hasWinner = this.board.winner();
    if(hasWinner === undefined){
      this.switchCurrentPlayer();
      this.print();
      this.computerPlay();
      this.print();
    }else{
      this.board.update();
      this.message(this.detrmineWinner(hasWinner));
    }
  }
  else{    
    this.message(this.detrmineWinner(hasWinner))
  }
}

TicTacToe.prototype.detrmineWinner = function(hasWinner){
  if(hasWinner === 'X'){
    winner = this.player1.name;
  }else if(hasWinner === 'O'){
    winner = this.player2.name;
  }else if(hasWinner === 'tie'){
    return 'The game ended with a tie';
  }
  return "The winner is " + winner;
}

function Board () {
  this.board = [["e", "e", "e"],
                ["e", "e", "e"],
                ["e", "e", "e"]];
}

// As a harder challenge, write the board in HTML and use jQuery for user input.
//
Board.prototype.print = function () {
  for(i = 0; i < this.board.length; i++){
    var line = '';
    for(j = 0; j < this.board[i].length; j++){
      line += this.board[i][j];
    }
  }
};

// TODO: This is the second-hardest function in this game. If you want to
// challenge yourself, delete the code and see if you can write it yourself.
//
// Given a character ("X" or "O") and position 1 to 9, set board to new state.
// Print out warning messages for invalid characters, positions, and
// already-played positions.
Board.prototype.play = function (char, position) {
  if (char !== "X" && char != "O") {
    this.message("Invalid character. Try again.");
    return;
  }

  if (position < 1 || position > 9) {
    this.message("Positions must be from 1 to 9. Try again.");
    return;
  }

  var row = Math.floor((position - 1) / 3);
  var col = (position - 1) % 3;

  var currentChar = this.board[row][col];
  if (currentChar === "X" || currentChar === "O") {
    this.message("Position has already been played. Try again.");
    return;
  }

  this.board[row][col] = char;

  return 'legal';
};

// TODO: This is the hardest function in this game. If you want to challenge
// yourself, delete the code and see if you can write it yourself. There are
// several ways of writing this function.
//
// Returns "X" or "O" if one of the players have won.
// Returns "tie" if the game is done with no winner.
// Return undefined if the game is still in progress.
Board.prototype.winner = function () {
  var playerChars = ["X", "O"];
  var numTurns = 0;

  for (var numPlayers = 0; numPlayers < 2; numPlayers++) {
    var char = playerChars[numPlayers];

    // Check if player won horizontally or vertically
    for (var r = 0; r < 3; r++) {
      var horizontalCount = 0;
      var verticalCount = 0;

      for (var c = 0; c < 3; c++) {

        if (this.board[r][c] == char) {
          horizontalCount += 1;
          numTurns += 1;
        }

        if (this.board[c][r] == char) {
          verticalCount += 1;
        }
      }

      if (horizontalCount == 3 || verticalCount == 3) {
        return char;
      }
    }

    // Check if players won diagonally
    var count1 = 0;
    var count2 = 0;
    for (var i = 0; i < 3; i++) {
      if (this.board[i][i] == char) {
        count1 += 1
      }

      if (this.board[i][2-i] === char) {
        count2 += 1
      }
    }
    if (count1 == 3 || count2 === 3) {
      return char;
    }
  }

  if (numTurns == 9) {
    return "tie";
  } else {
    return;
  }
};

Board.prototype.initialize = function(){
  for(i = 0;i < this.board.length; i++){
    $('#board').append('<div class="row margin"></div>');
    for(j = 0;j < this.board[i].length; j++){
      $($('#board').children('.row').get(i)).append('<div class="white tile" id="' +  i + '-' + j + '"></div>');      
    }     
  }
}

Board.prototype.update = function(){
    for(i = 0; i < this.board.length; i++){
      for(j = 0; j < this.board[i].length; j++){
        var piece = this.board[i][j];
        tile = '#' + i + '-' + j;
        switch(piece){
          case 'X':
            $(tile).append('<i class="fa fa-times fa-5x"></i>');
            break;
          case 'O':
            $(tile).append('<i class="fa fa-circle-o fa-5x"></i>');
            break;
          default:
            $(tile).empty();
            break;
        }
      }
    }   
}

Board.prototype.canWinInOne = function(char){
  var arr = [];
  arr = this.board.map(function(obj){return obj.map(function(obj1){return obj1;});});
  var checkArr = arr.map(function(obj){return obj.map(function(obj1){return obj1;});});
  var tempBoard = new Board();
  var indexes = [];
  for(i = 0; i < arr.length; i++){
    var idx = arr[i].indexOf('e');
    while(idx != -1){
      indexes.push({y:i,x:idx});
      idx = arr[i].indexOf('e', idx + 1);
    }
  }
  for(j = 0; j < indexes.length; j++){
    checkArr[indexes[j].y][indexes[j].x] = char;
    tempBoard.board = checkArr.map(function(obj){return obj.map(function(obj1){return obj1;});});
    // console.log(tempBoard.board);
    // debugger;
    var hasWinner = tempBoard.winner();
    if(hasWinner !== undefined){
      return true;
    }

    checkArr = arr.map(function(obj){return obj.map(function(obj1){return obj1;});});
  }
  return false;
}

Board.prototype.canWinInTwo = function(char){
  chars = ["X","O"];
  if(char !== chars[0]){
    chars.reverse();
  }
  var arr = [];
  arr = this.board.map(function(obj){return obj.map(function(obj1){return obj1;});});
  var checkArr = arr.map(function(obj){return obj.map(function(obj1){return obj1;});});
  var tempBoard = new Board();
  var indexes = [];
  for(i = 0; i < arr.length; i++){
    var idx = arr[i].indexOf('e');
    while(idx != -1){
      indexes.push({y:i,x:idx});
      idx = arr[i].indexOf('e', idx + 1);
    }
  }
  for(m = 0; m < indexes.length; m++){
    checkArr[indexes[m].y][indexes[m].x] = chars[0];
    var checkArr2 = checkArr.map(function(obj){return obj.map(function(obj1){return obj1;});});
    var tempIndexes = indexes.slice();
    tempIndexes.splice(m,1);
    for(j = 0; j < tempIndexes.length; j++){
      checkArr2[tempIndexes[j].y][tempIndexes[j].x] = chars[1];
      tempBoard.board = checkArr2.map(function(obj){return obj.map(function(obj1){return obj1;});});
      var ans = tempBoard.canWinInOne(chars[0]);
      if(ans){
        return true;
      }
      checkArr2 = checkArr.map(function(obj){return obj.map(function(obj1){return obj1;});});
      // debugger
    }
    var checkArr = arr.map(function(obj){return obj.map(function(obj1){return obj1;});});
    // debugger
  }

  return false;
}

Board.prototype.message = function(message){
  $('#messageContainer').empty();
  $('#messageContainer').append("<p>" + message +"</p>");
}

Board.prototype.chooseMove = function(boardState , currentChar, depth){
  var indexes = [];
  depth++;
  if(depth === 6){
    return;
  }
  var arr = boardState.map(function(obj){return obj.map(function(obj1){return obj1;});});
  var checkArr = arr.map(function(obj){return obj.map(function(obj1){return obj1;});});;
  var chars = ['X','O'];
  if(currentChar === chars[0]){
    var nextChar = chars[1];
  }else{
    var nextChar = chars[0];
  }
  var tempBoard = new Board();
  var scoreBoard = [];
  var score = 0;
  for(var i = 0; i < arr.length; i++){
    var idx = arr[i].indexOf('e');
    while(idx != -1){
      indexes.push({y:i,x:idx});
      idx = arr[i].indexOf('e', idx + 1);
    }
  }
  for(var j = 0; j < indexes.length; j++){
    checkArr[indexes[j].y][indexes[j].x] = currentChar;
    tempBoard.board = checkArr.map(function(obj){return obj.map(function(obj1){return obj1;});});;
    var hasWinner = tempBoard.winner();
    if(hasWinner === chars[0]){
      scoreBoard.push(10 - depth);
    }else if(hasWinner === chars[1]){
      scoreBoard.push(depth - 10);
    }else if(hasWinner === 'tie'){
      scoreBoard.push(0);
    }else{
      scoreBoard.push(this.chooseMove(tempBoard.board,nextChar,depth));
    }
    checkArr = arr.map(function(obj){return obj.map(function(obj1){return obj1;});});;
  } 
  if(depth !== 1){
    var biggestIndex = 0;
    var biggestNum = -100;
    var lowestNum = 100;
    for(var l = 0; l < scoreBoard.length; l++){
      if(scoreBoard[l] > biggestNum){
      biggestNum = scoreBoard[l];
      biggestIndex = l;
      }
      if(lowestNum > scoreBoard[l]){
        lowestNum = scoreBoard[l];
      }
    }
    if(currentChar === chars[0]){
      return biggestNum;
    }else{
      return lowestNum;
    }
  }else{
    var biggestIndex = 0;
    var biggestNum = -100;
    for(var l = 0; l < scoreBoard.length; l++){
      if(scoreBoard[l] > biggestNum){
        biggestNum = scoreBoard[l];
        biggestIndex = l;
      }
    }
    return move(indexes[biggestIndex]);
  }
}

TicTacToe.prototype.computerPlay = function(){
  var counter = 0;
  while(this.currentPlayer === this.player1 && this.board.winner() === undefined){
    // var rand = Math.floor(Math.random() * (10 - 1)) + 1;
    // console.log(rand);
    // this.play(rand);
    this.play(this.board.chooseMove(this.board.board,this.currentChar(),0));
    counter++
    if(counter > 100){
      break;
    }
  }
  this.print();
}

game = new TicTacToe("Computer", "Player");

$('#board').on('click', '.tile', function(){
  var str = $(this).attr('id');
  var num = 0;
  switch(str){
    case '0-0':
      num = 1;
      break;
    case '0-1':
      num = 2;
      break;
    case '0-2':
      num = 3;
      break;
    case '1-0':
      num = 4;
      break;
    case '1-1':
      num = 5;
      break;
    case '1-2':
      num = 6;
      break;
    case '2-0':
      num = 7;
      break;
    case '2-1':
      num = 8;
      break;
    case '2-2':
      num = 9;
      break;
  }
  game.play(num);
});

$('#reset').on('click', function(){
  game.reset();
})

$('#canWin1').on('click', function(){
  var arr = game.board.board;
  var char = game.currentChar();
  var ans = game.board.canWinInOne(char);
  if(ans){
    game.message('Can win in This Turn');
  }else{
    game.message("Can't win in This Turn");
  }
  game.board.update();
})

$('#canWin2').on('click', function(){
  var arr = game.board.board;
  var char = game.currentChar();
  var ans = game.board.canWinInTwo(char);
  if(ans){
    game.message('Can win in Two turns');
  }else{
    game.message("Can't win in Two turns");
  }
  game.board.update();
})








function move(index){
  y = index.y;
  x = index.x;
  switch(y){
    case 0:
      switch(x){
        case 0:
          return 1;
          break;
        case 1:
          return 2;
          break;
        case 2:
          return 3
          break;
      }
      break;
    case 1:
      switch(x){
        case 0:
          return 4;
          break;
        case 1:
          return 5;
          break;
        case 2:
          return 6;
          break;
      }
      break;
    case 2:
      switch(x){
        case 0:
          return 7;
          break;
        case 1:
          return 8;
          break;
        case 2:
          return 9;
          break;
      }
      break;
  }
}



