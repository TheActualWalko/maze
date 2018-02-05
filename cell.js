function Cell( board, x, y ){
  this.__board__ = board;
  this.x = x;
  this.y = y;
  this.__boundaries__ = {};
  this.becomeEmpty();
}

Cell.prototype = {
  CONTENT_EMPTY : "e",
  CONTENT_GOOD  : "g",
  becomeCost : function( cost ){
    this.__content__ = cost;
  },
  becomeEmpty : function(){
    this.__content__ = this.CONTENT_EMPTY;
  },
  becomeGood : function(){
    this.__content__ = this.CONTENT_GOOD;
  },
  isEmpty : function(){
    return this.__content__ === this.CONTENT_EMPTY;
  },
  isGood : function(){
    return this.__content__ === this.CONTENT_GOOD;
  },
  getCost : function(){
    if( _.isNumber( this.__content__ ) ){
      return this.__content__;
    }else{
      return Infinity;
    }
  },
  forEachAccessibleNeighbour : function( callback ){
    this.forEachNeighbour( function( currentCell, dir ){
      if( this.getBoundary( dir ).isPassage() ){
        callback( currentCell, dir );
      }
    }.bind(this));
  },
  forEachNeighbour : function( callback ){
    var dirs = {
      "n" : { x : 0,  y : -1 },
      "e" : { x : 1,  y : 0  },
      "s" : { x : 0,  y : 1  },
      "w" : { x : -1, y : 0  }
    };
    var neighbourX;
    var neighbourY;
    for( var dirName in dirs ){
      neighbourX = this.x + dirs[ dirName ].x;
      neighbourY = this.y + dirs[ dirName ].y;
      if( 
        neighbourX >= 0 && neighbourX < this.__board__.width
        &&
        neighbourY >= 0 && neighbourY < this.__board__.height
      ){
        callback( this.__board__.getCell( neighbourX, neighbourY ), dirName );
      }
    }
  },
  addBoundary : function( boundary ){
    var dir = this.getDirectionToBoundary( boundary );
    this.__boundaries__[ dir ] = boundary;
  },
  getBoundary : function( dir ){
    return this.__boundaries__[ dir ];
  },
  getRandomWall : function(){
    var walls = [];
    this.forEachBoundary( function( currentBoundary, dir ){
      if( currentBoundary.isWall() ){
        walls.push( currentBoundary );
      }
    });
    if( walls.length > 0 ){
      return walls[ Math.floor( Math.random() * walls.length ) ];
    }
  },
  getDirectionToBoundary : function( boundary ){
    var neighbour = this.getCellAcrossBoundary( boundary );
    if( neighbour === null ){
      throw new Error("Boundaries must separate cells!");
    }
    if( neighbour.x < this.x ){
      return "w";
    }
    if( neighbour.y < this.y ){
      return "n";
    }
    if( neighbour.x > this.x ){
      return "e";
    }
    if( neighbour.y > this.y ){
      return "s";
    }
  },
  forEachWall : function( callback ){
    this.forEachBoundary( function( currentBoundary, dir ){
      if( currentBoundary.isWall() ){
        callback( currentBoundary, dir );
      }
    });
  },
  forEachBoundary : function( callback ){
    for( var dir in this.__boundaries__ ){
      callback( this.__boundaries__[ dir ], dir );
    }
  },
  getCellAcrossBoundary : function( boundary ){
    if( boundary.cells[ 0 ] === this ){
      return boundary.cells[ 1 ];
    }else if( boundary.cells[ 1 ] === this ){
      return boundary.cells[ 0 ];
    }
  },
  getBoundaryCount : function(){
    return Object.keys( this.__boundaries__ ).length;
  }
}