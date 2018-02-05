function Explorer( board, x, y ){
  this.__board__ = board;
  this.x = x;
  this.y = y;
}

Explorer.prototype = {
  setColor : function( color ){
    this.__color__ = color;
  },
  MOVE_DIRS : {
    "n" : [ 0, -1 ],
    "e" : [ 1, 0 ],
    "s" : [ 0, 1 ],
    "w" : [ -1, 0]
  },
  forceMove : function( dir ){
    this.__board__.getCell( this.x, this.y ).getBoundary( dir ).becomePassage();
    this.move( dir );
  },
  move : function( dir ){
    var coordDelta = this.MOVE_DIRS[ dir ];
    var boundary = this.__board__.getCell( this.x, this.y ).getBoundary( dir );
    if( boundary == null || boundary.isWall() ){
      return;
    }
    this.x += coordDelta[0];
    this.y += coordDelta[1];
  },
  draw : function( context ){
    var cellSize = Math.min( context.canvas.width / this.__board__.width, context.canvas.height / this.__board__.height );
    context.fillStyle = this.__color__;
    context.fillRect( 2 + ( this.x * cellSize ), 2 + ( this.y * cellSize ), cellSize - 3, cellSize - 3 );
  }
};