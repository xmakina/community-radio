# Twogether Radio
A live music lobby that rotates between peoples song suggestions, anyone can listen anonymously but internally people can register, listen, create playlists and click ‘start djing’ to queue up their songs.

This app is using node, mongodb (mongoose), react, browserify, babel, sass and gulp, the project will auto build sass and javascript when changes are made and the server will auto reload when node src is changed.

## Running the app:
	
	//Ensure node is up to date for harmony support
	sudo npm cache clean -f
	sudo npm install -g n
	sudo n stable

	//Ensure mongodb is installed and mongodb is running
	sudo mongod

	//Install dependencies
	npm install

	// Start gulp
	gulp

visit http://localhost:3000

## Core functionality/things to do

### 1. People can listen to music from youtube synchronously 
- Videos are loaded in from youtube id's passed in from node via websockets
- Videos will play synchronously across all clients
- Video functionality will be stripped away and we will use the youtube api to render just the audio
- Pausing the video will be disabled
- User will be able to control volume
- A default playlist will be setup that loops over continuously

Stuff to think about
- How do we know that a video has ended to emit the next video id
- What happens if someone starts listening mid song
- How do we handle adverts on youtube videos, do we encourge adblocker extension?

### 2. Users can create multiple playlists that are saved in the database
- Stored in the database as youtube id references
- Ability for multiple playlists with names
- Need to have some functionality for adding the video to the playlist from youtube urls or ids
- (Phase 2) use the youtube api to search for videos while on the app
- Need to check song length

### 3. Registered users can start djing one of their playlists
- we need to track what there last song was, can they choose which song plays next?
- how does this work, where does it go when they click button?

### 4. User avatars will appear on screen, users that are currently in the room or just the one djing?

### 5. Alerts will appear each time someone tunes in, each time a registerd user tunes in and each time someone queues up to dj

### 6. Users can upvote or downvote songs, upvotes will go to a user leaderboard and downvote percentage will skip the current song

### 7. Twogether audio adverts, every x amount of songs, only if audio advert is there