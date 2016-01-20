import React from 'react';
import ReactDOM from 'react-dom';
import Youtube from '../utils/youtube';
import Cookies from '../utils/cookies';

class Player extends React.Component {

	constructor(props) {

		super(props);
		
		this.socket = io(window.location.href.split("/")[0]+'//'+window.location.href.split("/")[2]+'/radio');

		this.socket.on('newSong', (info) => {
			this.changeVideo(info.id);
		});

		this.socket.on('songDetails', (data) => {
			if(!this.made) this.makePlayer(data.id, data.elapsed);
		});

	}

	changeVideo(videoId) {
		console.log("changing video");
		this.player.loadVideoById(videoId);
	}

	makePlayer(id, elapsed) {
		this.made = true;
		Youtube.onReady(() => {
			this.player = new YT.Player(ReactDOM.findDOMNode(this), {
				videoId: id,
				events: {
					onReady: (event) => {
						event.target.seekTo(elapsed || 0);
						event.target.playVideo();
						if(Cookies.cookies.volume) this.player.setVolume(Cookies.cookies.volume);
					}
				},
				playerVars: { 
					controls: 0,
					rel: 0,
					showinfo: 0
				}
			});
		});

	}

	render(){
		return (
			<div id="player"></div>
		);
	}

}

Player.defaultProps = {};

export default Player;