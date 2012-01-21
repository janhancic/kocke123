// Taken from https://github.com/yui/yui2/blob/master/src/yahoo/js/Lang.js
// after reading http://dmitrysoshnikov.com/ecmascript/chapter-7-2-oop-ecmascript-implementation/
Object.extend = function(subc, superc) {
	if (!superc||!subc) {
		throw new Error("extend failed, please check that all dependencies are included.");
	}
	var F = function() {}, i;
	F.prototype=superc.prototype;
	subc.prototype=new F();
	subc.prototype.constructor=subc;
	subc.superclass=superc.prototype;
	if (superc.prototype.constructor == Object.prototype.constructor) {
		superc.prototype.constructor=superc;
	}
}

var boxTypes = [];
boxTypes[0] = 'images/1.jpg';
boxTypes[1] = 'images/2.jpg';
boxTypes[2] = 'images/3.jpg';
boxTypes[3] = 'images/4.jpg';

function Box ( boxType, row, column ) {
	this.boxType = boxType;
	this.row = row;
	this.column = column;
	this.x = this.column * 45;
	this.y = this.row * 45;

	jaws.Sprite.call ( this, { image: boxTypes[this.boxType], x: this.x, y: this.y } );
}
Object.extend ( Box, jaws.Sprite );

Box.prototype.setPosition = function ( row, column ) {
	this.row = row;
	this.column = column;
	this.x = this.column * 45;
	this.y = this.row * 45;
}

function PlayState () {
	var boxes;
	var numOfRows = 10;
	var numOfColumns = 10;

	this.setup = function () {
		var that = this;

		jaws.context.clearRect(0,0,jaws.width,jaws.height)

		// generate boxes
		boxes = new Array ( numOfRows );
		for ( var row = 0; row < numOfRows; row++ ) {
			boxes[row] = new Array ( numOfColumns );
			for ( var column = 0; column < numOfColumns; column++ ) {
				var boxType = Math.floor ( Math.random () * 4 );
				boxes[row][column] = new Box ( boxType, row, column );
			}
		}

		jaws.canvas.addEventListener (
			'click',
			function () {
				var column = jaws.mouse_x;
				var row = jaws.mouse_y;

				column = Math.floor ( column / 45 );
				row = Math.floor ( row / 45 );

				if ( column < numOfColumns && row < numOfRows ) {
					// "playing" field was clicked
					// now check if there is a box there ...
					if ( boxes[row][column] !== null ) {
						that.removeBox ( row, column );
					}
				}
			}
		);
	},
	this.removeBox = function ( row, column ) {
		if ( this.hasSameNeighbour ( row, column ) === false ) {
			return;
		}

		// remove boxes
		this.removeBoxes ( row, column );

		// collaps boxes
		this.collapsBoxes ();

		// check if there are any moves left
		this.checkMovesLeft ();
	},
	this.removeBoxes = function ( row, column ) {
		var thisType = boxes[row][column].boxType;
		boxes[row][column] = null;

		if ( column !== 0 && boxes[row][column - 1] !== null && boxes[row][column - 1].boxType === thisType ) {
			this.removeBoxes ( row, column - 1 );
		}

		// check right
		if ( column !== numOfColumns - 1 && boxes[row][column + 1] !== null && boxes[row][column + 1].boxType === thisType ) {
			this.removeBoxes ( row, column + 1);
		}

		// check top
		if ( row !== 0 && boxes[row - 1][column] !== null && boxes[row - 1][column].boxType === thisType ) {
			this.removeBoxes ( row - 1, column );
		}

		// check bottom
		if ( row !== numOfRows - 1 && boxes[row + 1][column] !== null && boxes[row + 1][column].boxType === thisType ) {
			this.removeBoxes ( row + 1, column );
		}
	},
	this.hasSameNeighbour = function ( row, column ) {
		// check this box's neighbours (left, right, top, bottom) if it contains the same box, at least two same boxes must be together

		// check left
		if ( column !== 0 && boxes[row][column - 1] !== null && boxes[row][column - 1].boxType === boxes[row][column].boxType ) {
			return true;
		}

		// check right
		if ( column !== numOfColumns - 1 && boxes[row][column + 1] !== null && boxes[row][column + 1].boxType === boxes[row][column].boxType ) {
			return true;
		}

		// check top
		if ( row !== 0 && boxes[row - 1][column] !== null && boxes[row - 1][column].boxType === boxes[row][column].boxType ) {
			return true;
		}

		// check bottom
		if ( row !== numOfRows - 1 && boxes[row + 1][column] !== null && boxes[row + 1][column].boxType === boxes[row][column].boxType ) {
			return true;
		}

		return false;
	},
	this.collapsBoxes = function () {
		// collapse vertically
		for ( var row = numOfRows - 1; row > 0; row-- ) {
			for ( var column = 0; column < numOfColumns; column++ ) {
				if ( boxes[row][column] === null ) {
					for ( var checkRow = row - 1; checkRow >= 0; checkRow-- ) {
						if ( boxes[checkRow][column] !== null ) {
							boxes[row][column] = boxes[checkRow][column];
							boxes[checkRow][column] = null;
							boxes[row][column].setPosition ( row, column );
							break;
						}
					}
				}
			}
		}

		// collapse horizontally
		for ( var column = 0; column < numOfColumns - 1; column++ ) {
			if ( boxes[numOfRows - 1][column] === null ) {
				// this column is empty, move all columns to the right of it one space to the left
				for ( var row = 0; row < numOfRows; row++ ) {
					boxes[row][column] = boxes[row][column + 1];
					boxes[row][column + 1] = null;
					if ( boxes[row][column] !== null ) {
						boxes[row][column].setPosition ( row, column );
					}
				}
			}
		}
	},
	this.checkMovesLeft = function () {
		for ( var row = 0; row < numOfRows; row++ ) {
			for ( var column = 0; column < numOfColumns; column++ ) {
				if ( boxes[row][column] !== null ) {
					if ( this.hasSameNeighbour ( row, column ) === true ) {
						return true;
					}
				}
			}
		}

		alert ( 'no more moves :(' );
	}
	this.update = function () {
		
	},
	this.drawBoxes = function () {
		for ( var row = 0; row < numOfRows; row++ ) {
			for ( var column = 0; column < numOfColumns; column++ ) {
				if ( boxes[row][column] !== null ) {
					boxes[row][column].draw ();
				}
			}
		}
	},
	this.draw = function () {
		jaws.context.clearRect(0,0,jaws.width,jaws.height)
		this.drawBoxes ();
	}
}

