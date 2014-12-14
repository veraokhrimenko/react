/** @jsx React.DOM */
'use strict';

var Profile = React.createClass({
	getInitialState: function() {
		return { status: 'online', name: 'Vera Okhrimenko' };
	},

	render: function() {
		return (
			<div>
				<div className="name">{this.state.name}</div>
				<div className="status">{this.state.status}</div>
			</div>
		);
	}
});

var UserList = React.createClass({
	render: function() {
		return (
			<div>
                <div>{ this.props.items.map(function(item, index){
                    return <div className="user-item">{item.name} {item.status} </div>;
                	}) }
                        
                </div>
            </div>
        );
	}
});

var MessageInput = React.createClass({
	render: function() {
		return (
			<input type="text" placeholder="Type your message" />
        );
	}
});

React.renderComponent(
	<Profile />,
	document.getElementById('profile')
);

React.renderComponent(
	<MessageInput />,
	document.getElementById('message')
);

React.renderComponent(
    <UserList items={ [ {name: 'Home', status: 'online'}, {name: 'Services', status: 'offline'}, {name: 'About', status: 'away' }] } />,
    document.getElementById('list')
);
