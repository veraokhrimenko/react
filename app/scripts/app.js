/** @jsx React.DOM */
'use strict';
var CustomEvents = (function() {
    var _map = {};
 
    return {
        subscribe: function(name, cb) {
            _map[name] || (_map[name] = []);
            _map[name].push(cb);
        },
     
        notify: function(name, data) {
            if (!_map[name]) {
                return;
            }
     
            _map[name].forEach(function(cb) {
                cb(data);
            });
        }
    }
})();

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
    getInitialState: function() {
        var self = this;
        CustomEvents.subscribe('search', function(data) {
            self.filterList(data.query);
        });

        return { search: '', user: ''}; 
    },
    filterList: function(query) {
        this.setState({ search: query})
    },
    checkUser: function(data) {
        var self = this;
        return function() {
            CustomEvents.notify('user:selected', data );
            self.setState({ user: data.id })
        }
    },
    render: function() {
        var self = this,
            items = this.props.items,
            searchString = this.state.search.trim().toLowerCase();

        if(searchString.length > 0){

            items = items.filter(function(l){
                return l.name.toLowerCase().match( searchString );
            });
        }

        return (
            React.DOM.div(null,   items.map(function(item, index){
                return React.DOM.div( {className:self.state.user === item.id ? 'user-item active' : 'user-item', onClick: self.checkUser(item) }, 
                        React.DOM.div( {className:"name"}, item.name, self.state.user.id),
                        React.DOM.div( {className:"status"}, item.status)
                    )
                }) 
                    
            )
        );
    }
});

var MessageInput = React.createClass({displayName: 'MessageInput',
    render: function() {
        return (
            React.DOM.div( {className:"input-message"}, 
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
        CustomEvents.notify('search', {query: e.target.value});
    },
    render: function() {
        return (
            React.DOM.input( {type:"text", value:this.state.searchString, placeholder:"Search", onChange:this.handleChange} )
        );
    }
});

var ChatContent = React.createClass({displayName: 'ChatContent',
    getInitialState: function() {
        var self = this;
        CustomEvents.subscribe('user:selected', function(data) {
            self.setChatWith(data);
        });

        return { name: '', status: ''}
    },
    setChatWith: function(data) {
        this.setState({ name: data.name, status: data.status })
    },
    render: function() {
        var cx = React.addons.classSet;

        var classes = cx({
            'messages-content': true,
            'active': this.state.name.length
        });

        return React.DOM.div( {className: classes }, 
                this.state.name,
                this.state.status,
                MessageInput(null )
            )
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
    ChatContent(null ),
    document.getElementById('messages')
);



React.renderComponent(
    SearchInput(null ),
    document.getElementById('search')
);

React.renderComponent(
    UserList( {items: libraries } ),
    document.getElementById('list')
);
