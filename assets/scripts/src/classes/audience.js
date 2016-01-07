import React from 'react';

class Audience extends React.Component {

	constructor(props) {

		super(props);
	}

	render(){
		return (
			<ul className="align-left">
				{this.props.listening.map(function(user, index){
					return (				
						<li key={index}>
							<img src={'images/avatars/'+user.avatar+'.gif'} width="100" title={user.username} />
							<p>{user.username}</p>
						</li>
					)
				})}
			</ul>
		);
	}

}

Audience.defaultProps = {};

export default Audience;