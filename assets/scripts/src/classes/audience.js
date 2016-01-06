import React from 'react';

class Audience extends React.Component {

	constructor(props) {

		super(props);
		// io.connect("http://localhost/new");
	}

	render(){
		return (
			<ul className="align-left">
				<li>
					<img src="https://www.wearetwogether.com/images/us/Jon-Busby-2.jpg" width="100" title="Jon Busby" />
				</li>
				<li>
					<img src="https://www.wearetwogether.com/images/us/Julie-Rollinson-2.jpg" width="100" title="Julie Rollinson" />
				</li>
				<li>
					<img src="https://www.wearetwogether.com/images/us/Lilly-Yau-2.jpg" width="100" title="Lilly Yau" />
				</li>
				<li>
					<img src="https://www.wearetwogether.com/images/us/Ben-Whitehouse-2.jpg" width="100" title="Simon Staton" />
				</li>
			</ul>
		);
	}

}

Audience.defaultProps = {};

export default Audience;