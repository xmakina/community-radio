var Parser = require('react-dom-parser');

Parser.register({
	Input: require('./classes/input.jsx')
});

Parser.parse($('body')[0]);