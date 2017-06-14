import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import setHeaders from '../server/common/setHeaders';
import io from 'socket.io-client'

import jwtDecode from 'jwt-decode';
import rootReducer from './reducers/rootReducer';

import './components/style/common/bootstrap-grid.min.css';
import './components/style/common/bootstrap.min.css';
import './components/style/common/index.sass';

import App from './components/App';


const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);

if(localStorage.jwtToken) {
    setHeaders(localStorage.jwtToken);

    let socket = io('/chat');

    window.onbeforeunload = () => {
        socket.emit('leave-client', {
            id: jwtDecode(localStorage.jwtToken).id
        });
    };
};

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>,
    document.getElementById('app')
);
