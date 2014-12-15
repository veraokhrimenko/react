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
                return <div className={self.state.user === item.id ? 'user-item active' : 'user-item'} onClick={ self.checkUser(item) }>
                        <div className="name">{item.name} {self.state.user.id}</div>
                        <div className="status">{item.status}</div>
                    </div>
                }) }
                    
            </div>
        );
    }
});

var MessageInput = React.createClass({
    render: function() {
        return (
            <div className="input-message">
                <input type="text" placeholder="Type your message" />
            </div>
        );
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
                {this.state.name}
                {this.state.status}
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
