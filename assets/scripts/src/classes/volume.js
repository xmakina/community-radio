import React from 'react';
import Parser from 'react-dom-parser';
import Cookies from '../utils/cookies';

class Volume extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			volumeLevel: 100,
			muted: false
		};

		if(Cookies.cookies.volume) this.state.volumeLevel = Cookies.cookies.volume;

		Parser.onParseComplete(() => {
			this.domPlayer = Parser.getByNode(document.getElementById('player'));
		});

	}

	setVolume(percentage) {

		this.domPlayer.player.setVolume(percentage);
		if(percentage > 0 && this.state.muted) {
			this.toggleMute();
		}
		this.setState({volumeLevel: percentage});
		Cookies.set('volume', percentage);

	}

	drag(e) {

		e.preventDefault();

		var mouseMove = (e) => {
				var percent = (e.pageX - this.refs.slider.getBoundingClientRect().left) / this.refs.slider.getBoundingClientRect().width * 100;
				if (percent < 0) {
					percent = 0;
				} else if (percent > 100) {
					percent = 100;
				}
				this.setVolume(percent);
			},
			clearListeners = (e) => {
				document.removeEventListener('mousemove', mouseMove);
				document.removeEventListener('mouseup', clearListeners);
			}

		document.addEventListener('mousemove', mouseMove);
		document.addEventListener('mouseup', clearListeners);

	}

	toggleMute() {
		if(this.state.volumeLevel == 0){
			this.setVolume(100);
			this.setState({muted: false});
			this.domPlayer.player.unMute();
		} else if(this.state.muted){
			this.setState({muted: false});
			this.domPlayer.player.unMute()
		} else {
			this.setState({muted: true});
			this.domPlayer.player.mute();
		}
	}

	jumpTo(e) {
		var percent = (e.pageX - this.refs.slider.getBoundingClientRect().left) / this.refs.slider.getBoundingClientRect().width * 100;
		if (percent < 0) {
			percent = 0;
		} else if (percent > 100) {
			percent = 100;
		}
		this.setVolume(percent);
	}

	render() {
		return (
			<div className="volume-wrap">
				<button id="volume" onClick={this.toggleMute.bind(this)}>
					<span className={this.state.muted || this.state.volumeLevel === 0 ? "fa fa-volume-off" : (this.state.volumeLevel < 50 ? "fa fa-volume-down" : "fa fa-volume-up")}></span>
				</button>
				<div className="volume-panel">
					<div className="volume-slider" ref="slider" onClick={this.jumpTo.bind(this)}>
						<div className="volume-slider-track">
							<div className="volume-slider-progress" style={{width: (this.state.muted ? 0 : this.state.volumeLevel+'%')}}>
								<div className="volume-slider-handle" onMouseDown={this.drag.bind(this)}></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

Volume.defaultProps = {
	muted: false
};

export default Volume;