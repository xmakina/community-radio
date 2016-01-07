import React from 'react';
import Audience from './audience';

class Room extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			audience: []
		};

		this.socket = io(window.location.href.split("/")[0]+'//'+window.location.href.split("/")[2]+'/radio');
		
		this._bindEvents();
		this._getListeners();

	}

	_bindEvents() {

		this.socket.on('listening', this._getListeners.bind(this));
		this.socket.on('notListening', this._getListeners.bind(this));

	}

	_getListeners() {
		$.get('/radio/listening', (response) => {
			this.setState({audience: response});
		});
	}

	render() {

		return (

			<div className="room-wrapper">
				<input type="checkbox" className="toggle-overlay" />
				<section id="overlay">

					<img src="https://www.wearetwogether.com/images/us/Gary-Fagan-2.jpg" />

					<h3>Gary Fagan</h3>
					<h3>Boulevard Of Broken Dreams by Green Day</h3>
					
					<h3>Audience</h3>

					<Audience listening={this.state.audience}/>

				</section>
			</div>

		);
	}

}

export default Room;