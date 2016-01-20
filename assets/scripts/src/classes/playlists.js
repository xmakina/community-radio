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
			selectedPlaylist: false,
			activePlaylist: window._bootstrapData.activePlaylist || false
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
		$.get('/media/details/'+playlist.songs.join(','), (response) => {
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

	makeActive(playlist) {
		$.ajax({
			method: 'POST',
			url: '/settings',
			data: {
				activePlaylist: playlist._id
			},
			success: (response) => {
				this.setState({activePlaylist: playlist._id});
			},
			error: (body, type, err) => {
				console.log(err);
			}
		})
	}

	render() {
		return (
			<div id="playlists">
				<button className="open-playlists" onClick={this.toggleOpen.bind(this)}><i className="fa fa-list"></i> Playlists</button>
				<div className="playlists-window">
					<button type="button" className="new-playlist" onClick={this.createPlaylist.bind(this)}><i className={this.state.playlistFormOpen ? "fa fa-close" : "fa fa-plus"}></i> {this.state.playlistFormOpen ? 'Back To Playlists' : 'New Playlist' }</button>
					<PlaylistForm open={this.state.playlistFormOpen} playlist={this.state.selectedPlaylist} onSave={this.onSave.bind(this)} />
					{(() => {
						if(!this.state.playlistFormOpen) return (
							<div className="playlists-list">
								<h2>Playlists</h2>
								<ul className="playlists-list-wrapper">
									{this.state.playlists.map((playlist, i) => {
										return (
											<li key={i} className={this.state.activePlaylist == playlist._id ? 'is-active' : null}>
												<h3>{playlist.name}</h3>
												<button onClick={this.editPlaylist.bind(this, playlist)} className="edit-playlist">Edit</button>
												<button className="delete-playlist" onClick={this.deletePlaylist.bind(this, playlist)}>Delete Playlist</button>
												{this.state.activePlaylist != playlist._id ? <button className="toggle-playlist" onClick={this.makeActive.bind(this, playlist)}>Make Active</button> : null}
											</li>
										);
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