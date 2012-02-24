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