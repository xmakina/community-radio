import Parser from 'react-dom-parser';
import dom from './utils/dom';
import Input from './classes/input';
import Player from './classes/player';
import Controls from './classes/controls';
import Room from './classes/room';
import Playlists from './classes/Playlists';
import QueueList from './classes/queueList';

Parser.register({Input, Player, Controls, Room, Playlists, QueueList});

Parser.parse(dom.$body[0]);