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
							<img src={user.avatar} height="35" />
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