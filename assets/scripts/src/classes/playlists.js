import React from 'react';

class Playlists extends React.Component {

	constructor(props) {

		super(props);

	}

	render(){
		return (

			<div id="playlists">

				<button className="open-playlists"><i className="fa fa-list-ol"></i></button>

				<div className="playlists-window">
					
				</div>

			</div>

		);
	}

}

Playlists.defaultProps = {};

export default Playlists;

/*

1. Need to get all playlists and display them
2. Can set a playlist as active - only one can be active
3. Can remove a playlist
4. Can modify a playlist

*/