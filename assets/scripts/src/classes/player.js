import React from 'react';
import ReactDOM from 'react-dom';
import Youtube from '../utils/youtube';

class Player extends React.Component {

	constructor(props) {

		super(props);
		this.makePlayer();
	}

	changeVideo(videoId) {
		// use either: RzB6JlEVYcQ, UclCCFNG9q4, RWYOYhAHKDA, YQHsXMglC9A
		this.player.loadVideoById(videoId);
	}

	makePlayer() {

		Youtube.onReady(() => {
			this.player = new YT.Player(ReactDOM.findDOMNode(this), {
				videoId: 'RzB6JlEVYcQ',
				events: {
					onReady: (event) => {
						event.target.playVideo();
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