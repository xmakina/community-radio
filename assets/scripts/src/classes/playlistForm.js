import React from 'react';
import Input from './input';
import Search from './search';

class PlaylistForm extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			songs: [],
			playlistName: '',
			searching: false,
			playlistId: false
		};

	}

	componentWillReceiveProps(props) {
		if(props.playlist) {
			this.setState({
				songs: props.playlist.songs,
				playlistName: props.playlist.name,
				playlistId: props.playlist._id
			});
		} else {
			this.setState({
				songs: [],
				playlistName: '',
				playlistId: false
			});
		}
	}

	addSong(song) {
		var songs = this.state.songs,
			searching = false;
		songs.push(song);
		this.setState({songs, searching});
	}

	removeSong(song) {
		var songs = this.state.songs;
		songs.splice(songs.findIndex(data => data.id.videoId == song.id.videoId), 1)
		this.setState({songs});
	}

	openSearch() {
		this.setState({searching: true});
	}

	closeSearch() {
		this.setState({searching: false});
	}

	save(e) {
		e.preventDefault();
		var songs = this.state.songs.map((song) => {
			return song.id.videoId || song.id;
		});
		$.ajax({
			url: '/playlists'+(this.state.playlistId ? '/'+this.state.playlistId : ''),
			method: 'POST',
			data: {
				songs: JSON.stringify(songs),
				name: this.state.playlistName
			},
			success: (response) => {
				this.props.onSave.call(false, response);
			},
			error: (err) => {
				console.log(err);
			}
		});
	}

	onNameChange(e){
		this.setState({playlistName: e.target.value});
	}

	render(){
		
		return (

			<div id="playlist-form">
				{(() => {
					if(this.props.open) return (
						<form onSubmit={this.save.bind(this)}>
							{(() => {
								if(!this.state.searching) return (
									<div>
										<Input errorMsg="Please a playlist name" onChange={this.onNameChange.bind(this)} required={true} attributes={{type: 'text', name: 'playlist_name', id: 'playlist_name', placeholder: 'Playlist Name', value: this.state.playlistName}}/>
										<ul className="song-list">
											{this.state.songs.map((song, i) => {
												return (
													<li key={i}>
														<img src={song.snippet.thumbnails.medium.url} width="100"/>
														<span className="song-name">{song.snippet.title}</span>
														<button type="button" onClick={this.removeSong.bind(this, song)}>Remove Song</button>
													</li>
												)
											})}
										</ul>
										<button type="button" className="add-song" onClick={this.openSearch.bind(this)}>Add Song</button>
										<button className="save">Save</button>
									</div>
								)
							})()}
							{(() => {
								if(this.state.searching) return (
									<div>
										<button type="button" className="back-to-playlist" onClick={this.closeSearch.bind(this)}>Back to playlist</button>
										<Search onSelect={this.addSong.bind(this)} />
									</div>
								)
							})()}
						</form>
					)
				})()}
			</div>

		);
		
	}

}

PlaylistForm.defaultProps = {
	open: false
};

export default PlaylistForm;