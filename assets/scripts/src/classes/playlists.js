import React from 'react';
import Dom from '../utils/dom';
import PlaylistForm from './playlistForm';

class Playlists extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			playlists: [],
			open: false,
			playlistFormOpen: false,
			selectedPlaylist: false
		};

		$.get('/playlists/'+window._bootstrapData.guid, (response) => {
			this.setState({playlists: response});
		});

	}

	toggleOpen() {
		this.setState({open: !this.state.open});
		Dom.$body.toggleClass('playlist-open', this.state.open);
	}

	createPlaylist() {
		this.setState({
			selectedPlaylist: false,
			playlistFormOpen: !this.state.playlistFormOpen
		});
	}

	editPlaylist(playlist) {
		$.get('https://www.googleapis.com/youtube/v3/videos?id='+playlist.songs.join(',')+'&part=contentDetails,status,snippet&key=AIzaSyABtT6HgNEXwI2tJwN7C43QXfyV9Km7fkU', (response) => {
			playlist.songs = response.items;
			this.setState({
				selectedPlaylist: playlist,
				playlistFormOpen: true
			});
		});
	}

	deletePlaylist(playlist) {
		$.ajax({
			method: 'DELETE',
			url: '/playlists/'+playlist._id,
			success: (response) => {
				var playlists = this.state.playlists,
					index = playlists.findIndex(data => data._id == playlist._id);
				playlists.splice(index, 1);
				this.setState({playlists});
			},
			error: (err) => {
				console.log(err);
			}
		});
	}

	onSave(playlist) {
		var playlists = this.state.playlists,
			inPlaylists = playlists.findIndex(data => data._id == playlist._id);
		if(inPlaylists !== -1) {
			playlists[inPlaylists] = playlist;
		} else {
			playlists.push(playlist);
		}
		this.setState({
			playlists: playlists,
			playlistFormOpen: false,
			selectedPlaylist: false
		});
	}

	render() {
		return (
			<div id="playlists">
				<button className="open-playlists" onClick={this.toggleOpen.bind(this)}><i className="fa fa-list"></i> Playlists</button>
				<div className="playlists-window">
					<button type="button" onClick={this.createPlaylist.bind(this)}><i className={this.state.playlistFormOpen ? "fa fa-close" : "fa fa-plus"}></i> {this.state.playlistFormOpen ? 'Back To Playlists' : 'New Playlist' }</button>
					<PlaylistForm open={this.state.playlistFormOpen} playlist={this.state.selectedPlaylist} onSave={this.onSave.bind(this)} />
					{(() => {
						if(!this.state.playlistFormOpen) return (
							<div className="playlists-list">
								<h2>Playlists</h2>
								<ul>
									{this.state.playlists.map((playlist, i) => {
										return <li key={i}>{playlist.name} <button onClick={this.editPlaylist.bind(this, playlist)}>Edit</button> <button onClick={this.deletePlaylist.bind(this, playlist)}>Delete</button></li>;
									})}
								</ul>
							</div>
						)
					})()}
				</div>
			</div>
		);
	}

}

Playlists.defaultProps = {};

export default Playlists;