import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ServiceProvider } from '../helpers/Context';
import Login from './Login';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated : window.sessionStorage.isAuthenticated ? true : false,
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
        this.getLogout = this.getLogout.bind(this);
    }


    /**
    * Funcion callback que se pasa como 'props' al componente de login para manipular el 'state' de sesion del layout
    * @param boolean
    * @return mixed
    */
    userHasAuthenticated(isAuthenticated)  {
        return this.setState({ isAuthenticated : isAuthenticated });
    }

    /**
    * Funcion para destruir la session en la aplicacion
    */
    getLogout(e) {
        window.sessionStorage.clear();
        this.userHasAuthenticated(false);
        window.location = '/';
    }

    render() {
        const { isAuthenticated } = this.state;

        return <Fragment>
            <ServiceProvider value={{
                userHasAuthenticated : this.userHasAuthenticated,
                isAuthenticated : isAuthenticated
            }}>
                <nav>
                    <div className="nav-wrapper">
                        <Link to="home" className="brand-logo">App</Link>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><Link to="home">Home</Link></li>
                            <li><Link to="admin">Admin</Link></li>
                            <li>{isAuthenticated ? <a onClick={this.getLogout}>Logout</a> : <Link to="login">Login</Link>}</li>
                        </ul>
                    </div>
                </nav>
                <main className="clear-fixed-footer">
                    <div className="container fluid">
                        {isAuthenticated ? this.props.children : <Login />}
                    </div>
                </main>
            </ServiceProvider>
        </Fragment>;
    }
}

export default Layout;
