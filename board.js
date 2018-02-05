function Board( width, height ){
  this.width = width;
  this.height= height;
  this.__reset__();
}

Board.prototype = {
  EMPTY_CELL : 0,
  __reset__ : function(){
    this.__resetCells__();
    this.__resetBoundaries__();
  },
  __resetCells__ : function(){
    this.__cells__ = [];
    for( var x = 0; x < this.width; x ++ ){
      this.__cells__[ x ] = [];
      for( var y = 0; y < this.height; y ++ ){
        this.__cells__[ x ][ y ] = new Cell( this, x, y );
      }
    }
  },
  __resetBoundaries__ : function(){
    this.__boundaries__ = [];
    this.__forEachCell__( function( currentCell ){
      currentCell.forEachNeighbour( function( currentNeighbour, direction ){
        if( 
          ( currentCell.x !== this.width - 1 && direction === "e" ) 
          ||
          ( currentCell.y !== this.height - 1 && direction === "s" )
        ){
          this.__boundaries__.push( new Boundary( currentCell, currentNeighbour ) );
        }
      }.bind(this));
    }.bind(this));
  },
  __forEachCell__ : function( callback ){
    for( var x = 0; x < this.__cells__.length; x ++ ){
      for( var y = 0; y < this.__cells__[ x ].length; y ++ ){
        callback( this.getCell( x, y ) );
      }
    }
  },
  getWallCount : function(){
    var count = 0;
    for( var i = 0; i < this.__boundaries__.length; i ++ ){
      if( this.__boundaries__[ i ].isWall() ){
        count ++;
      }
    }
    return count;
  },
  getRandomCell : function(){
    var x = Math.floor( Math.random() * this.width );
    var y = Math.floor( Math.random() * this.height );
    return this.getCell( x, y );
  },
  getCell : function( x, y ){
    return this.__cells__[ x ][ y ];
  },
  draw : function( context ){
    context.clearRect( 0, 0, context.canvas.width, context.canvas.height );
    var cell1, cell2, currentBoundary;
    for( var i = 0; i < this.__boundaries__.length; i ++ ){
      currentBoundary = this.__boundaries__[ i ];
      if( !currentBoundary.isWall() ){
        continue;
      }
      context.beginPath();
      context.moveTo( 0.5 + ( currentBoundary.getX1() * cellSize ), 0.5 + ( currentBoundary.getY1() * cellSize ) );
      context.lineTo( 0.5 + ( currentBoundary.getX2() * cellSize ), 0.5 + ( currentBoundary.getY2() * cellSize ) );
      context.stroke();
    }
  }
};