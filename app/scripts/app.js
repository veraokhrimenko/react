/** @jsx React.DOM */
'use strict';
var HelloWorld = React.createClass({displayName: 'HelloWorld',
	getInitialState: function() {
		return {message: 'Hello World!'};
	},
	goodbye: function(event) {
		this.setState({message: 'Goodbye World.'});
	},
	render: function() {
		return (
			React.DOM.h1( {onClick:this.goodbye}, this.state.message)
		);
	}
});

React.renderComponent(
	HelloWorld(null ),
	document.getElementById('app')
);
