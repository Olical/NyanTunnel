/**
 * Main script, runs basically everything on DOM ready
 */
document.addEvent('domready', function() {
	// Set up page management
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
});