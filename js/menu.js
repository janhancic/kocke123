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