function MenuState () {
	var index =  0;
	var items = [ "zacni igro", "navodila" ];
	var background = null;
	var player = null;

	this.setup = function () {
		background = new jaws.Sprite ( {
			image: "images/menu_bg.png",
			x: 0,
			y: 0
		} );

		index = 0
		jaws.on_keydown (
			'down',
			function () {
				index++;
				if ( index >= items.length ) {
					index = items.length - 1;
				}
			}
		);

		jaws.on_keydown (
			'up',
			function () {
				index--;
				if ( index < 0 ) {
					index = 0;
				}
			}
		);

		jaws.on_keydown (
			'enter',
			function () {
				if ( index === 0 ) {
					jaws.switchGameState ( PlayState );
				}
			}
		);
	}

	this.draw = function() {
		jaws.context.clearRect(0,0,jaws.width,jaws.height)
		background.x = jaws.width / 2 - background.width / 2;
		background.y = jaws.height / 2 - background.height / 2;
		background.draw ();

		for(var i=0; items[i]; i++) {
			// jaws.context.translate(0.5, 0.5)
			jaws.context.font = "bold 50pt terminal";
			jaws.context.lineWidth = 10
			jaws.context.fillStyle =  (i == index) ? "Red" : "Black"
			jaws.context.strokeStyle =  "rgba(200,200,200,0.0)"
			jaws.context.fillText(items[i], 30, 100 + i * 60)
		}
	}
}

window.onload = function () {
	/*jaws.assets.add("plane.png")
	jaws.assets.add("bullet.png")*/

	jaws.assets.add ( 'images/menu_bg.png' );
	jaws.assets.add ( 'images/1.jpg' );
	jaws.assets.add ( 'images/2.jpg' );
	jaws.assets.add ( 'images/3.jpg' );
	jaws.assets.add ( 'images/4.jpg' );

	//jaws.start ( MenuState );
	jaws.start ( PlayState );
}