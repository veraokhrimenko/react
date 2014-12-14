/** @jsx React.DOM */
'use strict';

var Profile = React.createClass({displayName: 'Profile',
	getInitialState: function() {
		return { status: 'online', name: 'Vera Okhrimenko' };
	},

	render: function() {
		return (
			React.DOM.div(null, 
				React.DOM.div( {className:"name"}, this.state.name),
				React.DOM.div( {className:"status"}, this.state.status)
			)
		);
	}
});

var UserList = React.createClass({displayName: 'UserList',
	render: function() {
		return (
			React.DOM.div(null, 
                React.DOM.div(null,  this.props.items.map(function(item, index){
                    return React.DOM.div( {className:"user-item"}, item.name, item.status );
                	}) 
                        
                )
            )
        );
	}
});

var MessageInput = React.createClass({displayName: 'MessageInput',
	render: function() {
		return (
			React.DOM.input( {type:"text", placeholder:"Type your message"} )
        );
	}
});

React.renderComponent(
	Profile(null ),
	document.getElementById('profile')
);

React.renderComponent(
	MessageInput(null ),
	document.getElementById('message')
);

React.renderComponent(
    UserList( {items: [ {name: 'Home', status: 'online'}, {name: 'Services', status: 'offline'}, {name: 'About', status: 'away' }] } ),
    document.getElementById('list')
);
