function Box ( boxType, row, column ) {
	this.boxType = boxType;
	this.row = row;
	this.column = column;
	this.width = kocke123.boxWidth;
	this.height = kocke123.boxHeight;
	this.x = this.column * this.width;
	this.y = this.row * this.height;

	jaws.Sprite.call ( this, { image: kocke123.boxTypes[this.boxType], x: this.x, y: this.y } );
	this.setWidth ( kocke123.boxWidth );
	this.setHeight ( kocke123.boxHeight );
}
Object.extend ( Box, jaws.Sprite );

Box.prototype.setPosition = function ( row, column ) {
	this.row = row;
	this.column = column;
	this.x = this.column * this.width;
	this.y = this.row * this.height;
}

function PlayState () {
	var self = this;
	var boxes;
	var score = 0;
	var lives = kocke123.numOfLives;
	var level = 1;
	var showNextLevelSprite = false;
	var showGameOverSprite = false;
	var showNewGameHoverSprite = false;
	var updateDraw = false;

	var backgroundLeftSprite = null;
	var backgroundRightSprite = null;
	var logoSprite = null;
	var levelSprite = null
	var scoreSprite = null;
	var livesSprite = null;
	var nextLevelSprite = null;

	var gameOverSprite = null;
	var newGameSprite = null;
	var newGameHoverSprite = null;

	var previousMouseX = 0;
	var previousMouseY = 0;

	this.setup = function ( options ) {
		if ( options ) {
			score = options.score;
			lives = options.lives;
			level = options.level;
		}

		backgroundLeftSprite = new jaws.Sprite ( { image: 'images/play/background_left.png', x: 0, y: 0 } );

		backgroundRightSprite = new jaws.Sprite ( {
			image: 'images/play/background_right.png',
			x: kocke123.numOfColumns * kocke123.boxWidth + kocke123.borderWidth,
			y: 0
		} );

		logoSprite = new jaws.Sprite ( {
			image: "images/play/logo.png",
			x: kocke123.numOfColumns * kocke123.boxWidth + kocke123.borderWidth + 25,
			y: 20
		} );

		levelSprite = new jaws.Sprite ( {
			image: "images/play/level.png",
			x: kocke123.numOfColumns * kocke123.boxWidth + kocke123.borderWidth + 20,
			y: 100
		} );

		scoreSprite = new jaws.Sprite ( {
			image: "images/play/score.png",
			x: kocke123.numOfColumns * kocke123.boxWidth + kocke123.borderWidth + 20,
			y: 260
		} );

		livesSprite = new jaws.Sprite ( {
			image: "images/play/lives.png",
			x: kocke123.numOfColumns * kocke123.boxWidth + kocke123.borderWidth + 20,
			y: 380
		} );

		nextLevelSprite = new jaws.Sprite ( { image: 'images/play/next_level.png', x: 0, y: 0 } );

		gameOverSprite = new jaws.Sprite ( { image: 'images/play/game_over.png', x: 0, y: 0 } );

		newGameSprite = new jaws.Sprite ( {
			image: 'images/play/new_game.png',
			x: ( kocke123.numOfColumns * kocke123.boxWidth ) / 2,
			y: 200,
			anchor: 'center'
		} );

		newGameHoverSprite = new jaws.Sprite ( {
			image: 'images/play/new_game_hover.png',
			x: ( kocke123.numOfColumns * kocke123.boxWidth ) / 2,
			y: 200,
			anchor: 'center'
		} );

		this.startNewLevel ();

		jaws.canvas.addEventListener ( 'click', self.handleClick, false );
		//jaws.canvas.addEventListener ( 'click', this.handleGameOverClick, false );
	},
	this.handleClick = function () {
		var column = jaws.mouse_x;
		var row = jaws.mouse_y;

		column = Math.floor ( column / kocke123.boxWidth );
		row = Math.floor ( row / kocke123.boxHeight );
		//console.log ( column + ' ' + row );

		if ( column < kocke123.numOfColumns && row < kocke123.numOfRows ) {
			// "playing" field was clicked
			if ( boxes[row][column] !== null ) { // now check if there is a box there ...
				self.removeBox ( row, column );
			}
		}
	},
	this.handleGameOverClick = function () {
		var mockRectangle = {
			x: jaws.mouse_x,
			y: jaws.mouse_y,
			right: jaws.mouse_x + 1,
			bottom: jaws.mouse_y + 1
		}

		if ( jaws.collideRects ( mockRectangle, newGameSprite.rect () ) === true ) {
			level = 1;
			score = 0;
			lives = kocke123.numOfLives;
			showNextLevelSprite = false;
			showGameOverSprite = false;
			jaws.canvas.removeEventListener ( 'click', self.handleGameOverClick, false );
			jaws.canvas.addEventListener ( 'click', self.handleClick, false );
			updateDraw = true;
			self.startNewLevel ();
		}

	},
	this.startNewLevel = function () {
		showNextLevelSprite = false;
		showGameOverSprite = false;
		//showGameOverSprite = true;

		var numOfBoxesToGenerate = 3;
		if ( level === 2 || level === 3 || level === 4 ) {
			numOfBoxesToGenerate = 4;
		} else if ( level === 5 || level === 6 ) {
			numOfBoxesToGenerate = 5;
		} else if ( level === 7 || level === 8) {
			numOfBoxesToGenerate = 6;
		} else if ( level === 9 || level === 10 ) {
			numOfBoxesToGenerate = 7;
		} else if ( level > 11 ) {
			numOfBoxesToGenerate = 8;
		}

		// generate boxes
		var middleRow = Math.floor ( kocke123.numOfRows / 2 );
		var middleColumn = Math.floor ( kocke123.numOfColumns / 2 );
		boxes = new Array ( kocke123.numOfRows );
		for ( var row = 0; row < kocke123.numOfRows; row++ ) {
			boxes[row] = new Array ( kocke123.numOfColumns );
			for ( var column = 0; column < kocke123.numOfColumns; column++ ) {
				var boxType = null;
				if ( row === middleRow && ( column === middleColumn - 1 || column === middleColumn || column === middleColumn + 1 ) ) { // put first three boxes (box types) in the middle of the grid ... just for fun :)
					if ( column === middleColumn - 1 ) {
						boxType = 0;
					} else if ( column === middleColumn ) {
						boxType = 1;
					} else if ( column === middleColumn + 1) {
						boxType = 2;
					}
				} else {
					boxType = Math.floor ( Math.random () * numOfBoxesToGenerate );
				}

				boxes[row][column] = new Box ( boxType, row, column );
			}
		}

		updateDraw = true;
	},
	this.removeBox = function ( row, column ) {
		if ( this.hasSameNeighbour ( row, column ) === false ) {
			return;
		}

		this.removeBoxes ( row, column );

		this.collapsBoxes ();

		this.checkMovesLeft ();
		updateDraw = true;
	},
	this.removeBoxes = function ( row, column ) {
		var thisType = boxes[row][column].boxType;
		boxes[row][column] = null;
		score = score + 1;

		if ( column !== 0 && boxes[row][column - 1] !== null && boxes[row][column - 1].boxType === thisType ) {
			this.removeBoxes ( row, column - 1 );
		}

		// check right
		if ( column !== kocke123.numOfColumns - 1 && boxes[row][column + 1] !== null && boxes[row][column + 1].boxType === thisType ) {
			this.removeBoxes ( row, column + 1);
		}

		// check top
		if ( row !== 0 && boxes[row - 1][column] !== null && boxes[row - 1][column].boxType === thisType ) {
			this.removeBoxes ( row - 1, column );
		}

		// check bottom
		if ( row !== kocke123.numOfRows - 1 && boxes[row + 1][column] !== null && boxes[row + 1][column].boxType === thisType ) {
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
		if ( column !== kocke123.numOfColumns - 1 && boxes[row][column + 1] !== null && boxes[row][column + 1].boxType === boxes[row][column].boxType ) {
			return true;
		}

		// check top
		if ( row !== 0 && boxes[row - 1][column] !== null && boxes[row - 1][column].boxType === boxes[row][column].boxType ) {
			return true;
		}

		// check bottom
		if ( row !== kocke123.numOfRows - 1 && boxes[row + 1][column] !== null && boxes[row + 1][column].boxType === boxes[row][column].boxType ) {
			return true;
		}

		return false;
	},
	this.collapsBoxes = function () {
		// collapse vertically
		for ( var row = kocke123.numOfRows - 1; row > 0; row-- ) {
			for ( var column = 0; column < kocke123.numOfColumns; column++ ) {
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
		/*for ( var column = 0; column < kocke123.numOfColumns - 1; column++ ) {
			if ( boxes[kocke123.numOfRows - 1][column] === null ) {
				// this column is empty, move all columns to the right of it one space to the left
				for ( var row = 0; row < kocke123.numOfRows; row++ ) {
					boxes[row][column] = boxes[row][column + 1];
					boxes[row][column + 1] = null;
					if ( boxes[row][column] !== null ) {
						boxes[row][column].setPosition ( row, column );
					}
				}
			}
		}*/

		// collapse horizontally
		var middleColumn = Math.floor ( kocke123.numOfColumns / 2 );
		for ( var column = 0; column < kocke123.numOfColumns - 1; column++ ) {
			if ( boxes[kocke123.numOfRows - 1][column] === null ) {
				// found empty column
				if ( column < middleColumn ) {
					// move all columns left from this column one position right
					for ( var tmpColumn = column; tmpColumn > 0; tmpColumn-- ) {
						for ( var tmpRow = 0; tmpRow < kocke123.numOfRows; tmpRow++ ) {
							boxes[tmpRow][tmpColumn] = boxes[tmpRow][tmpColumn - 1];
							boxes[tmpRow][tmpColumn - 1] = null
							if ( boxes[tmpRow][tmpColumn] !== null ) {
								boxes[tmpRow][tmpColumn].setPosition ( tmpRow, tmpColumn );
							}
						}
					}
				} else {
					// move all columns right from this column one position left
					for ( var tmpColumn = column; tmpColumn < kocke123.numOfColumns; tmpColumn++ ) {
						for ( var tmpRow = 0; tmpRow < kocke123.numOfRows; tmpRow++ ) {
							if ( tmpColumn + 1 === kocke123.numOfColumns ) {
								boxes[tmpRow][tmpColumn] = null;
							} else {
								boxes[tmpRow][tmpColumn] = boxes[tmpRow][tmpColumn + 1];
								boxes[tmpRow][tmpColumn + 1] = null
								if ( boxes[tmpRow][tmpColumn] !== null ) {
									boxes[tmpRow][tmpColumn].setPosition ( tmpRow, tmpColumn );
								}
							}
						}
					}
				}
			}
		}
	},
	this.checkMovesLeft = function () {
		for ( var row = 0; row < kocke123.numOfRows; row++ ) {
			for ( var column = 0; column < kocke123.numOfColumns; column++ ) {
				if ( boxes[row][column] !== null ) {
					if ( this.hasSameNeighbour ( row, column ) === true ) {
						return true;
					}
				}
			}
		}

		// check how mayn boxes are left, if more than 0 remove a life
		var hasBoxesLeft = false;
		for ( var row = 0; row < kocke123.numOfRows; row++ ) {
			for ( var column = 0; column < kocke123.numOfColumns; column++ ) {
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
			showNextLevelSprite = true;
			level = level + 1;
			setTimeout (
				function () {
					self.startNewLevel ();
				},
				4000
			);
		} else {
			showGameOverSprite = true;
			jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
			jaws.canvas.addEventListener ( 'click', self.handleGameOverClick, false );
		}
	},
	this.update = function () {
		if ( showGameOverSprite === true ) {
			if ( jaws.mouse_x !== previousMouseX && jaws.mouse_y !== previousMouseY ) {
				// determine button hovers
				var mockRectangle = {
					x: jaws.mouse_x,
					y: jaws.mouse_y,
					right: jaws.mouse_x + 1,
					bottom: jaws.mouse_y + 1
				}

				if ( jaws.collideRects ( mockRectangle, newGameSprite.rect () ) ) {
					showNewGameHoverSprite = true;
					updateDraw = true;
				} else {
					showNewGameHoverSprite = false;
					updateDraw = true;
				}

				previousMouseX = jaws.mouse_x;
				previousMouseY = jaws.mouse_y;
			}
		}
	},
	this.drawBoxes = function () {
		for ( var row = 0; row < kocke123.numOfRows; row++ ) {
			for ( var column = 0; column < kocke123.numOfColumns; column++ ) {
				if ( boxes[row][column] !== null ) {
					boxes[row][column].draw ();
				}
			}
		}
	},
	this.draw = function () {
		if ( updateDraw === false ) {
			return;
		}

		jaws.context.clearRect(0,0,jaws.width,jaws.height)

		backgroundLeftSprite.draw ();
		backgroundRightSprite.draw ();
		logoSprite.draw ();
		levelSprite.draw ();
		scoreSprite.draw ();
		livesSprite.draw ();

		// draw border
		jaws.context.lineWidth = kocke123.borderWidth;

		// middle vertical
		jaws.context.strokeStyle =  "black";
		jaws.context.moveTo ( kocke123.boxWidth * kocke123.numOfColumns + (kocke123.borderWidth / 2), 0 );
		jaws.context.lineTo ( kocke123.boxWidth * kocke123.numOfColumns + (kocke123.borderWidth / 2), jaws.height );
		jaws.context.stroke ();

		this.drawBoxes ();

		if ( showNextLevelSprite === true ) {
			nextLevelSprite.draw ();
		}

		if ( showGameOverSprite === true ) {
			gameOverSprite.draw ();
			newGameSprite.draw ();

			if ( showNewGameHoverSprite === true ) {
				newGameHoverSprite.draw ();
			}
		}

		//jaws.context.font = "bold 60pt Cooper Black";
		jaws.context.font = "bold 60pt CooperBlackRegular";
		jaws.context.lineWidth = 10;
		jaws.context.fillStyle =  "rgba(64,64,65, 1)";
		jaws.context.strokeStyle =  "rgba(64,64,65, 1)";

		jaws.context.fillText ( level, kocke123.numOfColumns * kocke123.boxWidth + 90, 210 );

		//jaws.context.font = "bold 40pt Cooper Black";
		jaws.context.font = "bold 40pt CooperBlackRegular";
		if ( score < 100 ) {
			jaws.context.fillText ( score, kocke123.numOfColumns * kocke123.boxWidth + 90, 340 );
		} else if ( score < 1000 ) {
			jaws.context.fillText ( score, kocke123.numOfColumns * kocke123.boxWidth + 70, 340 );
		} else if ( score < 10000 ) {
			jaws.context.fillText ( score, kocke123.numOfColumns * kocke123.boxWidth + 50, 340 );
		} else {
			jaws.context.fillText ( score, kocke123.numOfColumns * kocke123.boxWidth + 30, 340 );
		}

		jaws.context.fillText ( lives, kocke123.numOfColumns * kocke123.boxWidth + 90, 470 );

		updateDraw = false;
	}
}