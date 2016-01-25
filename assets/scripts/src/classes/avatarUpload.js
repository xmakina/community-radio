import ReactDOM from 'react-dom';
import React from 'react';

class AvatarUpload extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			value: '',
			hasImage: false,
			valid: true
		};

	}

	componentWillReceiveProps(props){
		this.setState({value: props.attributes.value});
	}

	onClick(e){
		this.refs.input.click();
	}

	onChange(e) {
		if(this.refs.input.files && this.refs.input.files[0]) {
			var reader = new FileReader();
			reader.onload = (e) => {
				this.refs.preview.src = e.target.result;
			};
			reader.readAsDataURL(this.refs.input.files[0]);
			this.setState({hasImage: true});
		} else {
			removeImage();
		}
	}

	removeImage(){
		$(this.refs.input).replaceWith($(this.refs.input).clone());
		this.setState({hasImage: false});
	}

	render(){
		var self = this;
		return (
			<div className="file-upload">
				<div style={{display: this.state.hasImage ? 'none' : 'block'}}>
					<label htmlFor="avatar">Upload avatar</label>
					<button className="upload" type="button" onClick={this.onClick.bind(this)}>Add Image</button>
					<input type='file' onChange={this.onChange.bind(this)} accept="image/*" name="avatar" id="avatar" ref="input" value={this.state.value} />
				</div>
				<div style={{display: this.state.hasImage ? 'block' : 'none'}}>
					<img ref="preview" src="#" />
					<button type="button" onClick={this.removeImage.bind(this)} className="remove">Remove Image</button>
				</div>
			</div>
		);
	}
}

export default AvatarUpload;