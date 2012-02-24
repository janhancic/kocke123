function SplashScreenState () {
	background = null;
	var logo = null;
	var title = null;
	var self = this;

	this.setup = function () {
		background = new jaws.Sprite ( {
			image: 'images/splash_screen/background.png',
			x: 0,
			y: 0
		} );

		logo = new jaws.Sprite ( {
			image: "images/splash_screen/logo.png",
			x: jaws.width / 2,
			y: 0,
			anchor: 'center'
		} );

		title = new jaws.Sprite ( {
			image: "images/splash_screen/title.png",
			x: jaws.width / 2,
			y: 100,
			alpha: 0,
			anchor: 'center'
		} );

		jaws.canvas.addEventListener ( 'click', self.handleClick, false );
	}

	this.handleClick = function () {
		jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
		jaws.switchGameState ( PlayState );
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
						//jaws.switchGameState ( PlayState );
						jaws.canvas.removeEventListener ( 'click', self.handleClick, false );
					},
					1000
				);
			}
		}
	}

	this.draw = function() {
		jaws.context.clearRect ( 0, 0, jaws.width, jaws.height );
		/*jaws.context.fillStyle = "rgba(0, 0, 0, 0)";
		jaws.context.fillRect(0, 0, jaws.width, jaws.height);*/
		/*logo.draw ();
		title.draw ();*/

		background.draw ();
		logo.draw ();
		title.draw ();
	}
}