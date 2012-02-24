function PlayState () {
	var boxes;
	var borderWidth = 4;
	var numOfRows = 21;
	//numOfRows = 10;
	var numOfColumns = 22;
	//numOfColumns = 10;
	var score = 0;
	//var lives = 10;
	var lives = 10;
	var level = 1;
	var self = this;
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

	this.setup = function ( options ) {
		jaws.context.clearRect(0,0,jaws.width,jaws.height)

		if ( options ) {
			score = options.score;
			lives = options.lives;
			level = options.level;
		}

		backgroundLeftSprite = new jaws.Sprite ( { image: 'images/play/background_left.png', x: 0, y: 0 } );

		backgroundRightSprite = new jaws.Sprite ( {
			image: 'images/play/background_right.png',
			x: numOfColumns * boxWidth + borderWidth,
			y: 0
		} );

		logoSprite = new jaws.Sprite ( {
			image: "images/play/logo.png",
			x: numOfColumns * boxWidth + borderWidth + 25,
			y: 20
		} );

		levelSprite = new jaws.Sprite ( {
			image: "images/play/level.png",
			x: numOfColumns * boxWidth + borderWidth + 20,
			y: 100
		} );

		scoreSprite = new jaws.Sprite ( {
			image: "images/play/score.png",
			x: numOfColumns * boxWidth + borderWidth + 20,
			y: 260
		} );

		livesSprite = new jaws.Sprite ( {
			image: "images/play/lives.png",
			x: numOfColumns * boxWidth + borderWidth + 20,
			y: 380
		} );

		nextLevelSprite = new jaws.Sprite ( { image: 'images/play/next_level.png', x: 0, y: 0 } );

		gameOverSprite = new jaws.Sprite ( { image: 'images/play/game_over.png', x: 0, y: 0 } );

		newGameSprite = new jaws.Sprite ( {
			image: 'images/play/new_game.png',
			x: ( numOfColumns * boxWidth ) / 2,
			y: 200,
			anchor: 'center'
		} );

		newGameHoverSprite = new jaws.Sprite ( {
			image: 'images/play/new_game_hover.png',
			x: ( numOfColumns * boxWidth ) / 2,
			y: 200,
			anchor: 'center'
		} );

		this.startNewLevel ();

		jaws.canvas.addEventListener ( 'click', this.handleClick, false );
		//jaws.canvas.addEventListener ( 'click', this.handleGameOverClick, false );
	},
	this.handleClick = function () {
		var column = jaws.mouse_x;
		var row = jaws.mouse_y;

		column = Math.floor ( column / boxWidth );
		row = Math.floor ( row / boxHeight );
		console.log ( column + ' ' + row );

		if ( column < numOfColumns && row < numOfRows ) {
			// "playing" field was clicked
			// now check if there is a box there ...
			if ( boxes[row][column] !== null ) {
				self.removeBox ( row, column );
			}
		}
	},
	this.handleGameOverClick = function () {

	},
	this.startNewLevel = function () {
		showNextLevelSprite = false;
		showGameOverSprite = false;

		var numOfBoxesToGenerate = 3;
		if ( level === 3 || level === 4 ) {
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
		boxes = new Array ( numOfRows );
		for ( var row = 0; row < numOfRows; row++ ) {
			boxes[row] = new Array ( numOfColumns );
			for ( var column = 0; column < numOfColumns; column++ ) {
				var boxType = Math.floor ( Math.random () * numOfBoxesToGenerate );
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
			showNextLevelSprite = true;
			level = level + 1;
			setTimeout (
				function () {
					self.startNewLevel ();
				},
				3000
			);

			//jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
			//jaws.switchGameState ( MidLevelState, null, { score: score, lives: lives, level: level + 1 } );
		} else {
			showGameOverSprite = true;
			jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
			jaws.canvas.addEventListener ( 'click', this.handleGameOverClick, false );
			//jaws.switchGameState ( GameOverState, null, score );
		}
	},
	this.update = function () {
		if ( showGameOverSprite === true ) {
			// determine hovers
			var mockRectangle = {
				x: jaws.mouse_x,
				y: jaws.mouse_y,
				right: jaws.mouse_x + 1,
				bottom: jaws.mouse_y + 1
			}
// naredi da preveriš če se je pozicija spremenila da ne updejtaš skoz za bv
			if ( jaws.collideRects ( mockRectangle, newGameSprite.rect () ) ) {
				showNewGameHoverSprite = true;
				updateDraw = true;
			} else {
				showNewGameHoverSprite = false;
				updateDraw = true;
			}
		}
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
		jaws.context.lineWidth = borderWidth;

		// middle vertical
		jaws.context.strokeStyle =  "black";
		jaws.context.moveTo ( boxWidth * numOfColumns + (borderWidth / 2), 0 );
		jaws.context.lineTo ( boxWidth * numOfColumns + (borderWidth / 2), jaws.height );
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

		jaws.context.font = "bold 60pt Cooper Black";
		jaws.context.lineWidth = 10;
		jaws.context.fillStyle =  "rgba(64,64,65, 1)";
		jaws.context.strokeStyle =  "rgba(64,64,65, 1)";

		jaws.context.fillText ( level, numOfColumns * boxWidth + 90, 210 );

		jaws.context.font = "bold 40pt Cooper Black";
		if ( score < 100 ) {
			jaws.context.fillText ( score, numOfColumns * boxWidth + 90, 340 );
		} else if ( score < 1000 ) {
			jaws.context.fillText ( score, numOfColumns * boxWidth + 70, 340 );
		} else if ( score < 10000 ) {
			jaws.context.fillText ( score, numOfColumns * boxWidth + 50, 340 );
		} else {
			jaws.context.fillText ( score, numOfColumns * boxWidth + 30, 340 );
		}

		jaws.context.fillText ( lives, numOfColumns * boxWidth + 90, 470 );

		updateDraw = false;
	}
}