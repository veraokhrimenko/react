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

var User = React.createClass({displayName: 'User',
    render: function() {
        return React.DOM.div( {className: this.props.activeId === this.props.item.id ? 'user-item active' : 'user-item', onClick: this.props.onClick }, 
                    React.DOM.div( {className:"name"}, this.props.item.name),
                    React.DOM.div( {className:"status"}, this.props.item.status)
                )
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
                return User( {item: item,  onClick: self.checkUser(item),  activeId: self.state.user })
                })     
            )
        );
    }
});

var MessageInput = React.createClass({displayName: 'MessageInput',
    handleChange: function(e) {
        this.setState({ userInput: e.target.value });
    },
    handleKeyPress: function(e) {
        if(e.which === 13) {
            this.setState({ userInput: '' });
            CustomEvents.notify('message:add', { text: e.target.value, id: this.props.userId });
        }
    },
    getInitialState: function() {
      return {userInput: ''};
    },
    render: function() {
        return (
            React.DOM.div( {className:"input-message"}, 
                React.DOM.input( {type:"text", placeholder:"Type your message", value: this.state.userInput,  onChange: this.handleChange,  onKeyPress: this.handleKeyPress } )
            )
        );
    }
});


var MessageList = React.createClass({displayName: 'MessageList',
    addMessage: function(data) {
        var self = this;

        this.props.messages.forEach(function(i) {
            if(i.id == self.props.userId) {
                i.text.push(data.text)
            }
        })

        this.setState({ message: 'added' })
    },
    getDefaultProps: function() {
        var self = this;

        CustomEvents.subscribe('message:add', function(data) {
            self.addMessage(data);
        });

        return {
            messages: [
                {
                    text: [],
                    id: '1'
                },
                {
                    text: [],
                    id: '2'
                },
                {
                    text: [],
                    id: '3'
                }
            ]
        };
    },
    getInitialState: function() {
      return { message: '' };
    },
    render: function() {
        var self = this,
            messages = [],
            filterMessages = [];

        filterMessages = this.props.messages.filter(function(i){
            return i.id == self.props.userId;
        });

        messages = filterMessages.length ? filterMessages[0] : { id: '', text: [] }

        var items = messages.text.map(function(item) {
            return React.DOM.div( {className:"message"}, item);
        }.bind(this));

        return (
            React.DOM.div( {className:"message-list"}, items)
        )
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

        return { name: '', status: '', id: ''}
    },
    setChatWith: function(data) {
        this.setState({ name: data.name, status: data.status, id: data.id })
    },
    render: function() {
        var cx = React.addons.classSet;

        var classes = cx({
            'messages-content': true,
            'active': this.state.name.length
        });

        return React.DOM.div( {className: classes }, 
                React.DOM.div( {className:"user-info"}, 
                    this.state.name,
                    React.DOM.span( {className:"status"}, this.state.status)
                ),
                MessageList( {userId: this.state.id } ),
                MessageInput( {userId: this.state.id } )
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
