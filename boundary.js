function Boundary( cell1, cell2 ){
  this.cells = [ cell1, cell2 ];
  this.cells.forEach( function( currentCell ){
    if( currentCell != null ){
      currentCell.addBoundary( this );    
    }else{
      throw new Error("Cells cannot be null");
    }
  }.bind(this));
  this.becomeWall();
}

Boundary.prototype = {
  WALL_CONTENT : 1,
  PASSAGE_CONTENT : 0,
  becomeWall : function(){
    this.__content__ = this.WALL_CONTENT;
  },
  becomePassage : function(){
    this.__content__ = this.PASSAGE_CONTENT;
  },
  isWall : function(){
    return this.__content__ === this.WALL_CONTENT;
  },
  isPassage : function(){
    return this.__content__ === this.PASSAGE_CONTENT;
  },
  getX1 : function(){
    return Math.max( this.cells[0].x, this.cells[1].x );
  },
  getX2 : function(){
    if( this.cells[0].x !== this.cells[1].x ){
      return this.getX1();
    }else{
      return this.getX1() + 1;
    }
  },
  getY1 : function(){
    return Math.max( this.cells[0].y, this.cells[1].y );
  },
  getY2 : function(){
    if( this.cells[0].y !== this.cells[1].y ){
      return this.getY1();
    }else{
      return this.getY1() + 1;
    }
  }
};