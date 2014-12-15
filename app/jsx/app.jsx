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
            <div>
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
            <div>
                <input type="text" value={this.state.searchString} placeholder="Search" onChange={this.handleChange} />
                <UserList  items= { libraries }/>
            </div>
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
    <SearchInput items={ libraries } />,
    document.getElementById('search')
);
