import Chat from './Chat';
import Manager from './Manager';
import { Link, Route } from 'react-router-dom';

const style = {
    paddingBottom: '50px',
    minHeight: '100vh',
    marginBottom: 0,

    backLink: {
        position: 'absolute',
        left: 0,
        top: '-50px'
    }
};

const App = createReactClass({

    render() {
        return (
            <div className="jumbotron App" style={style}>
                <div className="container">
                   <h1>Socket-test</h1>
                    {window.location.pathname == '/manager' ?
                        <Link className="btn btn-primary" to="/">Back to client</Link> :
                        <Link className="btn btn-primary" to="/manager">Manager login</Link>
                    }

                    <Route exact path="/" component={Chat}/>
                    <Route exact path="/manager" component={Manager}/>

                </div>

            </div>
        );
    }
});

export default App;