/**
 * Sprite class
 * Extends the Rectangle class
 * Allows for image loading and drawing
 */
var Sprite = new Class({
	Extends: Rectangle,
	initialize: function(options, path, callback) {
		// Pass the options up to the Rectangle class
		this.parent(options);
		
		this.resize = options.resize || options.size;
		
		this.loaded = false;
		
		this.velocity = {
			x: 0,
			y: 0
		};
		
		// If there is a path, load an image
		if(path) {
			this.loadImage(path, callback);
		}
	},
	loadImage: function(path, callback) {
		// Initialise the image and set the onload listener
		var temp = new Image();
		this.loaded = false;
		
		temp.onload = function() {
			// When done loading, store the image and run the callback
			this.image = new Element('canvas');
			this.image.width = this.resize.x;
			this.image.height = this.resize.y;
			this.image.getContext('2d').drawImage(temp, this.position.x, this.position.y, this.resize.x, this.resize.y);
			this.loaded = true;
			
			if(callback) {
				callback.call(this);
			}
		}.bind(this);
		
		// Set the src of the image to begin loading
		temp.src = path;
	},
	draw: function(target, offset) {
		// Draw the image onto the target
		// Use offset if required, it is basically a clipping mask for sprite sheets
		if(offset) {
			target.drawImage(this.image, offset.x, offset.y, offset.width, offset.height, (this.position.x + 0.5) << 0, (this.position.y + 0.5) << 0, offset.width, offset.height);
		}
		else {
			target.drawImage(this.image, (this.position.x + 0.5) << 0, (this.position.y + 0.5) << 0);
		}
	},
	addVelocity: function(velocity) {
		this.velocity.x += velocity.x;
		this.velocity.y += velocity.y;
	},
	applyVelocity: function() {
		this.setPosition({
			x: this.position.x + this.velocity.x,
			y: this.position.y + this.velocity.y
		});
	}
});