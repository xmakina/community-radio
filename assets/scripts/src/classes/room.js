import React from 'react';
import Audience from './audience';

class Room extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			audience: [],
			song: null,
			dj: null
		};

		this.socket = io(window.location.href.split("/")[0]+'//'+window.location.href.split("/")[2]+'/radio');
		
		this._bindEvents();
		this._getListeners();

	}

	_bindEvents() {
		this.socket.on('listening', this._getListeners.bind(this));
		this.socket.on('notListening', this._getListeners.bind(this));
		this.socket.on('songDetails', this._setOverlayDetails.bind(this));
		this.socket.on('newSong', this._setOverlayDetails.bind(this));
	}

	_getListeners() {
		$.get('/radio/listening', (response) => {
			this.setState({audience: response});
		});
	}

	_setOverlayDetails(songInfo) {
		this.setState({dj: songInfo.dj ? songInfo.dj.username : null});
		$.get('/media/details/'+songInfo.id, (response) => {
			if(response.items[0]) {
				this.setState({song: response.items[0]});
			}
		});
	}

	render() {

		return (

			<div className="room-wrapper">
				<input type="checkbox" className="toggle-overlay" />
				<section id="overlay">

					<img src={this.state.dj ? 'https://www.wearetwogether.com/images/us/Gary-Fagan-2.jpg' : 'https://www.steamid.co.uk/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'} />

					<h3>{this.state.dj ? this.state.dj : 'Community.dj Bot'}</h3>

					{(() => {
						if(this.state.song) {
							return <h3>{this.state.song.snippet.title}</h3>
						}
					})()}
					
					<h3>Audience</h3>

					<Audience listening={this.state.audience}/>

				</section>
			</div>

		);
	}

}

export default Room;