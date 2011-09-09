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
		this.walls = [];
		this.paused = false;
		this.events = {
			keydown: this.enableRaiseCat.bind(this),
			keyup: this.disableRaiseCat.bind(this),
			keypress: this.togglePause.bind(this)
		};
		this.scoreCount = 0;
		this.wallStepGap = 500;
		this.gapPosition = Number.random(0, 500);
		this.gapHeight = Number.random(100, 400);
		this.wallsTimeout = null;
		this.alive = true;
		
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
		
		if(this.wallsTimeout) {
			clearTimeout(this.wallsTimeout);
		}
		
		this.intervals = [];
		this.wallsTimeout = null;
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
		
		// Start the wall step timeout
		this.wallsTimeout = setTimeout(this.manageWalls.bind(this), this.wallStepGap);
	},
	manageWalls: function() {
		// If we are not paused mange and then recurse via timeout
		if(!this.paused && this.alive) {
			// Move the walls to the left
			this.walls.each(function(wall) {
				wall.setPosition({
					x: wall.position.x - wall.size.x,
					y: wall.position.y
				});
				
				// Check for a collision
				if(this.sprites.cat.testCollision(wall, {
					width: 96,
					height: 50
				})) {
					// The cat hit a wall D:
					// Oh well, game over
					mainNav.checkTag('game-over');
				}
			}.bind(this));
			
			// Filter out walls that have gone off screen
			this.walls = this.walls.filter(function(wall) {
				if(wall.position.x + wall.size.x > 0) {
					return true;
				}

				return false;
			});
			
			// Add a new wall at the end in a random place
			this.gapPosition = (this.gapPosition + Number.random(-30, 30)).limit(0, 500);
			this.gapHeight = (this.gapHeight + Number.random(-20, 20)).limit(100, 400);
			
			this.walls.push(Object.clone(this.sprites.wall));
			this.walls.getLast().setPosition({
				x: 600 - this.sprites.wall.size.x,
				y: this.gapPosition - 500
			});
			
			this.walls.push(Object.clone(this.sprites.wall));
			this.walls.getLast().setPosition({
				x: 600 - this.sprites.wall.size.x,
				y: this.gapPosition + this.gapHeight
			});
			
			this.wallStepGap -= 10;
			this.wallStepGap = this.wallStepGap.limit(100, 1000);
			this.wallsTimeout = setTimeout(this.manageWalls.bind(this), this.wallStepGap);
		}
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
			this.sprites.cat.position.x > 550 ||
			this.sprites.cat.position.y < 0 ||
			this.sprites.cat.position.y > 550
		) {
			mainNav.checkTag('game-over');
		}
	},
	displayAll: function() {
		// Draw the background
		this.sprites.background.draw(this.display);
		
		// Draw the walls
		this.walls.each(function(wall) {
			wall.draw(this.display);
		});
		
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
		
		this.alive = false;
	}
});