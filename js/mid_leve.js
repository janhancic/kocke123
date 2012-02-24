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