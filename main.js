var WIDTH   = 80;
var HEIGHT  = 60;
var MONSTER_WAIT = 10; 
var PLACEMENT_PADDING = 4;
var VIEW_DIST = 20;
var cellSize;
var keyCodeDirs = {
  37 : "w",
  38 : "n",
  39 : "e",
  40 : "s"
};
var boardContext, maze, objective;
var explorerContext, player, monsters;
var pathContext, costMap;
$(function(){
  boardContext    = document.getElementById("board").getContext('2d');
  boardContext.lineWidth = 4;
  explorerContext = document.getElementById("explorers").getContext('2d');
  pathContext     = document.getElementById("path").getContext('2d');
  cellSize = Math.min( boardContext.canvas.width / WIDTH, boardContext.canvas.height / HEIGHT );
  maze = new Maze( WIDTH, HEIGHT );
  player = new Explorer( 
    maze, 
    PLACEMENT_PADDING + Math.floor( Math.random() * ( WIDTH - PLACEMENT_PADDING ) ), 
    PLACEMENT_PADDING + Math.floor( Math.random() * ( HEIGHT - PLACEMENT_PADDING ) )
  );
  player.setColor("green");
  monsters = [];
  var monster;
  for( var i = 0; i < 4; i ++ ){
    monster = new Explorer( 
      maze, 
      PLACEMENT_PADDING + Math.floor( Math.random() * ( WIDTH - PLACEMENT_PADDING ) ), 
      PLACEMENT_PADDING + Math.floor( Math.random() * ( HEIGHT - PLACEMENT_PADDING ) )
    );
    monster.setColor("red");
    monsters.push( monster );
  }
  objective = new Cell( 
    maze, 
    PLACEMENT_PADDING + Math.floor( Math.random() * ( WIDTH - PLACEMENT_PADDING ) ), 
    PLACEMENT_PADDING + Math.floor( Math.random() * ( HEIGHT - PLACEMENT_PADDING ) )
  );
  pathContext.fillStyle = "#fff";
  pathContext.fillRect( 0, 0, pathContext.canvas.width, pathContext.canvas.height );

  function doNextRemoveStep(){
    maze.makeRandomBoundariesIntoPassages( 100 );
    maze.draw( boardContext );
    updateCostMap();
    if( maze.getWallCount() > WIDTH * HEIGHT / 1.1 ){
      setTimeout(doNextRemoveStep, 16.6 );
    }else{
      initialize();
      boardContext.fillStyle = "blue";
      boardContext.fillRect( 2 + ( objective.x * cellSize ), 2 + ( objective.y * cellSize ), cellSize - 3, cellSize -3 );
    }
  }

  function doNextGenStep(){
    maze.doPrimsSteps( 300 );
    maze.draw( boardContext );
    updateCostMap();
    if( !maze.isComplete() ){
      setTimeout(doNextGenStep, 16.6 );
    }else{
      setTimeout(doNextRemoveStep, 16.6);
    }
  }
  doNextGenStep();


});

function initialize(){
  bindMoveKeys( player );
  updateCostMap();
  redrawExplorers();
  player.draw( explorerContext );
  monsters.forEach( 
    function( monster ){ 
      monster.draw( explorerContext );
    }
  );
}

function updateCostMap(){
  costMap = getCostMapForDestination( maze.getCell( player.x, player.y ) );
}

function moveMonster( monster ){
  var movesMade = 0;
  function moveUntilDone(){
    doNextMoveForMonster( monster );
    checkLoseCondition();
    redrawExplorers();
    movesMade ++;
    if( movesMade < MONSTER_WAIT ){
      setTimeout( moveUntilDone, 100 );
    }
  }
  moveUntilDone();
}

function checkLoseCondition(){
  monsters.forEach( function( monster ){
    if( monster.x === player.x && monster.y === player.y ){
      alert("YOU LOSE");
      player = null;
    }
  } );
}

function getCostMapForDestination( targetCell ){
  var costs = new Board( WIDTH, HEIGHT );
  var startingCell = targetCell;
  var currentCost;
  var costsAdded = 0;
  var lastMapped = [];
  pathContext.clearRect( 0, 0, pathContext.canvas.width, pathContext.canvas.height );
  function drawCellWithCost( cell, cost ){
    var color = Math.round( Math.min( 255, Math.max( 0, 255 - ( ( cost / VIEW_DIST ) * 255 ) ) ) );
    pathContext.fillStyle = "rgb( "+color+", "+color+", "+color+" )";
    pathContext.fillRect( cell.x * cellSize, cell.y * cellSize, cellSize, cellSize );
  }
  function recursiveScoreCells(){
    currentCost ++;
    var currentMapped = [];
    for( var i = 0; i < lastMapped.length; i ++ ){
      lastMapped[ i ].forEachAccessibleNeighbour( function( currentCell, dir ){
        currentCostMapCell = costs.getCell( currentCell.x, currentCell.y );
        if( currentCostMapCell.getCost() == Infinity ){
          currentCostMapCell.becomeCost( currentCost );
          currentMapped.push( currentCell );
          costsAdded ++;
          drawCellWithCost( currentCostMapCell, currentCost );
        }
      });
    }
    lastMapped = currentMapped;
    if( lastMapped.length > 0 ){
      recursiveScoreCells();
    }
  }
  currentCost = 0;
  costs.getCell( startingCell.x, startingCell.y ).becomeCost( currentCost );
  drawCellWithCost( costs.getCell( startingCell.x, startingCell.y ), 0 );
  costsAdded ++;
  lastMapped.push( startingCell );
  recursiveScoreCells();
  return costs;
}

function doNextMoveForMonster( monster ){
  var currentCell = maze.getCell( monster.x, monster.y );
  var minCost = Infinity
  var minCostDir;
  currentCell.forEachAccessibleNeighbour( function( currentCell, dir ){
    var currentCost = costMap.getCell( currentCell.x, currentCell.y ).getCost();
    if( currentCost < minCost ){
      minCost = currentCost;
      minCostDir = dir;
    }
  });
  monster.move( minCostDir );
}

function redrawExplorers(){
  explorerContext.clearRect( 0, 0, explorerContext.canvas.width, explorerContext.canvas.height );
  player.draw( explorerContext );
  monsters.forEach( function( monster ){
    monster.draw( explorerContext );
  });
}

var playerMoves = 0;

function bindMoveKeys(){
  $(document).on( "keydown", function( event ){
    var dir = keyCodeDirs[ event.which ];
    if( dir != null ){
      if( playerMoves % MONSTER_WAIT === 0 ){
        monsters.forEach( function( monster ){
          moveMonster( monster );
        });
      }
      if( event.metaKey ){
        player.forceMove( dir );
        maze.draw( boardContext );
      }else{
        player.move( dir );
      }
      checkLoseCondition();
      playerMoves ++;
      updateCostMap();
      redrawExplorers();
      if( player.x === objective.x && player.y === objective.y ){
        alert("YOU WIN");
      }
      event.preventDefault();
      event.stopPropagation();
    }
  });
}