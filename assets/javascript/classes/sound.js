/**
 * Sound class
 * Used for the loading and controlling of sound files
 */
var Sound = new Class({
	initialize: function(file, callback) {
		this.element = new Audio();
		this.loaded = false;
		this.callback = null;
		this.element.addEventListener('canplaythrough', this.loadedCallback.bind(this), false);
		
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
	loadedCallback: function() {
		this.loaded = true;
		
		if(this.callback) {
			this.callback.call(this);
			this.callback = null;
		}
	},
	load: function(file, callback) {
		this.callback = callback;
		this.loaded = false;
		this.element.set('src', file);
		this.element.load();
	}
});