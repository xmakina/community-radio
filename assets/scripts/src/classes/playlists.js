import React from 'react';
import Dom from '../utils/dom';

class Playlists extends React.Component {

	constructor(props) {

		super(props);

	}

	toggleOpen(){
		Dom.$body.toggleClass('playlist-open');
	}

	render(){
		return (

			<div id="playlists">

				<button className="open-playlists" onClick={this.toggleOpen.bind(this)}><i className="fa fa-list"></i> Playlists</button>

				<div className="playlists-window">
					<h1>Playlists</h1>
					<ul>
						<li>
							test
						</li>
					</ul>
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