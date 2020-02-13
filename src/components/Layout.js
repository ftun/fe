import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

class Layout extends React.Component {

    render() {
        return <Fragment>
            <nav>
                <div className="nav-wrapper">
                    <Link to="home" className="brand-logo">App</Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><Link to="home">Home</Link></li>
                        <li><Link to="admin">Admin</Link></li>
                    </ul>
                </div>
            </nav>
            <main className="clear-fixed-footer">
                <div className="container fluid">
                    {this.props.children}
                </div>
            </main>
        </Fragment>;
    }
}

export default Layout;
