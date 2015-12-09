var React = require('react'),
    ReactDOM = require('react-dom');

/** @jsx React.DOM */
module.exports = React.createClass({
	displayName: 'Input Class',
	isOldie: false,
	mounted: false,
	propTypes: {
		tag: React.PropTypes.string,
		attributes: React.PropTypes.shape({
			type: React.PropTypes.string,
			placeholder: React.PropTypes.oneOfType([
				React.PropTypes.string,
				React.PropTypes.bool
			]),
			name: React.PropTypes.string,
			id: React.PropTypes.string,
		}),
		parameter: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.bool
		]),
		errorMsg: React.PropTypes.string,
		required: React.PropTypes.bool
	},
	getDefaultProps: function(){
		return {
			tag: 'input',
			attributes: {
				type: 'text',
				placeholder: null,
				name: 'input',
				id: 'input',
			},
			validation: null,
			parameter: null,
			errorMsg: 'This field is invalid',
			required: false
		};
	},
	getInitialState: function(){
		return {
			value: '',
			valid: true
		}
	},
	componentWillReceiveProps: function(props){
		this.setState({value: props.attributes.value});
	},
	componentWillMount: function(){
		var domClass =  document.documentElement.className;
		this.isOldie = (domClass.indexOf('ie9') > -1 || domClass.indexOf('ie8') > -1 || domClass.indexOf('ie6') > -1 || domClass.indexOf('ie7') > -1);
		this.setState({value: this.props.attributes.value});
	},
	componentDidMount: function(){
		this.mounted = true;
		if(this.props.parameter){
			var parameters = {};
			$.each(location.search.substr(1).split("&"), function(index, part){
			    var item = part.split("="),
			        result = {};
			    parameters[item[0]] = decodeURIComponent(item[1]);
			});
			if(parameters[this.props.parameter]){
				this.setState({value: parameters[this.props.parameter]});
			}
		}
		if(this.isOldie && this.props.attributes.placeholder && this.props.attributes.type == 'text'){
			this.setState({value: this.props.attributes.placeholder});
		}
	},
	validate: function(newValue){
		var value = typeof(newValue) !== 'undefined' ? newValue : (this.state.value ? this.state.value : ''),
			isValid = true;
		if(this.props.validation){
			if(this.props.validation instanceof RegExp){
				isValid = this.props.validation.test(value);
			} else {
				isValid = new RegExp(this.props.validation).test(value);
			}
		}
		if(!isValid && !this.props.required && value.length === 0){
			isValid = true;
		} else if(this.props.required && this.props.attributes.type == 'checkbox' && !ReactDOM.findDOMNode(this.refs['form-element']).checked){ 
			isValid = false;
		} else if(this.props.required && value.length === 0){
			isValid = false;
		}
		this.setState({valid: isValid});
		return isValid;
	},
	handleChange: function(event){
		if(this.props.tag == 'select') $(ReactDOM.findDOMNode(this.refs['form-element'])).blur();
		this.setState({value: event.target.value});
		// validate on change?
		// this.validate(event.target.value);
	},
	handleFocus: function(event){
		if(this.state.value == this.props.attributes.placeholder){
			this.setState({value: ''});
		}
	},
	handleBlur: function(event){
		if(!this.isOldie || !this.props.attributes.placeholder || this.props.attributes.type != 'text') return;
		if(this.state.value == ''){
			this.setState({value: this.props.attributes.placeholder});
		}
	},
	render: function(){
		var self = this;
		if(this.props.attributes.type == 'radio'){
			return (
				<fieldset className={this.state.valid ? null : 'error'} >
						<legend>{this.props.legend}</legend>
						<p className="small-margin">{this.props.description}</p>
						{this.props.options.map(_.bind(function(option, i) {
							return <label htmlFor={'radio-button-'+i+'-'+this.props.attributes.name}><input id={'radio-button-'+i+'-'+this.props.attributes.name} key={'input-option-'+i} type={this.props.attributes.type} name={this.props.attributes.name} value={option.value} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />{option.label}</label>
						}, this))}
						{(function(){
							if(!self.state.valid){
								return <span className="error-message">{self.props.errorMsg}</span>
							}
						})()}
				</fieldset>
			);
		} else if(this.props.tag == 'select'){
			return (
				<p>
					<select ref="form-element" {...this.props.attributes} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} className={this.state.valid ? null : 'error'} >
						<option disabled selected>{this.props.attributes.placeholder}</option>
						{this.props.options.map(_.bind(function(option, i) {
							return <option key={'input-option-'+i} value={option.value}>{option.label}</option>
						}, this))}
					</select>
					{(function(){
						if(!self.state.valid){
							return <span className="error-message">{self.props.errorMsg}</span>
						}
					})()}
				</p>
			)
		} else {
			return (
				<span>
					<this.props.tag ref="form-element" {...this.props.attributes} onChange={this.handleChange} value={this.state.value} onFocus={this.handleFocus} onBlur={this.handleBlur} className={this.state.valid ? null : 'error'} />
						{(function(){
							if(!self.state.valid){
								return <span className="error-message">{self.props.errorMsg}</span>
							}
						})()}
				</span>
			);
		}
	}
});