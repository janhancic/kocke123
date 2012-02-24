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