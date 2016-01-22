# Community.dj
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