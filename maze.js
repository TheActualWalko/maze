function Maze( width, height ){
  Board.call( this, width, height );
  this.__encounteredWalls__ = [];
  this.__encounteredCells__ = [];
  this.__encounterCell__( this.getCell( Math.round( width / 2 ), Math.round( height / 2 ) ) );
}
Maze.prototype = _.extend( _.clone( Board.prototype ), {

  isComplete : function(){
    return this.__encounteredWalls__.length == 0;
  },

  makeRandomBoundariesIntoPassages : function( num ){
    var currentBoundary;
    for( var i = 0; i < num; i ++ ){
      currentBoundary = this.__boundaries__[ Math.floor( Math.random() * this.__boundaries__.length ) ];
      if( currentBoundary.cells[0].getBoundaryCount() < 4 || currentBoundary.cells[1].getBoundaryCount() < 4 ){
        continue;
      }
      currentBoundary.becomePassage();
    }
  },

  doPrimsSteps : function( num ){
    for( var i = 0; i < num; i ++ ){
      this.doOnePrimsStep();
    }
  },
  doOnePrimsStep : function(){
    var wall = this.__getRandomEncounteredWall__();
    if( wall == null ){
      return;
    }
    this.__encounteredWalls__.splice( this.__encounteredWalls__.indexOf( wall ), 1 );
    if( this.__hasEncounteredCell__( wall.cells[0] ) && this.__hasEncounteredCell__( wall.cells[1] ) ){
      return;
    }
    if( wall.cells[0].getBoundaryCount() < 4 || wall.cells[1].getBoundaryCount() < 4 ){
      return;
    }

    var encounteredCell, newCell;
    if( this.__hasEncounteredCell__( wall.cells[0] ) ){
      encounteredCell = wall.cells[0];
    }else if( this.__hasEncounteredCell__( wall.cells[1] ) ){
      encounteredCell = wall.cells[1];
    }else{
      console.log( wall );
      throw new Error("Wall should not have been a candidate");
    }
    newCell = encounteredCell.getCellAcrossBoundary( wall );

    var cell1 = wall.cells[0];
    var cell2 = wall.cells[1];

    wall.becomePassage();
    this.__encounterCell__( newCell );
  },

  __getRandomEncounteredWall__ : function(){
    return this.__encounteredWalls__[ Math.floor( Math.random() * this.__encounteredWalls__.length ) ];
  },

  __hasEncounteredCell__ : function( cell ){
    return this.__encounteredCells__.indexOf( cell ) >= 0;
  },

  __encounterCell__ : function( cell ){
    this.__encounteredCells__.push( cell );
    cell.forEachWall( function( boundary, dir ){
      this.__encounteredWalls__.push( boundary );
    }.bind(this));
  }
});