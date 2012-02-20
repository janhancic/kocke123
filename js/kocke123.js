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
boxTypes[4] = 'images/5.jpg';

var boxWidth = 30;
var boxHeight = 30;

function Box ( boxType, row, column, borderWidth ) {
	this.boxType = boxType;
	this.row = row;
	this.column = column;
	this.borderWidth = borderWidth;
	this.width = boxWidth;
	this.height = boxHeight;
	this.x = this.column * this.width + this.borderWidth;
	this.y = this.row * this.height + this.borderWidth;

	jaws.Sprite.call ( this, { image: boxTypes[this.boxType], x: this.x, y: this.y } );
	this.setWidth ( boxWidth );
	this.setHeight ( boxHeight );
}
Object.extend ( Box, jaws.Sprite );

Box.prototype.setPosition = function ( row, column ) {
	this.row = row;
	this.column = column;
	this.x = this.column * this.width + this.borderWidth;
	this.y = this.row * this.height + this.borderWidth;
}

function PlayState () {
	var boxes;
	var borderWidth = 8;
	var numOfRows = 19;
	var numOfColumns = 18;
	var score = 0;
	//var lives = 10;
	var lives = 5;
	var level = 1;
	var self = this;

	this.setup = function ( options ) {
		jaws.context.clearRect(0,0,jaws.width,jaws.height)

		if ( options ) {
			score = options.score;
			lives = options.lives;
			level = options.level;
		}

		this.startNewLevel ();

		jaws.canvas.addEventListener ( 'click', this.handleClick, false );
	},
	this.handleClick = function () {
		var column = jaws.mouse_x;
		var row = jaws.mouse_y;

		column = Math.floor ( column / ( boxWidth + borderWidth ) ); // TODO this does not work
		row = Math.floor ( row / ( boxHeight + borderWidth ) ); // TODO this does not work
		console.log ( column + ' ' + row );

		if ( column < numOfColumns && row < numOfRows ) {
			// "playing" field was clicked
			// now check if there is a box there ...
			if ( boxes[row][column] !== null ) {
				self.removeBox ( row, column );
			}
		}
	},
	this.startNewLevel = function () {
		var numOfBoxesToGenerate = 3;
		if ( level === 2 ) {
			numOfBoxesToGenerate = 4;
		} else if ( level >= 3 ) {
			numOfBoxesToGenerate = 5;
		} 
		// generate boxes
		boxes = new Array ( numOfRows );
		for ( var row = 0; row < numOfRows; row++ ) {
			boxes[row] = new Array ( numOfColumns );
			for ( var column = 0; column < numOfColumns; column++ ) {
				var boxType = Math.floor ( Math.random () * numOfBoxesToGenerate );
				boxes[row][column] = new Box ( boxType, row, column, borderWidth );
			}
		}
	},
	this.removeBox = function ( row, column ) {
		if ( this.hasSameNeighbour ( row, column ) === false ) {
			return;
		}

		this.removeBoxes ( row, column );

		this.collapsBoxes ();

		this.checkMovesLeft ();
	},
	this.removeBoxes = function ( row, column ) {
		var thisType = boxes[row][column].boxType;
		boxes[row][column] = null;
		score = score + 1;

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

		// check how mayn boxes are left, if more than 0 remove a life
		var hasBoxesLeft = false;
		for ( var row = 0; row < numOfRows; row++ ) {
			for ( var column = 0; column < numOfColumns; column++ ) {
				if ( boxes[row][column] !== null ) {
					hasBoxesLeft = true;
					break;
				}
			}

			if ( hasBoxesLeft === true ) {
				break;
			}
		}

		if ( hasBoxesLeft === true ) {
			lives = lives -1;
		}

		if ( lives > 0 ) {
			// new level
			jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
			jaws.switchGameState ( MidLevelState, null, { score: score, lives: lives, level: level + 1 } );
		} else {
			jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
			jaws.switchGameState ( GameOverState, null, score );
		}
	},
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

		// draw border
		jaws.context.lineWidth = borderWidth;

		// top horizontal
		jaws.context.moveTo ( 0, borderWidth / 2 );
		jaws.context.lineTo ( jaws.width, borderWidth / 2 );
		jaws.context.stroke ();

		// left vertical
		jaws.context.moveTo ( borderWidth / 2, 0 );
		jaws.context.lineTo ( borderWidth / 2, jaws.height );
		jaws.context.stroke ();

		// bottom horizontal
		jaws.context.moveTo ( 0, jaws.height - ( borderWidth / 2 ) );
		jaws.context.lineTo ( jaws.width, jaws.height - ( borderWidth / 2 ) );
		jaws.context.stroke ();

		// right vertical
		jaws.context.moveTo ( jaws.width - ( borderWidth / 2 ), 0 );
		jaws.context.lineTo ( jaws.width - ( borderWidth / 2 ), jaws.height );
		jaws.context.stroke ();

		// middle vertical
		jaws.context.moveTo ( 558, 0 );
		jaws.context.lineTo ( 558, jaws.height );
		jaws.context.stroke ();

		this.drawBoxes ();

		/*jaws.context.font = "bold 25pt terminal";
		jaws.context.lineWidth = 10;
		jaws.context.fillStyle =  "Blue";
		jaws.context.strokeStyle =  "rgba(200,200,200,0.0)"
		jaws.context.fillText ( "Score: " + score, numOfColumns * boxWidth + 10, 50 );
		jaws.context.fillText ( "Lives: " + lives, numOfColumns * boxWidth + 10, 100 );*/
	}
}

