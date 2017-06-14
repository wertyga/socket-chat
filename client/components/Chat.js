import './style/Chat.sass';

import { authSilent } from '../actions/actions';
import io from 'socket.io-client';

import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';


const style = {
    loading: {
        color: 'darkslateblue'
    }
};

const Chat = createReactClass({

    getInitialState() {
        return {
            id: this.props.id || '',
            message: '',
            messages: this.props.messages || [],
            isAuth: false,
            loading: false,
            error: ''
        }

    },

    onChange(e) {
        this.setState({
            message: e.target.value
        });
    },

    onKeyUp(e) {
        if(this.state.error) return;
        if(e.keyCode == 13 && this.isMounted) {
            this.setState({
                messages: [
                    ...this.state.messages,
                    {
                        name: 'client',
                        message: this.state.message,
                        date: new Date().toLocaleString().split(' ')[1].split(':')[0] + ':' + new Date().toLocaleString().split(' ')[1].split(':')[1]
                    },
                ],
                message: ''
            });
            this.socket.emit('message', {
                id: this.state.id,
                name: 'client',
                message: this.state.message,
                date: new Date().toLocaleString().split(' ')[1].split(':')[0] + ':' + new Date().toLocaleString().split(' ')[1].split(':')[1]
            });
        };
    },

    async componentDidMount() {
        this.isMounted = true;
        this.socket = io('/chat');
        this.socket.on('manager-message', message => {
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

        });

        this.socket.on('message', message => {
            this.setState({
                messages: [
                    ...this.state.messages,
                    {
                        name: message.name,
                        message: message.message,
                        date: message.date
                    }
                ]
            });
        });

        this.socket.on('manager-connected', manager => {
            if (this.state.isAuth) {
                this.socket.emit('new-client-connect', this.state);
            }
        });

        this.socket.on('leave-client', client => {
            if(this.state.isAuth && this.state.id == client.id) {
                this.setState({
                    isAuth: false
                });
            };
        });
    },

    componentWillMount() {
        this.isMounted = false;
    },

    async fetchClient() {
        try {
            await this.props.authSilent(this.state);
            await this.setState({
                id: this.props.id,
                messages: this.props.messages,
                loading: false
            });
        } catch(err) {
            this.setState({
                error: err.response ? err.response.data.error : err.message,
                loading: false
            });
        };
    },

    async silentAuth() {
        await this.setState({
            isAuth: !this.state.isAuth,
            loading: true
        });

        if(this.state.isAuth) {
            await this.fetchClient();
            this.socket.emit('new-client-connect', this.state);

        };
        if(!this.state.isAuth) {
            this.socket.emit('leave-client', {
                id: this.state.id
            })
        };
    },

    render() {

        const main = (
            <div className="messages">
                {this.state.error && <div className="error">{this.state.error}</div>}
                {!this.state.error &&
                    <ul>
                        {this.state.messages.map((item, i) => {
                            return (
                                <li key={i} className="message">
                                    <div className={item.name == 'client' ? 'client' : 'manager'}>
                                        {item.name == 'client' && <span className="time">{item.date}</span>}<span className="text">{item.message}</span>{item.name !== 'client' && <span className="time">{item.date}</span>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>}

                <div className="footer">
                    <input type="text" placeholder="Input message..." value={this.state.message} onKeyUp={this.onKeyUp} onChange={this.onChange}/>
                </div>
            </div>
        );

        const loading = (
            <MuiThemeProvider>
                <div className="loading">
                    <CircularProgress
                        color='darkslateblue'
                    />
                </div>
            </MuiThemeProvider>
        );

        return (
            <div className="Chat">
                <div className="header" onClick={this.silentAuth}>Socket chat</div>

                    {(this.state.isAuth && this.state.loading) ? loading : (this.state.isAuth && main)}
                </div>
        );
    }
});

function mapState(state) {
    return {
        id: state.main.id,
        messages: state.main.messages
    }
};

export default connect(mapState, { authSilent })(Chat);