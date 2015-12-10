# Twogether Radio
This app is using node, mongodb (mongoose), react, browserfy, babel, sass and gulp, the project will auto reload sass and javascript when changes are made and the server will auto reload when node src is changed.

## Running the app:

	mongod
	npm install
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

### 3. Registered users can start djing one of their playlists
- we need to track what there last song was, can they choose which song plays next?
- how does this work, where does it go when they click button?

Users can upvote or downvote tracks 
- How does this work?