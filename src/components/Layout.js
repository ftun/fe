import React, { Fragment } from 'react';

class Layout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Fragment>
            <nav>
                <div className="nav-wrapper">
                    <a href="#" className="brand-logo">Logo</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="sass.html">Sass</a></li>
                        <li><a href="badges.html">Components</a></li>
                        <li><a href="collapsible.html">JavaScript</a></li>
                    </ul>
                </div>
            </nav>
            <main className="clear-fixed-footer">
                <div className="container fluid">
                    {this.props.children}
                </div>
            </main>
            <footer className="page-footer">
                <div className="footer-copyright">
                    <div className="container">
                        © {new Date().getFullYear()} Copyright Text
                    </div>
                </div>
            </footer>
        </Fragment>;
    }
}

export default Layout;
