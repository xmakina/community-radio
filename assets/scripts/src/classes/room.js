import React from 'react';
import Audience from './audience';

class Room extends React.Component {

	constructor(props) {

		super(props);

		var socket = io(window.location.href.split("/")[0]+'//'+window.location.href.split("/")[2]+'/radio');
		
		socket.on('listening', function(user){
			console.log(user);
		});

		socket.on('notListening', function(user){
			console.log(user);
		});

	}

	render(){
		return (

			<div className="room-wrapper">
				<input type="checkbox" className="toggle-overlay" />
				<section id="overlay">
					<img src="https://www.wearetwogether.com/images/us/Gary-Fagan-2.jpg" />
					<h3>Gary Fagan</h3>
					<h3>Boulevard Of Broken Dreams by Green Day</h3>
					
					<h3>Audience</h3>

					<Audience />

				</section>
			</div>
		);
	}

}

Room.defaultProps = {
	name: 'radio-room'
};

export default Room;