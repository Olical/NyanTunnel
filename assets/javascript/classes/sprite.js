/**
 * Sprite class
 * Extends the Rectangle class
 * Allows for image loading and drawing
 */
var Sprite = new Class({
	Extends: Rectangle,
	initialise: function(options, path, callback) {
		// Pass the options up to the Rectangle class
		this.parent(options);
		
		// If there is a path, load an image
		if(path) {
			this.loadImage(path, callback);
		}
	},
	loadImage: function(path, callback) {
		// Initialise the image and set the onload listener
		var temp = new Image();
		
		temp.onLoad = function() {
			// When done loading, store the image and run the callback
			this.image = new Element('canvas');
			this.image.width = this.size.x;
			this.image.height = this.size.y;
			this.image.drawImage(temp, this.position.x, this.position.y, this.size.x, this.size.y);
			callback.call(this);
		}.bind(this);
		
		// Set the src of the image to begin loading
		temp.src = path;
	},
	draw: function(target) {
		// Draw the image onto the target
		target.drawImage(this.image, this.position.x, this.position.y);
	}
});