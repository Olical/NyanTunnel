/**
 * Rectangle class
 * Used for things that need a box and collision detection
 * Requires the Point class
 */
var Rectangle = new Class({
	initialize: function(options) {
		// Store the configuration and calculate the points
		this.size = options.size;
		this.position = options.position;
		this.calculatePoints();
	},
	calculatePoints: function() {
		// Calculate a new set of points
		this.points = [
			new Point({ // Top left [0]
				x: this.position.x,
				y: this.position.y
			}),
			new Point({ // Top right [1]
				x: this.position.x + this.size.x,
				y: this.position.y
			}),
			new Point({ // Bottom right [2]
				x: this.position.x + this.size.x,
				y: this.position.y + this.size.y
			}),
			new Point({ // Bottom left [3]
				x: this.position.x,
				y: this.position.y + this.size.y
			})
		];
	},
	setSize: function(size) {
		// Set the new size and recalculate the points
		this.size = size;
		this.calculatePoints();
	},
	setPosition: function(position) {
		// Set the new position and recalculate the points
		this.position = position;
		this.calculatePoints();
	},
	testCollision: function(test) {
		// Check if any of the points are within the test rectangles bounds
		// If so, return true
		return this.points.some(function(point) {
			if(
				point.x > test.position.x &&
				point.x < test.position.x + test.size.x &&
				point.y > test.position.y &&
				point.y < test.position.y + test.size.y
			) {
				return true;
			}
			
			return false;
		});
	}
});