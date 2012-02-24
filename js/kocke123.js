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
boxTypes[0] = 'images/play/box1.png';
boxTypes[1] = 'images/play/box2.png';
boxTypes[2] = 'images/play/box3.png';
boxTypes[3] = 'images/play/box4.png';
boxTypes[4] = 'images/play/box5.png';
boxTypes[5] = 'images/play/box6.png';
boxTypes[6] = 'images/play/box7.png';
boxTypes[7] = 'images/play/box8.png';

var boxWidth = 25;
var boxHeight = 25;

function Box ( boxType, row, column ) {
	this.boxType = boxType;
	this.row = row;
	this.column = column;
	this.width = boxWidth;
	this.height = boxHeight;
	this.x = this.column * this.width;
	this.y = this.row * this.height;

	jaws.Sprite.call ( this, { image: boxTypes[this.boxType], x: this.x, y: this.y } );
	this.setWidth ( boxWidth );
	this.setHeight ( boxHeight );
}
Object.extend ( Box, jaws.Sprite );

Box.prototype.setPosition = function ( row, column ) {
	this.row = row;
	this.column = column;
	this.x = this.column * this.width;
	this.y = this.row * this.height;
}

window.onload = function () {
	/*jaws.assets.add("plane.png")
	jaws.assets.add("bullet.png")*/

	/*jaws.assets.add ( 'images/menu_bg.png' );
	jaws.assets.add ( 'images/title.png' );*/
	/*jaws.assets.add ( 'images/1.jpg' );
	jaws.assets.add ( 'images/2.jpg' );
	jaws.assets.add ( 'images/3.jpg' );
	jaws.assets.add ( 'images/4.jpg' );
	jaws.assets.add ( 'images/5.jpg' );*/

	jaws.assets.add ( 'images/splash_screen/background.png' );
	jaws.assets.add ( 'images/splash_screen/logo.png' );
	jaws.assets.add ( 'images/splash_screen/title.png' );

	jaws.assets.add ( 'images/play/background_left.png' );
	jaws.assets.add ( 'images/play/background_right.png' );
	jaws.assets.add ( 'images/play/logo.png' );
	jaws.assets.add ( 'images/play/level.png' );
	jaws.assets.add ( 'images/play/score.png' );
	jaws.assets.add ( 'images/play/lives.png' );
	jaws.assets.add ( 'images/play/next_level.png' );
	jaws.assets.add ( 'images/play/box1.png' );
	jaws.assets.add ( 'images/play/box2.png' );
	jaws.assets.add ( 'images/play/box3.png' );
	jaws.assets.add ( 'images/play/box4.png' );
	jaws.assets.add ( 'images/play/box5.png' );
	jaws.assets.add ( 'images/play/box6.png' );
	jaws.assets.add ( 'images/play/box7.png' );
	jaws.assets.add ( 'images/play/box8.png' );
	jaws.assets.add ( 'images/play/game_over.png' );
	jaws.assets.add ( 'images/play/new_game.png' );
	jaws.assets.add ( 'images/play/new_game_hover.png' );

	//jaws.start ( MenuState );
	jaws.start ( PlayState );
	//jaws.start ( SplashScreenState );
}