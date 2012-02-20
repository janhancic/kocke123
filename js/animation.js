function MenuState () {
	var background = null;

	this.setup = function () {
		background = new jaws.Sprite ( {
			image: "images/menu_bg.png",
			x: 0,
			y: 0
		} );
	}

	var doRotate = true;
	this.update = function () {
		if ( doRotate === true ) {
			background.angle += 3;
			background.y += 3;
			if ( background.angle === 360 ) {
				doRotate = false;
			}
		}

		background.x = jaws.width / 2 - background.width / 2;

		
	}

	this.draw = function() {
		jaws.context.clearRect(0,0,jaws.width,jaws.height)
		background.draw ();
	}
}

window.onload = function () {
	jaws.assets.add ( 'images/menu_bg.png' );

	jaws.start ( MenuState );
}