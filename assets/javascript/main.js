var sprites = {},
	display = null;

/**
 * Main script, runs basically everything on DOM ready
 */
document.addEvent('domready', function() {
	// Load the sprites
	sprites.cat = new Sprite({
		size: {
			x: 80,
			y: 50
		},
		position: {
			x: 0,
			y: 0
		}
	}, 'assets/images/nyan-cat.png', setUpNav);
	
	sprites.wall = new Sprite({
		size: {
			x: 30,
			y: 500
		},
		position: {
			x: 0,
			y: 0
		}
	}, 'assets/images/wall.png', setUpNav);
	
	sprites.rainbow = new Sprite({
		size: {
			x: 3,
			y: 12
		},
		position: {
			x: 0,
			y: 0
		}
	}, 'assets/images/rainbow.png', setUpNav);
	
	display = $('display').getContext('2d');
});

function setUpNav() {
	// Make sure all are loaded
	if(!sprites.cat.loaded || !sprites.wall.loaded || !sprites.rainbow.loaded) {
		return false
	}
	
	// Loaded, set up page management
	var mainNav = new Navigation(function(from, to) {
		if(from) {
			$('page:' + from).addClass('hidden');
		}

		if(to) {
			$('page:' + to).removeClass('hidden');
		}
	});

	mainNav.checkTag('menu');

	$$('a[data-page]').addEvent('click', function() {
		mainNav.checkTag(this.get('data-page'));
	});
}