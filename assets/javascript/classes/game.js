/**
 * Main game class
 * Manages pretty much all game related stuff
 * Including timers etc
 */
var Game = new Class({
	initialize: function(options) {
		// Copy config
		this.sprites = options.sprites;
		this.display = options.display;
		this.raiseCat = false;
		this.spriteState = 2;
		this.rainbows = [];
		this.paused = false;
		this.events = {
			keydown: this.enableRaiseCat.bind(this),
			keyup: this.disableRaiseCat.bind(this),
			keypress: this.togglePause.bind(this)
		};
		this.scoreCount = 0;
		
		// Add events
		document.addEvents(this.events);
		
		// Initialise intervals
		this.intervals = [];
		this.start();
		
		// Set the cats starting position
		this.sprites.cat.setPosition({
			x: 120,
			y: 100
		});
		
		// Reset the cats velocity
		this.sprites.cat.velocity = {
			x: 0,
			y: 0
		};
		
		// Call displayAll once to stop any initial flicker
		this.displayAll();
	},
	pause: function() {
		// Stop all intervals
		this.intervals.each(function(interval) {
			clearInterval(interval);
		});
		
		this.intervals = [];
	},
	start: function() {
		// Display everything (at 24 fps)
		this.intervals.push(setInterval(this.displayAll.bind(this), 1000 / 24));
		
		// Calculate cat movement (at 30 fps)
		this.intervals.push(setInterval(this.moveCat.bind(this), 1000 / 30));
		
		// Manage rainbow movement, addition and removal (at 10 fps)
		this.intervals.push(setInterval(this.manageRainbows.bind(this), 1000 / 10));
		
		// Change the sprite sheet state for the cat (at 3 fps)
		this.intervals.push(setInterval(this.incrementSpriteState.bind(this), 1000 / 3));
	},
	manageRainbows: function() {
		// Move the rainbows to the left
		this.rainbows.each(function(rainbow) {
			rainbow.setPosition({
				x: rainbow.position.x - rainbow.size.x,
				y: rainbow.position.y
			});
		});
		
		// Filter out rainbows that have gone off screen
		this.rainbows = this.rainbows.filter(function(rainbow) {
			if(rainbow.position.x + rainbow.size.x > 0) {
				return true;
			}
			
			return false;
		});
		
		// Add a new rainbow in the cats butt
		this.rainbows.push(Object.clone(this.sprites.rainbow));
		this.rainbows.getLast().setPosition({
			x: this.sprites.cat.position.x,
			y: this.sprites.cat.position.y + 5
		});
	},
	incrementSpriteState: function() {
		this.spriteState -= 1;
		
		if(this.spriteState === -1) {
			this.spriteState = 2;
		}
	},
	moveCat: function() {
		var original = this.sprites.cat.position.y
		
		if(this.raiseCat) {
			// Raise
			this.sprites.cat.addVelocity({
				x: 0,
				y: -0.5
			});
		}
		else {
			// Drop
			this.sprites.cat.addVelocity({
				x: 0,
				y: 0.5
			});
		}
		
		this.sprites.cat.velocity.y = this.sprites.cat.velocity.y.limit(-10, 10);
		this.sprites.cat.applyVelocity();
		
		// If we go out of the world, end the game
		if(
			this.sprites.cat.position.x < 0 ||
			this.sprites.cat.position.x > 520 ||
			this.sprites.cat.position.y < 0 ||
			this.sprites.cat.position.y > 520
		) {
			mainNav.checkTag('game-over');
		}
	},
	displayAll: function() {
		// Draw the background
		this.sprites.background.draw(this.display);
		
		// Draw the rainbows
		this.rainbows.each(function(rainbow) {
			rainbow.draw(this.display);
		});
		
		// Draw the cat
		this.sprites.cat.draw(this.display, {
			x: this.spriteState * 80,
			y: 0,
			width: 80,
			height: 50
		});
		
		// Increment the score
		this.scoreCount += 1;
	},
	enableRaiseCat: function(e) {
		if(e.code === 85) {
			this.raiseCat = true;
		}
	},
	disableRaiseCat: function(e) {
		if(e.code === 85) {
			this.raiseCat = false;
		}
	},
	togglePause: function(e) {
		if(e.code === 112) {
			if(!this.paused) {
				// Pause the game
				this.pause();
				this.paused = true;
			}
			else {
				// Unpause the game
				this.start();
				this.paused = false;
			}
		}
	},
	stop: function() {
		// Remove events
		document.removeEvents(this.events);
		
		// Remove intervals by pausing
		this.pause();
		
		// Save the score
		scoreDisplay.set('text', this.scoreCount);
	}
});