function MidLevelState () {
	var optionsForNextLevel;
	var self = this;

	this.setup = function ( options ) {
		optionsForNextLevel = options;
		jaws.canvas.addEventListener ( 'click', self.handleClick, false );
	};

	this.handleClick = function () {
		jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
		jaws.switchGameState ( PlayState, null, optionsForNextLevel );
	};

	var cleared = false;
	this.draw = function() {
		jaws.context.clearRect(0,0,jaws.width,jaws.height)

		jaws.context.font = "bold 20pt terminal";
		jaws.context.lineWidth = 10
		jaws.context.fillStyle =  "Red";
		jaws.context.strokeStyle =  "rgba(200,200,200,0.0)"
		jaws.context.fillText( 'Your intermediate score: ' + optionsForNextLevel.score, 10, 30 );
		jaws.context.fillText( 'Click anywhere to continue!', 10, 70 );
	}
}

function GameOverState () {
	var finalScore;
	var self = this;

	this.setup = function ( options ) {
		finalScore = options;
		jaws.canvas.addEventListener ( 'click', self.handleClick, false );
	};

	this.handleClick = function () {
		jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
		jaws.switchGameState ( MenuState, null );
	};

	this.update = function () {

	};

	this.draw = function() {
		jaws.context.clearRect(0,0,jaws.width,jaws.height)

		jaws.context.font = "bold 25pt terminal";
		jaws.context.lineWidth = 10
		jaws.context.fillStyle =  "Red";
		jaws.context.strokeStyle =  "rgba(200,200,200,0.0)"
		jaws.context.fillText( 'Your final score: ' + finalScore, 10, 50 );
		jaws.context.fillText( 'Click anywhere to continue!', 10, 70 );
	}
}

function MenuState () {
	var index =  0;
	var items = [ "zacni igro", "navodila" ];
	var background = null;
	var player = null;
	var self = this;

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
		//background.draw ();

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

function SplashScreenState () {
	var logo = null;
	var title = null;
	var self = this;

	this.setup = function () {
		logo = new jaws.Sprite ( {
			image: "images/menu_bg.png",
			x: jaws.width / 2,
			y: 0,
			anchor: 'center'
		} );

		title = new jaws.Sprite ( {
			image: "images/title.png",
			x: jaws.width / 2,
			y: 100,
			alpha: 0,
			anchor: 'center'
		} );

		jaws.canvas.addEventListener ( 'click', self.handleClick, false );
	}

	this.handleClick = function () {
		jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
		jaws.switchGameState ( MenuState, null );
	};

	var rotateLogo = true;
	var showTitle = false;
	this.update = function () {
		if ( rotateLogo === true ) {
			logo.rotate ( 3 );
			logo.move ( null, 3 );
			if ( logo.angle === 360 ) {
				rotateLogo = false;
				showTitle = true;
			}
		}

		if ( showTitle === true ) {
			title.alpha += 0.005;
			if ( title.alpha > 1 ) {
				showTitle = false;
				setTimeout (
					function () {
						jaws.switchGameState ( MenuState, null, "fuuuu" );
						jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
					},
					1000
				);
			}
		}
	}

	this.draw = function() {
		jaws.context.clearRect(0,0,jaws.width,jaws.height);
		jaws.context.fillStyle = "rgba(0, 0, 0, 0)";
		jaws.context.fillRect(0, 0, jaws.width, jaws.height);
		logo.draw ();
		title.draw ();
	}
}

window.onload = function () {
	/*jaws.assets.add("plane.png")
	jaws.assets.add("bullet.png")*/

	jaws.assets.add ( 'images/menu_bg.png' );
	jaws.assets.add ( 'images/title.png' );
	jaws.assets.add ( 'images/1.jpg' );
	jaws.assets.add ( 'images/2.jpg' );
	jaws.assets.add ( 'images/3.jpg' );
	jaws.assets.add ( 'images/4.jpg' );
	jaws.assets.add ( 'images/5.jpg' );

	//jaws.start ( MenuState );
	jaws.start ( PlayState );
	//jaws.start ( SplashScreenState );
}