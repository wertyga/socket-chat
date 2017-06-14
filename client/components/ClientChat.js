import io from 'socket.io-client';

const ClientChat = createReactClass({

    getInitialState() {
        return {
            message: '',
            messages: this.props.messages
        }
    },

    onChange(e) {
        this.setState({
            message: e.target.value
        });
    },

    componentDidMount() {
        this.isMounted = true;
        this.socket = io('/chat');

        this.socket.emit('new-client-chat', {
            id: this.props.id
        });

        this.socket.on('message', message => {
            console.log(this.isMounted)
            if(this.isMounted) {
                this.setState({
                    messages: [
                        ...this.state.messages,
                        {
                            name: message.name,
                            message: message.message,
                            date: message.date

                        },
                    ]
                });
            };
        });
    },

    componentWillMount() {
        this.isMounted = false;
    },

    async onSubmit(e) {
        if(e.keyCode == 13) {
            if(!this.state.message) return;
            await this.setState({
                messages: [...this.state.messages,
                    {
                        name: 'manager',
                        message: this.state.message,
                        date: new Date().toLocaleString().split(' ')[1].split(':')[0] + ':' + new Date().toLocaleString().split(' ')[1].split(':')[1]
                    }
                ],
            });

            await this.socket.emit('manager-message', {
                id: this.props.id,
                name: 'manager',
                message: this.state.message,
                date: new Date().toLocaleString().split(' ')[1].split(':')[0] + ':' + new Date().toLocaleString().split(' ')[1].split(':')[1]
            });

            this.setState({
                message: ''
            });

        };
    },

    render() {
        return (
            <div className="client col">
                <h5>{`Client_${(this.props.id).slice(this.props.id.length - 3)}`}</h5>
                <div ref={messages => this.messages = messages} className="messages">
                    <ul>
                        {this.state.messages.map((message, i) => {
                            return (
                                <li key={i} className={message.name == 'client' ? 'client' : 'manager'}>
                                    <div>
                                        {message.name == 'client' && <span className="time">{message.date}</span>}
                                        <span className="text">{message.message}</span>
                                        {message.name !== 'client' && <span className="time">{message.date}</span>}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <input type="text" onChange={this.onChange} onKeyUp={this.onSubmit} value={this.state.message}/>
            </div>
        );
    }
});

export default ClientChat;