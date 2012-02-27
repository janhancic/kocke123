var boxTypes = [];

var kocke123 = {
	boxWidth: 25,
	boxHeight: 25,
	boxTypes: [
		'images/play/box1.png',
		'images/play/box2.png',
		'images/play/box3.png',
		'images/play/box4.png',
		'images/play/box5.png',
		'images/play/box6.png',
		'images/play/box7.png',
		'images/play/box8.png'
	],
	numOfRows: 21,
	numOfColumns: 22,
	//numOfRows: 10,
	//numOfColumns: 10,
	borderWidth: 4,
	numOfLives: 6
};

window.onload = function () {
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

	jaws.start ( PlayState );
	//jaws.start ( SplashScreenState );
}