import React from 'react';
//import Input from './input';

class Search extends React.Component {

	constructor(props) {

		super(props);
		this.state = {
			keyword: '',
			songs: [],
			selected: [],
			searching: false
		};

	}

	throttleSearch(method, threshhold) {
		var threshhold = threshhold || 250,
			now = +new Date,
			args = Array.prototype.slice.call(arguments);
		if(this.lastThrottle && now < this.lastThrottle + threshhold) {
			clearTimeout(this.deferTimer);
			this.deferTimer = setTimeout(() => {
				this.lastThrottle = now;
				method.apply(this, args);
			}, threshhold);
		} else {
			this.lastThrottle = now;
			method.apply(this, args);
		}
	}

	search(e) {
		this.setState({
			keyword: e.target.value,
			searching: true
		});
		if(!e.target.value) {
			this.setState({songs: []});
		}
		this.throttleSearch(() => {
			this.setState({searching: false});
			$.get('/media/search/'+encodeURIComponent(this.state.keyword), (response) => {
				this.setState({songs: response.items});
			});
		}, 2000);
	}

	selectSong(song) {
		this.props.onSelect(song);
	}

	render(){
		return (
			<div className="search">
				<input type="text" onChange={this.search.bind(this)} placeholder="Search for song" value={this.state.keyword} />
				{(() => {
					if(this.state.searching) {
						return <h1>Searching...</h1>
					} else {
						return (
							<ul>
								{this.state.songs.map((song, i) => {
									return (
										<li key={i} onClick={this.selectSong.bind(this, song)}>
											<img src={song.snippet.thumbnails.medium.url} width="100"/>
											<span>{song.snippet.title}</span>
										</li>
									)
								})}
							</ul>
						)
					}
				})()}
			</div>
		);
		
	}

}

Search.defaultProps = {};

export default Search;