/**
 * Navigation class
 * Can be used with any marker such as the pages hash
 * Use it to show and hide elements like pages
 */
var Navigation = new Class({
	initialize: function(changeHandler) {
		this.changeHandler = changeHandler;
	},
	checkTag: function(tag) {
		if(this.currentTag !== tag) {
			this.changeHandler(this.currentTag || false, tag);
			this.currentTag = tag;
		}
	}
});