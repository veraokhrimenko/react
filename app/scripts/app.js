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
                    return React.DOM.div( {className:"user-item"}, 
                            React.DOM.div( {className:"name"}, item.name),
                            React.DOM.div( {className:"status"}, item.status)
                        )
                    }) 
                        
                )
            )
        );
    }
});

var MessageInput = React.createClass({displayName: 'MessageInput',
    render: function() {
        return (
            React.DOM.div(null, 
            React.DOM.input( {type:"text", placeholder:"Type your message"} )
            )
        );
    }
});

var SearchInput = React.createClass({displayName: 'SearchInput',
    getInitialState: function(){
        return { searchString: '' };
    },
    handleChange: function(e) {
        this.setState({searchString:e.target.value});
    },
    render: function() {
        var libraries = this.props.items,
            searchString = this.state.searchString.trim().toLowerCase();

        if(searchString.length > 0){
            libraries = libraries.filter(function(l){
                return l.name.toLowerCase().match( searchString );
            });
        }

        return (
            React.DOM.div(null, 
                React.DOM.input( {type:"text", value:this.state.searchString, placeholder:"Search", onChange:this.handleChange} ),
                UserList(  {items:  libraries })
            )
        );
    }
});

var libraries = [ 
    {name: 'User First', status: 'online', id: '1'}, 
    {name: 'Second User', status: 'offline', id: '2'}, 
    {name: 'One More User', status: 'away', id: '3' }
];

React.renderComponent(
    Profile(null ),
    document.getElementById('profile')
);

React.renderComponent(
    MessageInput(null ),
    document.getElementById('message')
);

React.renderComponent(
    SearchInput( {items: libraries } ),
    document.getElementById('search')
);
