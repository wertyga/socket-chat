import io from 'socket.io-client';

import './style/Manager.sass';
import ClientChat from './ClientChat';

const Manager = createReactClass({

    getInitialState() {
        return {
            clients: [],
            message: ''
        }
    },

    componentDidMount() {
        this.socket = io('/chat');
        this.socket.emit('manager-connected', {
            id: this.props.id
        });
        this.socket.on('new-client-connect', client => {
            let existCLient = this.state.clients.find(item => item.id == client.id);
            if(existCLient) return;
            if(!client.id) return;
            this.setState({
                clients: [...this.state.clients, client]
            });
        });
        this.socket.on('leave-client', client => {
            console.log('leave-client ', client)
            this.setState({
                clients: this.state.clients.filter(item => item.id !== client.id)
            });
        });
        this.socket.on('appear-client', client => {
            console.log(client)
            this.setState({
                clients: this.state.clients.filter(item => item.id !== client.id)
            });
        });
    },
    render() {
        return (
            <div className="Manager">
                <h4>Clients chats</h4>
                <div className="chats row">
                        {this.state.clients.map(client =>
                            <ClientChat
                                key={client.id}
                                id={client.id}
                                messages={client.messages}
                            />
                        )}
                </div>
            </div>
        );
    }
});

export default Manager;