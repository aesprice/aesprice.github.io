function Board(solution, maxSize){
  /** Determine board size based on the dimensions of the available screen space */
  this._boardSize = maxSize;

  this._complete = false;
  this._tiles = [[],[],[],[],[],[],[],[],[]];
  
  this.element = $('<div/>').addClass('board').height(this._boardSize).width(this._boardSize);

  this.init(solution);
}

Board.prototype.init = function(solution){
  this.element.empty();
  this._complete = false;
  this._tiles = [[],[],[],[],[],[],[],[],[]];

  var tileSize = this._boardSize/9;
  
  /** Create a tile for each item in our solution matrix */
  for(var y = 0; y < solution.length; y++){
    var row = $('<div/>').addClass('row');
    this.element.append(row);
    for(var x = 0; x < solution[0].length; x++){
      var hidden = Math.floor(Math.random() * 2) ? true : false;
      var tile = new Tile(solution[y][x], tileSize, hidden);
      this._tiles[y].push(tile);
      row.append(tile.element);
    }
  }

  this.element.change(this.update.bind(this));
};

/** (Re-)Renders the board's results if completed */
Board.prototype.update = function(){
  if(this._complete){
    this.checkCompletion();
    if(!this._complete){
      this.hideResults();
    }else{
      this.showResults();
    }
  }else{
    this.checkCompletion();
    if(this._complete){
      this.showResults();
    }
  }
};

/** Checks to see if any tiles are still empty */
Board.prototype.checkCompletion = function(){
  for(var y = 0; y < this._tiles.length; y++){
    for(var x = 0; x < this._tiles[y].length; x++){
      if(!this._tiles[y][x].isFilled()){
        this._complete = false;
        return;
      }
    }
  }
  this._complete = true;
};

/** Shows whether all input tiles are correct */
Board.prototype.showResults = function(){
  for(var y = 0; y < this._tiles.length; y++){
    for(var x = 0; x < this._tiles[y].length; x++){
      this._tiles[y][x].evaluate();
    }
  }
};

Board.prototype.hideResults = function(){
  for(var y = 0; y < this._tiles.length; y++){
    for(var x = 0; x < this._tiles[y].length; x++){
      this._tiles[y][x].reset();
    }
  }
};

/** Clear all inputs */
Board.prototype.clearTiles = function(){
  for(var y = 0; y < this._tiles.length; y++){
    for(var x = 0; x < this._tiles[y].length; x++){
      this._tiles[y][x].clear();
    }
  }
  this.update();
};

$(document).ready(function(){
  var sampleBoard = [
    [1,3,6,2,5,9,7,4,8],
    [7,2,5,4,1,8,9,3,6],
    [4,8,9,3,6,7,1,5,2],
    [3,6,4,7,8,5,2,1,9],
    [5,1,8,6,9,2,3,7,4],
    [9,7,2,1,3,4,6,8,5],
    [2,4,1,5,7,6,8,9,3],
    [8,5,3,9,2,1,4,6,7],
    [6,9,7,8,4,3,5,2,1]
  ];

  var maxSize;
  if(window.innerHeight <= window.innerWidth){
    maxSize = window.innerHeight * 0.8;
  }else{
    maxSize = window.innerWidth * 0.8;
  }
  var titleFontSize = maxSize * 0.12;
  var buttonFontSize = titleFontSize / 2.5;

  $('.header').width(maxSize).css('margin-bottom', maxSize * 0.03);
  $('.title').css('font-size', titleFontSize);
  $('button').css('font-size', buttonFontSize);


  var board = new Board(sampleBoard, maxSize);
  $('.boardContainer').append(board.element);
  
  $('.new').click(function(){
    board.init(sampleBoard);
  });

  $('.reset').click(function(){
    board.clearTiles();
  });
});

function Tile(number, size, hidden){
  this._tileSize = size;
  this._number = number;
  this._hidden = hidden;
  this._filled = !hidden;

  this.element = $('<div/>').addClass('tile').height(this._tileSize).width(this._tileSize);

  this.init();
}

Tile.prototype.init = function(){
  var fontSize = this._tileSize * 0.7;
  var borderRadius = this._tileSize / 4;
  
  /** Hidden tiles get input elements, others just get text */
  var text;
  if(this._hidden){
    text = $('<input/>').addClass('tileInput').attr({'type': 'text', 'pattern': '[0-9]*', 'maxlength': 1}).width('90%');
    text.change(this.check.bind(this));
  }else{
    text = $('<span/>').text(this._number);
  }
  text.addClass('tileText').css({'font-size': fontSize, 'border-radius': borderRadius});

  this.element.append(text);
};

/** Checks whether a number is entered */
Tile.prototype.check = function(){
  if(this._hidden){
    var inputElement = this.element.find('input').first();
    if(inputElement.val() === ''){
      this._filled = false;
    }else if(inputElement.val().match(/[^0-9]/)){
      inputElement.val('');
      this._filled = false;
    }else{
      this._filled = true;
    }
  }
};

/** Validates and adds corresponding style */
Tile.prototype.evaluate = function(){
  if(this._hidden){
    var inputElement = this.element.find('input').first();
    if(this.isCorrect()){
      inputElement.removeClass('incorrect').addClass('correct');
    }else{
      inputElement.removeClass('correct').addClass('incorrect');
    }
  }
};

/** Removes validation style */
Tile.prototype.reset = function(){
  if(this._hidden){
    var inputElement = this.element.find('input').first();
    inputElement.removeClass('correct').removeClass('incorrect');
  }
};

/** Manually erases input */
Tile.prototype.clear = function(){
  if(this._hidden){
    var inputElement = this.element.find('input').first();
    inputElement.val('');
    this._filled = false;
  }
};

Tile.prototype.isCorrect = function(){
  if(this._hidden){
    var inputElement = this.element.find('input').first();
    return inputElement.val() === this._number.toString();
  }else{
    return true;
  }
};

Tile.prototype.isFilled = function(){
  return this._filled;
};
