import Parser from 'react-dom-parser';
import dom from './utils/dom';
import Input from './classes/input';
import Player from './classes/player';
import Controls from './classes/controls';
import Room from './classes/room';
import Playlists from './classes/Playlists';
import QueueList from './classes/queueList';
import AvatarUpload from './classes/avatarUpload';

Parser.register({Input, Player, Controls, Room, Playlists, QueueList, AvatarUpload});

Parser.parse(dom.$body[0]);

$('form').submit((e) => {
	var $inputs = $(e.target).find('[data-reactid]'),
		isValid = true,
		$firstInvalid;
	$.each($inputs, function(){
		var component = Parser.getByNode(this);
		if(component && component.validate && !component.validate()){
			isValid = false;
			if(!$firstInvalid) $firstInvalid = $(this);
		}
	});
	if(!isValid){
		e.preventDefault();
		$('html,body').animate({
			scrollTop: $firstInvalid.offset().top
		});
	}
});

$('#open-sidebar-nav').click((e) => {
	e.preventDefault();
	dom.$body.toggleClass('sidebar-nav-open');
});