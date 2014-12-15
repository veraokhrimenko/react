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

        return { search: '' }; 
    },
    filterList: function(query) {
        this.setState({ search: query})
    },
    render: function() {
        var items = this.props.items,
            searchString = this.state.search.trim().toLowerCase();


        if(searchString.length > 0){

            items = items.filter(function(l){
                return l.name.toLowerCase().match( searchString );
            });
        }

        return (
            <div>
                <div> { items.map(function(item, index){
                    return <div className="user-item">
                            <div className="name">{item.name}</div>
                            <div className="status">{item.status}</div>
                        </div>
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
    <MessageInput />,
    document.getElementById('message')
);

React.renderComponent(
    <SearchInput />,
    document.getElementById('search')
);

React.renderComponent(
    <UserList items={ libraries } />,
    document.getElementById('list')
);
