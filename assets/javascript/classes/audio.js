/**
 * Audio class
 * Used for the loading and controlling of sound files
 */
var Audio = new Class({
	initialize: function(file, callback) {
		this.element = new Element('audio');
		this.loaded = false;
		
		if(file) {
			this.load(file, callback);
		}
	},
	setTime: function(time) {
		this.element.currentTime = time;
	},
	setVolume: function(volume) {
		this.element.volume = volume;
	},
	getDuration: function() {
		return this.element.duration;
	},
	play: function() {
		this.element.play();
	},
	pause: function() {
		this.element.pause();
	},
	stop: function() {
		this.pause();
		this.setTime(0);
	},
	load: function(file, callback) {
		this.element.onLoad = function() {
			this.loaded = true;
			
			if(callback) {
				callback.call(this);
			}
		}.bind(this);
		
		this.loaded = false;
		this.element.set('src', file);
		this.element.load();
	}
});