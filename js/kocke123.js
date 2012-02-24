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

window.onload = function () {
	/*jaws.assets.add("plane.png")
	jaws.assets.add("bullet.png")*/

	/*jaws.assets.add ( 'images/menu_bg.png' );
	jaws.assets.add ( 'images/title.png' );
	jaws.assets.add ( 'images/1.jpg' );
	jaws.assets.add ( 'images/2.jpg' );
	jaws.assets.add ( 'images/3.jpg' );
	jaws.assets.add ( 'images/4.jpg' );
	jaws.assets.add ( 'images/5.jpg' );*/

	jaws.assets.add ( 'images/splash_screen/background.png' );
	jaws.assets.add ( 'images/splash_screen/logo.png' );
	jaws.assets.add ( 'images/splash_screen/title.png' );

	//jaws.start ( MenuState );
	//jaws.start ( PlayState );
	jaws.start ( SplashScreenState );
}