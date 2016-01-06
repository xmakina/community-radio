import Parser from 'react-dom-parser';

import Socket from './utils/socket.js';
import dom from './utils/dom';

import Input from './classes/input';
import Player from './classes/player';
import Controls from './classes/controls';
import Room from './classes/room';

Parser.register({Input, Player, Controls, Room});

Parser.parse(dom.$body[0]);