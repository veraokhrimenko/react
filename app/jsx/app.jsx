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

var User = React.createClass({
    render: function() {
        return <div className={ this.props.activeId === this.props.item.id ? 'user-item active' : 'user-item'} onClick={ this.props.onClick }>
                    <div className="name">{this.props.item.name}</div>
                    <div className="status">{this.props.item.status}</div>
                </div>
    }
});

var UserList = React.createClass({
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
            <div> { items.map(function(item, index){
                return <User item={ item } onClick={ self.checkUser(item) } activeId={ self.state.user }/>
                }) }    
            </div>
        );
    }
});

var MessageInput = React.createClass({
    handleChange: function(e) {
        this.setState({ userInput: e.target.value });
    },
    handleKeyPress: function(e) {
        if(e.which === 13) {
            this.setState({ userInput: '' });
            CustomEvents.notify('message:add', { text: e.target.value });
        }
    },
    getInitialState: function() {
      return {userInput: ''};
    },
    render: function() {
        return (
            <div className="input-message">
                <input type="text" ref="myInput" placeholder="Type your message" value={ this.state.userInput } onChange={ this.handleChange } onKeyPress={ this.handleKeyPress } />
            </div>
        );
    }
});


var MessageList = React.createClass({
    addMessage: function(text) {
        this.props.messages.push(text);
        this.setState({message: 'added'});
    },
    getDefaultProps: function() {
        var self = this;

        CustomEvents.subscribe('message:add', function(data) {
            self.addMessage(data.text);
        });

        return {
            messages: []
        };
    },
    getInitialState: function() {
      return { message: ''};
    },
    render: function() {
        var items = this.props.messages.map(function(item) {
            return <div className="message">{item}</div>;
        }.bind(this));

        return (
            <div className="message-list">{items}</div>
        )
    }
});

var SearchInput = React.createClass({
    getInitialState: function(){
        return { searchString: '' };
    },
    handleChange: function(e) {
        this.setState({searchString:e.target.value});
        CustomEvents.notify('search', {query: e.target.value});
    },
    render: function() {
        return (
            <input type="text" value={this.state.searchString} placeholder="Search" onChange={this.handleChange} />
        );
    }
});

var ChatContent = React.createClass({
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

        return <div className={ classes }>
                <div className="user-info">
                    {this.state.name}
                    <span className="status">{this.state.status}</span>
                </div>
                <MessageList />
                <MessageInput />
            </div>
    }
});

var libraries = [ 
    {name: 'User First', status: 'online', id: '1'}, 
    {name: 'Second User', status: 'offline', id: '2'}, 
    {name: 'One More User', status: 'away', id: '3' }
];

React.renderComponent(
    <Profile />,
    document.getElementById('profile')
);


React.renderComponent(
    <ChatContent />,
    document.getElementById('messages')
);

React.renderComponent(
    <SearchInput />,
    document.getElementById('search')
);

React.renderComponent(
    <UserList items={ libraries } />,
    document.getElementById('list')
);
