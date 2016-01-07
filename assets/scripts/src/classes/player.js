import React from 'react';
import ReactDOM from 'react-dom';
import Youtube from '../utils/youtube';
import Cookies from '../utils/cookies';

class Player extends React.Component {

	constructor(props) {

		super(props);
		this.makePlayer();
	}

	changeVideo(videoId) {
		this.player.loadVideoById(videoId);
	}

	makePlayer() {

		Youtube.onReady(() => {
			this.player = new YT.Player(ReactDOM.findDOMNode(this), {
				videoId: 'RzB6JlEVYcQ',
				events: {
					onReady: (event) => {
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