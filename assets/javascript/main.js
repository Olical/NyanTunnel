var sprites = {},
	display = null,
	mainNav = null,
	game = null,
	scoreDisplay = null,
	backgroundMusic = null;

/**
 * Main script, runs basically everything on DOM ready
 */
document.addEvent('domready', function() {
	// Load the sprites
	sprites.cat = new Sprite({
		resize: {
			x: 240,
			y: 50
		},
		size: {
			x: 80,
			y: 50
		},
		position: {
			x: 0,
			y: 0
		}
	}, 'assets/images/nyan-cat.png', checkLoadState);
	
	sprites.wall = new Sprite({
		size: {
			x: 30,
			y: 500
		},
		position: {
			x: 0,
			y: 0
		}
	}, 'assets/images/wall.png', checkLoadState);
	
	sprites.rainbow = new Sprite({
		size: {
			x: 15,
			y: 40
		},
		position: {
			x: 0,
			y: 0
		}
	}, 'assets/images/rainbow.png', checkLoadState);
	
	sprites.background = new Sprite({
		size: {
			x: 600,
			y: 600
		},
		position: {
			x: 0,
			y: 0
		}
	}, 'assets/images/background.png', checkLoadState);
	
	// Load the music
	backgroundMusic = new Audio('assets/audio/nyan-cat.ogg', checkLoadState);
	
	// Set up page management
	mainNav = new Navigation(function(from, to) {
		if(from) {
			$('page:' + from).addClass('hidden');
			
			// If from is play then clean up
			if(from === 'play') {
				game.stop();
			}
		}

		if(to) {
			$('page:' + to).removeClass('hidden');
			
			// If we are going to play then start the game
			if(to === 'play') {
				game = new Game({
					sprites: sprites,
					display: display
				});
			}
		}
	});

	mainNav.checkTag('loading');

	$$('a[data-page]').addEvent('click', function() {
		mainNav.checkTag(this.get('data-page'));
	});
	
	display = $('display').getContext('2d');
	scoreDisplay = $('score-display');
});

function checkLoadState() {
	// Make sure all are loaded
	if(!sprites.cat.loaded || !sprites.wall.loaded || !sprites.rainbow.loaded || !sprites.background.loaded || !backgroundMusic.loaded) {
		return false
	}
	
	// All are loaded, show the menu
	mainNav.checkTag('menu');
}