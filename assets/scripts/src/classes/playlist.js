import React from 'react';

class Playlist extends React.Component {

	constructor(props) {

		super(props);

	}

	render(){
		return (
			<div id="player"></div>
		);
	}

}

Playlist.defaultProps = {};

export default Playlist;