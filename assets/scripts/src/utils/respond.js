var respond = {

	callbacks: [],

	change: function(callback){
		if(this.callbacks.indexOf(callback) == -1) this.callbacks.push(callback);
	},

	getBreakpoint: function(){
		var width = $(window).width(),
			breakpoint = 'desktop';
		for(var key in this.breakpoints){
			if(width < this.breakpoints[key]){
				breakpoint = key;
			}
		}
		if(breakpoint != this.breakpoint){
			this.breakpoint = breakpoint;
			for(var i=0;i<this.callbacks.length;i++){
				this.callbacks[i](this.breakpoint);
			}
		}
	},

	breakpoints: {
		tablet: 900
	},

	breakpoint: 'desktop'
}

$(window).on('resize', function(){
	respond.getBreakpoint();
});

setTimeout(function(){respond.getBreakpoint();});

module.exports = respond;