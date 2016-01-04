class Youtube {

	constructor() {
		this.state = {};
		this.readyCallbacks = [];
		this.loadScripts();
	}

	onReady(callback, isReady) {
		if(isReady && !callback) {
			this.ready = true;
			for(let i=0;i<this.readyCallbacks.length;i++) this.readyCallbacks[i]();
			this.readyCallbacks = [];
		}
		if(!this.ready && callback) {
			this.readyCallbacks.push(callback);
		} else if(this.ready && callback){
			callback();
		}
	}

	loadScripts() {

		var tag = document.createElement('script'),
			placement = document.getElementsByTagName('script')[0];

		tag.src = "https://www.youtube.com/iframe_api";
		placement.parentNode.insertBefore(tag, placement);

	}

	set playerState(data) {
		if (data == YT.PlayerState.PLAYING && !this.state.done) {
			this.state.done = true;
		}
	}

	get ready() {
		return this.isReady;
	}

	set ready(isReady) {
		this.isReady = isReady;
	}

};

let youtube = new Youtube();

window.onYouTubeIframeAPIReady = () => {
	youtube.onReady(null, true);
};

window.onPlayerStateChange = (event) => {
	youtube.playerState = event.data;
}

export default youtube;